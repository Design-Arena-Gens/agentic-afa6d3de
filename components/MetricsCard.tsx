import { ReactNode } from 'react'

interface MetricsCardProps {
  icon: ReactNode
  title: string
  value: number | string
  color: 'blue' | 'green' | 'purple' | 'orange'
  isText?: boolean
}

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600',
}

export default function MetricsCard({ icon, title, value, color, isText = false }: MetricsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className={`font-bold ${isText ? 'text-xl' : 'text-3xl'} text-gray-900`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </div>
  )
}
