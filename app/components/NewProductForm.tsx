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

export default function NewProductForm({ onClose }: { onClose?: () => void }) {
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
  const [highlightError, setHighlightError] = useState<string>("");
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

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('language', language);
      formData.append('category', category);
      formData.append('title', title);
      formData.append('referenceCode', referenceCode);
      formData.append('shortDesc', shortDesc);
      formData.append('fullDesc', fullDesc);
      formData.append('highlights', JSON.stringify(highlights));
      formData.append('locations', JSON.stringify(locations));
      formData.append('keywords', JSON.stringify(keywords));
      formData.append('inclusions', inclusionsText);
      formData.append('exclusions', exclusionsText);
      formData.append('options', JSON.stringify(options));
      formData.append('price', price);
      formData.append('currency', currency);
      formData.append('availability', availability);
      formData.append('meetingPoint', meetingPoint);
      formData.append('importantInfo', importantInfo);
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
      if (onClose) {
        onClose();
      } else {
        router.push('/admin/products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSidebarClick = (idx: number) => {
    if (idx + 1 < step) setStep(idx + 1);
  };

  const HotkeyHint = () => (
    <div className="text-xs text-gray-500 mt-2">
      <span className="bg-gray-100 px-2 py-1 rounded mr-2">←</span> Previous step
      <span className="bg-gray-100 px-2 py-1 rounded mx-2">→</span> Next step
      <span className="bg-gray-100 px-2 py-1 rounded ml-2">Enter</span> Continue
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto bg-white rounded shadow min-h-[700px] relative">
      {onClose && (
        <button
          className="absolute top-4 right-4 z-10 bg-gray-200 hover:bg-gray-300 rounded-full p-2"
          onClick={onClose}
          aria-label="Close"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      {/* Sidebar */}
      {/* ... rest of the component remains unchanged ... */}
      {step === 5 && (
        <div>
          {/* ...existing Descriptions UI... */}
          <label className="block font-semibold mb-2">Highlights</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="flex-1 border rounded px-3 py-2"
              value={highlightInput}
              onChange={(e) => {
                setHighlightInput(e.target.value);
                if (e.target.value.length >= 50) setHighlightError("");
              }}
              placeholder="Enter highlight (at least 50 characters)"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && highlightInput.trim()) {
                  if (highlightInput.trim().length < 50) {
                    setHighlightError("Each highlight must be at least 50 characters.");
                    return;
                  }
                  setHighlights([...highlights, highlightInput.trim()]);
                  setHighlightInput('');
                  setHighlightError("");
                }
              }}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => {
                if (highlightInput.trim().length < 50) {
                  setHighlightError("Each highlight must be at least 50 characters.");
                  return;
                }
                setHighlights([...highlights, highlightInput.trim()]);
                setHighlightInput('');
                setHighlightError("");
              }}
            >Add</button>
          </div>
          {highlightError && <div className="text-red-600 text-sm mb-2">{highlightError}</div>}
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
          {/* Prevent continue if any highlight is too short */}
          <div className="flex justify-between mt-6">
            <button
              className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold"
              onClick={() => setStep(4)}
            >Back</button>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded font-semibold"
              onClick={() => setStep(6)}
              disabled={highlights.some(h => h.length < 50)}
              title={highlights.some(h => h.length < 50) ? 'All highlights must be at least 50 characters.' : ''}
            >Continue</button>
          </div>
        </div>
      )}
    </div>
  );
} 