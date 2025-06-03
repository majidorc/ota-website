"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-4">Search Results</h1>
      <p className="text-gray-600 mb-8">Showing results for: <span className="font-semibold">{query}</span></p>
      <div className="text-gray-400">(Search results will appear here soon.)</div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
} 