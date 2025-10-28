"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/types";

type Props = { products: Product[] };

export default function ProductList({ products }: Props) {
  const [query, setQuery] = useState("");

  const filtered = products.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.category ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-5xl mx-auto">
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full mb-8 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 flex flex-col items-center text-center"
          >
            {!!product.image_url && (
              <Image
                src={product.image_url}
                alt={product.name}
                width={240}
                height={240}
                className="rounded-lg mb-4 object-cover"
              />
            )}
            <h2 className="text-xl font-semibold text-gray-800">
              {product.name}
            </h2>
            {!!product.description && (
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {product.description}
              </p>
            )}
            <p className="mt-4 text-lg font-bold text-blue-600">
              ₹{Number(product.price).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-white">No products found.</p>
      )}
    </div>
  );
}
