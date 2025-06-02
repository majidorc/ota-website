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
  const [referencecode, setReferencecode] = useState<string>("");
  const [shortdesc, setShortdesc] = useState<string>("");
  const [fulldesc, setFulldesc] = useState<string>("");
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
  const [meetingpoint, setMeetingpoint] = useState<string>("");
  const [importantinfo, setImportantinfo] = useState<string>("");
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
      const formData = new FormData();
      formData.append('language', language);
      formData.append('category', category);
      formData.append('title', title);
      formData.append('referencecode', referencecode);
      formData.append('shortdesc', shortdesc);
      formData.append('fulldesc', fulldesc);
      formData.append('highlights', JSON.stringify(highlights));
      formData.append('locations', JSON.stringify(locations));
      formData.append('keywords', JSON.stringify(keywords));
      formData.append('inclusions', inclusionsText);
      formData.append('exclusions', exclusionsText);
      formData.append('options', JSON.stringify(options));
      formData.append('price', price);
      formData.append('currency', currency);
      formData.append('availability', availability);
      formData.append('meetingpoint', meetingpoint);
      formData.append('importantinfo', importantinfo);

      photos.forEach((photo, index) => {
        formData.append(`photo${index}`, photo);
      });

      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      router.push('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
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
              <span className="font-semibold">Automated Content Creator</span>
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
                        setShortdesc(data.shortDescription || data.shortdesc || "");
                        setFulldesc(data.fullDescription || data.fulldesc || "");
                        setHighlights(Array.isArray(data.highlights) ? data.highlights : (typeof data.highlights === 'string' ? data.highlights.split('\n') : []));
                        setInclusionsText(Array.isArray(data.inclusions) ? data.inclusions.join('\n') : (data.inclusions || ""));
                        setExclusionsText(Array.isArray(data.exclusions) ? data.exclusions.join('\n') : (data.exclusions || ""));
                        setLocations(Array.isArray(data.locations) ? data.locations : (typeof data.locations === 'string' ? data.locations.split('\n') : []));
                        setKeywords(Array.isArray(data.keywords) ? data.keywords : (typeof data.keywords === 'string' ? data.keywords.split(',').map((k: string) => k.trim()) : []));
                        setPrice(data.price ? String(data.price) : "");
                        setCurrency(data.currency || "THB");
                        setAvailability(data.availability || "");
                        setMeetingpoint(data.meetingpoint || data.meetingPoint || "");
                        setImportantinfo(data.importantinfo || data.importantInfo || "");
                        setOptions(Array.isArray(data.options) ? data.options : []);
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
        {step === 4 && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-blue-600 font-bold">4</span>
              <span className="font-semibold">Main Information</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Title</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter product title"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Reference Code</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={referencecode}
                  onChange={(e) => setReferencecode(e.target.value)}
                  placeholder="Enter reference code"
                />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold"
                onClick={() => setStep(3)}
              >Back</button>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded font-semibold"
                onClick={() => setStep(5)}
              >Continue</button>
            </div>
          </div>
        )}
        {/* Step 5: Descriptions & Highlights */}
        {step === 5 && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-blue-600 font-bold">5</span>
              <span className="font-semibold">Descriptions & Highlights</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Short Description</label>
                <textarea
                  className="w-full border rounded px-3 py-2"
                  value={shortdesc}
                  onChange={(e) => setShortdesc(e.target.value)}
                  placeholder="Enter short description"
                  rows={3}
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Full Description</label>
                <textarea
                  className="w-full border rounded px-3 py-2"
                  value={fulldesc}
                  onChange={(e) => setFulldesc(e.target.value)}
                  placeholder="Enter full description"
                  rows={6}
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Highlights</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className="flex-1 border rounded px-3 py-2"
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    placeholder="Enter highlight"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && highlightInput.trim()) {
                        setHighlights([...highlights, highlightInput.trim()]);
                        setHighlightInput('');
                      }
                    }}
                  />
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => {
                      if (highlightInput.trim()) {
                        setHighlights([...highlights, highlightInput.trim()]);
                        setHighlightInput('');
                      }
                    }}
                  >Add</button>
                </div>
                <div className="space-y-2">
                  {highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="flex-1">{highlight}</span>
                      <button
                        className="text-red-600"
                        onClick={() => setHighlights(highlights.filter((_, i) => i !== index))}
                      >Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold"
                onClick={() => setStep(4)}
              >Back</button>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded font-semibold"
                onClick={() => setStep(6)}
              >Continue</button>
            </div>
          </div>
        )}
        {/* Step 6: Locations */}
        {step === 6 && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-blue-600 font-bold">6</span>
              <span className="font-semibold">Locations</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Add Locations</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className="flex-1 border rounded px-3 py-2"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="Enter location"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && locationInput.trim()) {
                        setLocations([...locations, locationInput.trim()]);
                        setLocationInput('');
                      }
                    }}
                  />
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => {
                      if (locationInput.trim()) {
                        setLocations([...locations, locationInput.trim()]);
                        setLocationInput('');
                      }
                    }}
                  >Add</button>
                </div>
                <div className="space-y-2">
                  {locations.map((location, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="flex-1">{location}</span>
                      <button
                        className="text-red-600"
                        onClick={() => setLocations(locations.filter((_, i) => i !== index))}
                      >Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold"
                onClick={() => setStep(5)}
              >Back</button>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded font-semibold"
                onClick={() => setStep(7)}
              >Continue</button>
            </div>
          </div>
        )}
        {/* Step 7: Keywords */}
        {step === 7 && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-blue-600 font-bold">7</span>
              <span className="font-semibold">Keywords</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Add Keywords</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className="flex-1 border rounded px-3 py-2"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="Enter keyword"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && keywordInput.trim()) {
                        setKeywords([...keywords, keywordInput.trim()]);
                        setKeywordInput('');
                      }
                    }}
                  />
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => {
                      if (keywordInput.trim()) {
                        setKeywords([...keywords, keywordInput.trim()]);
                        setKeywordInput('');
                      }
                    }}
                  >Add</button>
                </div>
                <div className="space-y-2">
                  {keywords.map((keyword, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="flex-1">{keyword}</span>
                      <button
                        className="text-red-600"
                        onClick={() => setKeywords(keywords.filter((_, i) => i !== index))}
                      >Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold"
                onClick={() => setStep(6)}
              >Back</button>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded font-semibold"
                onClick={() => setStep(8)}
              >Continue</button>
            </div>
          </div>
        )}
        {/* Step 8: Inclusions & Exclusions */}
        {step === 8 && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-blue-600 font-bold">8</span>
              <span className="font-semibold">Inclusions & Exclusions</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Inclusions</label>
                <textarea
                  className="w-full border rounded px-3 py-2"
                  value={inclusionsText}
                  onChange={(e) => setInclusionsText(e.target.value)}
                  placeholder="Enter inclusions (one per line)"
                  rows={6}
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Exclusions</label>
                <textarea
                  className="w-full border rounded px-3 py-2"
                  value={exclusionsText}
                  onChange={(e) => setExclusionsText(e.target.value)}
                  placeholder="Enter exclusions (one per line)"
                  rows={6}
                />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold"
                onClick={() => setStep(7)}
              >Back</button>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded font-semibold"
                onClick={() => setStep(9)}
              >Continue</button>
            </div>
          </div>
        )}
        {/* Step 9: Photos */}
        {step === 9 && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-blue-600 font-bold">9</span>
              <span className="font-semibold">Photos</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Upload Photos</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      setPhotos(Array.from(e.target.files));
                    }
                  }}
                  className="w-full border rounded px-3 py-2"
                />
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                        onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold"
                onClick={() => setStep(8)}
              >Back</button>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded font-semibold"
                onClick={() => setStep(10)}
              >Continue</button>
            </div>
          </div>
        )}
        {/* Step 10: Options */}
        {step === 10 && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-blue-600 font-bold">10</span>
              <span className="font-semibold">Options</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Add Option</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className="flex-1 border rounded px-3 py-2"
                    value={optionName}
                    onChange={(e) => setOptionName(e.target.value)}
                    placeholder="Option name"
                  />
                  <input
                    type="text"
                    className="flex-1 border rounded px-3 py-2"
                    value={optionDesc}
                    onChange={(e) => setOptionDesc(e.target.value)}
                    placeholder="Option description"
                  />
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => {
                      if (optionName.trim() && optionDesc.trim()) {
                        setOptions([...options, { name: optionName.trim(), description: optionDesc.trim() }]);
                        setOptionName('');
                        setOptionDesc('');
                      }
                    }}
                  >Add</button>
                </div>
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-1">
                        <div className="font-semibold">{option.name}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                      </div>
                      <button
                        className="text-red-600"
                        onClick={() => setOptions(options.filter((_, i) => i !== index))}
                      >Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold"
                onClick={() => setStep(9)}
              >Back</button>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded font-semibold"
                onClick={() => setStep(11)}
              >Continue</button>
            </div>
          </div>
        )}
        {/* Step 11: Pricing */}
        {step === 11 && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-blue-600 font-bold">11</span>
              <span className="font-semibold">Pricing</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Price</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className="flex-1 border rounded px-3 py-2"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                  />
                  <select
                    className="border rounded px-3 py-2"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="THB">THB</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold"
                onClick={() => setStep(10)}
              >Back</button>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded font-semibold"
                onClick={() => setStep(12)}
              >Continue</button>
            </div>
          </div>
        )}
        {/* Step 12: Availability */}
        {step === 12 && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-blue-600 font-bold">12</span>
              <span className="font-semibold">Availability</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Availability Information</label>
                <textarea
                  className="w-full border rounded px-3 py-2"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  placeholder="Enter availability information"
                  rows={6}
                />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold"
                onClick={() => setStep(11)}
              >Back</button>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded font-semibold"
                onClick={() => setStep(13)}
              >Continue</button>
            </div>
          </div>
        )}
        {/* Step 13: Meeting Point */}
        {step === 13 && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-blue-600 font-bold">13</span>
              <span className="font-semibold">Meeting Point</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Meeting Point Information</label>
                <textarea
                  className="w-full border rounded px-3 py-2"
                  value={meetingpoint}
                  onChange={(e) => setMeetingpoint(e.target.value)}
                  placeholder="Enter meeting point information"
                  rows={6}
                />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold"
                onClick={() => setStep(12)}
              >Back</button>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded font-semibold"
                onClick={() => setStep(14)}
              >Continue</button>
            </div>
          </div>
        )}
        {/* Step 14: Important Info */}
        {step === 14 && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-blue-600 font-bold">14</span>
              <span className="font-semibold">Important Info</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Important Information</label>
                <textarea
                  className="w-full border rounded px-3 py-2"
                  value={importantinfo}
                  onChange={(e) => setImportantinfo(e.target.value)}
                  placeholder="Enter important information"
                  rows={6}
                />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold"
                onClick={() => setStep(13)}
              >Back</button>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded font-semibold"
                onClick={() => setStep(15)}
              >Continue</button>
            </div>
          </div>
        )}
        {/* Step 15: Review & Submit */}
        {step === 15 && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-blue-600 font-bold">15</span>
              <span className="font-semibold">Review & Submit</span>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Basic Information</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <p><strong>Language:</strong> {language}</p>
                  <p><strong>Category:</strong> {category}</p>
                  <p><strong>Title:</strong> {title}</p>
                  <p><strong>Reference Code:</strong> {referencecode}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Descriptions</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <p><strong>Short Description:</strong> {shortdesc}</p>
                  <p><strong>Full Description:</strong> {fulldesc}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Highlights</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <ul className="list-disc list-inside">
                    {highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Locations</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <ul className="list-disc list-inside">
                    {locations.map((location, index) => (
                      <li key={index}>{location}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Keywords</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{keyword}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Inclusions & Exclusions</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <p><strong>Inclusions:</strong></p>
                  <pre className="whitespace-pre-wrap">{inclusionsText}</pre>
                  <p><strong>Exclusions:</strong></p>
                  <pre className="whitespace-pre-wrap">{exclusionsText}</pre>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Photos</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <div className="grid grid-cols-3 gap-4">
                    {photos.map((photo, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(photo)}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Options</h3>
                <div className="bg-gray-50 p-4 rounded">
                  {options.map((option, index) => (
                    <div key={index} className="mb-2">
                      <p><strong>{option.name}</strong></p>
                      <p>{option.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Pricing</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <p><strong>Price:</strong> {price} {currency}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Additional Information</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <p><strong>Availability:</strong></p>
                  <pre className="whitespace-pre-wrap">{availability}</pre>
                  <p><strong>Meeting Point:</strong></p>
                  <pre className="whitespace-pre-wrap">{meetingpoint}</pre>
                  <p><strong>Important Info:</strong></p>
                  <pre className="whitespace-pre-wrap">{importantinfo}</pre>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold"
                onClick={() => setStep(14)}
              >Back</button>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded font-semibold"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
            {error && (
              <div className="mt-4 bg-red-100 border-l-4 border-red-400 p-4 text-red-700">
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 