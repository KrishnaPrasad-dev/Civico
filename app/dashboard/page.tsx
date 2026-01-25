"use client";

import { useState } from "react";

type AddressField = "street" | "city" | "state" | "pincode";

type UserProfile = {
  name: string;
  email: string;
  age?: number;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
};

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile>({
    name: "Krishna Prasad",
    email: "krishna@example.com",
    age: 21,
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1] as AddressField;
      setUser((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      setUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("Profile updated successfully");
  };

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      
      {/* 🌌 Radial Glow Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="relative h-full w-full bg-slate-950">
          <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full
            bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]" />

          <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full
            bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]" />
        </div>
      </div>

      {/* 🧱 Dashboard Content */}
      <div className="relative z-10 p-6">
        
        {/* 🔝 Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">CIVICO Dashboard</h1>
          <button className="text-sm text-red-400 hover:underline">
            Logout
          </button>
        </header>

        {/* 👋 Welcome */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold">
            Welcome back, {user.name}
          </h2>
          <p className="text-zinc-400">
            Let’s improve your community, one issue at a time.
          </p>
        </section>

        {/* 📊 Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {["Issues Reported", "In Progress", "Resolved"].map((label) => (
            <div
              key={label}
              className="bg-zinc-900/80 backdrop-blur rounded-xl p-4"
            >
              <p className="text-zinc-400 text-sm">{label}</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          ))}
        </section>

        {/* 📝 My Issues */}
        <section className="bg-zinc-900/80 backdrop-blur rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-2">My Issues</h3>
          <p className="text-zinc-400 mb-4">
            You haven’t reported any issues yet.
          </p>
          <button className="bg-blue-600 px-4 py-2 rounded-lg">
            + Report an Issue
          </button>
        </section>

        {/* 👤 Profile Details */}
        <section className="bg-zinc-900/80 backdrop-blur rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Profile Details</h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-400 text-sm"
              >
                Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-zinc-400">Age</label>
              <input
                name="age"
                type="number"
                disabled={!isEditing}
                value={user.age || ""}
                onChange={handleChange}
                className="w-full mt-1 bg-zinc-800 rounded p-2"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400">Phone</label>
              <input
                name="phone"
                disabled={!isEditing}
                value={user.phone || ""}
                onChange={handleChange}
                className="w-full mt-1 bg-zinc-800 rounded p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {(["street", "city", "state", "pincode"] as AddressField[]).map(
              (field) => (
                <div key={field}>
                  <label className="text-sm text-zinc-400 capitalize">
                    {field}
                  </label>
                  <input
                    name={`address.${field}`}
                    disabled={!isEditing}
                    value={user.address?.[field] || ""}
                    onChange={handleChange}
                    className="w-full mt-1 bg-zinc-800 rounded p-2"
                  />
                </div>
              )
            )}
          </div>

          {isEditing && (
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSave}
                className="bg-green-600 px-4 py-2 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-zinc-700 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
