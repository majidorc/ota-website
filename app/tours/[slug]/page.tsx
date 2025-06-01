"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  referencecode?: string;
  shortdesc?: string;
  fulldesc?: string;
  highlights?: string[];
  photos?: string[];
  status?: string;
  price?: number;
  currency?: string;
  inclusions?: string;
  exclusions?: string;
  notAvailableFor?: string;
  meetingpoint?: string;
  importantinfo?: string;
  options?: { name: string; description: string }[];
}

function extractIdFromSlug(slug: string): string | null {
  // Slug format: title-in-kebab-case-id
  const match = slug.match(/-(\w+)$/);
  return match ? match[1] : null;
}

export default function ProductDetailPage() {
  const params = useParams();
  const { slug } = params as { slug: string };
  const id = extractIdFromSlug(slug);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid product URL");
      setLoading(false);
      return;
    }
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error || !product) return <div className="p-8 text-red-600">{error || "Product not found"}</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-5xl mx-auto py-10 px-4">
        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          {product.photos && product.photos.length > 0 ? (
            <div className="relative w-full h-72 md:h-96">
              <Image src={product.photos[0]} alt={product.title} fill className="object-cover w-full h-full" />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow mb-2">{product.title}</h1>
                {product.shortdesc && <p className="text-lg text-gray-100 drop-shadow mb-1">{product.shortdesc}</p>}
              </div>
            </div>
          ) : (
            <div className="relative w-full h-72 md:h-96 bg-gray-200 flex items-center justify-center">
              <Image src="/images/placeholder.jpg" alt="No image" fill className="object-cover" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-700 z-10">{product.title}</h1>
            </div>
          )}
          {/* Photo Gallery */}
          {product.photos && product.photos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto p-4 bg-gray-50 border-t">
              {product.photos.slice(1).map((src, idx) => (
                <div key={idx} className="relative w-32 h-20 rounded overflow-hidden border flex-shrink-0">
                  <Image src={src} alt={product.title} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Main Info Card */}
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          <div className="md:col-span-2">
            {/* Highlights */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="mb-8">
                <h2 className="font-bold text-xl mb-3 flex items-center gap-2"><span>✨</span> Highlights</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 pl-2">
                  {product.highlights.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </div>
            )}
            {/* Full Description */}
            {product.fulldesc && (
              <div className="mb-8">
                <h2 className="font-bold text-xl mb-3 flex items-center gap-2"><span>📝</span> Full Description</h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{product.fulldesc}</p>
              </div>
            )}
            {/* Includes & Excludes */}
            {(product.inclusions || product.exclusions) && (
              <div className="mb-8 grid md:grid-cols-2 gap-6">
                {product.inclusions && (
                  <div>
                    <h2 className="font-bold text-lg mb-2 flex items-center gap-2"><span>✅</span> Includes</h2>
                    <pre className="bg-green-50 p-4 rounded whitespace-pre-wrap text-green-900">{product.inclusions}</pre>
                  </div>
                )}
                {product.exclusions && (
                  <div>
                    <h2 className="font-bold text-lg mb-2 flex items-center gap-2"><span>❌</span> Excludes</h2>
                    <pre className="bg-red-50 p-4 rounded whitespace-pre-wrap text-red-900">{product.exclusions}</pre>
                  </div>
                )}
              </div>
            )}
            {/* Meeting point & Important info */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {product.meetingpoint && (
                <div>
                  <h2 className="font-bold text-lg mb-2 flex items-center gap-2"><span>📍</span> Meeting Point</h2>
                  <p className="text-gray-700">{product.meetingpoint}</p>
                </div>
              )}
              {product.importantinfo && (
                <div>
                  <h2 className="font-bold text-lg mb-2 flex items-center gap-2"><span>ℹ️</span> Important Info</h2>
                  <p className="text-gray-700">{product.importantinfo}</p>
                </div>
              )}
            </div>
            {/* Options Section */}
            {product.options && product.options.length > 0 && (
              <div className="mb-8">
                <h2 className="font-bold text-lg mb-2 flex items-center gap-2"><span>🛎️</span> Options</h2>
                <div className="space-y-2">
                  {product.options.map((option, idx) => (
                    <div key={idx} className="border rounded p-4 bg-gray-50">
                      <div className="font-semibold">{option.name}</div>
                      <div className="text-gray-700 text-sm">{option.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Sidebar Card */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-6 sticky top-8">
            <div>
              <div className="text-3xl font-bold text-blue-700 mb-2">
                {typeof product.price === 'number' ? `${product.price.toFixed(2)} ${product.currency || ''}` : 'Contact for price'}
              </div>
              <button className="w-full bg-blue-600 text-white px-6 py-3 rounded font-semibold text-lg hover:bg-blue-700 transition">Check availability</button>
            </div>
            {product.referencecode && (
              <div className="text-sm text-gray-500"><span className="font-semibold">Reference code:</span> {product.referencecode}</div>
            )}
            {product.notAvailableFor && (
              <div className="text-sm text-gray-500"><span className="font-semibold">Not available for:</span> {product.notAvailableFor}</div>
            )}
          </div>
        </div>
        {/* Related products or recommendations */}
        <div className="mt-16">
          <h2 className="font-bold text-xl mb-4">You might also like...</h2>
          <div className="text-gray-500">(Related products section coming soon)</div>
        </div>
      </div>
    </div>
  );
} 