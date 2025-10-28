import fs from "fs/promises";
import path from "path";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  image_url?: string;
  lastUpdated: string;
};

const DB_PATH = path.join(process.cwd(), "data", "products.json");

async function readDB(): Promise<Product[]> {
  const buf = await fs.readFile(DB_PATH, "utf8");
  return JSON.parse(buf);
}

async function writeDB(data: Product[]) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}

export async function getAllProducts() {
    console.log(" Reading from:", DB_PATH);
  return readDB();
}

export async function getProductBySlug(slug: string) {
  const data = await readDB();
  return data.find((p) => p.slug === slug) ?? null;
}

export async function addProduct(newProduct: Omit<Product, "id" | "lastUpdated">) {
  const data = await readDB();

  const maxNum = data
    .map((p) => parseInt(p.id.replace("p-", ""), 10))
    .filter((n) => !isNaN(n))
    .reduce((a, b) => Math.max(a, b), 0);

  const nextId = `p-${String(maxNum + 1).padStart(3, "0")}`;

  const product: Product = {
    ...newProduct,
    id: nextId,
    lastUpdated: new Date().toISOString(),
  };

  data.push(product);
  await writeDB(data);
  return product;
}


export async function updateProduct(id: string, patch: Partial<Product>) {
  const data = await readDB();
  const index = data.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Product not found");

  data[index] = {
    ...data[index],
    ...patch,
    lastUpdated: new Date().toISOString(),
  };

  await writeDB(data);
  return data[index];
}
