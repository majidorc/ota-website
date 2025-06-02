export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Customer Dashboard Navbar or Sidebar can go here later */}
      {children}
    </div>
  );
} 