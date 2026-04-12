'use client'

import { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify'

type ProfileForm = {
  fullName: string
  address: string
  bio: string
  phone: string
  age: string
  city: string
  state: string
}

async function parseResponseBody(res: Response): Promise<unknown> {
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return await res.json()
  return await res.text().catch(() => '')
}

function toErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  return 'Error updating profile'
}

export default function EditProfilePage() {
  const router = useRouter()

  const [form, setForm] = useState<ProfileForm>({
    fullName: '',
    address: '',
    bio: '',
    phone: '',
    age: '',
    city: '',
    state: '',
  })

  const [loading, setLoading] = useState(false)

  // Load profile (NO redirects here)
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('token')

        if (!token) {
          toast.error('You are not logged in')
          return
        }

        const res = await fetch('/api/profile', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (res.status === 401) {
          toast.error('Session expired. Please login again.')
          localStorage.removeItem('token')
          return
        }

        if (!res.ok) {
          console.error('Profile fetch failed:', res.status)
          toast.error('Failed to load profile')
          return
        }

        const data = await parseResponseBody(res)
        const profile = (data && typeof data === 'object' ? data : {}) as Record<string, unknown>
        const safe = (v: unknown) => (v ?? '') as string | number

        setForm({
          fullName: String(safe(profile.fullName)),
          address: String(safe(profile.address)),
          bio: String(safe(profile.bio)),
          phone: String(safe(profile.phone)),
          age: String(safe(profile.age)),
          city: String(safe(profile.city)),
          state: String(safe(profile.state)),
        })
      } catch (err) {
        console.error(err)
        toast.error('Something went wrong while loading profile')
      }
    }

    loadProfile()
  }, [])


  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      const token = localStorage.getItem('token')

      if (!token) {
        toast.error('You are not logged in')
        return
      }

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          age: form.age ? Number(form.age) : undefined,
        }),
      })

      if (res.status === 401) {
        toast.error('Session expired. Please login again.')
        localStorage.removeItem('token')
        return
      }

      if (!res.ok) {
        const body = await parseResponseBody(res)
        const msg =
          body && typeof body === 'object' && 'message' in body
            ? String((body as { message?: unknown }).message || 'Update failed')
            : 'Update failed'
        throw new Error(msg)
      }

      toast.success('Profile updated successfully')

      // ✅ Intentional redirect only after save
      setTimeout(() => {
        router.push('/dashboard')
      }, 800)
    } catch (err: unknown) {
      console.error(err)
      toast.error(toErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-md bg-gray-950 text-white px-4 py-3 border border-gray-700 focus:border-indigo-500 outline-none transition'

  return (
    <section className="min-h-screen bg-slate-950 flex justify-center px-4 py-12">
      <div className="w-full max-w-4xl bg-slate-800/50 backdrop-blur-md rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Edit Profile
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className={inputClass}
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className={inputClass}
          />

          <input
            name="age"
            value={form.age}
            onChange={handleChange}
            placeholder="Age"
            className={inputClass}
          />

          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="City"
            className={inputClass}
          />

          <input
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="State"
            className={inputClass}
          />

          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="md:col-span-2 w-full rounded-md bg-gray-950 text-white px-4 py-3 border border-gray-700 focus:border-indigo-500 outline-none"
          />

          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Short Bio"
            className="md:col-span-2 w-full h-32 rounded-md bg-gray-950 text-white p-4 border border-gray-700 focus:border-indigo-500 outline-none"
          />

          <div className="md:col-span-2 flex justify-center mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-lg text-white font-semibold transition ${
                loading
                  ? 'bg-indigo-600/60 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        <ToastContainer position="bottom-right" />
      </div>
    </section>
  )
}
