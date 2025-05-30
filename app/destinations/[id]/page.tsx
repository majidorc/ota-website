import Image from 'next/image'
import { notFound } from 'next/navigation'

// This would typically come from a database
const destinations = [
  {
    id: '1',
    name: 'Paris, France',
    description: 'Experience the city of love with its iconic landmarks and rich culture.',
    image: '/images/paris.jpg',
    details: {
      bestTimeToVisit: 'April to June, September to October',
      topAttractions: [
        'Eiffel Tower',
        'Louvre Museum',
        'Notre-Dame Cathedral',
        'Champs-Élysées',
        'Montmartre'
      ],
      localCuisine: [
        'Croissants',
        'Macarons',
        'French Onion Soup',
        'Coq au Vin',
        'Ratatouille'
      ]
    }
  },
  {
    id: '2',
    name: 'Tokyo, Japan',
    description: 'Discover the perfect blend of traditional culture and modern innovation.',
    image: '/images/tokyo.jpg',
    details: {
      bestTimeToVisit: 'March to May, September to November',
      topAttractions: [
        'Tokyo Skytree',
        'Shibuya Crossing',
        'Senso-ji Temple',
        'Tsukiji Outer Market',
        'Meiji Shrine'
      ],
      localCuisine: [
        'Sushi',
        'Ramen',
        'Tempura',
        'Takoyaki',
        'Matcha Desserts'
      ]
    }
  },
  {
    id: '3',
    name: 'New York, USA',
    description: 'Explore the city that never sleeps with its endless possibilities.',
    image: '/images/new-york.jpg',
    details: {
      bestTimeToVisit: 'April to June, September to November',
      topAttractions: [
        'Statue of Liberty',
        'Central Park',
        'Times Square',
        'Empire State Building',
        'Brooklyn Bridge'
      ],
      localCuisine: [
        'New York Pizza',
        'Bagels',
        'Hot Dogs',
        'Cheesecake',
        'Pastrami Sandwiches'
      ]
    }
  }
]

export default function DestinationPage({ params }: { params: { id: string } }) {
  const destination = destinations.find(d => d.id === params.id)
  
  if (!destination) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-[400px]">
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center">
            {destination.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">About {destination.name}</h2>
              <p className="text-gray-600 mb-6">{destination.description}</p>
              
              <h3 className="text-xl font-semibold mb-4">Best Time to Visit</h3>
              <p className="text-gray-600 mb-6">{destination.details.bestTimeToVisit}</p>

              <h3 className="text-xl font-semibold mb-4">Top Attractions</h3>
              <ul className="list-disc list-inside text-gray-600 mb-6">
                {destination.details.topAttractions.map((attraction, index) => (
                  <li key={index}>{attraction}</li>
                ))}
              </ul>

              <h3 className="text-xl font-semibold mb-4">Local Cuisine</h3>
              <ul className="list-disc list-inside text-gray-600">
                {destination.details.localCuisine.map((dish, index) => (
                  <li key={index}>{dish}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <h3 className="text-xl font-semibold mb-4">Book Your Trip</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="dates" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Dates
                  </label>
                  <input
                    type="date"
                    id="dates"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Guests
                  </label>
                  <select
                    id="guests"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option>1 Guest</option>
                    <option>2 Guests</option>
                    <option>3 Guests</option>
                    <option>4 Guests</option>
                    <option>5+ Guests</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full btn-primary"
                >
                  Book Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 