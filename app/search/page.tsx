"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

interface Product {
  id: string;
  title: string;
  description?: string;
  price?: number;
  image?: string;
  category?: string;
  badge?: string;
  rating?: number;
  reviewCount?: number;
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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <SearchResults />
      </Suspense>
    </>
  );
} 