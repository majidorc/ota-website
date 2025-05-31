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
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-5xl mx-auto py-10 px-4">
        {/* Title & Gallery */}
        <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
        <div className="flex flex-wrap gap-4 mb-6">
          {product.photos && product.photos.length > 0 ? (
            product.photos.map((src, idx) => (
              <div key={idx} className="relative w-64 h-40 rounded overflow-hidden border">
                <Image src={src} alt={product.title} fill className="object-cover" />
              </div>
            ))
          ) : (
            <div className="relative w-64 h-40 rounded overflow-hidden border">
              <Image src="/images/placeholder.jpg" alt="No image" fill className="object-cover" />
            </div>
          )}
        </div>
        {/* Price & Booking */}
        <div className="flex items-center gap-8 mb-6">
          <div className="text-2xl font-bold text-blue-700">
            {typeof product.price === 'number' ? `${product.price.toFixed(2)} ${product.currency || ''}` : 'Contact for price'}
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded font-semibold">Check availability</button>
        </div>
        {/* Short Description */}
        {product.shortdesc && <p className="mb-4 text-lg text-gray-700">{product.shortdesc}</p>}
        {/* Highlights */}
        {product.highlights && product.highlights.length > 0 && (
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-2">Highlights</h2>
            <ul className="list-disc list-inside text-gray-700">
              {product.highlights.map((h, i) => <li key={i}>{h}</li>)}
            </ul>
          </div>
        )}
        {/* Full Description */}
        {product.fulldesc && (
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-2">Full Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{product.fulldesc}</p>
          </div>
        )}
        {/* Includes & Excludes */}
        {(product.inclusions || product.exclusions) && (
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-2">Includes</h2>
            <pre className="bg-gray-50 p-4 rounded whitespace-pre-wrap mb-2">{product.inclusions}</pre>
            {product.exclusions && <><h3 className="font-semibold mb-1">Excludes</h3><pre className="bg-gray-50 p-4 rounded whitespace-pre-wrap">{product.exclusions}</pre></>}
          </div>
        )}
        {/* Not available for */}
        {product.notAvailableFor && (
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-2">Not available for</h2>
            <p className="text-gray-700">{product.notAvailableFor}</p>
          </div>
        )}
        {/* Meeting point */}
        {product.meetingpoint && (
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-2">Meeting point</h2>
            <p className="text-gray-700">{product.meetingpoint}</p>
          </div>
        )}
        {/* Important info */}
        {product.importantinfo && (
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-2">Important information</h2>
            <p className="text-gray-700">{product.importantinfo}</p>
          </div>
        )}
        {/* Options Section */}
        {product.options && product.options.length > 0 && (
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-2">Options</h2>
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
        {/* Placeholder for related products or recommendations */}
        <div className="mt-10">
          <h2 className="font-bold text-lg mb-4">You might also like...</h2>
          <div className="text-gray-500">(Related products section coming soon)</div>
        </div>
      </div>
    </div>
  );
} 