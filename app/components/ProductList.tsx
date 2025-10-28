"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { Product } from "@/lib/products";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch products from local Next.js API route
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filtered = products.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.category ?? "").toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <p className="text-center text-gray-100 mt-10 animate-pulse">
        Loading products...
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Search bar */}
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full mb-8 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-900"
      />

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="bg-white/90 backdrop-blur-md rounded-xl shadow-md hover:shadow-2xl transition-all p-6 flex flex-col items-center text-center border border-white/30"
          >
            <Link href={`/products/${product.slug}`} className="block w-full">
              {product.image_url && (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={240}
                  height={240}
                  className="rounded-lg mb-4 object-cover mx-auto shadow-lg hover:scale-105 transition-transform"
                />
              )}

              <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition">
                {product.name}
              </h2>
            </Link>

            {product.description && (
              <p className="text-gray-700 text-sm mt-2 line-clamp-2">
                {product.description}
              </p>
            )}

            <p className="mt-4 text-lg font-bold text-blue-600">
              ₹{Number(product.price).toLocaleString()}
            </p>

            {product.inventory <= 0 ? (
              <p className="mt-2 text-sm font-semibold text-red-500">
                Out of stock
              </p>
            ) : product.inventory < 5 ? (
              <p className="mt-2 text-sm font-semibold text-yellow-500">
                Low stock ({product.inventory})
              </p>
            ) : (
              <p className="mt-2 text-sm text-green-600">
                In stock ({product.inventory})
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <p className="text-center text-white mt-10 text-lg">
          No products found.
        </p>
      )}
    </div>
  );
}
