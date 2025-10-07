import React from 'react'
import { Auth0Provider } from '@auth0/auth0-react'

const domain = import.meta.env.VITE_AUTH0_DOMAIN as string
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string
const audience = import.meta.env.VITE_AUTH0_AUDIENCE as string | undefined

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (!domain || !clientId) {
    console.warn('Auth0 env vars missing: VITE_AUTH0_DOMAIN and/or VITE_AUTH0_CLIENT_ID')
  }
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience,
      }}
      cacheLocation="localstorage"
      useRefreshTokens
    >
      {children}
    </Auth0Provider>
  )
}
