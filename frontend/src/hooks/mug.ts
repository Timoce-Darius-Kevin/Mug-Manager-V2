import { useAuth0 } from "@auth0/auth0-react"
import { useQuery } from "@tanstack/react-query"
import { authedFetch, makeTokenGetter } from "../API/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { Mug } from "../model/mug"

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