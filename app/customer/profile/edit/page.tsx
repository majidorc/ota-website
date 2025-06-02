"use client";
import { useState } from "react";
import Link from "next/link";

export default function EditProfile() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
    }, 1000);
  }

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
        <label className="font-semibold">Name
          <input type="text" className="border rounded px-3 py-2 w-full mt-1" value={name} onChange={e => setName(e.target.value)} />
        </label>
        <label className="font-semibold">Email
          <input type="email" className="border rounded px-3 py-2 w-full mt-1" value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
        {success && <div className="text-green-600 font-semibold">Profile updated!</div>}
      </form>
      <Link href="/customer" className="text-blue-600 hover:underline mt-4 block">Back to Dashboard</Link>
    </div>
  );
} 