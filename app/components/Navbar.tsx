"use client";

import Link from 'next/link'
import { useState } from 'react'
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import SearchBar from './SearchBar'

const destinations = [
  { name: 'Europe', href: '/destinations/europe', items: [
    { name: 'Paris, France', href: '/destinations/1' },
    { name: 'Rome, Italy', href: '/destinations/4' },
    { name: 'Barcelona, Spain', href: '/destinations/5' },
  ]},
  { name: 'Asia', href: '/destinations/asia', items: [
    { name: 'Tokyo, Japan', href: '/destinations/2' },
    { name: 'Bangkok, Thailand', href: '/destinations/6' },
    { name: 'Singapore', href: '/destinations/7' },
  ]},
  { name: 'Americas', href: '/destinations/americas', items: [
    { name: 'New York, USA', href: '/destinations/3' },
    { name: 'Rio de Janeiro, Brazil', href: '/destinations/8' },
    { name: 'Mexico City, Mexico', href: '/destinations/9' },
  ]},
]

const experiences = [
  { name: 'Adventure Tours', href: '/experiences/adventure' },
  { name: 'Cultural Experiences', href: '/experiences/cultural' },
  { name: 'Food & Wine', href: '/experiences/food-wine' },
  { name: 'City Tours', href: '/experiences/city-tours' },
]

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Destinations', href: '/destinations', items: destinations },
  { name: 'Experiences', href: '/experiences', items: experiences },
  { name: 'Hotels', href: '/hotels' },
  { name: 'Flights', href: '/flights' },
  { name: 'Deals', href: '/deals' },
  { name: 'About', href: '/about' },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Global">
        <div className="flex h-16 items-center justify-between">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5 text-2xl font-bold text-blue-600">
              OTA
            </Link>
          </div>
          <div className="hidden lg:flex flex-1 justify-center">
            <div className="w-full max-w-xl">
              <SearchBar />
            </div>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.items ? (
                  <div
                    className="group"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600"
                    >
                      {item.name}
                      <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                    {activeDropdown === item.name && (
                      <div className="absolute left-0 top-full z-10 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="py-2">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-6">
            <Link
              href="/login"
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="btn-primary text-sm font-semibold leading-6"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5 text-2xl font-bold text-blue-600">
                OTA
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <div key={item.name}>
                      {item.items ? (
                        <div className="space-y-2">
                          <div className="font-semibold text-gray-900">{item.name}</div>
                          <div className="pl-4 space-y-2">
                            {item.items.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="block text-gray-600 hover:text-blue-600"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
                <div className="py-6 space-y-4">
                  <Link
                    href="/login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="btn-primary block text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
} 