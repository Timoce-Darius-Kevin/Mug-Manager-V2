import { useAuth0 } from '@auth0/auth0-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export type Mug = { id: number; name: string; description: string; ownerSub?: string | null }
export type AdminUser = { sub: string; mugsCount: number }

async function authedFetch(path: string, options: RequestInit = {}, getToken: () => Promise<string>) {
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

function makeTokenGetter(getAccessTokenSilently: any) {
  return async () => {
    const res = await getAccessTokenSilently({
      authorizationParams: { audience },
      detailedResponse: true,
    } as any)
    return typeof res === 'string' ? res : res.access_token
  }
}

export function useMugs() {
  const { getAccessTokenSilently } = useAuth0()
  return useQuery({
    queryKey: ['mugs', 'me'],
    queryFn: () => authedFetch('/api/mugs/me', {}, makeTokenGetter(getAccessTokenSilently)),
  })
}

export function useCreateMug() {
  const { getAccessTokenSilently } = useAuth0()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (mug: Omit<Mug, 'id' | 'ownerSub'>) =>
      authedFetch('/api/mugs', { method: 'POST', body: JSON.stringify(mug) }, makeTokenGetter(getAccessTokenSilently)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mugs', 'me'] }),
  })
}

export function useUpdateMug() {
  const { getAccessTokenSilently } = useAuth0()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (mug: Mug) =>
      authedFetch(`/api/mugs/${mug.id}`, { method: 'PUT', body: JSON.stringify(mug) }, makeTokenGetter(getAccessTokenSilently)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mugs', 'me'] }),
  })
}

export function useDeleteMug() {
  const { getAccessTokenSilently } = useAuth0()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => authedFetch(`/api/mugs/${id}`, { method: 'DELETE' }, makeTokenGetter(getAccessTokenSilently)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mugs', 'me'] }),
  })
}

export function useAdminUsers() {
  const { getAccessTokenSilently } = useAuth0()
  return useQuery<AdminUser[]>({
    queryKey: ['admin', 'users'],
    queryFn: () => authedFetch('/api/admin/users', {}, makeTokenGetter(getAccessTokenSilently)),
  })
}

export function useAdminUserMugs(sub: string) {
  const { getAccessTokenSilently } = useAuth0()
  return useQuery<Mug[]>({
    queryKey: ['admin', 'users', sub, 'mugs'],
    queryFn: () => authedFetch(`/api/admin/users/${encodeURIComponent(sub)}/mugs`, {}, makeTokenGetter(getAccessTokenSilently)),
    enabled: !!sub,
  })
}
