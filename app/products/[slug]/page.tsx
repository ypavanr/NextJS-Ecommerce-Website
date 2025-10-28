import Image from "next/image";
import type { Product } from "@/lib/products";

//  Revalidate every 60s (ISR)
export const revalidate = 60;

//  Generate all product pages at build time
export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/products`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.error("Failed to fetch product slugs:", res.statusText);
    return [];
  }

  const data: Product[] = await res.json();
  return data.map((p) => ({ slug: p.slug }));
}

//  Fetch a single product from API
async function getProduct(slug: string): Promise<Product | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/products/${slug}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    console.error("Product fetch failed:", res.statusText);
    return null;
  }

  const data = await res.json();
  if ("error" in data) return null;
  return data as Product;
}

//  Page component
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 text-white">
        <h1 className="text-3xl font-semibold">Product not found</h1>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-10 flex flex-col md:flex-row gap-10">
        {product.image_url && (
          <div className="flex-shrink-0 w-full md:w-1/2 flex items-center justify-center">
            <Image
              src={product.image_url}
              alt={product.name}
              width={400}
              height={400}
              className="rounded-2xl object-cover shadow-lg"
            />
          </div>
        )}

        <div className="flex flex-col justify-center text-left md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-orange-500 mb-6">
            {product.name}
          </h1>

          {!!product.description && (
            <p className="text-gray-100 text-lg mb-6">{product.description}</p>
          )}

          <p className="text-2xl font-bold text-green-300 mb-3">
            ₹{Number(product.price).toLocaleString()}
          </p>

          <p className="text-sm text-gray-200 mb-2">
            Category: <span className="font-semibold">{product.category}</span>
          </p>

          <p
            className={`text-sm ${
              (product.inventory ?? 0) > 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {(product.inventory ?? 0) > 0
              ? `In stock (${product.inventory})`
              : "Out of stock"}
          </p>
        </div>
      </div>
    </main>
  );
}
