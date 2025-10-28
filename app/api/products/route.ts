import { NextResponse } from "next/server";
import { getAllProducts, addProduct } from "@/lib/products";

function isAdmin(req: Request) {
  const key = req.headers.get("x-admin-key");
  return key && key === process.env.ADMIN_KEY;
}

export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json(products);
  } catch (err: unknown) {
  let message = 'An unknown error occurred';

  if (err instanceof Error) {
    message = err.message;
  }

  return NextResponse.json({ error: message }, { status: 400 });
}
}

export async function POST(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const required = ["name", "slug", "description", "price", "category", "inventory"];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }

    const newProduct = await addProduct(body);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (err: unknown) {
  let message = 'An unknown error occurred';

  if (err instanceof Error) {
    message = err.message;
  }

  return NextResponse.json({ error: message }, { status: 400 });
}
}
