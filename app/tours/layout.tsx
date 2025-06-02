import Navbar from '../components/Navbar';

export default function ToursLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      {children}
    </div>
  );
} 