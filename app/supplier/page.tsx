"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SupplierDashboard() {
  const [productCount, setProductCount] = useState<number | null>(null);
  const [bookingCount, setBookingCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      setLoading(true);
      try {
        const res = await fetch("/api/products");
        const products = await res.json();
        setProductCount(Array.isArray(products) ? products.length : 0);
        // TODO: Replace with real booking count API if available
        setBookingCount(0); // Placeholder for now
      } catch (err) {
        setProductCount(0);
        setBookingCount(0);
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Supplier Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-6 flex flex-col items-center shadow">
          <div className="text-4xl font-bold text-blue-700 mb-2">
            {loading ? "..." : productCount}
          </div>
          <div className="text-lg font-semibold mb-2">Products</div>
          <Link href="/supplier/products" className="text-blue-600 hover:underline">Manage Products</Link>
        </div>
        <div className="bg-green-50 rounded-lg p-6 flex flex-col items-center shadow">
          <div className="text-4xl font-bold text-green-700 mb-2">
            {loading ? "..." : bookingCount}
          </div>
          <div className="text-lg font-semibold mb-2">Bookings</div>
          <Link href="/supplier/bookings" className="text-green-600 hover:underline">View Bookings</Link>
        </div>
        <div className="bg-yellow-50 rounded-lg p-6 flex flex-col items-center shadow">
          <div className="text-4xl font-bold text-yellow-700 mb-2">+1</div>
          <div className="text-lg font-semibold mb-2">Add Product</div>
          <Link href="/supplier/products/new" className="text-yellow-600 hover:underline">Add New Product</Link>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Welcome to your supplier panel</h2>
        <p className="mb-2">Here you can:</p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Add and manage your products</li>
          <li>View and manage your bookings</li>
          <li>Edit your supplier profile and settings</li>
        </ul>
        <div className="flex gap-4">
          <Link href="/supplier/products" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700">Go to Products</Link>
          <Link href="/supplier/products/new" className="bg-yellow-500 text-white px-4 py-2 rounded font-semibold hover:bg-yellow-600">Add Product</Link>
        </div>
      </div>
    </div>
  );
} 