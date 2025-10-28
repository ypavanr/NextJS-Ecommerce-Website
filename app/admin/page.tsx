"use client";

import { useEffect, useState, startTransition } from "react";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  image_url?: string;
};

const ADMIN_KEY_STORAGE = "adminKey";

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    slug: "",
    description: "",
    price: 0,
    category: "",
    inventory: 0,
    image_url: "",
  });

  // ✅ Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Auto-login if key exists in localStorage (and immediately fetch products)
  useEffect(() => {
    const storedKey = localStorage.getItem(ADMIN_KEY_STORAGE);
    if (storedKey) {
      startTransition(() => {
        setAdminKey(storedKey);
        setIsAuthenticated(true);
      });
      // 🟢 Fetch products once authenticated
      fetchProducts();
    }
  }, []);

  // ✅ Manual login
  const handleLogin = async () => {
    if (adminKey.trim().length > 0) {
      localStorage.setItem(ADMIN_KEY_STORAGE, adminKey);
      setIsAuthenticated(true);
      await fetchProducts(); // fetch immediately after login
    } else {
      alert("Please enter a valid admin key");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_KEY_STORAGE);
    setIsAuthenticated(false);
    setAdminKey("");
    setProducts([]); // clear data
  };

  // ✅ Add new product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify(newProduct),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(`Failed to add product: ${err.error || res.statusText}`);
      } else {
        alert("Product added successfully!");
        setNewProduct({
          name: "",
          slug: "",
          description: "",
          price: 0,
          category: "",
          inventory: 0,
          image_url: "",
        });
        fetchProducts(); // reload products
      }
    } catch (err) {
      console.error(err);
      alert("Error adding product");
    }
  };

  // ✅ Update inventory
  const handleUpdateInventory = async (id: string, inventory: number) => {
    try {
      const res = await fetch(`/api/products/by-id/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ inventory }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(`Failed to update product: ${err.error || res.statusText}`);
      } else {
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
      alert("Error updating inventory");
    }
  };

  // ✅ Login screen
  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 text-white">
        <div className="bg-white/10 p-8 rounded-2xl shadow-xl text-center backdrop-blur-md">
          <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
          <input
            type="password"
            placeholder="Enter Admin Key"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            className="w-64 px-4 py-2 rounded bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
          <button
            onClick={handleLogin}
            className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-lg transition"
          >
            Login
          </button>
        </div>
      </main>
    );
  }

  // ✅ Dashboard screen
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 text-white p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white font-semibold"
        >
          Logout
        </button>
      </div>

      {/* --- Add Product Form --- */}
      <section className="bg-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg mb-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="p-2 rounded text-black" required />
          <input type="text" placeholder="Slug"
            value={newProduct.slug}
            onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })}
            className="p-2 rounded text-black" required />
          <input type="number" placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
            className="p-2 rounded text-black" required />
          <input type="text" placeholder="Category"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            className="p-2 rounded text-black" />
          <input type="number" placeholder="Inventory"
            value={newProduct.inventory}
            onChange={(e) => setNewProduct({ ...newProduct, inventory: parseInt(e.target.value) })}
            className="p-2 rounded text-black" required />
          <input type="text" placeholder="Image URL"
            value={newProduct.image_url}
            onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
            className="p-2 rounded text-black col-span-1 md:col-span-2" />
          <textarea placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="p-2 rounded text-black col-span-1 md:col-span-2" />
          <button
            type="submit"
            className="col-span-1 md:col-span-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg transition"
          >
            Add Product
          </button>
        </form>
      </section>

      {/* --- Product Table --- */}
      <section className="max-w-5xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Current Products</h2>
        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <table className="min-w-full text-sm text-left text-white/90">
            <thead className="bg-white/20 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Inventory</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-white/10">
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3">{p.inventory}</td>
                  <td className="px-4 py-3">₹{Number(p.price).toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleUpdateInventory(p.id, p.inventory + 1)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => handleUpdateInventory(p.id, Math.max(p.inventory - 1, 0))}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      -1
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
