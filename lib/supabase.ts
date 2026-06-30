import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  title: string;
  description: string | null;
  brand: string;
  modality_type: 'MRI' | 'CT' | 'Cath Lab' | 'USG' | 'X-Ray' | 'Spares' | 'Other';
  condition: 'Imported Refurbished' | 'Indian Refurbished' | 'Pre-Owned' | 'New';
  specifications: Record<string, unknown>;
  base_price: number | null;
  show_price: boolean;
  is_available: boolean;
  images: string[];
  location_state: string | null;
  created_at: string;
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  institution_name: string | null;
  city: string | null;
  region_state: string | null;
  message: string | null;
  product_id: string | null;
  requirement_type: 'Buy' | 'Sell/Buyback' | 'Service/AMC' | 'AERB';
  status: 'New' | 'Contacted' | 'In-Negotiation' | 'Closed';
  assigned_to: string | null;
  notes: string | null;
  created_at: string;
};
