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

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setHydrated(true)
  }, [])

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

        {/* Profile Card */}
        <div className="mb-10 sm:mb-12">
          <div className="rounded-2xl p-5 sm:p-6 bg-slate-800/60 backdrop-blur-md border border-slate-700">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              {/* Left */}
              <div className="flex items-center gap-4">
                <div className="p-3 sm:p-4 rounded-xl bg-indigo-600/20 text-indigo-400 shrink-0">
                  <User size={28} className="sm:hidden" />
                  <User size={32} className="hidden sm:block" />
                </div>

                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-semibold text-white truncate">
                    {hydrated ? user?.fullName || 'User' : 'User'}
                  </h2>

                  <p className="text-slate-400 text-sm truncate">
                    {hydrated ? user?.email : ''}
                  </p>

                  <p className="text-slate-500 text-xs mt-1 capitalize">
                    {hydrated ? `Role: ${user?.role}` : ''}
                  </p>
                </div>
              </div>

              {/* Right */}
              <button
                onClick={() => router.push('/edit-profile')}
                className="flex items-center justify-center gap-2 bg-slate-600 hover:bg-gray-700 text-white px-4 py-3 sm:py-2 rounded-lg transition w-full sm:w-auto"
              >
                <Pencil size={16} />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Issue History */}
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">
            Your Issues
          </h2>

          <div className="rounded-2xl p-6 sm:p-10 bg-slate-800/40 border border-slate-700 text-center">
            <p className="text-slate-400 text-sm sm:text-base">
              You haven’t raised any issues yet.
            </p>

            <button
              onClick={() => router.push('/raise-issue')}
              className="mt-4 inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition text-sm sm:text-base"
            >
              <PlusCircle size={16} />
              Raise your first issue
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
