'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { AlertCircle, FileText } from 'lucide-react'

const departments = [
  { label: 'Fire', value: 'fire', emoji: '🔥' },
  { label: 'Water', value: 'water', emoji: '💧' },
  { label: 'GHMC', value: 'ghmc', emoji: '🏙️' },
  { label: 'Electricity', value: 'electricity', emoji: '⚡' },
  { label: 'Roads', value: 'roads', emoji: '🛣️' },
]

export default function RaiseIssuePage() {
  const router = useRouter()

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    department: '',
  })

  const [detecting, setDetecting] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported')
      return
    }

    setDetecting(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setForm((prev) => ({
          ...prev,
          location: `Lat ${latitude.toFixed(4)}, Lng ${longitude.toFixed(4)}`,
        }))
        setDetecting(false)
      },
      () => {
        alert('Location permission denied')
        setDetecting(false)
      }
    )
  }

  // 🔥 THIS IS THE FIX
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      alert('User not logged in')
      return
    }

    const user = JSON.parse(storedUser)

    setSubmitting(true)

    const res = await fetch('/api/issues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        location: form.location,
        department: form.department,
        userId: user._id || user.id, // ✅ handles both cases
      }),
    })

    if (!res.ok) {
  let message = 'Failed to create issue'
  try {
    const error = await res.json()
    message = error.message || message
  } catch {
    // backend did not return JSON
  }
  alert(message)
  setSubmitting(false)
  return
}


    router.push('/dashboard')
  }

  return (
    <section className="min-h-screen w-full bg-slate-950">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Raise an Issue
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Report a civic issue to the concerned department.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-slate-800/60 backdrop-blur-md border border-slate-700 p-6 sm:p-8 space-y-6"
        >
          {/* Title */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Issue Title
            </label>
            <div className="relative">
              
              <input
                type="text"
                name="title"
                placeholder="Enter your issue here"
                required
                value={form.title}
                onChange={handleChange}
                className="w-full pr-4 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Description
            </label>
            <div className="relative">
              
              <textarea
                name="description"
                rows={4}
                required
                placeholder="Enter the issue description here"
                value={form.description}
                onChange={handleChange}
                className="w-full  pr-4 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-600 resize-none"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Location
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                name="location"
                placeholder="Enter your location"
                required
                value={form.location}
                onChange={handleChange}
                className="flex-1 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-600"
              />
              <button
                type="button"
                onClick={detectLocation}
                disabled={detecting}
                className="px-4 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"
              >
                {detecting ? '...' : '📍'}
              </button>
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Department
            </label>
            <select
              name="department"
              required
              value={form.department}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.emoji} {d.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg"
          >
            {submitting ? 'Submitting...' : 'Submit Issue'}
          </button>
        </form>
      </div>
    </section>
  )
}
