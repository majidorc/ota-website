"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Category = ["ADVENTURE", "CULTURAL", "NATURE", "URBAN", "RELAXATION"];
const Difficulty = ["EASY", "MODERATE", "CHALLENGING"];

export default function NewActivity() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      shortDescription: formData.get("shortDescription"),
      fullDescription: formData.get("fullDescription"),
      highlights: formData.get("highlights")?.toString().split(",").map(h => h.trim()),
      inclusions: formData.get("inclusions")?.toString().split(",").map(i => i.trim()),
      exclusions: formData.get("exclusions")?.toString().split(",").map(e => e.trim()),
      locations: formData.get("locations")?.toString().split(",").map(l => l.trim()),
      keywords: formData.get("keywords")?.toString().split(",").map(k => k.trim()),
      price: parseFloat(formData.get("price") as string),
      duration: parseInt(formData.get("duration") as string),
      maxGroupSize: parseInt(formData.get("maxGroupSize") as string),
      minAge: parseInt(formData.get("minAge") as string) || null,
      difficulty: formData.get("difficulty"),
      category: formData.get("category"),
    };

    try {
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create activity");
      }

      const activity = await response.json();
      router.push(`/admin/activities/${activity.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Add New Activity</h1>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            name="title"
            required
            className="w-full p-2 border rounded-lg"
            maxLength={60}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Short Description</label>
          <textarea
            name="shortDescription"
            required
            className="w-full p-2 border rounded-lg"
            maxLength={160}
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Full Description</label>
          <textarea
            name="fullDescription"
            required
            className="w-full p-2 border rounded-lg"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              name="category"
              required
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select category</option>
              {Category.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Difficulty</label>
            <select
              name="difficulty"
              required
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select difficulty</option>
              {Difficulty.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Price</label>
            <input
              type="number"
              name="price"
              required
              min="0"
              step="0.01"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Duration (hours)</label>
            <input
              type="number"
              name="duration"
              required
              min="1"
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Max Group Size</label>
            <input
              type="number"
              name="maxGroupSize"
              required
              min="1"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Minimum Age</label>
            <input
              type="number"
              name="minAge"
              min="0"
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Highlights (comma-separated)</label>
          <input
            type="text"
            name="highlights"
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Inclusions (comma-separated)</label>
          <input
            type="text"
            name="inclusions"
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Exclusions (comma-separated)</label>
          <input
            type="text"
            name="exclusions"
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Locations (comma-separated)</label>
          <input
            type="text"
            name="locations"
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Keywords (comma-separated)</label>
          <input
            type="text"
            name="keywords"
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Activity"}
          </button>
        </div>
      </form>
    </div>
  );
} 