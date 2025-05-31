"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  title: string;
  referenceCode?: string;
  shortDesc?: string;
  longDesc?: string;
  photos?: string[];
  status?: string;
  price?: number;
  currency?: string;
  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<string, string> = {
  Bookable: "bg-green-100 text-green-800",
  Deactivated: "bg-gray-100 text-gray-800",
  "Not yet submitted": "bg-yellow-100 text-yellow-800",
};

export default function ProductDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!product) return <div className="p-8">Product not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">{product.title}</h1>
              <div className="space-x-3">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
                >
                  Edit Product
                </Link>
                <Link
                  href="/admin/products"
                  className="bg-gray-600 text-white px-4 py-2 rounded font-semibold hover:bg-gray-700"
                >
                  Back to Products
                </Link>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[product.status || "Not yet submitted"] || "bg-gray-100 text-gray-800"}`}>
                {product.status || "Not yet submitted"}
              </span>
              <span className="text-gray-500">Reference: {product.referenceCode || "N/A"}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Images */}
              <div>
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {product.photos && product.photos.length > 0 ? (
                    <img
                      src={product.photos[0]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image available
                    </div>
                  )}
                </div>
                {product.photos && product.photos.length > 1 && (
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {product.photos.slice(1).map((photo, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded overflow-hidden">
                        <img
                          src={photo}
                          alt={`${product.title} - ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column - Details */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Short Description</h2>
                  <p className="text-gray-600">{product.shortDesc || "No short description available"}</p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2">Long Description</h2>
                  <p className="text-gray-600 whitespace-pre-wrap">{product.longDesc || "No long description available"}</p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2">Price</h2>
                  <p className="text-gray-600">
                    {typeof product.price === 'number' && !isNaN(product.price)
                      ? `${product.price.toFixed(2)} ${product.currency || ''}`
                      : "Price not set"}
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2">Timestamps</h2>
                  <div className="text-sm text-gray-500">
                    <p>Created: {new Date(product.createdAt).toLocaleString()}</p>
                    <p>Last Updated: {new Date(product.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 