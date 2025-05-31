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
  const [referenceCode, setReferenceCode] = useState<string>("");
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
        setReferenceCode(data.referenceCode || "");
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
          language, category, title, referenceCode, shortDesc, fullDesc,
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

  // ... UI rendering for steps, sidebar, and fields (similar to NewProductForm) ...
  // For brevity, not included here, but should match the stepper/sidebar and field layout of NewProductForm.

  return (
    <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto bg-white rounded shadow min-h-[700px] relative">
      {/* Sidebar and stepper UI, fields for each step, and a save button on the last step */}
      {/* ... (reuse from NewProductForm, but with values and onChange for edit) ... */}
      {/* Show loading/error states as needed */}
    </div>
  );
} 