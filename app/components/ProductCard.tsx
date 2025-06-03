import Image from "next/image";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description?: string;
    image?: string;
    category?: string;
    badge?: string;
    rating?: number;
    reviewCount?: number;
    price?: number;
    currency?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border">
      <div className="relative h-40 w-full">
        <Image
          src={product.image || '/images/placeholder.jpg'}
          alt={product.title}
          fill
          className="object-cover rounded-t-lg"
        />
        {/* Example badge */}
        {product.badge && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded">
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="text-xs text-blue-600 font-bold mb-1">{product.category || "WATER ACTIVITY"}</div>
        <div className="font-semibold mb-1 line-clamp-2 min-h-[2.5rem]">{product.title}</div>
        <div className="text-xs text-gray-600 mb-2 line-clamp-2 min-h-[2.5rem]">{product.description}</div>
        <div className="flex items-center gap-2 mb-1">
          {/* Example: Star rating */}
          {product.rating && (
            <>
              <span className="text-yellow-500">★</span>
              <span className="text-xs font-semibold">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-400">({product.reviewCount})</span>
            </>
          )}
        </div>
        <div className="text-xs text-gray-500">
          {typeof product.price === 'number'
            ? <>From <span className="font-bold">{product.price.toLocaleString()} {product.currency || ""}</span> per person</>
            : 'Contact for price'}
        </div>
      </div>
    </div>
  );
} 