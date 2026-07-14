insert into accounts (id, type, name, status, price_tier, credit_limit, balance, service_area, license_number) values
  ('10000000-0000-0000-0000-000000000001', 'internal', 'Summit HVAC Supply', 'active', 'internal', 0, 0, 'CA, OR, WA, NV, AZ', null),
  ('10000000-0000-0000-0000-000000000002', 'dealer', 'Bay Area Mechanical Supply', 'active', 'gold', 75000, 8420, 'California', 'C20-983422'),
  ('10000000-0000-0000-0000-000000000003', 'installer', 'Summit HVAC Installers', 'active', 'standard', 25000, 1280, 'California', 'C20-771144'),
  ('10000000-0000-0000-0000-000000000004', 'homeowner', 'Maria Chen Residence', 'active', 'retail_referral', 0, 0, 'San Jose, CA', null),
  ('10000000-0000-0000-0000-000000000005', 'supplier', 'TCL HVAC North America', 'active', 'supplier', 0, 0, null, null);

insert into contacts (account_id, name, email, phone, role) values
  ('10000000-0000-0000-0000-000000000002', 'Andre Lewis', 'andre@bayareamech.example', '(415) 555-0144', 'Purchasing Manager'),
  ('10000000-0000-0000-0000-000000000003', 'Nina Patel', 'nina@summithvac.example', '(510) 555-0198', 'Owner'),
  ('10000000-0000-0000-0000-000000000004', 'Maria Chen', 'maria.chen@example.com', '(408) 555-0188', 'Homeowner');

insert into product_series (id, slug, name, family, type, image, category, description) values
  ('20000000-0000-0000-0000-000000000001', 'breezein', 'BreezeIN Series', 'TCL BreezeIN', 'High-efficiency inverter split AC', '/products/breezein.png', 'ductless', 'High-efficiency inverter split AC'),
  ('20000000-0000-0000-0000-000000000002', 'freshin', 'FreshIN Series', 'TCL FreshIN', 'Fresh air supply split system', '/products/freshin.png', 'ventilation', 'Fresh air supply split system'),
  ('20000000-0000-0000-0000-000000000003', 'elite', 'Elite Series', 'TCL Elite', 'Premium split inverter AC', '/products/elite.png', 'ductless', 'Premium split inverter AC'),
  ('20000000-0000-0000-0000-000000000004', 'light-commercial', 'Light Commercial Series', 'TCL Light Commercial', 'Ceiling cassette, floor-ceiling, ducted systems', '/products/light-commercial.png', 'commercial', 'Ceiling cassette, floor-ceiling, ducted systems'),
  ('20000000-0000-0000-0000-000000000005', 'multi-zone', 'Multi-Zone Systems', 'TCL Multi-Zone', 'Inverter outdoor unit + multiple indoor units', '/products/multi-zone.jpg', 'ductless', 'Inverter outdoor unit + multiple indoor units'),
  ('20000000-0000-0000-0000-000000000006', 'central-system', 'Central System Units', 'TCL Central Ducted', 'Central inverter systems', '/products/central-system.png', 'ducted', 'Central inverter systems');

insert into certifications (id, name, issuer, href, image) values
  ('30000000-0000-0000-0000-000000000001', 'AHRI Certified', 'AHRI', 'https://www.ahridirectory.org/', '/certifications/ahri-certified.png'),
  ('30000000-0000-0000-0000-000000000002', 'ENERGY STAR', 'ENERGY STAR', 'https://www.energystar.gov/', '/certifications/energy-star.png'),
  ('30000000-0000-0000-0000-000000000003', 'ETL Intertek', 'Intertek', 'https://www.intertek.com/marks/etl/', '/certifications/etl-intertek.png'),
  ('30000000-0000-0000-0000-000000000004', 'NEEP Listed', 'NEEP', 'https://neep.org/', '/certifications/neep.png');

insert into skus (id, series_id, sku, model_number, title, btu, voltage, unit_type, cost, dealer_price, msrp, dimensions, weight_lbs, refrigerant, ahri_reference, warranty_compressor, warranty_parts) values
  ('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'TCL-BRZ-09HP-230', 'BREEZEIN-09-230V', 'BreezeIN 9k Wall Mount Heat Pump', 9000, '208/230V', 'single-zone wall mount', 590, 865, 1299, '34 x 12 x 9 in', 31, 'R-32', 'AHRI-9482101', '7-year', '5-year'),
  ('40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'TCL-BRZ-24HP-230', 'BREEZEIN-24-230V', 'BreezeIN 24k Wall Mount Heat Pump', 24000, '208/230V', 'single-zone wall mount', 1120, 1585, 2349, '43 x 13 x 10 in', 43, 'R-32', 'AHRI-9482102', '7-year', '5-year'),
  ('40000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', 'TCL-FRS-12IAQ-230', 'FRESHIN-12-230V', 'FreshIN 12k Fresh Air Split', 12000, '208/230V', 'fresh-air wall mount', 770, 1095, 1649, '36 x 13 x 10 in', 36, 'R-32', 'AHRI-9482201', '7-year', '5-year'),
  ('40000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000003', 'TCL-ELT-09HP-230', 'ELITE-09-230V', 'Elite 9k Premium Heat Pump', 9000, '208/230V', 'single-zone wall mount', 735, 1090, 1699, '35 x 12 x 9 in', 33, 'R-32', 'AHRI-9482301', '7-year', '5-year'),
  ('40000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000003', 'TCL-ELT-24HP-230', 'ELITE-24-230V', 'Elite 24k Premium Heat Pump', 24000, '208/230V', 'single-zone wall mount', 1325, 1885, 2799, '44 x 13 x 10 in', 46, 'R-32', 'AHRI-9482302', '7-year', '5-year'),
  ('40000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000004', 'TCL-LC-36CAS-230', 'LC-CASSETTE-36-230V', 'Light Commercial 36k Cassette System', 36000, '208/230V', 'ceiling cassette', 1880, 2595, 3899, '33 x 33 x 11 in', 78, 'R-32', 'AHRI-9482401', '7-year', '5-year'),
  ('40000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000005', 'TCL-MZ-36ODU-230', 'MULTIZONE-36-ODU', 'Multi-Zone 36k Outdoor Unit', 36000, '208/230V', 'multi-zone outdoor', 1660, 2345, 3499, '38 x 32 x 16 in', 142, 'R-32', 'AHRI-9482501', '7-year', '5-year'),
  ('40000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000006', 'TCL-CD-48AH-230', 'CENTRAL-48-AHU', 'Central Ducted 48k Air Handler System', 48000, '208/230V', 'central ducted', 2390, 3295, 4899, '53 x 22 x 24 in', 168, 'R-32', 'AHRI-9482601', '10-year', '5-year');

insert into sku_certifications (sku_id, certification_id)
select s.id, c.id from skus s cross join certifications c where c.name in ('AHRI Certified', 'ETL Intertek');
insert into sku_certifications (sku_id, certification_id)
select s.id, c.id from skus s join certifications c on c.name = 'ENERGY STAR' where s.sku not like 'TCL-LC%';

insert into sku_documents (sku_id, kind, title, storage_path) 
select id, 'spec_sheet', title || ' Spec Sheet', 'mock-documents/spec-sheets/' || sku || '.pdf' from skus;
insert into sku_documents (sku_id, kind, title, storage_path)
select id, 'install_manual', title || ' Install Manual', 'mock-documents/install-manuals/' || sku || '.pdf' from skus;

insert into warehouses (id, code, name, address, is_primary) values
  ('50000000-0000-0000-0000-000000000001', 'NWK', 'Newark Fulfillment Center', '5437 Central Ave., Suite 10, Newark, CA 94560', true);

insert into bins (id, warehouse_id, code, zone) values
  ('51000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'A-01', 'ductless'),
  ('51000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000001', 'B-04', 'premium'),
  ('51000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000001', 'C-02', 'commercial'),
  ('51000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000001', 'D-01', 'ducted');

insert into inventory_lots (sku_id, warehouse_id, bin_id, lot_code, on_hand, reserved, reorder_point) values
  ('40000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', '51000000-0000-0000-0000-000000000001', 'NWK-BRZ09-0426', 42, 6, 8),
  ('40000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000001', '51000000-0000-0000-0000-000000000001', 'NWK-BRZ24-0426', 18, 4, 6),
  ('40000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000001', '51000000-0000-0000-0000-000000000001', 'NWK-FRS12-0426', 5, 3, 6),
  ('40000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000001', '51000000-0000-0000-0000-000000000002', 'NWK-ELT09-0426', 24, 2, 8),
  ('40000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000001', '51000000-0000-0000-0000-000000000002', 'NWK-ELT24-0426', 7, 7, 6),
  ('40000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000001', '51000000-0000-0000-0000-000000000003', 'NWK-LC36-0426', 3, 1, 4),
  ('40000000-0000-0000-0000-000000000007', '50000000-0000-0000-0000-000000000001', '51000000-0000-0000-0000-000000000003', 'NWK-MZ36-0426', 11, 5, 5),
  ('40000000-0000-0000-0000-000000000008', '50000000-0000-0000-0000-000000000001', '51000000-0000-0000-0000-000000000004', 'NWK-CD48-0426', 2, 2, 3);

insert into dealer_applications (company, contact_name, email, phone, license_number, service_area, business_type, monthly_volume, brands, notes, status) values
  ('Pacific Heat Pump Pros', 'Elena Torres', 'elena@pacifichpp.example', '(925) 555-0102', 'C20-664488', 'ca', 'contractor', '6-20', 'Daikin, Mitsubishi', 'Looking for value line with good warranty support.', 'pending_review');

insert into quote_requests (id, account_id, name, email, phone, need, status) values
  ('60000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Andre Lewis', 'andre@bayareamech.example', '(415) 555-0144', 'Three Elite 9k systems for San Mateo tenant improvement.', 'new');

insert into quote_request_lines (quote_request_id, series_slug, product_name, quantity) values
  ('60000000-0000-0000-0000-000000000001', 'elite', 'Elite Series', 3);

insert into quotes (id, quote_number, account_id, status, subtotal, tax, total, valid_until) values
  ('61000000-0000-0000-0000-000000000001', 'Q-2026-1042', '10000000-0000-0000-0000-000000000002', 'sent', 3270, 294.30, 3564.30, current_date + interval '14 days');

insert into quote_lines (quote_id, sku_id, quantity, unit_price, line_total) values
  ('61000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000004', 3, 1090, 3270);

insert into sales_orders (id, order_number, quote_id, account_id, status, subtotal, total) values
  ('62000000-0000-0000-0000-000000000001', 'SO-2026-2217', '61000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'reserved', 3270, 3564.30);

insert into order_lines (id, order_id, sku_id, quantity, reserved_quantity, shipped_quantity, unit_price) values
  ('62100000-0000-0000-0000-000000000001', '62000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000004', 3, 3, 0, 1090);

insert into invoices (id, invoice_number, order_id, account_id, status, subtotal, tax, total, paid, balance, due_date) values
  ('63000000-0000-0000-0000-000000000001', 'INV-2026-1884', '62000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'open', 3270, 294.30, 3564.30, 0, 3564.30, current_date + interval '30 days'),
  ('63000000-0000-0000-0000-000000000002', 'INV-2026-1769', null, '10000000-0000-0000-0000-000000000002', 'overdue', 4855, 436.95, 5291.95, 436.25, 4855.70, current_date - interval '8 days');

insert into invoice_lines (invoice_id, description, quantity, unit_price, line_total) values
  ('63000000-0000-0000-0000-000000000001', 'Elite 9k Premium Heat Pump', 3, 1090, 3270),
  ('63000000-0000-0000-0000-000000000002', 'BreezeIN 24k Wall Mount Heat Pump', 2, 1585, 3170),
  ('63000000-0000-0000-0000-000000000002', 'BreezeIN 9k Wall Mount Heat Pump', 1, 865, 865);

insert into payments (invoice_id, account_id, amount, method, reference) values
  ('63000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 436.25, 'Mock ACH', 'PAY-DEMO-7781');

insert into purchase_orders (id, po_number, supplier_account_id, status, total, expected_at) values
  ('64000000-0000-0000-0000-000000000001', 'PO-2026-3311', '10000000-0000-0000-0000-000000000005', 'sent', 19580, current_date + interval '9 days');

insert into purchase_order_lines (purchase_order_id, sku_id, quantity, received_quantity, unit_cost) values
  ('64000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000005', 12, 0, 1325),
  ('64000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000008', 4, 0, 2390);

insert into receipts (purchase_order_id, receipt_number, warehouse_id) values
  ('64000000-0000-0000-0000-000000000001', 'RCV-2026-0417', '50000000-0000-0000-0000-000000000001');

insert into rmas (rma_number, order_id, account_id, sku_id, status, reason) values
  ('RMA-2026-019', '62000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000004', 'waiting', 'Indoor unit arrived with cabinet dent.');

insert into warranty_claims (claim_number, account_id, sku_id, serial_number, status, issue) values
  ('WR-2026-044', '10000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000001', 'TCLBRZ09-26-44192', 'open', 'Intermittent fan motor fault after startup.');

insert into rebate_cases (case_number, account_id, program, customer_name, status, required_documents) values
  ('REB-2026-082', '10000000-0000-0000-0000-000000000003', 'TECH Clean California', 'Maria Chen', 'open', array['AHRI certificate', 'Invoice', 'Install photos']);

insert into tasks (account_id, title, owner_role, status, due_at) values
  ('10000000-0000-0000-0000-000000000002', 'Follow up on Q-2026-1042 before quote expires', 'staff', 'open', now() + interval '2 days'),
  ('10000000-0000-0000-0000-000000000003', 'Collect serial number photo for warranty claim WR-2026-044', 'installer', 'open', now() + interval '1 day'),
  ('10000000-0000-0000-0000-000000000004', 'Match homeowner with South Bay installer', 'staff', 'open', now() + interval '4 hours');

insert into activity_log (account_id, event, entity_type, entity_id) values
  ('10000000-0000-0000-0000-000000000002', 'Quote sent to dealer', 'quote', '61000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000002', 'Invoice opened with mock AR balance', 'invoice', '63000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000004', 'Homeowner referral case created', 'task', null);

-- ── Bay Area delivery zones (served from the Newark, CA warehouse) ──────────
insert into delivery_zones (zip, label, warehouse_id, local_delivery_eligible, delivery_fee, free_delivery_over, lead_time_hours) values
  ('94560', 'Newark',        '50000000-0000-0000-0000-000000000001', true, 0,  0,    4),
  ('94538', 'Fremont',       '50000000-0000-0000-0000-000000000001', true, 35, 2000, 8),
  ('94587', 'Union City',    '50000000-0000-0000-0000-000000000001', true, 35, 2000, 8),
  ('94544', 'Hayward',       '50000000-0000-0000-0000-000000000001', true, 45, 2000, 24),
  ('94601', 'Oakland',       '50000000-0000-0000-0000-000000000001', true, 55, 2500, 24),
  ('95131', 'San Jose',      '50000000-0000-0000-0000-000000000001', true, 55, 2500, 24),
  ('94103', 'San Francisco', '50000000-0000-0000-0000-000000000001', true, 75, 3000, 24),
  ('94303', 'Palo Alto',     '50000000-0000-0000-0000-000000000001', true, 65, 3000, 24)
on conflict (zip) do nothing;
