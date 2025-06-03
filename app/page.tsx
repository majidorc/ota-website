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

function HeaderButton({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <button title={title} className="text-gray-600 hover:text-blue-600">
      {children}
    </button>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('For you')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [continuePlanning, setContinuePlanning] = useState<any[]>([])
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
    // Continue planning: get last viewed product from localStorage
    if (typeof window !== 'undefined') {
      const lastProduct = localStorage.getItem('lastViewedProduct')
      if (lastProduct) {
        setContinuePlanning([JSON.parse(lastProduct)])
      }
    }
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
          <span className="font-bold text-xl text-orange-600 tracking-tight">OTA</span>
          <form onSubmit={e => { e.preventDefault(); /* TODO: handle search */ }} className="flex items-center bg-white rounded-full border border-gray-200 shadow-sm px-2 py-1 w-[480px] focus-within:ring-2 focus-within:ring-blue-100">
            <span className="pl-3 pr-2 text-gray-400">
              <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z' /></svg>
            </span>
            <input className="bg-transparent outline-none px-2 py-2 w-48 text-gray-700 placeholder-gray-500 font-medium" placeholder="Find places and things to do" />
            <span className="h-6 w-px bg-gray-200 mx-2" />
            <button type="button" className="flex items-center gap-1 px-2 py-1 text-gray-600 font-medium hover:text-blue-600 focus:outline-none">
              <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2z' /></svg>
              <span className="font-semibold">Anytime</span>
              <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 ml-1 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' /></svg>
            </button>
            <button type="submit" className="ml-3 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-300 transition">Search</button>
          </form>
          <a href="#" className="text-blue-600 font-medium hover:underline ml-4">Become a supplier</a>
        </div>
        <div className="flex items-center gap-6">
          <HeaderButton title="Wishlist">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.014-4.5-4.5-4.5-1.74 0-3.223 1.01-3.972 2.475C11.223 4.76 9.74 3.75 8 3.75 5.514 3.75 3.5 5.765 3.5 8.25c0 7.25 8.5 11 8.5 11s8.5-3.75 8.5-11z" />
            </svg>
          </HeaderButton>
          <HeaderButton title="Cart">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437m0 0L7.5 15.75A2.25 2.25 0 009.664 18h4.672a2.25 2.25 0 002.164-2.25l1.394-10.477m-13.09 1.477h13.09" />
            </svg>
          </HeaderButton>
          <button className="text-gray-600 hover:text-blue-600">EN/THB ฿</button>
          <HeaderButton title="Account">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
            </svg>
          </HeaderButton>
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
          {continuePlanning.length > 0 ? continuePlanning.map((item) => (
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
          )) : (
            <div className="text-gray-500">No recent products. Start exploring to see suggestions here!</div>
          )}
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
                          {typeof product.price === 'number' ? `${product.price.toFixed(2)} ${product.currency || ''}`