'use client'

import { useState } from 'react'
import { Github, Settings } from 'lucide-react'

interface ConfigFormProps {
  onSubmit: (config: { token: string; owner: string; repos: string[] }) => void
}

export default function ConfigForm({ onSubmit }: ConfigFormProps) {
  const [token, setToken] = useState('')
  const [owner, setOwner] = useState('')
  const [repos, setRepos] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const repoList = repos.split(',').map(r => r.trim()).filter(Boolean)
    onSubmit({ token, owner, repos: repoList })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <Github className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            SWE Performance Tracker
          </h1>
          <p className="text-gray-600">
            Analyze your team's GitHub metrics and performance
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">Configuration</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
                GitHub Personal Access Token
              </label>
              <input
                id="token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxx"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Required scopes: repo, read:user
              </p>
            </div>

            <div>
              <label htmlFor="owner" className="block text-sm font-medium text-gray-700 mb-1">
                Organization/Owner
              </label>
              <input
                id="owner"
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="your-org or username"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="repos" className="block text-sm font-medium text-gray-700 mb-1">
                Repositories
              </label>
              <input
                id="repos"
                type="text"
                value={repos}
                onChange={(e) => setRepos(e.target.value)}
                placeholder="repo1, repo2, repo3"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Comma-separated list of repository names
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Start Tracking
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-600">
              <strong>Note:</strong> Your GitHub token is stored only in your browser session and is never sent to our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
