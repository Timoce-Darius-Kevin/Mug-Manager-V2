export async function authedFetch(path: string, options: RequestInit = {}, getToken: () => Promise<string>) {
  const token = await getToken()
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${res.status} ${res.statusText}: ${text}`)
  }
  if (res.status === 204) return null
  return res.json()
}

const audience = import.meta.env.VITE_AUTH0_AUDIENCE as string | undefined

export function makeTokenGetter(getAccessTokenSilently: any) {
  return async () => {
    const res = await getAccessTokenSilently({
      authorizationParams: { audience },
      detailedResponse: true,
    } as any)
    return typeof res === 'string' ? res : res.access_token
  }
}
