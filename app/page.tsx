import ProductList from "./components/ProductList";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 text-white py-16 px-4">
      <h1 className="text-5xl md:text-6xl font-extrabold text-center tracking-tight drop-shadow-lg mb-10">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-pink-400 to-orange-500 animate-pulse">
          Our Products
        </span>
      </h1>
      <ProductList />
    </main>
  );
}
