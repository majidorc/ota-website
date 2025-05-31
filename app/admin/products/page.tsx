"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  referencecode?: string;
  shortdesc?: string;
  photos?: string[];
  status?: string;
  price?: number;
  currency?: string;
}

const statusColors: Record<string, string> = {
  Bookable: "bg-green-100 text-green-800",
  Deactivated: "bg-gray-100 text-gray-800",
  "Not yet submitted": "bg-yellow-100 text-yellow-800",
};

export default function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load products");
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.title?.toLowerCase().includes(search.toLowerCase()) ||
      product.referencecode?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? product.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      <div className="w-full max-w-6xl bg-white rounded shadow p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold">Products</h1>
          <Link href="/admin/products/new" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700">+ Create new product</Link>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search"
            className="border rounded px-3 py-2 w-full md:w-64"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="border rounded px-3 py-2 w-full md:w-48"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">Select Status</option>
            <option value="Bookable">Bookable</option>
            <option value="Deactivated">Deactivated</option>
            <option value="Not yet submitted">Not yet submitted</option>
          </select>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div>No products found.</div>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Product</th>
                <th className="p-3">Reference code</th>
                <th className="p-3">Status</th>
                <th className="p-3">Price</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="flex items-center gap-4 py-4">
                    <img
                      src={product.photos && product.photos.length > 0 ? product.photos[0] : "/images/placeholder.jpg"}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <div className="font-semibold">{product.title}</div>
                      <div className="text-xs text-gray-500">{product.shortdesc}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.referencecode}</td>
                  <td>
                    <span className={`${statusColors[product.status || "Bookable"]} px-2 py-1 rounded text-xs font-medium`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.price ? `${product.price} ${product.currency || ""}` : "-"}
                  </td>
                  <td>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}