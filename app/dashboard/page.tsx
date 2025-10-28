import type { Product } from "@/lib/products";

export const dynamic = "force-dynamic"; 

export default async function Dashboard() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/products`, {
    cache: "no-store", 
  });

  if (!res.ok) {
    console.error("API fetch error:", await res.text());
    return (
      <main className="flex min-h-screen items-center justify-center bg-red-50 text-red-700">
        <h1 className="text-xl font-semibold">Error loading inventory</h1>
      </main>
    );
  }

  const products: Product[] = await res.json();

  const total = products.length;
  const lowStock = products.filter((p) => p.inventory > 0 && p.inventory < 5).length;
  const outOfStock = products.filter((p) => p.inventory <= 0).length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-10">
        Inventory Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
        <StatCard title="Total Products" value={total} color="bg-white/10" />
        <StatCard title="Low Stock (<5)" value={lowStock} color="bg-yellow-400/20" />
        <StatCard title="Out of Stock" value={outOfStock} color="bg-red-400/20" />
      </div>

      <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl shadow-lg overflow-hidden">
        <table className="min-w-full text-sm text-left text-white/90">
          <thead className="bg-white/20 text-white uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Inventory</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const inventory = p.inventory ?? 0;
              const status =
                inventory <= 0
                  ? "Out of Stock"
                  : inventory < 5
                  ? "Low Stock"
                  : "In Stock";
              const color =
                inventory <= 0
                  ? "text-red-400"
                  : inventory < 5
                  ? "text-yellow-300"
                  : "text-green-300";

              return (
                <tr
                  key={p.id}
                  className="border-b border-white/10 hover:bg-white/10 transition"
                >
                  <td className="px-6 py-4 font-medium">{p.name}</td>
                  <td className="px-6 py-4">{p.category}</td>
                  <td className="px-6 py-4">
                    ₹{Number(p.price).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">{inventory}</td>
                  <td className={`px-6 py-4 font-semibold ${color}`}>
                    {status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color?: string;
}) {
  return (
    <div
      className={`p-6 rounded-2xl shadow-lg text-center ${
        color ?? "bg-white/10"
      }`}
    >
      <h2 className="text-2xl font-bold">{value}</h2>
      <p className="text-sm text-white/80 mt-2">{title}</p>
    </div>
  );
}
