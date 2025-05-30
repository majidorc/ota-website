import Image from 'next/image'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black/40" />
        <div className="container relative h-full flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
            Discover Your Next Adventure
          </h1>
          <p className="text-xl md:text-2xl text-center mb-8">
            Find and book amazing experiences around the world
          </p>
          
          {/* Search Bar */}
          <div className="w-full max-w-3xl bg-white rounded-lg p-2 flex items-center">
            <input
              type="text"
              placeholder="Where do you want to go?"
              className="flex-1 px-4 py-2 text-gray-900 focus:outline-none"
            />
            <button className="btn-primary flex items-center gap-2">
              <MagnifyingGlassIcon className="w-5 h-5" />
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Popular Destinations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination) => (
              <div
                key={destination.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{destination.name}</h3>
                  <p className="text-gray-600 mb-4">{destination.description}</p>
                  <button className="btn-primary w-full">Explore</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const destinations = [
  {
    id: 1,
    name: 'Paris, France',
    description: 'Experience the city of love with its iconic landmarks and rich culture.',
    image: '/images/paris.jpg',
  },
  {
    id: 2,
    name: 'Tokyo, Japan',
    description: 'Discover the perfect blend of traditional culture and modern innovation.',
    image: '/images/tokyo.jpg',
  },
  {
    id: 3,
    name: 'New York, USA',
    description: 'Explore the city that never sleeps with its endless possibilities.',
    image: '/images/new-york.jpg',
  },
] 