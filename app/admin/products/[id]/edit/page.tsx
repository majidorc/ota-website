"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProduct({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then(data => {
        setTitle(data.title || "");
        setReferenceCode(data.referenceCode || "");
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/products/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          referenceCode: referenceCode.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to update product");
      router.push(`/admin/products/${params.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      <form onSubmit={handleSubmit} className="w-full max-w-xl bg-white rounded shadow p-8">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
        <div className="mb-6">
          <label className="block font-semibold mb-2">What is the customer-facing title of your product?</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={60}
            required
          />
          <div className="text-right text-sm text-gray-500 mt-1">{title.length} / 60</div>
        </div>
        <div className="mb-6">
          <label className="block font-bold mb-1 text-lg">Create a product reference code <span className="font-normal text-gray-500 text-base">(optional)</span></label>
          <p className="text-gray-500 text-sm mb-2">To help you keep track of your products on GetYourGuide, you can add your internal code. If you do not add one, we will assign one automatically.</p>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={referenceCode}
            onChange={e => setReferenceCode(e.target.value)}
            maxLength={20}
            placeholder=""
          />
          <div className="text-right text-sm text-gray-500 mt-1">{referenceCode.length} / 20</div>
        </div>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded font-semibold mt-4"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
} 