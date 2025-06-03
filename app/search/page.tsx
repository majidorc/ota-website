"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  description?: string;
  price?: number;
  image?: string;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError(null);
    fetch(`/api/search-products?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load search results');
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-4">Search Results</h1>
      <p className="text-gray-600 mb-8">Showing results for: <span className="font-semibold">{query}</span></p>
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-gray-400">No results found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="relative h-40 w-full">
                <Image 
                  src={product.image || '/images/placeholder.jpg'} 
                  alt={product.title} 
                  fill 
                  className="object-cover rounded-t-lg" 
                />
              </div>
              <div className="p-4">
                <div className="font-semibold mb-1">{product.title}</div>
                <div className="text-xs text-gray-600 mb-2">{product.description}</div>
                <div className="text-xs text-gray-500">
                  {typeof product.price === 'number' ? `From ${product.price.toFixed(2)} per person` : 'Contact for price'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
} 