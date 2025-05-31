"use client";
import React, { useState, useEffect, ChangeEvent, KeyboardEvent, MouseEvent } from "react";
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

export default function NewProductForm() {
  const [step, setStep] = useState<number>(1);
  const [language, setLanguage] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [contentMode, setContentMode] = useState<string>("copy");
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [referenceCode, setReferenceCode] = useState<string>("");
  const [shortDesc, setShortDesc] = useState<string>("");
  const [fullDesc, setFullDesc] = useState<string>("");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [highlightInput, setHighlightInput] = useState<string>("");
  const [locations, setLocations] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState<string>("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState<string>("");
  const [inclusionsText, setInclusionsText] = useState<string>("");
  const [exclusionsText, setExclusionsText] = useState<string>("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [options, setOptions] = useState<{ name: string; description: string }[]>([]);
  const [optionName, setOptionName] = useState("");
  const [optionDesc, setOptionDesc] = useState("");
  const [price, setPrice] = useState<string>("");
  const [currency, setCurrency] = useState<string>("THB");
  const [availability, setAvailability] = useState<string>("");
  const [meetingPoint, setMeetingPoint] = useState<string>("");
  const [importantInfo, setImportantInfo] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingChatGPT, setLoadingChatGPT] = useState(false);
  const [chatGPTError, setChatGPTError] = useState<string | null>(null);
  const router = useRouter();

  const steps = [
    { label: "Product Language" },
    { label: "Product Category" },
    { label: "Automated Content Creator" },
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
    { label: "Review & Submit" },
  ];

  // Keyboard navigation for steps
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (step < steps.length) setStep(step + 1);
      } else if (e.key === 'ArrowLeft') {
        if (step > 1) setStep(step - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, steps.length]);

  // Submit handler for step 15
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        language,
        category,
        title,
        referenceCode,
        shortDesc,
        fullDesc,
        highlights,
        locations,
        keywords,
        inclusions: inclusionsText,
        exclusions: exclusionsText,
        options,
        price: parseFloat(price),
        currency,
        availability,
        meetingPoint,
        importantInfo,
      };
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let data;
        try { data = await res.json(); } catch { data = {}; }
        setError(data.error || `Failed to create product (status ${res.status})`);
        setLoading(false);
        return;
      }
      router.push("/admin/products");
    } catch (err: any) {
      setError("Failed to create product: " + (err?.message || err));
      setLoading(false);
    }
  };

  // Sidebar navigation handler
  const handleSidebarClick = (idx: number) => {
    if (idx + 1 < step) setStep(idx + 1);
  };

  // Hotkey hints
  const HotkeyHint = () => (
    <div className="text-xs text-gray-500 mt-2">
      <span className="bg-gray-100 px-2 py-1 rounded mr-2">←</span> Previous step
      <span className="bg-gray-100 px-2 py-1 rounded mx-2">→</span> Next step
      <span className="bg-gray-100 px-2 py-1 rounded ml-2">Enter</span> Continue
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto bg-white rounded shadow min-h-[700px]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r bg-gray-50 p-4 md:p-6 sticky top-0 h-auto md:h-full">
        <nav id="sidebar-steps" className={`md:block transition-all duration-200`}>
          <ul className="space-y-2">
            {steps.map((s, idx) => (
              <li key={s.label}>
                <button
                  className={`w-full text-left px-4 py-2 rounded font-medium transition-colors
                    ${step === idx + 1 ? 'bg-blue-600 text-white' : idx + 1 < step ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-400 cursor-not-allowed'}`}
                  disabled={idx + 1 > step}
                  onClick={() => handleSidebarClick(idx)}
                >
                  <span className="mr-2 font-bold">{idx + 1}.</span> {s.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {/* Form Content */}
      <div className="flex-1 p-8">
        <h1 className="text-xl font-bold mb-6">Create a new product</h1>
        {/* Progress bar */}
        <div className="flex items-center mb-8">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`flex-1 h-1 rounded ${step > idx ? 'bg-blue-600' : 'bg-gray-200'} ${idx !== 0 ? 'mx-1' : ''}`}
            ></div>
          ))}
        </div>
        {/* Add hotkey hints */}
        <HotkeyHint />
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
        {/* Step 3: Automated content creator */}
        {step === 3 && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-blue-600 font-bold">3</span>
              <span className="font-semibold">Automated content creator</span>
            </div>
            <div className="mb-4">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-blue-700 text-sm mb-4">
                <b>How it works</b>
                <ol className="list-decimal ml-6 mt-2 text-gray-700">
                  <li>Provide your content, then we'll fill out most of the sections for you</li>
                  <li>Check for accuracy and make changes if necessary</li>
                  <li>You'll still need to upload photos and create the booking options yourself</li>
                </ol>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-blue-700 text-sm mb-4">
                Products using the automated creator are likely to get more bookings, plus it saves you time.
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-2">Get started</label>
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="contentMode"
                      value="copy"
                      checked={contentMode === "copy"}
                      onChange={() => setContentMode("copy")}
                      className="mr-2"
                    />
                    Copy and paste your content <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded">Recommended</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="contentMode"
                      value="manual"
                      checked={contentMode === "manual"}
                      onChange={() => setContentMode("manual")}
                      className="mr-2"
                    />
                    Skip and create product manually
                  </label>
                </div>
                {contentMode === "copy" && (
                  <div className="mb-4">
                    <label className="block mb-2 font-semibold">Get started by copy-pasting a detailed description about your activity here.</label>
                    <textarea
                      className="w-full border rounded px-3 py-2 min-h-[120px]"
                      value={content}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                      placeholder="Write at least 700 characters."
                      maxLength={5000}
                    />
                    <div className="text-right text-xs text-gray-500">{content.length} / 5000</div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <button
                className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold"
                onClick={() => setStep(2)}
              >Back</button>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded font-semibold"
                onClick={async () => {
                  setChatGPTError(null);
                  if (contentMode === "copy" && content.trim()) {
                    setLoadingChatGPT(true);
                    try {
                      const res = await fetch("/api/chatgpt-content-extract", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ content }),
                      });

                      const data = await res.json();
                      if (data.error) {
                        setChatGPTError("ChatGPT API error: " + data.error + (data.raw ? `\nRaw: ${JSON.stringify(data.raw)}` : ""));
                      } else {
                        setTitle(data.title || "");
                        setShortDesc(data.shortDescription || "");
                        setFullDesc(data.fullDescription || "");
                        setHighlights(Array.isArray(data.highlights) ? data.highlights : (typeof data.highlights === 'string' ? data.highlights.split('\n') : []));
                        setInclusionsText(Array.isArray(data.inclusions) ? data.inclusions.join('\n') : (data.inclusions || ""));
                        setExclusionsText(Array.isArray(data.exclusions) ? data.exclusions.join('\n') : (data.exclusions || ""));
                        setLocations(Array.isArray(data.locations) ? data.locations : (typeof data.locations === 'string' ? data.locations.split('\n') : []));
                        setKeywords(Array.isArray(data.keywords) ? data.keywords : (typeof data.keywords === 'string' ? data.keywords.split(',').map((k: string) => k.trim()) : []));
                        setLoadingChatGPT(false);
                        setStep(4);
                      }
                    } catch (err: any) {
                      setChatGPTError("Failed to connect to ChatGPT API: " + (err?.message || err));
                    } finally {
                      setLoadingChatGPT(false);
                    }
                  } else {
                    setStep(4);
                  }
                }}
                disabled={loadingChatGPT || (contentMode === "copy" && !content.trim())}
              >Continue</button>
            </div>
            {chatGPTError && (
              <div className="bg-red-100 border-l-4 border-red-400 p-4 text-red-700 text-sm mb-4">{chatGPTError}</div>
            )}
            {loadingChatGPT && (
              <div className="bg-blue-100 border-l-4 border-blue-400 p-4 text-blue-700 text-sm mb-4">
                Generating suggestions from ChatGPT...
              </div>
            )}
          </div>
        )}
        {/* Step 4: Main Information */}
        {/* ... (rest of steps unchanged) ... */}
      </div>
    </div>
  );
} 