"use client";
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'

interface Product {
  id: string;
  title: string;
  referencecode?: string;
  shortDesc?: string;
  photos?: string[];
  status?: string;
  price?: number;
  currency?: string;
  category?: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('For you')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const tabs = ['For you', 'Culture', 'Food', 'Nature']

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load products:', err)
        setLoading(false)
      })
  }, [])

  function toKebabCase(str: string) {
    return str && str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Top Navigation Bar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b bg-white sticky top-0 z-20">
        <div className="flex items-center gap-8">
          <span className="font-bold text-xl text-orange-600 tracking-tight">GET<br className="md:hidden"/>YOUR<br className="md:hidden"/>GUIDE</span>
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
            <input className="bg-transparent outline-none px-2 py-1 w-48" placeholder="Find places and things to do" />
            <select className="bg-transparent outline-none text-gray-600">
              <option>Anytime</option>
            </select>
            <button className="bg-blue-600 text-white px-4 py-1 rounded ml-2 font-semibold">Search</button>
          </div>
          <a href="#" className="text-blue-600 font-medium hover:underline ml-4">Become a supplier</a>
        </div>
        <div className="flex items-center gap-6">
          <button title="Wishlist" className="text-gray-600 hover:text-blue-600"><span className="material-icons">favorite_border</span></button>
          <button title="Cart" className="text-gray-600 hover:text-blue-600"><span className="material-icons">shopping_cart</span></button>
          <button className="text-gray-600 hover:text-blue-600">EN/THB ฿</button>
          <button className="text-gray-600 hover:text-blue-600"><span className="material-icons">person</span></button>
        </div>
      </nav>
      {/* Sub Navigation */}
      <div className="flex gap-8 px-8 py-2 border-b bg-white text-gray-700 text-sm">
        <span className="font-semibold cursor-pointer">Places to see</span>
        <span className="font-semibold cursor-pointer">Things to do</span>
        <span className="font-semibold cursor-pointer">Trip inspiration</span>
      </div>
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] flex items-center justify-center bg-gray-200 overflow-hidden">
        <Image src="/images/hero.jpg" alt="Hero" fill className="object-cover object-center z-0" />
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center h-full w-full">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center drop-shadow-lg">Find your next travel experience</h1>
          <a href="#" className="text-white underline font-semibold">Learn more &gt;</a>
          <div className="flex gap-4 mt-10 bg-white/80 rounded-lg p-2">
            {tabs.map(tab => (
              <button
                key={tab}
                className={`px-6 py-2 rounded font-semibold transition-colors ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>
      {/* Continue Planning */}
      <section className="py-10 px-4 md:px-16">
        <h2 className="text-2xl font-bold mb-6">Continue planning</h2>
        <div className="flex gap-6 overflow-x-auto pb-2">
          {continuePlanning.map((item) => (
            <div key={item.id} className="min-w-[260px] bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="relative h-40 w-full">
                <Image src={item.image} alt={item.title} fill className="object-cover rounded-t-lg" />
              </div>
              <div className="p-4">
                <div className="text-xs text-gray-500 mb-1">{item.type}</div>
                <div className="font-semibold mb-1">{item.title}</div>
                <div className="text-xs text-gray-600 mb-2">{item.duration} • {item.group}</div>
                <div className="text-xs text-gray-500">From <span className="font-bold">{item.price}</span> per person</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Based on your search */}
      <section className="py-10 px-4 md:px-16">
        <h2 className="text-2xl font-bold mb-6">Based on your search in Surat Thani Province</h2>
        <div className="flex gap-6 overflow-x-auto pb-2">
          {searchResults.map((item) => (
            <div key={item.id} className="min-w-[260px] bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="relative h-40 w-full">
                <Image src={item.image} alt={item.title} fill className="object-cover rounded-t-lg" />
              </div>
              <div className="p-4">
                <div className="text-xs text-gray-500 mb-1">{item.type}</div>
                <div className="font-semibold mb-1">{item.title}</div>
                <div className="text-xs text-gray-600 mb-2">{item.duration} • {item.group}</div>
                <div className="text-xs text-gray-500">From <span className="font-bold">{item.price}</span> per person</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Unforgettable experiences */}
      <section className="py-10 px-4 md:px-16">
        <h2 className="text-2xl font-bold mb-6">Unforgettable experiences around the world</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="relative h-40 w-full">
                <Image src={item.image} alt={item.title} fill className="object-cover rounded-t-lg" />
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded">{item.badge}</span>
              </div>
              <div className="p-4">
                <div className="text-xs text-gray-500 mb-1">{item.type}</div>
                <div className="font-semibold mb-1">{item.title}</div>
                <div className="text-xs text-gray-600 mb-2">{item.duration} • {item.group}</div>
                <div className="text-xs text-gray-500">From <span className="font-bold">{item.price}</span> per person</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Awe-inspiring destinations */}
      <section className="py-10 px-4 md:px-16">
        <h2 className="text-2xl font-bold mb-6">Awe-inspiring destinations around the world</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {destinations.map((item) => (
            <div key={item.id} className="min-w-[160px] bg-white rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col items-center">
              <div className="relative w-32 h-32 rounded-lg overflow-hidden mb-2">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="font-semibold text-center mb-2">{item.name}</div>
            </div>
          ))}
        </div>
      </section>
      {/* Products Section */}
      <section className="py-10 px-4 md:px-16">
        <h2 className="text-2xl font-bold mb-6">Our Products</h2>
        {loading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">No products available at the moment.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const slug = `${toKebabCase(product.title || 'product')}-${product.id}`;
              return (
                <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                  <a href={`/tours/${slug}`}>
                    <div className="relative h-40 w-full">
                      <Image 
                        src={product.photos && product.photos.length > 0 ? product.photos[0] : '/images/placeholder.jpg'} 
                        alt={product.title} 
                        fill 
                        className="object-cover rounded-t-lg" 
                      />
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-gray-500 mb-1">{product.category || 'Product'}</div>
                      <div className="font-semibold mb-1">{product.title}</div>
                      <div className="text-xs text-gray-600 mb-2">{product.shortDesc}</div>
                      <div className="text-xs text-gray-500">
                        From <span className="font-bold">
                          {typeof product.price === 'number' ? `${product.price.toFixed(2)} ${product.currency || ''}` : 'Contact for price'}
                        </span> per person
                      </div>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </section>
      {/* Footer */}
      <footer className="bg-gray-50 py-10 px-4 md:px-16 mt-10 border-t">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-xs text-gray-700">
          {footerLinks.map((col, i) => (
            <div key={i}>
              <div className="font-bold mb-2">{col.title}</div>
              <ul>
                {col.links.map((link, j) => (
                  <li key={j} className="mb-1">{link}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>
    </div>
  )
}

const continuePlanning = [
  { id: 1, image: '/images/palm.jpg', type: 'WATER ACTIVITY', title: 'Koh Samui: Koh Madsum, Koh Tan & Koh Rap by Longtail Boat', duration: '5 hours', group: 'Private group', price: '฿2,571' },
]
const searchResults = [
  { id: 1, image: '/images/angthong.jpg', type: 'WATER ACTIVITY', title: 'Koh Samui: Mu Ko Ang Thong Park Cruise w/ Kayaking Option', duration: '9 hours', group: 'Pickup available', price: '฿1,104' },
  { id: 2, image: '/images/samui.jpg', type: 'WATER ACTIVITY', title: 'Samui: Angthong Marine Park Boat Tour w/ Transfer and Meals', duration: '8 hours', group: 'Pickup available', price: '฿1,300' },
  { id: 3, image: '/images/jungle.jpg', type: 'DAY TRIP', title: 'Ko Samui: 4WD Wild Jungle Safari Tour with Lunch', duration: '7-7.5 hours', group: 'Small group', price: '฿1,700' },
]
const experiences = [
  { id: 1, image: '/images/palau.jpg', badge: 'Originals by GetYourGuide', type: 'WATER ACTIVITY', title: 'From Palau: La Maddalena Catamaran Tour w/ Lunch', duration: '7 hours', group: 'Small group', price: '฿4,850' },
  { id: 2, image: '/images/portland.jpg', badge: 'Originals by GetYourGuide', type: 'WATER ACTIVITY', title: 'Portland: Best of Maine Lighthouse Scenic Cruise', duration: '105 minutes', group: 'Small group', price: '฿1,759' },
  { id: 3, image: '/images/lanzarote.jpg', badge: 'Originals by GetYourGuide', type: 'ADVENTURE', title: 'Lanzarote: Guided Off-Road Volcano Buggy Tour', duration: '2-3 hours', group: 'Pickup available', price: '฿4,815' },
  { id: 4, image: '/images/split.jpg', badge: 'Originals by GetYourGuide', type: 'WATER ACTIVITY', title: 'Split/Trogir: Blue Cave, Hvar and 5 Island Tour', duration: '10-11 hours', group: 'Small group', price: '฿3,277' },
]
const destinations = [
  { id: 1, name: 'Rome', image: '/images/rome.jpg' },
  { id: 2, name: 'Paris', image: '/images/paris.jpg' },
  { id: 3, name: 'London', image: '/images/london.jpg' },
  { id: 4, name: 'New York City', image: '/images/nyc.jpg' },
  { id: 5, name: 'Dubai', image: '/images/dubai.jpg' },
  { id: 6, name: 'Barcelona', image: '/images/barcelona.jpg' },
]
const footerLinks = [
  { title: 'Top attractions worldwide', links: ['Moulin Rouge', 'Seine River', 'Ha Long Bay', 'Notre Dame Cathedral', 'Miracle Garden', 'Memorial and Museum', 'Sagrada Familia', 'Disneyland Paris', 'Last Supper', 'Caminito del Rey'] },
  { title: 'Top destinations', links: ['Vatican Museums', 'Louvre Museum', 'Keukenhof', 'Eiffel Tower', 'Colosseum', 'Alhambra', 'Warner Bros. Studio Tour', 'Van Gogh Museum', 'Niagara Falls', 'Machu Picchu'] },
  { title: 'Top countries to visit', links: ['Palace of Versailles', 'Park Güell', 'Anne Frank House', 'Aquaventure Waterpark', 'Notre Dame Cathedral', 'Sagrada Familia', 'Disneyland Paris', 'Last Supper', 'Caminito del Rey', 'Vatican Museums'] },
  { title: 'Top attraction categories', links: ['Eiffel Tower', 'Colosseum', 'Alhambra', 'Warner Bros. Studio Tour', 'Van Gogh Museum', 'Niagara Falls', 'Machu Picchu', 'Palace of Versailles', 'Park Güell', 'Anne Frank House'] },
  { title: 'Top cities', links: ['Rome', 'Paris', 'London', 'New York City', 'Dubai', 'Barcelona', 'Bangkok', 'Singapore', 'Istanbul', 'Prague'] },
] 