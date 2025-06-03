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
    <form
      onSubmit={handleSearch}
      className="w-full max-w-lg flex items-center bg-white rounded-full border border-gray-200 shadow-sm px-4 py-2 transition focus-within:ring-2 focus-within:ring-blue-200"
    >
      <div className="relative flex-1">
        <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Where to?"
          className="block w-full pl-10 pr-2 py-2 bg-transparent text-sm border-none focus:ring-0 focus:outline-none placeholder-gray-400"
        />
      </div>
      <button
        type="submit"
        className="ml-2 flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full shadow transition"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
        Search
      </button>
    </form>
  )
} 