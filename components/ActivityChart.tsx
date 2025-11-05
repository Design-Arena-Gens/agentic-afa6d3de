'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { DeveloperMetrics } from '@/lib/github'
import { Activity } from 'lucide-react'

interface ActivityChartProps {
  metrics: DeveloperMetrics[]
}

export default function ActivityChart({ metrics }: ActivityChartProps) {
  const data = metrics.map(m => ({
    name: m.developer.length > 15 ? m.developer.substring(0, 15) + '...' : m.developer,
    'Pull Requests': m.pullRequests,
    'Commits': m.commits,
    'Review Comments': m.reviewComments,
  }))

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-900">Activity Overview</h2>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '14px' }} />
          <Bar dataKey="Pull Requests" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Commits" fill="#6366f1" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Review Comments" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
