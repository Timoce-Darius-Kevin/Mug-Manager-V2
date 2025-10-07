import { useState } from 'react'
import { useAdminUsers, useAdminUserMugs } from '../api'
import type { Mug } from '../api'

export default function AdminPage() {
  const { data: users, isLoading, error } = useAdminUsers()
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const { data: mugs } = useAdminUserMugs(selectedUser || '')

  if (isLoading) return <p>Loading…</p>
  if (error) return <p>Error: {(error as Error).message}</p>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Admin: Users</h2>
      <ul className="space-y-2">
        {(users || []).map((u) => (
          <li key={u.sub}>
            <button
              className="px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 border border-white/20"
              onClick={() => setSelectedUser(u.sub)}
            >
              {u.sub} <span className="text-white/70">({u.mugsCount})</span>
            </button>
          </li>
        ))}
      </ul>

      {selectedUser && (
        <div>
          <h3 className="text-xl font-semibold">Mugs for {selectedUser}</h3>
          <ul className="space-y-2">
            {(mugs || []).map((m: Mug) => (
              <li key={m.id} className="p-3 rounded-md bg-white/5 border border-white/10">
                <div className="font-medium">{m.name}</div>
                <div className="text-sm text-white/70">{m.description}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
