import { getSupabaseClient } from "@/shared/lib/supabase/client";
import type { Product, ProductFilter, ProductType } from "../model/types";

type ProductRow = {
  id: string;
  title: string;
  type: ProductType;
  price: number;
  sale_price: number | null;
  image_url: string;
};

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    price: row.price,
    salePrice: row.sale_price,
    imageUrl: row.image_url,
  };
}

// LIKE 패턴의 와일드카드 문자를 일반 문자로 취급하도록 이스케이프
function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

export async function fetchProducts({
  keyword,
  type,
}: ProductFilter): Promise<Product[]> {
  let query = getSupabaseClient()
    .from("products")
    .select("id, title, type, price, sale_price, image_url")
    .order("created_at", { ascending: true });

  const trimmed = keyword.trim();
  if (trimmed) {
    query = query.ilike("title", `%${escapeLikePattern(trimmed)}%`);
  }
  if (type !== "all") {
    query = query.eq("type", type);
  }

  const { data, error } = await query.overrideTypes<
    ProductRow[],
    { merge: false }
  >();
  if (error) throw new Error(error.message);

  return data.map(toProduct);
}
