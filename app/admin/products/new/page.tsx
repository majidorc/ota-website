"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const languages = ["English", "French", "German", "Spanish", "Italian", "Thai"];
const categories = [
  { label: "Attraction ticket", description: "Like entry to a landmark, theme park, show" },
  { label: "Tour", description: "Guided walking tours of a city or attraction, day trips, multi-day trips, city cruises, etc" },
  { label: "City card", description: "A pass for multiple attractions or transport within a city" },
  { label: "Hop-on hop-off ticket", description: "Entry to a hop-on hop-off bus or boat" },
  { label: "Transfer", description: "Transportation services like airport or bus transfers" },
  { label: "Rental", description: "Experience rentals like costumes, adventure equipment, unique vehicle drives" },
  { label: "Other", description: "Like a cooking class or multiple activities sold together" },
];

export default function NewProduct() {
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState("");
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          image,
          language,
          category,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create product");
        setLoading(false);
        return;
      }
      router.push("/admin/products");
    } catch (err) {
      setError("Failed to create product");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      <div className="w-full max-w-3xl bg-white rounded shadow p-8">
        <h1 className="text-2xl font-bold mb-6">Create a new product</h1>
        {/* Progress bar */}
        <div className="flex items-center mb-8">
          <div className={`flex-1 h-1 rounded ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex-1 h-1 rounded mx-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex-1 h-1 rounded ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
        </div>
        {/* Step 1: Language */}
        {step === 1 && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-blue-600 font-bold">1</span>
              <span className="font-semibold">Product Language</span>
            </div>
            <p className="mb-2 text-gray-700">What language will you use to write your activity?</p>
            <p className="mb-4 text-gray-500 text-sm">You can now write your activity in multiple languages. We'll take care of all the translations.</p>
            <select
              className="w-full border rounded px-3 py-2 mb-4"
              value={language}
              onChange={e => setLanguage(e.target.value)}
            >
              <option value="">Select a language</option>
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-blue-700 text-sm mb-4">
              <b>Product language and categories cannot be changed</b><br />
              This is because we customize the product creation process according to your initial selection. If you've selected the wrong language or category, please delete this one and create a new product.
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded font-semibold disabled:opacity-50"
                disabled={!language}
                onClick={() => setStep(2)}
              >Continue</button>
            </div>
          </div>
        )}
        {/* Step 2: Category */}
        {step === 2 && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-blue-600 font-bold">2</span>
              <span className="font-semibold">Product Category</span>
            </div>
            <p className="mb-2 text-gray-700">Which best describes your activity?</p>
            <p className="mb-4 text-gray-500 text-sm">This helps us categorize your product so customers can find it. Choose carefully as this is the only section that can't be changed later.</p>
            <div className="space-y-2 mb-4">
              {categories.map(cat => (
                <label key={cat.label} className={`block border rounded p-4 cursor-pointer ${category === cat.label ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                  <input
                    type="radio"
                    name="category"
                    value={cat.label}
                    checked={category === cat.label}
                    onChange={() => setCategory(cat.label)}
                    className="mr-2"
                  />
                  <span className="font-semibold">{cat.label}</span>
                  <span className="block text-gray-500 text-sm mt-1">{cat.description}</span>
                </label>
              ))}
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-blue-700 text-sm mb-4">
              <b>Product language and categories cannot be changed</b><br />
              This is because we customize the product creation process according to your initial selection. If you've selected the wrong language or category, please delete this one and create a new product.
            </div>
            <div className="flex justify-between">
              <button
                className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold"
                onClick={() => setStep(1)}
              >Back</button>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded font-semibold disabled:opacity-50"
                disabled={!category}
                onClick={() => setStep(3)}
              >Continue</button>
            </div>
          </div>
        )}
        {/* Step 3: Product Details and Submit */}
        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-blue-600 font-bold">3</span>
              <span className="font-semibold">Product Details</span>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Product Name</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Description</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Price (USD)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full border rounded px-3 py-2"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Image URL</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={image}
                onChange={e => setImage(e.target.value)}
              />
            </div>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            <div className="flex justify-between">
              <button
                type="button"
                className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold"
                onClick={() => setStep(2)}
                disabled={loading}
              >Back</button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded font-semibold disabled:opacity-50"
                disabled={loading || !name || !description || !price}
              >{loading ? "Submitting..." : "Add Product"}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 