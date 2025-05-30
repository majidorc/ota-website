"use client";
import { useEffect, useRef, useState } from "react";
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
    function handleClickOutside(event: MouseEvent) {
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

  const handleDropdownItemClick = (item: any) => {
    if (item.label === "New Product") {
      setShowNewProductForm(true);
      setOpenDropdown(null);
    } else if (item.href) {
      router.push(item.href);
      setOpenDropdown(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="flex items-center justify-between bg-white px-8 py-4 shadow-sm border-b">
        <div className="flex items-center gap-8">
          <span className="font-bold text-lg text-blue-600">Admin Panel</span>
          <div className="flex gap-6">
            {menuTabs.map((tab) => (
              <div
                key={tab.name}
                className="relative"
                ref={el => { dropdownRefs.current[tab.name] = el; }}
              >
                <button
                  className="text-gray-700 font-medium hover:text-blue-600 focus:outline-none px-2 py-1"
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
        </div>
        <div className="flex items-center gap-6">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Unlocked – Spring 2025 <span className="ml-1 bg-blue-500 text-white px-2 py-0.5 rounded-full text-[10px] align-middle">NEW</span></span>
          <div className="flex items-center gap-2">
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
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState("");
  const [category, setCategory] = useState("");
  const [contentMode, setContentMode] = useState("copy");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [highlightInput, setHighlightInput] = useState("");

  return (
    <div className="w-full max-w-3xl bg-white rounded shadow p-8 mx-auto">
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
          <div className="flex justify-between">
            <button
              className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold"
              onClick={onCancel}
            >Cancel</button>
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
                    onChange={e => setContent(e.target.value)}
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
              className="bg-blue-600 text-white px-6 py-2 rounded font-semibold disabled:opacity-50"
              disabled={contentMode === "copy" && content.length < 700}
              onClick={() => setStep(4)}
            >Continue</button>
          </div>
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
              onChange={e => setTitle(e.target.value)}
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
              onChange={e => setReferenceCode(e.target.value)}
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
              className="bg-blue-600 text-white px-6 py-2 rounded font-semibold disabled:opacity-50"
              disabled={title.length < 10}
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
              onChange={e => setShortDesc(e.target.value)}
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
              onChange={e => setFullDesc(e.target.value)}
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
              onChange={e => setHighlightInput(e.target.value)}
              maxLength={80}
              placeholder="Add a highlight and press Enter"
              onKeyDown={e => {
                if (e.key === 'Enter' && highlightInput.trim()) {
                  setHighlights([...highlights, highlightInput.trim()]);
                  setHighlightInput("");
                  e.preventDefault();
                }
              }}
            />
            <div className="flex flex-wrap gap-2 mb-2">
              {highlights.map((h, i) => (
                <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs flex items-center gap-1">
                  {h}
                  <button type="button" className="ml-1 text-red-500" onClick={() => setHighlights(highlights.filter((_, idx) => idx !== i))}>Remove</button>
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
              className="bg-blue-600 text-white px-6 py-2 rounded font-semibold disabled:opacity-50"
              disabled={shortDesc.length < 20 || fullDesc.length < 500 || highlights.length < 3}
              onClick={() => setStep(6)}
            >Continue</button>
          </div>
        </div>
      )}
      {/* Step 6: Placeholder */}
      {step === 6 && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="text-blue-600 font-bold">6</span>
            <span className="font-semibold">Locations (Coming soon)</span>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-yellow-700 text-sm mb-4">
            This is a placeholder for the next step. The full step will be implemented next.
          </div>
          <div className="flex justify-between">
            <button
              className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold"
              onClick={() => setStep(5)}
            >Back</button>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded font-semibold disabled:opacity-50"
              disabled
            >Continue</button>
          </div>
        </div>
      )}
    </div>
  );
} 