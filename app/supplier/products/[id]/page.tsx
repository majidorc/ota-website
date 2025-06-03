"use client";
import { useEffect, useState, Fragment } from "react";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  CalendarIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  StarIcon,
  PrinterIcon,
  EyeIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

interface Product {
  id: string;
  title: string;
  referencecode?: string;
  shortdesc?: string;
  longdesc?: string;
  photos?: string[];
  status?: string;
  price?: number;
  currency?: string;
  createdAt: string;
  updatedAt: string;
}

type HistoryItem = {
  date: string;
  status: string;
  section: string;
  before: string;
  after: string;
  editor: string;
};

const statusColors: Record<string, string> = {
  Bookable: "bg-green-100 text-green-800",
  Deactivated: "bg-gray-100 text-gray-800",
  "Not yet submitted": "bg-yellow-100 text-yellow-800",
};

const mockOptions = [
  {
    id: "1",
    title: "Without Transfer",
    referenceCode: "140303",
    status: "Active",
    bookingEngine: "Automatically accept new bookings",
    cutOffTime: "10 hours",
    productId: "784859_1450299",
    availableUntil: "Thursday, May 28th, 2026",
  },
  {
    id: "2",
    title: "With Transfer",
    referenceCode: "140304",
    status: "Active",
    bookingEngine: "Automatically accept new bookings",
    cutOffTime: "10 hours",
    productId: "784859_1450299",
    availableUntil: "Thursday, May 28th, 2026",
  },
];

const mockHistory: HistoryItem[] = [
  // Example: { date: '2024-05-01', status: 'Active', section: 'Title', before: 'Old', after: 'New', editor: 'Supplier' }
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductDetails({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!product) return <div className="p-8">Product not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Product Header */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src={product.photos && product.photos.length > 0 ? product.photos[0] : "/images/placeholder.jpg"}
            alt={product.title}
            className="w-14 h-14 object-cover rounded"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold leading-tight">{product.title}</h1>
              <span className={classNames(
                "ml-2 px-2 py-0.5 rounded text-xs font-semibold",
                statusColors[product.status || "Not yet submitted"] || "bg-gray-100 text-gray-800"
              )}>{product.status || "Not yet submitted"}</span>
            </div>
            <div className="text-sm text-gray-500 flex gap-2 mt-1">
              <span>Product #{product.id}</span>
              {product.referencecode && <span>Product Reference Code: {product.referencecode}</span>}
              {/* <span>Rating: ★★★★☆ 4.8 (200+ reviews)</span> */}
            </div>
          </div>
          {/* Actions Dropdown */}
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
              Actions
              <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
            </Menu.Button>
            <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="py-1">
                  <Menu.Item disabled>
                    {({ active }) => (
                      <button className="w-full flex items-center px-4 py-2 text-sm text-gray-400 cursor-not-allowed">
                        <PlusIcon className="w-5 h-5 mr-2" /> Create Special Offer
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button className={classNames(active ? "bg-gray-100" : "", "w-full flex items-center px-4 py-2 text-sm text-blue-600")}> <CalendarIcon className="w-5 h-5 mr-2" /> Block out dates </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button className={classNames(active ? "bg-gray-100" : "", "w-full flex items-center px-4 py-2 text-sm text-blue-600")}> <PrinterIcon className="w-5 h-5 mr-2" /> View sample voucher </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button className={classNames(active ? "bg-gray-100" : "", "w-full flex items-center px-4 py-2 text-sm text-blue-600")}> <EyeIcon className="w-5 h-5 mr-2" /> View bookings </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button className={classNames(active ? "bg-gray-100" : "", "w-full flex items-center px-4 py-2 text-sm text-blue-600")}> <StarIcon className="w-5 h-5 mr-2" /> View reviews </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button className={classNames(active ? "bg-gray-100" : "", "w-full flex items-center px-4 py-2 text-sm text-blue-600")}> <DocumentDuplicateIcon className="w-5 h-5 mr-2" /> Clone Product </button>
                    )}
                  </Menu.Item>
                  <div className="border-t my-1" />
                  <Menu.Item>
                    {({ active }) => (
                      <button className={classNames(active ? "bg-gray-100" : "", "w-full flex items-center px-4 py-2 text-sm text-red-600")}> <span className="w-5 h-5 mr-2"> <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg> </span> Deactivate </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button className={classNames(active ? "bg-gray-100" : "", "w-full flex items-center px-4 py-2 text-sm text-red-600")}> <TrashIcon className="w-5 h-5 mr-2" /> Delete </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        {/* Product Details Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="font-bold text-lg mb-1">Title</div>
              <div className="mb-4">{product.title}</div>
              <div className="font-bold mb-1">Short description</div>
              <div className="mb-4">{product.shortdesc}</div>
              <div className="font-bold mb-1">Long description</div>
              <div className="mb-4 whitespace-pre-line">{product.longdesc}</div>
            </div>
            <Link href={`/supplier/products/${product.id}/edit`} className="ml-6 bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 h-10">Edit product</Link>
          </div>
        </div>

        {/* Refund Policy */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="font-bold mb-1">Refund policy</div>
          <div>This activity has a Standard (24-hour refund) policy. Read the FAQ to learn more about refund policies.</div>
        </div>

        {/* Options Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="font-bold text-lg">Options</div>
            <button className="flex items-center text-blue-600 font-semibold hover:underline"><PlusIcon className="w-5 h-5 mr-1" /> Create new option</button>
          </div>
          <div className="space-y-6">
            {mockOptions.map(option => (
              <div key={option.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold text-base">{option.title}</div>
                  <button className="flex items-center text-blue-600 font-semibold hover:underline"><span>Edit option</span> <ChevronDownIcon className="w-4 h-4 ml-1" /></button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-700">
                  <div><span className="font-medium">Option ID:</span> {option.referenceCode}</div>
                  <div><span className="font-medium">Status:</span> {option.status}</div>
                  <div><span className="font-medium">Booking Engine:</span> {option.bookingEngine}</div>
                  <div><span className="font-medium">Cut-off time:</span> {option.cutOffTime}</div>
                  <div><span className="font-medium">External product ID:</span> {option.productId}</div>
                  <div><span className="font-medium">Available until:</span> {option.availableUntil}</div>
                </div>
                <button className="mt-2 text-blue-600 text-sm hover:underline">Show availability and pricing</button>
              </div>
            ))}
          </div>
        </div>

        {/* History Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="font-bold text-lg mb-4">History</div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Date</th>
                <th className="p-2">Status</th>
                <th className="p-2">Section</th>
                <th className="p-2">Before</th>
                <th className="p-2">After</th>
                <th className="p-2">Editor</th>
              </tr>
            </thead>
            <tbody>
              {mockHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-400 py-4">No edits have been made to this product yet.</td>
                </tr>
              ) : (
                mockHistory.map((h, i) => (
                  <tr key={i}>
                    <td className="p-2">{h.date}</td>
                    <td className="p-2">{h.status}</td>
                    <td className="p-2">{h.section}</td>
                    <td className="p-2">{h.before}</td>
                    <td className="p-2">{h.after}</td>
                    <td className="p-2">{h.editor}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 