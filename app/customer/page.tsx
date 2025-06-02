"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/bookings?userId=demo-user")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBookings(data);
        } else {
          setBookings([]);
          setError(data.error || "Failed to load bookings");
        }
      })
      .catch(() => {
        setBookings([]);
        setError("Failed to load bookings");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : bookings.length === 0 ? (
          <div>No upcoming bookings.</div>
        ) : (
          <ul>
            {bookings.map((booking: any) => (
              <li key={booking.id} className="mb-4 border-b pb-4">
                <div className="font-semibold">{booking.activityName}</div>
                <div className="text-gray-600">{booking.date} — {booking.location}</div>
                <div className="flex gap-2 mt-2">
                  <Link href={`/customer/bookings/${booking.id}`} className="text-blue-600 hover:underline">View</Link>
                  <Link href={`/customer/bookings/${booking.id}/edit`} className="text-yellow-600 hover:underline">Edit</Link>
                  <button className="text-red-600 hover:underline">Cancel</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Profile</h2>
        {/* Replace with real profile info and edit form */}
        <div>Name: John Doe</div>
        <div>Email: john@example.com</div>
        <Link href="/customer/profile/edit" className="text-blue-600 hover:underline mt-2 block">Edit Profile</Link>
      </div>
    </div>
  );
} 