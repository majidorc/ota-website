"use client";
import React, { useEffect, useRef, useState, ChangeEvent, KeyboardEvent, MouseEvent } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  description: string;
  referenceCode: string;
  status: "Bookable" | "Deactivated" | "In review";
}

const statusColors: Record<string, string> = {
  Bookable: "bg-green-100 text-green-800",
  Deactivated: "bg-gray-100 text-gray-800",
  "In review": "bg-blue-100 text-blue-800",
};

const menuTabs = [
  { name: "Create", dropdown: [{ label: "New Product", href: "/admin/products/new" }] },
  { name: "Manage", dropdown: [{ label: "Products" }] },
  { name: "Bookings", dropdown: [{ label: "Bookings" }] },
  { name: "Performance" },
  { name: "Finance" },
];

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

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const router = useRouter();
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/destinations")
      .then((res) => res.json())
      .then((data) => {
        // Add mock referenceCode and status for demo
        setProducts(
          data.map((item: any, idx: number) => ({
            ...item,
            referenceCode: `REF${1000 + idx}`,
            status: idx % 3 === 0 ? "Bookable" : idx % 3 === 1 ? "Deactivated" : "In review",
          }))
        );
      });
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (
        openDropdown &&
        dropdownRefs.current[openDropdown] &&
        !dropdownRefs.current[openDropdown]?.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    }
    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  const handleDropdownClick = (tabName: string) => {
    setOpenDropdown(openDropdown === tabName ? null : tabName);
  };

  const handleDropdownItemClick = (item: { label: string; href?: string }) => {
    if (item.label === "New Product") {
      setShowNewProductForm(true);
      setOpenDropdown(null);
    } else if (item.href) {
      router.push(item.href);
      setOpenDropdown(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-[15px]">
      {/* Top Navigation Bar */}
      <nav className="flex flex-col md:flex-row md:items-center md:justify-between bg-white px-4 md:px-8 py-4 shadow-sm border-b gap-4 md:gap-0 relative">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 w-full md:w-auto">
          <span className="font-bold text-lg md:text-xl text-blue-600">Admin Panel</span>
          {/* Hamburger for mobile */}
          <button
            className="md:hidden absolute right-4 top-4 z-30"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open menu"
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {/* Desktop nav */}
          <div className="hidden md:flex flex-col sm:flex-row gap-2 md:gap-6 w-full md:w-auto">
            {menuTabs.map((tab) => (
              <div
                key={tab.name}
                className="relative"
                ref={(el: HTMLDivElement | null) => { dropdownRefs.current[tab.name] = el; }}
              >
                <button
                  className="text-gray-700 font-medium hover:text-blue-600 focus:outline-none px-2 py-1 w-full text-left md:text-center"
                  onClick={() => tab.dropdown ? handleDropdownClick(tab.name) : undefined}
                >
                  {tab.name}
                </button>
                {tab.dropdown && openDropdown === tab.name && (
                  <div className="absolute left-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                    {tab.dropdown.map((item) => (
                      <div
                        key={item.label}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleDropdownItemClick(item)}
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Mobile slide-in menu */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden" onClick={() => setMobileMenuOpen(false)}>
              <div className="absolute top-0 left-0 w-64 h-full bg-white shadow-lg p-6" onClick={e => e.stopPropagation()}>
                <button className="mb-6" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <nav className="flex flex-col gap-4">
                  {menuTabs.map((tab) => (
                    <div key={tab.name}>
                      <button
                        className="text-gray-700 font-medium hover:text-blue-600 focus:outline-none px-2 py-1 w-full text-left"
                        onClick={() => {
                          if (tab.dropdown) handleDropdownClick(tab.name);
                          setMobileMenuOpen(false);
                        }}
                      >
                        {tab.name}
                      </button>
                      {/* Show dropdown items inline for mobile */}
                      {tab.dropdown && openDropdown === tab.name && (
                        <div className="ml-4 mt-1 flex flex-col gap-1">
                          {tab.dropdown.map((item) => (
                            <button
                              key={item.label}
                              className="text-sm text-gray-600 hover:text-blue-600 text-left"
                              onClick={() => {
                                handleDropdownItemClick(item);
                                setMobileMenuOpen(false);
                              }}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 w-full md:w-auto">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold text-center md:text-left">Unlocked – Spring 2025 <span className="ml-1 bg-blue-500 text-white px-2 py-0.5 rounded-full text-[10px] align-middle">NEW</span></span>
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span className="font-semibold text-gray-700">Majid</span>
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">M</div>
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <div className="p-8">
        {showNewProductForm ? (
          <NewProductForm onCancel={() => setShowNewProductForm(false)} />
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-6">Products</h1>
            <div className="overflow-x-auto bg-white rounded shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.referenceCode}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[product.status]}`}>{product.status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-blue-600 hover:underline font-semibold">See details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function NewProductForm({ onCancel }: { onCancel: () => void }) {
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
  // Step 10: Photos
  const [photos, setPhotos] = useState<File[]>([]);
  // Step 11: Options
  const [options, setOptions] = useState<{ name: string; description: string }[]>([]);
  const [optionName, setOptionName] = useState("");
  const [optionDesc, setOptionDesc] = useState("");
  // Step 12: Pricing
  const [price, setPrice] = useState<string>("");
  const [currency, setCurrency] = useState<string>("THB");
  // Step 13: Availability
  const [availability, setAvailability] = useState<string>("");
  // Step 14: Meeting Point
  const [meetingPoint, setMeetingPoint] = useState<string>("");
  // Step 15: Important Info
  const [importantInfo, setImportantInfo] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // ChatGPT loading and error state
  const [loadingChatGPT, setLoadingChatGPT] = useState(false);
  const [chatGPTError, setChatGPTError] = useState<string | null>(null);

  // Steps definition
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

  // Sidebar navigation handler
  const handleSidebarClick = (idx: number) => {
    if (idx + 1 < step) setStep(idx + 1);
  };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard navigation when not in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        // Move to next step if not on last step
        if (step < steps.length) {
          setStep(step + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        // Move to previous step if not on first step
        if (step > 1) {
          setStep(step - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, steps.length]);

  // Add hotkey hints component
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
        {/* Accordion toggle for mobile */}
        <div className="md:hidden mb-2">
          <button
            className="w-full flex items-center justify-between px-4 py-2 bg-blue-100 text-blue-700 rounded font-semibold"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-expanded={sidebarOpen}
            aria-controls="sidebar-steps"
          >
            Steps
            <svg className={`ml-2 transition-transform ${sidebarOpen ? 'rotate-90' : ''}`} width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <nav id="sidebar-steps" className={`${sidebarOpen ? 'block' : 'hidden'} md:block transition-all duration-200`}>
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
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setLanguage(e.target.value)}
            >
              <option value="">Select a language</option>
              {languages.map((lang: string) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-blue-700 text-sm mb-4">
              <b>Product language and categories cannot be changed</b><br />
              This is because we customize the product creation process according to your initial selection. If you've selected the wrong language or category, please delete this one and create a new product.
            </div>
            <div className="flex justify-between">
              <button
                className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold"
                onClick={onCancel}
              >Cancel</button>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded font-semibold"
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
              {categories.map((cat: { label: string; description: string }) => (
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
                className="bg-blue-600 text-white px-6 py-2 rounded font-semibold"
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
                      console.log('ChatGPT API response:', data);

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
        {step === 4 && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-blue-600 font-bold">4</span>
              <span className="font-semibold">Main Information</span>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">What is the customer-facing title of your product?</label>
              <input
                className="w-full border rounded px-3 py-2 mb-2"
                value={title}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                maxLength={60}
                placeholder="e.g. From Phuket: Krabi and Phang Nga Bay Island Hopping Tour"
              />
              <div className="text-right text-xs text-gray-500">{title.length} / 60</div>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Create a product reference code <span className="text-xs text-gray-400">(optional)</span></label>
              <input
                className="w-full border rounded px-3 py-2 mb-2"
                value={referenceCode}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setReferenceCode(e.target.value)}
                maxLength={20}
                placeholder="e.g. HKT0097"
              />
              <div className="text-right text-xs text-gray-500">{referenceCode.length} / 20</div>
            </div>
            <div className="flex justify-between">
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
            <div className="mb-4">
              <label className="block font-semibold mb-2">Introduce your product</label>
              <input
                className="w-full border rounded px-3 py-2 mb-2"
                value={shortDesc}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setShortDesc(e.target.value)}
                maxLength={200}
                placeholder="Short intro (2-3 sentences)"
              />
              <div className="text-right text-xs text-gray-500">{shortDesc.length} / 200</div>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Add a full description</label>
              <textarea
                className="w-full border rounded px-3 py-2 mb-2 min-h-[120px]"
                value={fullDesc}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFullDesc(e.target.value)}
                maxLength={3000}
                placeholder="Full description (at least 500 characters)"
              />
              <div className="text-right text-xs text-gray-500">{fullDesc.length} / 3000</div>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Summarize the highlights</label>
              <input
                className="w-full border rounded px-3 py-2 mb-2"
                value={highlightInput}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setHighlightInput(e.target.value)}
                maxLength={80}
                placeholder="Add a highlight and press Enter"
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter' && highlightInput.trim()) {
                    setHighlights([...highlights, highlightInput.trim()]);
                    setHighlightInput("");
                    e.preventDefault();
                  }
                }}
              />
              <div className="flex flex-wrap gap-2 mb-2">
                {highlights.map((h: string, i: number) => (
                  <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs flex items-center gap-1">
                    {h}
                    <button type="button" className="ml-1 text-red-500" onClick={(e: MouseEvent<HTMLButtonElement>) => setHighlights(highlights.filter((_, idx) => idx !== i))}>Remove</button>
                  </span>
                ))}
              </div>
              <div className="text-xs text-gray-500">Write 3-5 highlights. Each up to 80 characters.</div>
            </div>
            <div className="flex justify-between">
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
            <div className="mb-4">
              <label className="block font-semibold mb-2">Add locations for your product</label>
              <div className="flex gap-2 mb-2">
                <input
                  className="flex-1 border rounded px-3 py-2"
                  value={locationInput}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setLocationInput(e.target.value)}
                  maxLength={80}
                  placeholder="Enter a location (city, landmark, etc.)"
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter' && locationInput.trim()) {
                      setLocations([...locations, locationInput.trim()]);
                      setLocationInput("");
                      e.preventDefault();
                    }
                  }}
                />
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded font-semibold"
                  type="button"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    if (locationInput.trim()) {
                      setLocations([...locations, locationInput.trim()]);
                      setLocationInput("");
                    }
                  }}
                >Add</button>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {locations.map((loc, i) => (
                  <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs flex items-center gap-1">
                    {loc}
                    <button type="button" className="ml-1 text-red-500" onClick={(e: MouseEvent<HTMLButtonElement>) => setLocations(locations.filter((_, idx) => idx !== i))}>Remove</button>
                  </span>
                ))}
              </div>
              <div className="text-xs text-gray-500">Add all relevant locations (e.g., cities, landmarks, meeting points).</div>
            </div>
            <div className="flex justify-between">
              <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold" onClick={(e: MouseEvent<HTMLButtonElement>) => setStep(5)}>Back</button>
              <button className="bg-blue-600 text-white px-6 py-2 rounded font-semibold" onClick={(e: MouseEvent<HTMLButtonElement>) => setStep(7)}>Continue</button>
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
            <div className="mb-4">
              <label className="block font-semibold mb-2">Add keywords for your product</label>
              <input
                className="w-full border rounded px-3 py-2 mb-2"
                value={keywordInput}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setKeywordInput(e.target.value)}
                maxLength={40}
                placeholder="Add a keyword and press Enter"
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter' && keywordInput.trim()) {
                    setKeywords([...keywords, keywordInput.trim()]);
                    setKeywordInput("");
                    e.preventDefault();
                  }
                }}
              />
              <div className="flex flex-wrap gap-2 mb-2">
                {keywords.map((kw, i) => (
                  <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs flex items-center gap-1">
                    {kw}
                    <button type="button" className="ml-1 text-red-500" onClick={(e: MouseEvent<HTMLButtonElement>) => setKeywords(keywords.filter((_, idx) => idx !== i))}>Remove</button>
                  </span>
                ))}
              </div>
              <div className="text-xs text-gray-500">Add keywords to help customers find your product.</div>
            </div>
            <div className="flex justify-between">
              <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold" onClick={(e: MouseEvent<HTMLButtonElement>) => setStep(6)}>Back</button>
              <button className="bg-blue-600 text-white px-6 py-2 rounded font-semibold" onClick={(e: MouseEvent<HTMLButtonElement>) => setStep(8)}>Continue</button>
            </div>
          </div>
        )}
        {/* Step 8: Inclusions & Exclusions (merged) */}
        {step === 8 && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-blue-600 font-bold">8</span>
              <span className="font-semibold">Inclusions & Exclusions</span>
            </div>
            <div className="mb-8">
              <label className="block font-bold mb-2 text-base">What is included? <span className="text-blue-600">🔑</span></label>
              <div className="text-gray-700 mb-2">List all the features that are included in the price so customers understand the value for money of your activity. Start a new line for each one.</div>
              <textarea
                className="w-full border rounded px-3 py-2 mb-1 min-h-[120px]"
                value={inclusionsText}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInclusionsText(e.target.value)}
                maxLength={1000}
                placeholder={"Snorkeling Equipment (mask and snorkel)\nAccident Insurance\nLife Jacket\nFruits\nPaddle board, Clear Kayak\nDrinking Water Soft Drinks\nLunch and Breakfast\nTransfer pick up\nGuide (English and Russia)\nBeach tower"}
              />
              <div className="text-right text-xs text-gray-500">{inclusionsText.length} / 1000</div>
            </div>
            <div className="mb-8">
              <label className="block font-bold mb-2 text-base">What is not included? <span className="text-blue-600">(optional)</span> <span className="text-blue-600">🔑</span></label>
              <div className="text-gray-700 mb-2">Name what customers need to pay extra for or what they may expect to see that isn't included in the price. This allows customers to appropriately set their expectations.</div>
              <textarea
                className="w-full border rounded px-3 py-2 mb-1 min-h-[80px]"
                value={exclusionsText}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setExclusionsText(e.target.value)}
                maxLength={1000}
                placeholder={"National Park Fee, Island fee\nFin\nActivity on the island"}
              />
              <div className="text-right text-xs text-gray-500">{exclusionsText.length} / 1000</div>
            </div>
            <div className="flex justify-between">
              <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold" onClick={(e: MouseEvent<HTMLButtonElement>) => setStep(7)}>Back</button>
              <button className="bg-blue-600 text-white px-6 py-2 rounded font-semibold" onClick={(e: MouseEvent<HTMLButtonElement>) => setStep(9)}>Continue</button>
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
            <div className="mb-4">
              <label className="block font-semibold mb-2">Upload photos for your product</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files) {
                    setPhotos([...photos, ...Array.from(e.target.files)]);
                  }
                }}
                className="mb-2"
              />
              <div className="flex flex-wrap gap-2">
                {photos.map((file, i) => (
                  <div key={i} className="relative w-24 h-24 border rounded overflow-hidden">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Photo ${i + 1}`}
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      onClick={(e: MouseEvent<HTMLButtonElement>) => setPhotos(photos.filter((_, idx) => idx !== i))}
                    >×</button>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-2">Add high-quality images to attract more bookings.</div>
            </div>
            <div className="flex justify-between">
              <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold" onClick={(e: MouseEvent<HTMLButtonElement>) => setStep(8)}>Back</button>
              <button className="bg-blue-600 text-white px-6 py-2 rounded font-semibold" onClick={(e: MouseEvent<HTMLButtonElement>) => setStep(10)}>Continue</button>
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
            <div className="mb-4">
              <label className="block font-semibold mb-2">Add booking options for your product</label>
              <div className="flex gap-2 mb-2">
                <input
                  className="flex-1 border rounded px-3 py-2"
                  value={optionName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setOptionName(e.target.value)}
                  maxLength={40}
                  placeholder="Option name"
                />
                <input
                  className="flex-1 border rounded px-3 py-2"
                  value={optionDesc}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setOptionDesc(e.target.value)}
                  maxLength={80}
                  placeholder="Description"
                />
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded font-semibold"
                  type="button"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    if (optionName.trim()) {
                      setOptions([...options, { name: optionName.trim(), description: optionDesc.trim() }]);
                      setOptionName("");
                      setOptionDesc("");
                    }
                  }}
                >Add</button>
              </div>
              <div className="flex flex-col gap-2 mb-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2 bg-blue-50 rounded px-3 py-2">
                    <span className="font-semibold text-blue-800">{opt.name}</span>
                    <span className="text-gray-600">{opt.description}</span>
                    <button type="button" className="ml-auto text-red-500" onClick={(e: MouseEvent<HTMLButtonElement>) => setOptions(options.filter((_, idx) => idx !== i))}>Remove</button>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-500">Add all available booking options (e.g., Adult, Child, Private Tour).</div>
            </div>
            <div className="flex justify-between">
              <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold" onClick={(e: MouseEvent<HTMLButtonElement>) => setStep(9)}>Back</button>
              <button className="bg-blue-600 text-white px-6 py-2 rounded font-semibold" onClick={(e: MouseEvent<HTMLButtonElement>) => setStep(11)}>Continue</button>
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
            <div className="mb-4">
              <label className="block font-semibold mb-2">Set pricing for your product</label>
              <div className="flex gap-2 mb-2">
                <input
                  className="flex-1 border rounded px-3 py-2"
                  value={price}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
                  maxLength={10}
                  placeholder="Price"
                  type="number"
                  min="0"
                />
                <select
                  className="border rounded px-3 py-2"
                  value={currency}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setCurrency(e.target.value)}
                >
                  <option value="THB">THB</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div className="text-xs text-gray-500">Set the base price and currency for your product.</div>
            </div>
            <div className="flex justify-between">
              <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold" onClick={(e: MouseEvent<HTMLButtonElement>) => setStep(10)}>Back</button>
              <button className="bg-blue-600 text-white px-6 py-2 rounded font-semibold" onClick={(e: MouseEvent<HTMLButtonElement>) => setStep(12)}>Continue</button>
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
            <div className="mb-4">
              <label className="block font-semibold mb-2">Set availability for your product</label>
              <input
                className="w-full border rounded px-3 py-2 mb-2"
                value={availability}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setAvailability(e.target.value)}
                placeholder="e.g. Daily, Weekends, 1 Jan - 31 Mar, etc."
              />
              <div className="text-xs text-gray-500">Describe when your product is available for booking.</div>
            </div>
            <div className="flex justify-between">
              <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold" onClick={(e: MouseEvent<HTMLButtonElement>) => setStep(11)}>Back</button>
              <button className="bg-blue-600 text-white px-6 py-2 rounded font-semibold" onClick={(e: MouseEvent<HTMLButtonElement>) => setStep(13)}>Continue</button>
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
            <div className="mb-4">
              <label className="block font-semibold mb-2">Add meeting point details for your product</label>
              <input
                className="w-full border rounded px-3 py-2 mb-2"
                value={meetingPoint}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setMeetingPoint(e.target.value)}
                maxLength={120}
                placeholder="e.g. Hotel pickup, Main entrance, etc."
              />
              <div className="text-xs text-gray-500">Specify where customers should meet for the activity.</div>
            </div>
            <div className="flex justify-between">
              <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold" onClick={(e: MouseEvent<HTMLButtonElement>) => setStep(12)}>Back</button>
              <button className="bg-blue-600 text-white px-6 py-2 rounded font-semibold" onClick={(e: MouseEvent<HTMLButtonElement>) => setStep(14)}>Continue</button>
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
            <div className="mb-4">
              <label className="block font-semibold mb-2">Add important information for your product</label>
              <textarea
                className="w-full border rounded px-3 py-2 mb-2 min-h-[80px]"
                value={importantInfo}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setImportantInfo(e.target.value)}
                maxLength={500}
                placeholder="e.g. Not suitable for children under 6, bring sunscreen, etc."
              />
              <div className="text-xs text-gray-500">Add any important notes or restrictions for customers.</div>
            </div>
            <div className="flex justify-between">
              <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold" onClick={(e: MouseEvent<HTMLButtonElement>) => setStep(13)}>Back</button>
              <button className="bg-blue-600 text-white px-6 py-2 rounded font-semibold" onClick={(e: MouseEvent<HTMLButtonElement>) => setStep(15)}>Continue</button>
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
            <div className="mb-4">
              <h2 className="font-bold mb-2">Review your product details</h2>
              <ul className="text-sm text-gray-700 space-y-1">
                <li><b>Language:</b> {language}</li>
                <li><b>Category:</b> {category}</li>
                <li><b>Title:</b> {title}</li>
                <li><b>Reference Code:</b> {referenceCode}</li>
                <li><b>Short Description:</b> {shortDesc}</li>
                <li><b>Full Description:</b> {fullDesc}</li>
                <li><b>Highlights:</b> {highlights.join(", ")}</li>
                <li><b>Locations:</b> {locations.join(", ")}</li>
                <li><b>Keywords:</b> {keywords.join(", ")}</li>
                <li><b>Inclusions:</b> {inclusionsText}</li>
                <li><b>Exclusions:</b> {exclusionsText}</li>
                <li><b>Options:</b> {options.map(o => o.name).join(", ")}</li>
                <li><b>Price:</b> {price} {currency}</li>
                <li><b>Availability:</b> {availability}</li>
                <li><b>Meeting Point:</b> {meetingPoint}</li>
                <li><b>Important Info:</b> {importantInfo}</li>
                <li><b>Photos:</b> {photos.length} uploaded</li>
              </ul>
            </div>
            <div className="flex justify-between">
              <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold" onClick={(e: MouseEvent<HTMLButtonElement>) => setStep(14)}>Back</button>
              <button className="bg-green-600 text-white px-6 py-2 rounded font-semibold">Submit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 