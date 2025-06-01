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
      {/* Header placeholder (if you want to add a sticky header, do it in _app or layout) */}
      <div className="max-w-7xl mx-auto py-8 px-2 md:px-6 flex flex-col md:flex-row gap-8">
        {/* Main Left: Hero, Gallery, Content */}
        <div className="flex-1 min-w-0">
          {/* Hero Section */}
          <div className="relative flex flex-col md:flex-row gap-4 mb-6">
            {/* Main Image */}
            <div className="relative w-full md:w-2/3 h-64 md:h-[420px] rounded-xl overflow-hidden shadow bg-white">
              <Image src={product.photos?.[0] || '/images/placeholder.jpg'} alt={product.title} fill className="object-cover w-full h-full" />
              {/* Overlay Title & Actions */}
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col gap-2">
                <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow mb-1">{product.title}</h1>
                {product.shortdesc && <p className="text-base text-gray-100 drop-shadow mb-1">{product.shortdesc}</p>}
                <div className="flex gap-3 mt-2">
                  <button className="bg-white/80 hover:bg-white text-gray-700 px-3 py-1 rounded shadow text-sm font-semibold">Share</button>
                  <button className="bg-white/80 hover:bg-white text-gray-700 px-3 py-1 rounded shadow text-sm font-semibold">Save</button>
                </div>
              </div>
            </div>
            {/* Vertical Gallery */}
            {product.photos && product.photos.length > 1 && (
              <div className="hidden md:flex flex-col gap-2 w-1/3">
                {product.photos.slice(1, 5).map((src, idx) => (
                  <div key={idx} className="relative h-24 rounded-lg overflow-hidden border bg-white">
                    <Image src={src} alt={product.title} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Main Content Cards */}
          <div className="space-y-6">
            {/* Highlights */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><span>✨</span> Highlights</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 pl-2">
                  {product.highlights.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </div>
            )}
            {/* About/Description */}
            {product.fulldesc && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><span>📝</span> About this activity</h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{product.fulldesc}</p>
              </div>
            )}
            {/* Includes/Excludes */}
            {(product.inclusions || product.exclusions) && (
              <div className="grid md:grid-cols-2 gap-6">
                {product.inclusions && (
                  <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="font-bold text-lg mb-2 flex items-center gap-2"><span>✅</span> Includes</h2>
                    <pre className="bg-green-50 p-4 rounded whitespace-pre-wrap text-green-900">{product.inclusions}</pre>
                  </div>
                )}
                {product.exclusions && (
                  <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="font-bold text-lg mb-2 flex items-center gap-2"><span>❌</span> Excludes</h2>
                    <pre className="bg-red-50 p-4 rounded whitespace-pre-wrap text-red-900">{product.exclusions}</pre>
                  </div>
                )}
              </div>
            )}
            {/* Meeting point, Important info, Not available for */}
            <div className="grid md:grid-cols-3 gap-6">
              {product.meetingpoint && (
                <div className="bg-white rounded-xl shadow p-6">
                  <h2 className="font-bold text-lg mb-2 flex items-center gap-2"><span>📍</span> Meeting Point</h2>
                  <p className="text-gray-700">{product.meetingpoint}</p>
                </div>
              )}
              {product.importantinfo && (
                <div className="bg-white rounded-xl shadow p-6">
                  <h2 className="font-bold text-lg mb-2 flex items-center gap-2"><span>ℹ️</span> Important Info</h2>
                  <p className="text-gray-700">{product.importantinfo}</p>
                </div>
              )}
              {product.notAvailableFor && (
                <div className="bg-white rounded-xl shadow p-6">
                  <h2 className="font-bold text-lg mb-2 flex items-center gap-2"><span>🚫</span> Not available for</h2>
                  <p className="text-gray-700">{product.notAvailableFor}</p>
                </div>
              )}
            </div>
            {/* Options Section */}
            {product.options && product.options.length > 0 && (
              <div className="bg-white rounded-xl shadow p-6">
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
            {/* Itinerary/Map Section (placeholder) */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <h2 className="font-bold text-lg mb-2 flex items-center gap-2"><span>🗺️</span> Itinerary / Map</h2>
              <div className="text-gray-500">(Itinerary and map coming soon)</div>
            </div>
          </div>
        </div>
        {/* Sidebar: Sticky Booking Card */}
        <aside className="w-full md:w-80 flex-shrink-0">
          <div className="sticky top-8">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 flex flex-col gap-4">
              <div className="text-3xl font-bold text-blue-700">
                {typeof product.price === 'number' ? `${product.price.toFixed(2)} ${product.currency || ''}` : 'Contact for price'}
              </div>
              {/* Date/Participant Selector (placeholder) */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-sm">Select participants and date</label>
                <input type="date" className="border rounded px-3 py-2" />
                <select className="border rounded px-3 py-2">
                  <option>1 Adult</option>
                  <option>2 Adults</option>
                  <option>3 Adults</option>
                  <option>4 Adults</option>
                </select>
              </div>
              <button className="w-full bg-blue-600 text-white px-6 py-3 rounded font-semibold text-lg hover:bg-blue-700 transition">Check availability</button>
              {product.referencecode && (
                <div className="text-sm text-gray-500"><span className="font-semibold">Reference code:</span> {product.referencecode}</div>
              )}
            </div>
            {/* Related Products (placeholder) */}
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="font-bold text-lg mb-2">You might also like...</h2>
              <div className="text-gray-500">(Related products section coming soon)</div>
            </div>
          </div>
        </aside>
      </div>
      {/* Footer placeholder (add your own or use layout) */}
    </div>
  );
} 