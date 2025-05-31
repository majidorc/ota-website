"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EditProductForm from "../../../../components/EditProductForm";

export default function EditProduct({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      <EditProductForm productId={params.id} />
    </div>
  );
} 