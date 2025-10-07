import { useAuth0 } from "@auth0/auth0-react"
import { useQuery } from "@tanstack/react-query"
import type { AdminUser } from "../model/admin"
import type { Mug } from "../model/mug"
import { authedFetch, makeTokenGetter } from "../API/api"

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