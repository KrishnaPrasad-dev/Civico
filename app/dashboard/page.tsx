'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import {
  User,
  Pencil,
  PlusCircle,
  MapPin,
  Building2,
  Clock3,
  Activity,
  CheckCircle2,
  AlertCircle,
  Layers,
  ArrowUpRight,
} from 'lucide-react'

type UserInfo = {
  id: string
  fullName: string
  email: string
  role: string
}

type Issue = {
  _id: string
  title: string
  description: string
  location: string
  department: string
  status: 'pending' | 'in_progress' | 'resolved'
  createdAt: string
}

export default function Dashboard() {
  const router = useRouter()

  const [user, setUser] = useState<UserInfo | null>(null)
  const [issues, setIssues] = useState<Issue[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [loadingIssues, setLoadingIssues] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all')

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      fetchIssues(parsedUser._id || parsedUser.id)
    }
    setHydrated(true)
  }, [])

  const fetchIssues = async (userId: string) => {
    try {
      const res = await fetch(`/api/issues?userId=${userId}`)
      const data = await res.json()

      // ✅ FIX: extract issues array from API response
      setIssues(data.data || [])
    } catch (error) {
      console.error('Failed to fetch issues', error)
      setIssues([])
    } finally {
      setLoadingIssues(false)
    }
  }

  const totalIssues = issues.length
  const pendingIssues = issues.filter(i => i.status === 'pending').length
  const inProgressIssues = issues.filter(i => i.status === 'in_progress').length
  const resolvedIssues = issues.filter(i => i.status === 'resolved').length
  const filteredIssues =
    statusFilter === 'all' ? issues : issues.filter(issue => issue.status === statusFilter)

  const recentIssues = [...issues]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 5)

  const departmentBreakdown = issues.reduce<Record<string, number>>((acc, issue) => {
    acc[issue.department] = (acc[issue.department] || 0) + 1
    return acc
  }, {})

  const topDepartments = Object.entries(departmentBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)

  const resolutionRate = totalIssues ? Math.round((resolvedIssues / totalIssues) * 100) : 0

  return (
    <section className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Track your reports, monitor progress, and take fast action.
            </p>
          </div>

          <button
            onClick={() => router.push('/raise-issue')}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg font-medium w-full sm:w-auto"
          >
            <PlusCircle size={18} />
            Raise Issue
          </button>
        </div>

        {/* Summary + Profile */}
        <div className="mb-10 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="p-4 rounded-2xl bg-indigo-600/20 text-indigo-400">
                  <User size={30} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
                    {hydrated ? user?.fullName : 'User'}
                  </h2>

                  <p className="text-slate-400 text-sm sm:text-base truncate mt-1">
                    {hydrated ? user?.email : ''}
                  </p>

                  <span className="inline-block mt-3 px-3 py-1 text-xs rounded-full bg-indigo-500/20 text-indigo-400 capitalize">
                    {hydrated ? user?.role : 'user'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => router.push('/edit-profile')}
                className="inline-flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-5 py-3 rounded-lg"
              >
                <Pencil size={16} />
                Edit Profile
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <InsightCard icon={<Layers size={16} />} label="Total Issues" value={totalIssues} tone="slate" />
              <InsightCard icon={<AlertCircle size={16} />} label="Pending" value={pendingIssues} tone="yellow" />
              <InsightCard icon={<Activity size={16} />} label="In Progress" value={inProgressIssues} tone="blue" />
              <InsightCard icon={<CheckCircle2 size={16} />} label="Resolved" value={resolvedIssues} tone="green" />
            </div>

            <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-300">Resolution rate</p>
                <span className="text-sm font-semibold text-emerald-300">{resolutionRate}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-700">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${resolutionRate}%` }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6">
            <h3 className="text-lg font-semibold text-white">Top Departments</h3>
            <p className="mt-1 text-sm text-slate-400">Where your reports are concentrated</p>

            <div className="mt-5 space-y-3">
              {topDepartments.length === 0 && (
                <p className="text-sm text-slate-400">No issue data yet.</p>
              )}

              {topDepartments.map(([department, count]) => (
                <div key={department} className="rounded-xl border border-slate-700 bg-slate-800/60 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium capitalize text-slate-200">{department}</p>
                    <span className="text-xs text-slate-400">{count} reports</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-slate-700">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{ width: `${totalIssues ? Math.max(8, (count / totalIssues) * 100) : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          {/* Issues */}
          <div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-white">
                  Your Issues
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  {filteredIssues.length} showing of {issues.length} total reports
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'in_progress', label: 'In Progress' },
                  { value: 'resolved', label: 'Resolved' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setStatusFilter(option.value as 'all' | 'pending' | 'in_progress' | 'resolved')
                    }
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      statusFilter === option.value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {loadingIssues && (
              <div className="rounded-2xl border border-slate-700 bg-slate-800/40 p-6 text-sm text-slate-400">
                Loading your recent issues...
              </div>
            )}

            {!loadingIssues && issues.length === 0 && (
              <div className="rounded-2xl p-8 bg-slate-800/40 border border-slate-700 text-center">
                <p className="text-slate-400">You haven’t raised any issues yet.</p>
              </div>
            )}

            {!loadingIssues && issues.length > 0 && filteredIssues.length === 0 && (
              <div className="rounded-2xl p-8 bg-slate-800/40 border border-slate-700 text-center">
                <p className="text-slate-400">No issues found for this filter.</p>
              </div>
            )}

            {!loadingIssues && filteredIssues.length > 0 && (
              <div className="space-y-4">
                {filteredIssues.map(issue => (
                  <div
                    key={issue._id}
                    className="rounded-2xl p-5 bg-slate-900/70 border border-slate-700 hover:border-slate-500 transition"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-white break-words">
                          {issue.title}
                        </h3>

                        <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                          {issue.description}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin size={13} />
                            {issue.location}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Building2 size={13} />
                            {issue.department}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 size={13} />
                            {new Date(issue.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-xs px-3 py-1 w-fit rounded-full capitalize whitespace-nowrap ${
                          issue.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : issue.status === 'in_progress'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}
                      >
                        {issue.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Side utilities */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
              <h3 className="text-base font-semibold text-white">Quick Actions</h3>
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => router.push('/raise-issue')}
                  className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition"
                >
                  Raise New Issue
                </button>
                <button
                  onClick={() => router.push('/issues')}
                  className="w-full rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-700 transition"
                >
                  Open Community Feed
                </button>
                <button
                  onClick={() => router.push('/edit-profile')}
                  className="w-full rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-700 transition"
                >
                  Update Profile
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
              <h3 className="text-base font-semibold text-white">Recent Activity</h3>

              <div className="mt-4 space-y-3">
                {recentIssues.length === 0 && (
                  <p className="text-sm text-slate-400">No activity yet.</p>
                )}

                {recentIssues.map((issue) => (
                  <button
                    key={issue._id}
                    onClick={() => setStatusFilter(issue.status)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/50 p-3 text-left hover:border-slate-500 transition"
                  >
                    <p className="text-sm font-medium text-slate-200 line-clamp-1">{issue.title}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                      <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                      <span className="inline-flex items-center gap-1 capitalize">
                        {issue.status.replace('_', ' ')}
                        <ArrowUpRight size={12} />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

function InsightCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: number
  tone: 'slate' | 'yellow' | 'blue' | 'green'
}) {
  const toneMap = {
    slate: 'text-white bg-slate-800/70 border-slate-700',
    yellow: 'text-yellow-300 bg-yellow-500/10 border-yellow-500/20',
    blue: 'text-blue-300 bg-blue-500/10 border-blue-500/20',
    green: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
  }

  return (
    <div className={`rounded-xl border p-4 ${toneMap[tone]}`}>
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide opacity-90">
          {icon}
          {label}
        </span>
        <span className="text-2xl font-bold">{value}</span>
      </div>
    </div>
  )
}