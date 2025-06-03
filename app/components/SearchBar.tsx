"use client";

import { useState } from 'react'
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline'

export default function SearchBar() {
  const [location, setLocation] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      window.location.href = `/search?query=${encodeURIComponent(location)}`;
    }
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md flex items-center bg-gray-100 rounded-md border border-gray-200 px-2 py-1">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
          <MapPinIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Where to?"
          className="block w-full pl-8 pr-2 py-1 bg-transparent text-sm border-none focus:ring-0 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="ml-2 flex items-center justify-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md transition"
      >
        <MagnifyingGlassIcon className="h-4 w-4" />
        Search
      </button>
    </form>
  )
} 