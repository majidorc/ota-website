"use client";

import { useState } from 'react'
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline'

export default function SearchBar() {
  const [location, setLocation] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResults([])
    try {
      const res = await fetch(`/api/search-products?q=${encodeURIComponent(location)}`)
      const data = await res.json()
      setResults(data.products || [])
    } catch (err) {
      setError('Failed to fetch results')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSearch} className="bg-white rounded-lg p-4 shadow-lg">
        <div className="flex gap-4">
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
          <button
            type="submit"
            className="btn-primary flex items-center justify-center gap-2 px-6 py-2"
            disabled={loading}
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
      {error && <div className="text-red-600 mt-2">{error}</div>}
      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg mt-4 p-4">
          <h2 className="text-lg font-bold mb-2">Results</h2>
          <ul className="divide-y divide-gray-200">
            {results.map((product) => (
              <li key={product.id} className="py-3 flex items-center gap-4">
                {product.image && (
                  <img src={product.image} alt={product.title} className="w-16 h-16 object-cover rounded" />
                )}
                <div>
                  <div className="font-semibold">{product.title}</div>
                  <div className="text-gray-600 text-sm">{product.description}</div>
                  {product.price && (
                    <div className="text-blue-600 font-bold mt-1">From {product.price} {product.currency || ''}</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
} 