import './App.css'
import React from 'react'
import { AuthProvider } from './auth'
import { useAuth0 } from '@auth0/auth0-react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './queryClient'
import { BrowserRouter, Link, Route, Routes, Navigate } from 'react-router-dom'
import MyMugs from './pages/MyMugs'
import AdminPage from './pages/Admin'

const rolesClaim = (import.meta.env.VITE_AUTH0_ROLES_CLAIM as string) || 'roles'

function Nav() {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0()
  const roles: string[] = (user && (user as any)[rolesClaim]) || []
  const isAdmin = roles.includes('ADMIN')

  return (
    <nav className="flex items-center gap-4 p-4 bg-black/20 backdrop-blur border-b border-white/10">
      <Link to="/" className="text-white font-semibold">MugManager</Link>
      {isAuthenticated && (
        <>
          <Link to="/mugs" className="hover:underline">My Mugs</Link>
          {isAdmin && <Link to="/admin" className="hover:underline">Admin</Link>}
        </>
      )}
      <div className="ml-auto" />
      {!isAuthenticated ? (
        <button
          className="px-4 py-2 rounded-md bg-mint-500 text-black hover:bg-mint-400 shadow"
          onClick={() => loginWithRedirect()}
        >
          Log in
        </button>
      ) : (
        <button
          className="px-4 py-2 rounded-md bg-white/10 text-white hover:bg-white/20 border border-white/20"
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
        >
          Log out
        </button>
      )}
    </nav>
  )
}

function Protected({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { isAuthenticated, user, isLoading } = useAuth0()
  const roles: string[] = (user && (user as any)[rolesClaim]) || []
  if (isLoading) return <p>Loading…</p>
  if (!isAuthenticated) return <Navigate to="/" replace />
  if (adminOnly && !roles.includes('ADMIN')) return <Navigate to="/" replace />
  return <>{children}</>
}

function Shell() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Nav />
          <main className="flex-1 p-6">
            <div className="mx-auto max-w-4xl bg-black/30 border border-white/10 rounded-xl p-6 shadow-xl">
              <Routes>
                <Route path="/" element={<h1 className="text-3xl font-bold">Mug Manager</h1>} />
                <Route
                  path="/mugs"
                  element={
                    <Protected>
                      <MyMugs />
                    </Protected>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <Protected adminOnly>
                      <AdminPage />
                    </Protected>
                  }
                />
              </Routes>
            </div>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  )
}
