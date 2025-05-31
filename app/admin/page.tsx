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
  id: number;
  name: string;
  description: string;
  referenceCode: string;
  status: "Bookable" | "Deactivated" | "In review";
}

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
  const [products, setProducts] = useState<Product[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const router = useRouter();
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/destinations")
      .then((res) => res.json())
      .then((data) => {
        // Add mock referenceCode and status for demo
        setProducts(
          data.map((item: any, idx: number) => ({
            ...item,
            referenceCode: `REF${1000 + idx}`,
            status: idx % 3 === 0 ? "Bookable" : idx % 3 === 1 ? "Deactivated" : "In review",
          }))
        );
      });
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (
        openDropdown &&
        dropdownRefs.current[openDropdown] &&
        !dropdownRefs.current[openDropdown]?.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    }
    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  const handleDropdownClick = (tabName: string) => {
    setOpenDropdown(openDropdown === tabName ? null : tabName);
  };

  const handleNavigation = (href: string) => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    if (href === '/admin/products/new') {
      setShowNewProductForm(true);
    } else {
      router.push(href);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>

          {/* Top Navigation Bar */}
          <nav className="flex flex-col md:flex-row md:items-center md:justify-between bg-white px-4 md:px-8 py-4 shadow-sm border-b gap-4 md:gap-0 relative">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 w-full md:w-auto">
              <span className="font-bold text-lg md:text-xl text-blue-600">Admin Panel</span>
              {/* Hamburger for mobile */}
              <button
                className="md:hidden absolute right-4 top-4 z-30"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Open menu"
              >
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              {/* Desktop nav */}
              <div className="hidden md:flex items-center gap-8">
                {menuTabs.map((tab) => (
                  <div
                    key={tab.name}
                    className="relative"
                    ref={(el: HTMLDivElement | null) => { dropdownRefs.current[tab.name] = el; }}
                  >
                    {tab.dropdown ? (
                      <button
                        className="text-gray-700 font-medium hover:text-blue-600 focus:outline-none px-2 py-1"
                        onClick={() => handleDropdownClick(tab.name)}
                      >
                        {tab.name}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleNavigation(tab.href || '#')}
                        className="text-gray-700 font-medium hover:text-blue-600 px-2 py-1"
                      >
                        {tab.name}
                      </button>
                    )}
                    {tab.dropdown && openDropdown === tab.name && (
                      <div className="absolute left-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                        {tab.dropdown.map((item) => (
                          <button
                            key={item.label}
                            onClick={() => handleNavigation(item.href || '#')}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 w-full md:w-auto">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold text-center md:text-left">Unlocked – Spring 2025 <span className="ml-1 bg-blue-500 text-white px-2 py-0.5 rounded-full text-[10px] align-middle">NEW</span></span>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="font-semibold text-gray-700">Majid</span>
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">M</div>
              </div>
            </div>
          </nav>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden">
              <div className="absolute top-0 left-0 w-64 h-full bg-white shadow-lg p-6" onClick={e => e.stopPropagation()}>
                <button className="mb-6" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <nav className="flex flex-col gap-4">
                  {menuTabs.map((tab) => (
                    <div key={tab.name}>
                      {tab.dropdown ? (
                        <>
                          <div className="font-semibold text-gray-900">{tab.name}</div>
                          <div className="ml-4 mt-1 flex flex-col gap-1">
                            {tab.dropdown.map((item) => (
                              <button
                                key={item.label}
                                onClick={() => handleNavigation(item.href || '#')}
                                className="text-sm text-gray-600 hover:text-blue-600 text-left"
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </>
                      ) : (
                        <button
                          onClick={() => handleNavigation(tab.href || '#')}
                          className="text-gray-700 font-medium hover:text-blue-600"
                        >
                          {tab.name}
                        </button>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="mt-8">
            {showNewProductForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="relative w-full max-w-5xl mx-auto">
                  <NewProductForm onClose={() => setShowNewProductForm(false)} />
                </div>
                <button
                  className="fixed inset-0 w-full h-full cursor-default"
                  style={{ background: 'transparent', border: 'none', zIndex: 40 }}
                  aria-label="Close modal"
                  onClick={() => setShowNewProductForm(false)}
                  tabIndex={-1}
                />
              </div>
            )}
            <h1 className="text-2xl font-bold mb-6">Products</h1>
            <div className="overflow-x-auto bg-white rounded shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.referenceCode}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[product.status]}`}>{product.status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-blue-600 hover:underline font-semibold">See details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 