'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { User, Pencil, PlusCircle } from 'lucide-react'

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
      setIssues(data)
    } catch (error) {
      console.error('Failed to fetch issues', error)
    } finally {
      setLoadingIssues(false)
    }
  }

  // 📊 Stats
  const totalIssues = issues.length
  const pendingIssues = issues.filter(i => i.status === 'pending').length
  const resolvedIssues = issues.filter(i => i.status === 'resolved').length

  return (
    <section className="min-h-screen w-full bg-slate-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
        {/* Top bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Dashboard
          </h1>

          <button
            onClick={() => router.push('/raise-issue')}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 sm:py-2.5 rounded-lg font-medium transition w-full sm:w-auto"
          >
            <PlusCircle size={18} />
            Raise Issue
          </button>
        </div>

        {/* 🔥 BIG PROFILE CARD */}
        <div className="mb-12">
          <div className="rounded-3xl p-6 sm:p-8 bg-slate-800/70 backdrop-blur-md border border-slate-700">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              
              {/* User Info */}
              <div className="flex items-start gap-5">
                <div className="p-4 rounded-2xl bg-indigo-600/20 text-indigo-400 shrink-0">
                  <User size={36} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white truncate">
                    {hydrated ? user?.fullName || 'User' : 'User'}
                  </h2>

                  <p className="text-slate-400 text-sm sm:text-base truncate mt-1">
                    {hydrated ? user?.email : ''}
                  </p>

                  <span className="inline-block mt-3 px-3 py-1 text-xs rounded-full bg-indigo-500/20 text-indigo-400 capitalize">
                    {hydrated ? user?.role : 'user'}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 w-full lg:w-auto">
                <div className="rounded-xl bg-slate-900/60 border border-slate-700 p-4 text-center">
                  <p className="text-2xl font-bold text-white">
                    {totalIssues}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Total Issues
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900/60 border border-slate-700 p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-400">
                    {pendingIssues}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Pending
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900/60 border border-slate-700 p-4 text-center">
                  <p className="text-2xl font-bold text-green-400">
                    {resolvedIssues}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Resolved
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => router.push('/edit-profile')}
                  className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-5 py-3 rounded-lg transition"
                >
                  <Pencil size={16} />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Issues Section */}
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-6">
            Your Issues
          </h2>

          {loadingIssues && (
            <p className="text-slate-400 text-sm">
              Loading issues...
            </p>
          )}

          {!loadingIssues && issues.length === 0 && (
            <div className="rounded-2xl p-8 bg-slate-800/40 border border-slate-700 text-center">
              <p className="text-slate-400">
                You haven’t raised any issues yet.
              </p>

              <button
                onClick={() => router.push('/raise-issue')}
                className="mt-4 inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition"
              >
                <PlusCircle size={16} />
                Raise your first issue
              </button>
            </div>
          )}

          {!loadingIssues && issues.length > 0 && (
            <div className="space-y-4">
              {issues.map(issue => (
                <div
                  key={issue._id}
                  className="rounded-xl p-5 bg-slate-800/50 border border-slate-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {issue.title}
                    </h3>

                    <span
                      className={`text-xs px-3 py-1 rounded-full capitalize ${
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

                  <p className="text-slate-400 text-sm mb-2">
                    {issue.description}
                  </p>

                  <div className="text-xs text-slate-500 flex flex-wrap gap-4">
                    <span>📍 {issue.location}</span>
                    <span>🏢 {issue.department}</span>
                    <span>
                      🕒 {new Date(issue.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
