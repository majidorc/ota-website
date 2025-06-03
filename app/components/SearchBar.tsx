"use client";

import { useState } from 'react'
import { MagnifyingGlassIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline'

export default function SearchBar() {
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement navigation to search results page or update parent state
    // For now, just log the search
    console.log('Searching for:', { location, date })
    // Example: window.location.href = `/search?location=${encodeURIComponent(location)}&date=${encodeURIComponent(date)}`
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-3xl bg-white rounded-lg p-4 shadow-lg">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="location" className="sr-only">
            Location
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPinIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where do you want to go?"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="flex-1">
          <label htmlFor="date" className="sr-only">
            Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          className="btn-primary flex items-center justify-center gap-2 px-6 py-2"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
          Search
        </button>
      </div>
    </form>
  )
} 