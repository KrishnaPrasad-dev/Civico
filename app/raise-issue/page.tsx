"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { ImagePlus, X } from "lucide-react";

const departments = [
  { label: "Fire", value: "fire", emoji: "🔥" },
  { label: "Water", value: "water", emoji: "💧" },
  { label: "GHMC", value: "ghmc", emoji: "🏙️" },
  { label: "Electricity", value: "electricity", emoji: "⚡" },
  { label: "Roads", value: "roads", emoji: "🛣️" },
];

export default function RaiseIssuePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    department: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [detecting, setDetecting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const draft = localStorage.getItem("issueDraft");
    if (!draft) return;

    setForm((prev) => ({ ...prev, description: draft }));
    localStorage.removeItem("issueDraft");
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    // limit to 4 images
    const validFiles = files.slice(0, 4 - images.length);

    setImages((prev) => [...prev, ...validFiles]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setDetecting(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setForm((prev) => ({
          ...prev,
          location: `Lat ${latitude.toFixed(4)}, Lng ${longitude.toFixed(4)}`,
        }));
        setDetecting(false);
      },
      () => {
        alert("Location permission denied");
        setDetecting(false);
      }
    );
  };

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("User not logged in");
      return;
    }

    const user = JSON.parse(storedUser);
    setSubmitting(true);

  const formData = new FormData();
formData.append("title", form.title);
formData.append("description", form.description);
formData.append("location", form.location);
formData.append("department", form.department);
formData.append("userId", user._id || user.id);
formData.append("userName", user.fullName); // ✅ THIS LINE


    images.forEach((img) => {
      formData.append("images", img);
    });

    const res = await fetch("/api/issues", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      let message = "Failed to create issue";
      try {
        const error = await res.json();
        message = error.message || message;
      } catch {}
      alert(message);
      setSubmitting(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <section className="min-h-screen w-full bg-slate-950">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Raise an Issue
          </h1>
          <p className="text-slate-400 mt-2">
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
            <input
              type="text"
              name="title"
              required
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              required
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white resize-none"
            />
          </div>

          {/* Image Upload (Twitter-style) */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Images (optional)
            </label>

            <div className="flex gap-3 flex-wrap">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="relative w-28 h-28 rounded-xl overflow-hidden border border-slate-700"
                >
                  <img
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-black/60 rounded-full p-1"
                  >
                    <X size={14} className="text-white" />
                  </button>
                </div>
              ))}

              {images.length < 4 && (
                <label className="w-28 h-28 flex items-center justify-center rounded-xl border border-dashed border-slate-600 cursor-pointer hover:border-indigo-500">
                  <ImagePlus className="text-slate-400" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
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
                required
                value={form.location}
                onChange={handleChange}
                className="flex-1 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
              />
              <button
                type="button"
                onClick={detectLocation}
                disabled={detecting}
                className="px-4 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"
              >
                {detecting ? "..." : "📍"}
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
            {submitting ? "Submitting..." : "Submit Issue"}
          </button>
        </form>
      </div>
    </section>
  );
}
