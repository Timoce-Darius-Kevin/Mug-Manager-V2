import { useState } from 'react'
import { useMugs, useCreateMug, useUpdateMug, useDeleteMug } from '../api'
import type { Mug } from '../api'

export default function MyMugs() {
  const { data, isLoading, error } = useMugs()
  const createM = useCreateMug()
  const updateM = useUpdateMug()
  const deleteM = useDeleteMug()

  const [draft, setDraft] = useState<Partial<Mug>>({ name: '', description: '' })

  if (isLoading) return <p>Loading…</p>
  if (error) return <p>Error: {(error as Error).message}</p>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">My Mugs</h2>
      <ul className="space-y-3">
        {(data as Mug[] | undefined)?.map((m) => (
          <li key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
            <div>
              <div className="font-medium">{m.name}</div>
              <div className="text-sm text-white/70">{m.description}</div>
            </div>
            <div className="space-x-2">
              <button
                className="px-3 py-1 rounded-md bg-red-500/80 hover:bg-red-500 text-white"
                onClick={() => deleteM.mutate(m.id)}
              >
                Delete
              </button>
              <button
                className="px-3 py-1 rounded-md bg-mint-500 text-black hover:bg-mint-400"
                onClick={() => {
                  const name = prompt('New name', m.name) ?? m.name
                  const description = prompt('New description', m.description) ?? m.description
                  updateM.mutate({ ...m, name, description })
                }}
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h3 className="text-xl font-semibold">Add Mug</h3>
      <form
        className="flex items-center gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          if (!draft.name) return
          createM.mutate({ name: draft.name!, description: draft.description || '' })
          setDraft({ name: '', description: '' })
        }}
      >
        <input
          className="px-3 py-2 rounded-md bg-white/10 border border-white/20 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-mint-500"
          placeholder="Name"
          value={draft.name || ''}
          onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
        />
        <input
          className="px-3 py-2 rounded-md bg-white/10 border border-white/20 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-mint-500"
          placeholder="Description"
          value={draft.description || ''}
          onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
        />
        <button type="submit" className="px-4 py-2 rounded-md bg-mint-500 text-black hover:bg-mint-400">Add</button>
      </form>
    </div>
  )
}
