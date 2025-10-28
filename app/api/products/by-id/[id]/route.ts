import { NextRequest, NextResponse } from "next/server";
import { updateProduct, getAllProducts } from "@/lib/products";

function isAdmin(req: NextRequest) {
  const key = req.headers.get("x-admin-key");
  return key && key === process.env.ADMIN_KEY;
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; 

  console.log(" Update request for ID:", id);

  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const patch = await req.json();

    const all = await getAllProducts();
    console.log("📁 All IDs in DB:", all.map((p) => p.id));

    const updated = await updateProduct(id, patch);
    return NextResponse.json(updated);
  } catch (err: unknown) {
    let message = "An unknown error occurred";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
