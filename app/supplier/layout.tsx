import SupplierHeader from "../components/SupplierHeader";

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <SupplierHeader />
      {/* Supplier Dashboard Navbar or Sidebar can go here later */}
      {children}
    </div>
  );
} 