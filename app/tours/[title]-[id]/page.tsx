import { useEffect } from 'react';

export default function ProductDetailPage({ params }: { params: { title: string, id: string } }) {
  useEffect(() => {
    if (product) {
      // Save last viewed product for continue planning
      localStorage.setItem('lastViewedProduct', JSON.stringify(product));
    }
  }, [product]);
} 