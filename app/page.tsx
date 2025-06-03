"use client";
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'
import ProductCard from './components/ProductCard'

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
  badge?: string;
  rating?: number;
  reviewCount?: number;
  description?: string;
  image?: string;
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
  const [searchQuery, setSearchQuery] = useState('')
  const tabs = ['For you', 'Culture', 'Food', 'Nature']

  // Add missing variables to fix build error
  const searchResults: any[] = [];
  const experiences: any[] = [];
  const destinations: any[] = [];

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
      <Navbar />
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
            <div key={item.id} className="min-w-[260px]">
              <ProductCard product={item} />
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
            <div key={item.id} className="min-w-[260px]">
              <ProductCard product={item} />
            </div>
          ))}
        </div>
      </section>
      {/* Unforgettable experiences */}
      <section className="py-10 px-4 md:px-16">
        <h2 className="text-2xl font-bold mb-6">Unforgettable experiences around the world</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((item) => (
            <ProductCard key={item.id} product={item} />
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
    </div>
  );
}