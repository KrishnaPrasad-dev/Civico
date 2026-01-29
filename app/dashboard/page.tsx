'use client'
import Navbar from '@/components/layout/Navbar'
import { useRouter } from 'next/navigation'
import { User, Pencil } from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()

  return (
    <section className="min-h-screen w-full bg-slate-950  ">
      <Navbar />
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
          Dashboard
        </h1>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Edit Profile Shortcut */}
          <button
            onClick={() => router.push('/edit-profile')}
            className="group relative rounded-2xl p-6 bg-slate-800/60 backdrop-blur-md border border-slate-700 hover:border-indigo-500 transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400">
                <User size={26} />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white group-hover:text-indigo-400 transition">
                  Edit Profile
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Update your personal information
                </p>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 text-slate-500 group-hover:text-indigo-400 transition">
              <Pencil size={18} />
            </div>
          </button>
        </div>
      </div>
    </section>
  )
}
 