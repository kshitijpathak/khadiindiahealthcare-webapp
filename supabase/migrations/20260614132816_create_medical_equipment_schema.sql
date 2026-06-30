
-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  brand TEXT NOT NULL,
  modality_type TEXT NOT NULL CHECK (modality_type IN ('MRI', 'CT', 'Cath Lab', 'USG', 'X-Ray', 'Spares', 'Other')),
  condition TEXT NOT NULL CHECK (condition IN ('Imported Refurbished', 'Indian Refurbished', 'Pre-Owned', 'New')),
  specifications JSONB DEFAULT '{}',
  base_price DECIMAL(15,2),
  show_price BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  images TEXT[] DEFAULT '{}',
  location_state TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_select_all" ON products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "products_insert_admin" ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "products_update_admin" ON products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "products_delete_admin" ON products FOR DELETE TO authenticated USING (true);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  institution_name TEXT,
  city TEXT,
  region_state TEXT,
  message TEXT,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  requirement_type TEXT NOT NULL CHECK (requirement_type IN ('Buy', 'Sell/Buyback', 'Service/AMC', 'AERB')),
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'In-Negotiation', 'Closed')),
  assigned_to TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leads_insert_anon" ON leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "leads_select_admin" ON leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "leads_update_admin" ON leads FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "leads_delete_admin" ON leads FOR DELETE TO authenticated USING (true);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'SalesAgent' CHECK (role IN ('SuperAdmin', 'SalesAgent')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_users_select" ON admin_users FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_users_insert" ON admin_users FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "admin_users_update" ON admin_users FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_users_delete" ON admin_users FOR DELETE TO authenticated USING (true);

-- Insert sample products
INSERT INTO products (title, description, brand, modality_type, condition, specifications, base_price, show_price, is_available, images, location_state) VALUES
(
  'Siemens SOMATOM Definition AS+ 128 Slice CT Scanner',
  'High-performance 128-slice CT scanner ideal for cardiac, neuro, and oncology imaging. Fully refurbished with new X-ray tube and 12-month warranty.',
  'Siemens',
  'CT',
  'Imported Refurbished',
  '{"sliceCount": 128, "tubeCondition": "New", "manufacturingYear": 2018, "gantryBore": "78cm", "scanSpeed": "0.28s", "warranty": "12 months"}',
  4500000,
  true,
  true,
  ARRAY['https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg', 'https://images.pexels.com/photos/3376790/pexels-photo-3376790.jpeg'],
  'Maharashtra'
),
(
  'GE Optima MR450w 1.5T MRI System',
  'Wide-bore 1.5T MRI system with 70cm bore diameter. Excellent for claustrophobic patients. Complete refurbishment with gradient coil service.',
  'GE',
  'MRI',
  'Imported Refurbished',
  '{"teslaStrength": "1.5T", "boreDiameter": "70cm", "channels": 16, "manufacturingYear": 2017, "gradientStrength": "33mT/m", "warranty": "12 months"}',
  6800000,
  true,
  true,
  ARRAY['https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg'],
  'Delhi'
),
(
  'Philips Allura Xper FD20 Cath Lab',
  'Single plane flat detector cath lab system. Ideal for cardiac catheterization and interventional radiology. Complete with injector and hemodynamic system.',
  'Philips',
  'Cath Lab',
  'Indian Refurbished',
  '{"detectorSize": "20cm", "rotationSpeed": "25deg/s", "manufacturingYear": 2016, "flatDetector": true, "warranty": "6 months"}',
  8500000,
  true,
  true,
  ARRAY['https://images.pexels.com/photos/3376790/pexels-photo-3376790.jpeg'],
  'Karnataka'
),
(
  'GE Logiq E10 Premium Ultrasound',
  'AI-enhanced ultrasound platform for radiology and OB/GYN. 4D imaging capability with premium probe set included.',
  'GE',
  'USG',
  'Pre-Owned',
  '{"probes": ["C1-6", "L3-12", "E8C"], "4DCapable": true, "manufacturingYear": 2020, "aiEnhanced": true, "warranty": "6 months"}',
  950000,
  true,
  true,
  ARRAY['https://images.pexels.com/photos/4226119/pexels-photo-4226119.jpeg'],
  'Tamil Nadu'
),
(
  'Siemens Ysio DR X-Ray System',
  'Digital radiography system with wireless detector. High throughput for emergency and general radiology departments.',
  'Siemens',
  'X-Ray',
  'Imported Refurbished',
  '{"detectorType": "Wireless DR", "detectorSize": "43x43cm", "manufacturingYear": 2019, "throughput": "High", "warranty": "12 months"}',
  1200000,
  true,
  true,
  ARRAY['https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg'],
  'Gujarat'
),
(
  'Toshiba Aquilion 64 Slice CT Scanner',
  'Reliable 64-slice CT scanner with excellent image quality. Fully serviced and calibrated. Ideal for secondary care hospitals.',
  'Toshiba',
  'CT',
  'Indian Refurbished',
  '{"sliceCount": 64, "tubeCondition": "Tested Good", "manufacturingYear": 2015, "gantryBore": "72cm", "warranty": "6 months"}',
  2800000,
  false,
  true,
  ARRAY['https://images.pexels.com/photos/3376790/pexels-photo-3376790.jpeg'],
  'Rajasthan'
),
(
  'Philips Ingenia 3.0T MRI Scanner',
  'High-field 3.0T MRI with dStream architecture for superior SNR. Ideal for research and advanced neurological imaging.',
  'Philips',
  'MRI',
  'Imported Refurbished',
  '{"teslaStrength": "3.0T", "boreDiameter": "60cm", "channels": 32, "manufacturingYear": 2019, "warranty": "12 months"}',
  12500000,
  true,
  true,
  ARRAY['https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg'],
  'Telangana'
),
(
  'X-Ray Tube Replacement Kit - Siemens Compatible',
  'OEM-grade X-ray tube assembly compatible with Siemens Multix Impact and Ysio series. Tested and certified.',
  'Siemens',
  'Spares',
  'New',
  '{"compatibility": "Siemens Multix/Ysio", "heatCapacity": "300kHU", "warranty": "6 months", "certifiedOEM": true}',
  180000,
  true,
  true,
  ARRAY['https://images.pexels.com/photos/4226119/pexels-photo-4226119.jpeg'],
  'Maharashtra'
);

-- Insert sample leads
INSERT INTO leads (name, phone, email, institution_name, city, region_state, message, requirement_type, status) VALUES
('Dr. Rajesh Kumar', '+91-9876543210', 'rajesh@cityhospital.com', 'City General Hospital', 'Mumbai', 'Maharashtra', 'Looking for a 64 or 128 slice CT scanner for our radiology department expansion.', 'Buy', 'New'),
('Mr. Suresh Patel', '+91-9988776655', 'suresh@medicenter.com', 'Medi Center Pvt Ltd', 'Ahmedabad', 'Gujarat', 'We have a 2014 GE MRI system we want to sell. Machine in good condition.', 'Sell/Buyback', 'Contacted'),
('Dr. Priya Nair', '+91-8877665544', 'priya@apollocare.com', 'Apollo Care Diagnostics', 'Kochi', 'Kerala', 'Need AMC for our Siemens CT scanner. Currently out of warranty.', 'Service/AMC', 'In-Negotiation'),
('Mr. Arun Sharma', '+91-7766554433', null, 'Max Diagnostics', 'Delhi', 'Delhi', 'AERB license renewal assistance required for our X-Ray unit.', 'AERB', 'New');
