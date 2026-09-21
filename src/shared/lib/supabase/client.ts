import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

// 브라우저(CSR)에서 사용하는 Supabase 클라이언트. 앱 전체에서 하나만 생성한다.
export function getSupabaseClient(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Supabase 환경변수가 없습니다. .env.local에 NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY를 설정하세요.",
    );
  }

  client = createClient(url, publishableKey, {
    auth: { persistSession: false },
  });
  return client;
}
