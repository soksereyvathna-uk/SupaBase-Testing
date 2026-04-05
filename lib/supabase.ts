import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "signature" | "sides" | "drinks" | "desserts";
  image_url: string | null;
  tag?: string | null;
  available: boolean;
  created_at: string;
};
