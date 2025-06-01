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
  const [showOptionForm, setShowOptionForm] = useState(false);
  const [optionSubStep, setOptionSubStep] = useState<null | { index: number | null, data: any }>(null);
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
      {/* Step 10: Options */}
      {step === 10 && (
        <div className="max-w-xl mx-auto flex flex-col items-center text-center">
          {!optionSubStep ? (
            <>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 justify-center">
                Add option(s) to your product
                <span title="Options allow you to customize your activity and attract more customers.">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="white"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4m0-4h.01" /></svg>
                </span>
              </h2>
              <p className="mb-4 text-gray-700">Options allow you to customize your activity and attract more customers. For example, your options can have different:</p>
              <ul className="text-left mb-4 text-gray-700 list-disc list-inside mx-auto max-w-md">
                <li>Durations (1 or 2 hours)</li>
                <li>Group sizes (10 or 20 people) or set-ups (private or public)</li>
                <li>Languages (English or Spanish)</li>
                <li>Inclusions (with or without lunch)</li>
                <li>Ways to start the activity (meeting point or hotel pickup)</li>
              </ul>
              <p className="mb-6 text-gray-700 text-sm">The option is where the pricing/availability are stored, and where bookings are made. So you need at least one option per product to start receiving bookings.</p>
              {/* List of added options */}
              <div className="w-full max-w-md mx-auto mb-6">
                {options.length === 0 && <div className="text-gray-400 italic">No options added yet.</div>}
                {options.map((option, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 border rounded p-4 mb-2">
                    <div className="text-left">
                      <div className="font-semibold">{option.title || option.name}</div>
                      <div className="text-sm text-gray-600">Ref: {option.referenceCode || option.referencecode || '-'}</div>
                      <div className="text-xs text-gray-400">Group size: {option.groupSize || '-'}, Type: {option.isPrivate ? 'Private' : 'Non-private'}</div>
                    </div>
                    <button
                      className="border border-blue-600 text-blue-600 px-4 py-1 rounded font-semibold ml-4"
                      onClick={() => setOptionSubStep({ index, data: option })}
                      type="button"
                    >Edit</button>
                  </div>
                ))}
              </div>
              <button
                className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold hover:bg-blue-50 transition mb-4"
                onClick={() => setOptionSubStep({ index: null, data: null })}
                type="button"
              >Create new option</button>
              <div className="flex justify-between mt-6 w-full max-w-md mx-auto">
                <button
                  className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold"
                  onClick={() => setStep(9)}
                >Back</button>
                <button
                  className="bg-blue-600 text-white px-6 py-2 rounded font-semibold"
                  onClick={() => setStep(11)}
                  disabled={options.length === 0}
                >Continue</button>
              </div>
            </>
          ) : (
            <OptionForm
              initialData={optionSubStep.data}
              onSave={opt => {
                const optionObj = {
                  ...opt,
                  name: opt.title || opt.name || '',
                  description: opt.description || '',
                };
                if (optionSubStep.index === null) {
                  setOptions([...options, optionObj]);
                } else {
                  setOptions(options.map((o, i) => i === optionSubStep.index ? optionObj : o));
                }
                setOptionSubStep(null);
              }}
              onCancel={() => setOptionSubStep(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}

function OptionForm({ initialData, onSave, onCancel }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [referenceCode, setReferenceCode] = useState(initialData?.referenceCode || '');
  const [groupSize, setGroupSize] = useState(initialData?.groupSize || '');
  const [languages, setLanguages] = useState(initialData?.languages || []);
  const [isPrivate, setIsPrivate] = useState(initialData?.isPrivate || false);
  const [accessible, setAccessible] = useState(initialData?.accessible || false);
  const [status, setStatus] = useState(initialData?.status || 'Temporary');
  const [bookingEngine, setBookingEngine] = useState(initialData?.bookingEngine || 'Automatically accept new bookings');
  const [cutoffTime, setCutoffTime] = useState(initialData?.cutoffTime || '');
  const [type, setType] = useState(initialData?.type || 'Non-private');

  return (
    <form className="bg-white border rounded p-6 w-full max-w-lg mx-auto text-left">
      <h3 className="text-xl font-bold mb-4">Option setup</h3>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Title</label>
        <input className="w-full border rounded px-3 py-2" value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Reference code</label>
        <input className="w-full border rounded px-3 py-2" value={referenceCode} onChange={e => setReferenceCode(e.target.value)} />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Maximum group size</label>
        <input className="w-full border rounded px-3 py-2" type="number" value={groupSize} onChange={e => setGroupSize(e.target.value)} />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Languages</label>
        <input className="w-full border rounded px-3 py-2" value={languages.join(', ')} onChange={e => setLanguages(e.target.value.split(','))} placeholder="e.g. English, Spanish" />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Is this a private activity?</label>
        <div className="flex gap-4 mt-1">
          <label><input type="radio" checked={!isPrivate} onChange={() => setIsPrivate(false)} /> No</label>
          <label><input type="radio" checked={isPrivate} onChange={() => setIsPrivate(true)} /> Yes</label>
        </div>
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Is the activity wheelchair accessible?</label>
        <div className="flex gap-4 mt-1">
          <label><input type="radio" checked={!accessible} onChange={() => setAccessible(false)} /> No</label>
          <label><input type="radio" checked={accessible} onChange={() => setAccessible(true)} /> Yes</label>
        </div>
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Status</label>
        <input className="w-full border rounded px-3 py-2" value={status} onChange={e => setStatus(e.target.value)} />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Booking Engine</label>
        <input className="w-full border rounded px-3 py-2" value={bookingEngine} onChange={e => setBookingEngine(e.target.value)} />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Cut-off time</label>
        <input className="w-full border rounded px-3 py-2" value={cutoffTime} onChange={e => setCutoffTime(e.target.value)} />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Type</label>
        <input className="w-full border rounded px-3 py-2" value={type} onChange={e => setType(e.target.value)} />
      </div>
      <div className="flex justify-between mt-6">
        <button type="button" className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold" onClick={onCancel}>Cancel</button>
        <button type="button" className="bg-blue-600 text-white px-6 py-2 rounded font-semibold" onClick={() => onSave({ title, referenceCode, groupSize, languages, isPrivate, accessible, status, bookingEngine, cutoffTime, type })}>Save</button>
      </div>
    </form>
  );
} 