"use client";
import React, { useEffect, useRef, useState, ChangeEvent, KeyboardEvent, MouseEvent, JSX } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NewProductForm from '../components/NewProductForm';

// Add type declarations for JSX elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

interface Product {
  id: string;
  title: string;
  status: "Pending" | "Approved" | "Rejected";
}

interface Supplier {
  id: string;
  name: string;
  email: string;
  products: Product[];
}

const mockSuppliers: Supplier[] = [
  {
    id: "1",
    name: "Majid Travel",
    email: "majid@example.com",
    products: [
      { id: "p1", title: "Bangkok City Tour", status: "Pending" },
      { id: "p2", title: "Ayutthaya Day Trip", status: "Approved" },
    ],
  },
  {
    id: "2",
    name: "Global Tours",
    email: "global@example.com",
    products: [
      { id: "p3", title: "Chiang Mai Adventure", status: "Rejected" },
      { id: "p4", title: "Phuket Beach Fun", status: "Pending" },
    ],
  },
];

const statusColors: Record<string, string> = {
  Bookable: "bg-green-100 text-green-800",
  Deactivated: "bg-gray-100 text-gray-800",
  "In review": "bg-blue-100 text-blue-800",
};

const menuTabs = [
  { name: "Create", dropdown: [{ label: "New Product", href: "/admin/products/new", internal: true }] },
  { name: "Manage", dropdown: [{ label: "Products", href: "/admin/products", internal: true }] },
  { name: "Bookings", dropdown: [{ label: "Bookings", href: "/admin/bookings", internal: true }] },
  { name: "Performance", href: "/admin/performance", internal: true },
  { name: "Finance", href: "/admin/finance", internal: true },
];

const languages = ["English", "French", "German", "Spanish", "Italian", "Thai"];
const categories = [
  { label: "Attraction ticket", description: "Like entry to a landmark, theme park, show" },
  { label: "Tour", description: "Guided walking tours of a city or attraction, day trips, multi-day trips, city cruises, etc" },
  { label: "City card", description: "A pass for multiple attractions or transport within a city" },
  { label: "Hop-on hop-off ticket", description: "Entry to a hop-on hop-off bus or boat" },
  { label: "Transfer", description: "Transportation services like airport or bus transfers" },
  { label: "Rental", description: "Experience rentals like costumes, adventure equipment, unique vehicle drives" },
  { label: "Other", description: "Like a cooking class or multiple activities sold together" },
];

export default function AdminDashboard() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const router = useRouter();
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleApprove = (supplierId: string, productId: string) => {
    setSuppliers(suppliers => suppliers.map(s =>
      s.id === supplierId ? {
        ...s,
        products: s.products.map(p =>
          p.id === productId ? { ...p, status: "Approved" } : p
        )
      } : s
    ));
  };

  const handleReject = (supplierId: string, productId: string) => {
    setSuppliers(suppliers => suppliers.map(s =>
      s.id === supplierId ? {
        ...s,
        products: s.products.map(p =>
          p.id === productId ? { ...p, status: "Rejected" } : p
        )
      } : s
    ));
  };

  const handleDelete = (supplierId: string, productId: string) => {
    setSuppliers(suppliers => suppliers.map(s =>
      s.id === supplierId ? {
        ...s,
        products: s.products.filter(p => p.id !== productId)
      } : s
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin: Manage Suppliers & Products</h1>
      {suppliers.map(supplier => (
        <div key={supplier.id} className="mb-8 bg-white rounded shadow p-6">
          <div className="flex justify-between items-center mb-2">
            <div>
              <div className="font-bold text-lg">{supplier.name}</div>
              <div className="text-gray-500 text-sm">{supplier.email}</div>
            </div>
            <span className="text-xs text-gray-400">Supplier ID: {supplier.id}</span>
          </div>
          <table className="w-full table-auto border-collapse mt-4">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Product</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {supplier.products.map(product => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 font-semibold">{product.title}</td>
                  <td className="py-3">
                    <span className={
                      product.status === "Approved"
                        ? "bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium"
                        : product.status === "Rejected"
                        ? "bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium"
                        : "bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium"
                    }>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-3 flex gap-2">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      disabled={product.status === "Approved"}
                      onClick={() => handleApprove(supplier.id, product.id)}
                    >Approve</button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      disabled={product.status === "Rejected"}
                      onClick={() => handleReject(supplier.id, product.id)}
                    >Reject</button>
                    <Link
                      href={`/supplier/products/${product.id}/edit`}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >Edit</Link>
                    <button
                      className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
                      onClick={() => handleDelete(supplier.id, product.id)}
                    >Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
} 