'use client'

import { useState } from 'react'
import Dashboard from '@/components/Dashboard'
import ConfigForm from '@/components/ConfigForm'

export default function Home() {
  const [config, setConfig] = useState<{
    token: string
    owner: string
    repos: string[]
  } | null>(null)

  return (
    <main className="min-h-screen">
      {!config ? (
        <ConfigForm onSubmit={setConfig} />
      ) : (
        <Dashboard config={config} onReset={() => setConfig(null)} />
      )}
    </main>
  )
}
