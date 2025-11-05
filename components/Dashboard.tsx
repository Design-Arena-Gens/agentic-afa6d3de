'use client'

import { useEffect, useState } from 'react'
import { Octokit } from '@octokit/rest'
import { LogOut, RefreshCw, TrendingUp, Users, GitPullRequest, Code, Award, Activity } from 'lucide-react'
import MetricsCard from './MetricsCard'
import DeveloperTable from './DeveloperTable'
import ActivityChart from './ActivityChart'
import { DeveloperMetrics, fetchMetrics } from '@/lib/github'

interface DashboardProps {
  config: {
    token: string
    owner: string
    repos: string[]
  }
  onReset: () => void
}

export default function Dashboard({ config, onReset }: DashboardProps) {
  const [metrics, setMetrics] = useState<DeveloperMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const loadMetrics = async () => {
    setLoading(true)
    setError(null)
    try {
      const octokit = new Octokit({ auth: config.token })
      const data = await fetchMetrics(octokit, config.owner, config.repos)
      setMetrics(data)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMetrics()
  }, [])

  const totalPRs = metrics.reduce((sum, m) => sum + m.pullRequests, 0)
  const totalCommits = metrics.reduce((sum, m) => sum + m.commits, 0)
  const totalLinesAdded = metrics.reduce((sum, m) => sum + m.linesAdded, 0)
  const totalLinesDeleted = metrics.reduce((sum, m) => sum + m.linesDeleted, 0)
  const avgImpactScore = metrics.length > 0
    ? Math.round(metrics.reduce((sum, m) => sum + m.impactScore, 0) / metrics.length)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Performance Dashboard</h1>
              <p className="text-gray-600 mt-1">
                {config.owner} • {config.repos.join(', ')}
              </p>
              {lastUpdated && (
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={loadMetrics}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={onReset}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Change Config
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading && metrics.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="ml-3 text-lg text-gray-600">Loading metrics...</span>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricsCard
                icon={<Users className="w-6 h-6" />}
                title="Active Developers"
                value={metrics.length}
                color="blue"
              />
              <MetricsCard
                icon={<GitPullRequest className="w-6 h-6" />}
                title="Total Pull Requests"
                value={totalPRs}
                color="green"
              />
              <MetricsCard
                icon={<Code className="w-6 h-6" />}
                title="Lines Changed"
                value={`+${totalLinesAdded.toLocaleString()} / -${totalLinesDeleted.toLocaleString()}`}
                color="purple"
                isText
              />
              <MetricsCard
                icon={<Award className="w-6 h-6" />}
                title="Avg Impact Score"
                value={avgImpactScore}
                color="orange"
              />
            </div>

            {/* Activity Chart */}
            <div className="mb-8">
              <ActivityChart metrics={metrics} />
            </div>

            {/* Developer Table */}
            <DeveloperTable metrics={metrics} />
          </>
        )}
      </div>
    </div>
  )
}
