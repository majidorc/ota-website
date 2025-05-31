"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const menuTabs = [
  { name: "Create", dropdown: [{ label: "New Product", href: "/admin/products/new", internal: true }] },
  { name: "Manage", dropdown: [{ label: "Products", href: "/admin/products", internal: true }] },
  { name: "Bookings", dropdown: [{ label: "Bookings", href: "/admin/bookings", internal: true }] },
  { name: "Performance", href: "/admin/performance", internal: true },
  { name: "Finance", href: "/admin/finance", internal: true },
];

export default function AdminHeader() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleDropdownClick = (tabName: string) => {
    setOpenDropdown(openDropdown === tabName ? null : tabName);
  };

  const handleNavigation = (href: string) => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    router.push(href);
  };

  return (
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
        <div className="flex items-center gap-2 justify-center md:justify-start">
          <span className="font-semibold text-gray-700">Majid</span>
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">M</div>
        </div>
      </div>
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
    </nav>
  );
} 