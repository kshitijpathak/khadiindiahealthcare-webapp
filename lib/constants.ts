export function formatINR(amount: number | null | undefined, showPrice?: boolean): string {
  if (!showPrice || amount === null || amount === undefined) return 'Price on Request';
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

export const MODALITIES = ['MRI', 'CT', 'Cath Lab', 'USG', 'X-Ray', 'Spares', 'Other'] as const;
export const BRANDS = ['GE', 'Siemens', 'Philips', 'Toshiba', 'Mindray', 'Canon', 'Hitachi', 'Samsung', 'Other'] as const;
export const CONDITIONS = ['Imported Refurbished', 'Indian Refurbished', 'Pre-Owned', 'New'] as const;
export const LEAD_STATUSES = ['New', 'Contacted', 'In-Negotiation', 'Closed'] as const;

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
] as const;

export const CONDITION_COLORS: Record<string, string> = {
  'Imported Refurbished': 'bg-blue-100 text-blue-800',
  'Indian Refurbished': 'bg-teal-100 text-teal-800',
  'Pre-Owned': 'bg-amber-100 text-amber-800',
  'New': 'bg-emerald-100 text-emerald-800',
};

export const STATUS_COLORS: Record<string, string> = {
  'New': 'bg-blue-100 text-blue-800',
  'Contacted': 'bg-yellow-100 text-yellow-800',
  'In-Negotiation': 'bg-orange-100 text-orange-800',
  'Closed': 'bg-green-100 text-green-800',
};
