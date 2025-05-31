"use client";
import React, { useState, useEffect } from "react";
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

export default function EditProductForm({ productId }: { productId: string }) {
  const [step, setStep] = useState<number>(1);
  const [language, setLanguage] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [referencecode, setReferencecode] = useState<string>("");
  const [shortDesc, setShortDesc] = useState<string>("");
  const [fullDesc, setFullDesc] = useState<string>("");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [inclusionsText, setInclusionsText] = useState<string>("");
  const [exclusionsText, setExclusionsText] = useState<string>("");
  const [options, setOptions] = useState<{ name: string; description: string }[]>([]);
  const [price, setPrice] = useState<string>("");
  const [currency, setCurrency] = useState<string>("THB");
  const [availability, setAvailability] = useState<string>("");
  const [meetingPoint, setMeetingPoint] = useState<string>("");
  const [importantInfo, setImportantInfo] = useState<string>("");
  const [photos, setPhotos] = useState<string[]>([]); // URLs only for edit
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optionName, setOptionName] = useState("");
  const [optionDesc, setOptionDesc] = useState("");
  const router = useRouter();

  const steps = [
    { label: "Product Language" },
    { label: "Product Category" },
    { label: "Main Information" },
    { label: "Descriptions & Highlights" },
    { label: "Locations" },
    { label: "Keywords" },
    { label: "Inclusions & Exclusions" },
    { label: "Photos" },
    { label: "Options" },
    { label: "Pricing" },
    { label: "Availability" },
    { label: "Meeting Point" },
    { label: "Important Info" },
    { label: "Review & Save" },
  ];

  useEffect(() => {
    fetch(`/api/products/${productId}`)
      .then(res => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then(data => {
        setLanguage(data.language || "");
        setCategory(data.category || "");
        setTitle(data.title || "");
        setReferencecode(data.referencecode || "");
        setShortDesc(data.shortDesc || "");
        setFullDesc(data.fullDesc || "");
        setHighlights(Array.isArray(data.highlights) ? data.highlights : []);
        setLocations(Array.isArray(data.locations) ? data.locations : []);
        setKeywords(Array.isArray(data.keywords) ? data.keywords : []);
        setInclusionsText(data.inclusions || "");
        setExclusionsText(data.exclusions || "");
        setOptions(Array.isArray(data.options) ? data.options : []);
        setPrice(data.price ? String(data.price) : "");
        setCurrency(data.currency || "THB");
        setAvailability(data.availability || "");
        setMeetingPoint(data.meetingPoint || "");
        setImportantInfo(data.importantInfo || "");
        setPhotos(Array.isArray(data.photos) ? data.photos : []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [productId]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language, category, title, referencecode, shortDesc, fullDesc,
          highlights, locations, keywords, inclusions: inclusionsText, exclusions: exclusionsText,
          options, price: parseFloat(price), currency, availability, meetingPoint, importantInfo, photos
        }),
      });
      if (!res.ok) throw new Error("Failed to update product");
      router.push(`/admin/products/${productId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto bg-white rounded shadow min-h-[700px] relative">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-50 border-r rounded-l flex-shrink-0">
        <nav className="flex flex-col gap-2 p-6 sticky top-0">
          {steps.map((s, idx) => (
            <button
              key={s.label}
              className={`text-left px-4 py-2 rounded font-semibold transition-colors ${step === idx + 1 ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50'}`}
              onClick={() => setStep(idx + 1)}
            >
              {idx + 1}. {s.label}
            </button>
          ))}
        </nav>
      </aside>
      {/* Main Form Area */}
      <main className="flex-1 p-8">
        {/* Step 1: Language */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Product Language</h2>
            <select
              className="border rounded px-3 py-2 w-full"
              value={language}
              onChange={e => setLanguage(e.target.value)}
            >
              <option value="">Select language</option>
              {languages.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        )}
        {/* Step 2: Category */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Product Category</h2>
            <select
              className="border rounded px-3 py-2 w-full"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
            </select>
          </div>
        )}
        {/* Step 3: Main Information */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Main Information</h2>
            <label className="block font-semibold mb-2">Title</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mb-4"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={60}
              required
            />
            <label className="block font-semibold mb-2">Reference Code</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={referencecode}
              onChange={e => setReferencecode(e.target.value)}
              maxLength={20}
            />
          </div>
        )}
        {/* Step 4: Descriptions & Highlights */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Descriptions & Highlights</h2>
            <label className="block font-semibold mb-2">Short Description</label>
            <textarea
              className="w-full border rounded px-3 py-2 mb-4"
              value={shortDesc}
              onChange={e => setShortDesc(e.target.value)}
              rows={3}
            />
            <label className="block font-semibold mb-2">Full Description</label>
            <textarea
              className="w-full border rounded px-3 py-2 mb-4"
              value={fullDesc}
              onChange={e => setFullDesc(e.target.value)}
              rows={6}
            />
            <label className="block font-semibold mb-2">Highlights</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mb-2"
              placeholder="Add highlight and press Enter"
              onKeyDown={e => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  setHighlights([...highlights, e.currentTarget.value.trim()]);
                  e.currentTarget.value = '';
                }
              }}
            />
            <div className="flex flex-wrap gap-2 mb-2">
              {highlights.map((h, i) => (
                <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center">
                  {h}
                  <button className="ml-1 text-xs" onClick={() => setHighlights(highlights.filter((_, idx) => idx !== i))}>×</button>
                </span>
              ))}
            </div>
          </div>
        )}
        {/* Step 5: Locations */}
        {step === 5 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Locations</h2>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mb-2"
              placeholder="Add location and press Enter"
              onKeyDown={e => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  setLocations([...locations, e.currentTarget.value.trim()]);
                  e.currentTarget.value = '';
                }
              }}
            />
            <div className="flex flex-wrap gap-2 mb-2">
              {locations.map((l, i) => (
                <span key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded flex items-center">
                  {l}
                  <button className="ml-1 text-xs" onClick={() => setLocations(locations.filter((_, idx) => idx !== i))}>×</button>
                </span>
              ))}
            </div>
          </div>
        )}
        {/* Step 6: Keywords */}
        {step === 6 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Keywords</h2>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mb-2"
              placeholder="Add keyword and press Enter"
              onKeyDown={e => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  setKeywords([...keywords, e.currentTarget.value.trim()]);
                  e.currentTarget.value = '';
                }
              }}
            />
            <div className="flex flex-wrap gap-2 mb-2">
              {keywords.map((k, i) => (
                <span key={i} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded flex items-center">
                  {k}
                  <button className="ml-1 text-xs" onClick={() => setKeywords(keywords.filter((_, idx) => idx !== i))}>×</button>
                </span>
              ))}
            </div>
          </div>
        )}
        {/* Step 7: Inclusions & Exclusions */}
        {step === 7 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Inclusions & Exclusions</h2>
            <label className="block font-semibold mb-2">Inclusions</label>
            <textarea
              className="w-full border rounded px-3 py-2 mb-4"
              value={inclusionsText}
              onChange={e => setInclusionsText(e.target.value)}
              rows={4}
            />
            <label className="block font-semibold mb-2">Exclusions</label>
            <textarea
              className="w-full border rounded px-3 py-2 mb-4"
              value={exclusionsText}
              onChange={e => setExclusionsText(e.target.value)}
              rows={4}
            />
          </div>
        )}
        {/* Step 8: Photos (view only for edit) */}
        {step === 8 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Photos</h2>
            <div className="grid grid-cols-3 gap-4">
              {photos.map((url, idx) => (
                <img key={idx} src={url} alt={`Photo ${idx + 1}`} className="w-full h-32 object-cover rounded" />
              ))}
            </div>
            <div className="text-gray-500 mt-2">(Photo editing coming soon)</div>
          </div>
        )}
        {/* Step 9: Options */}
        {step === 9 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Options</h2>
            <div className="space-y-2 mb-4">
              {options.map((option, idx) => (
                <div key={idx} className="border rounded p-4 bg-gray-50 flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{option.name}</div>
                    <div className="text-gray-700 text-sm">{option.description}</div>
                  </div>
                  <button className="text-red-600 ml-4" onClick={() => setOptions(options.filter((_, i) => i !== idx))}>Remove</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="flex-1 border rounded px-3 py-2"
                placeholder="Option name"
                value={optionName}
                onChange={e => setOptionName(e.target.value)}
              />
              <input
                type="text"
                className="flex-1 border rounded px-3 py-2"
                placeholder="Option description"
                value={optionDesc}
                onChange={e => setOptionDesc(e.target.value)}
              />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  const name = optionName.trim();
                  const desc = optionDesc.trim();
                  if (name && desc) {
                    setOptions([...options, { name, description: desc }]);
                    setOptionName("");
                    setOptionDesc("");
                  }
                }}
              >Add</button>
            </div>
          </div>
        )}
        {/* Step 10: Pricing */}
        {step === 10 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Pricing</h2>
            <div className="flex gap-2 mb-2">
              <input
                type="number"
                className="flex-1 border rounded px-3 py-2"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="Enter price"
                min="0"
                step="0.01"
              />
              <select
                className="border rounded px-3 py-2"
                value={currency}
                onChange={e => setCurrency(e.target.value)}
              >
                <option value="THB">THB</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>
        )}
        {/* Step 11: Availability */}
        {step === 11 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Availability</h2>
            <textarea
              className="w-full border rounded px-3 py-2 mb-4"
              value={availability}
              onChange={e => setAvailability(e.target.value)}
              rows={4}
            />
          </div>
        )}
        {/* Step 12: Meeting Point */}
        {step === 12 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Meeting Point</h2>
            <textarea
              className="w-full border rounded px-3 py-2 mb-4"
              value={meetingPoint}
              onChange={e => setMeetingPoint(e.target.value)}
              rows={2}
            />
          </div>
        )}
        {/* Step 13: Important Info */}
        {step === 13 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Important Info</h2>
            <textarea
              className="w-full border rounded px-3 py-2 mb-4"
              value={importantInfo}
              onChange={e => setImportantInfo(e.target.value)}
              rows={4}
            />
          </div>
        )}
        {/* Step 14: Review & Save */}
        {step === 14 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Review & Save</h2>
            <div className="space-y-2">
              <div><strong>Language:</strong> {language}</div>
              <div><strong>Category:</strong> {category}</div>
              <div><strong>Title:</strong> {title}</div>
              <div><strong>Reference Code:</strong> {referencecode}</div>
              <div><strong>Short Desc:</strong> {shortDesc}</div>
              <div><strong>Full Desc:</strong> {fullDesc}</div>
              <div><strong>Highlights:</strong> {highlights.join(', ')}</div>
              <div><strong>Locations:</strong> {locations.join(', ')}</div>
              <div><strong>Keywords:</strong> {keywords.join(', ')}</div>
              <div><strong>Inclusions:</strong> {inclusionsText}</div>
              <div><strong>Exclusions:</strong> {exclusionsText}</div>
              <div><strong>Options:</strong> {options.map(o => o.name).join(', ')}</div>
              <div><strong>Price:</strong> {price} {currency}</div>
              <div><strong>Availability:</strong> {availability}</div>
              <div><strong>Meeting Point:</strong> {meetingPoint}</div>
              <div><strong>Important Info:</strong> {importantInfo}</div>
            </div>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded font-semibold mt-6"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            {error && <div className="text-red-600 mt-4">{error}</div>}
          </div>
        )}
        {/* Step navigation */}
        <div className="flex gap-4 mt-8">
          <button
            className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
          >Back</button>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded font-semibold"
            onClick={() => setStep(Math.min(steps.length, step + 1))}
            disabled={step === steps.length}
          >Next</button>
        </div>
      </main>
    </div>
  );
} 