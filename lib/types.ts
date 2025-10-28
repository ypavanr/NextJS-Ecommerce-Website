export type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  category?: string | null;
  inventory?: number | null;
  image_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};
