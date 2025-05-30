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

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const router = useRouter();
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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
    if (item.href) {
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
                ref={el => (dropdownRefs.current[tab.name] = el)}
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
      </div>
    </div>
  );
} 