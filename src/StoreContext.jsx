import { createContext, useState, useContext, useCallback } from 'react';

// ════════════════════════════════════════════════════════════════
// SEED DATA
// ════════════════════════════════════════════════════════════════

const SEED_PRODUCTS = [
  { id: 1, name: "Handmade Macramé Wall Hanging", category: "Handmade Decor", subCategory: "Wall & Home Decor", originalPrice: 999, salePrice: 599, costPrice: 280, discount: "SAVE 40%", image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Macrame+Hanging+A", image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Macrame+Hanging+B", rating: 4.8, reviewsCount: 48, badge: "BESTSELLER", badgeType: "bestseller", colors: ["#EEDFC6","#C07850","#7A9E7E"], colorNames: ["Natural Ivory","Terracotta","Sage Green"], sizes: ["Standard (2.5x2 ft)","Large (3.5x2.5 ft)"], description: "Introduce a gorgeous bohemian warmth to your spaces. Expertly hand-woven by Indian women artisans.", materials: "100% natural organic cotton cord, premium hand-polished solid pine wood dowel.", shipping: "Dispatched in 24 hours. Standard delivery across India in 3-5 business days.", sku: "MC-WD-0001", stock: 24, lowStockThreshold: 10, weight: 450, status: "published", featured: true, showIn: ["bestsellers"], tags: ["handmade","eco-friendly","boho"], uploadedBy: "admin", createdAt: "2026-01-15" },
  { id: 2, name: "Embroidery Thread Kit — 48 Colors", category: "Craft Supplies", subCategory: "Fabric & Fibre", originalPrice: 599, salePrice: 349, costPrice: 150, discount: "SAVE 42%", image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Embroidery+Threads+A", image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Embroidery+Threads+B", rating: 4.7, reviewsCount: 36, badge: "SAVE 42%", badgeType: "save", colors: ["#F5E6CC"], colorNames: ["Assorted Rainbow Set"], sizes: ["48 Skeins Pack"], description: "A premium curated box of 48 brilliant colored embroidery threads.", materials: "100% long-staple mercerized organic cotton.", shipping: "Dispatched in 24 hours. Delivers in 3-5 days.", sku: "MC-CS-0002", stock: 52, lowStockThreshold: 15, weight: 200, status: "published", featured: false, showIn: [], tags: ["embroidery","thread","craft supplies"], uploadedBy: "admin", createdAt: "2026-01-20" },
  { id: 3, name: "DIY Jewellery Making Starter Kit", category: "DIY Kits", subCategory: "Jewellery Kits", originalPrice: 1499, salePrice: 799, costPrice: 380, discount: "SAVE 47%", image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Jewellery+Kit+A", image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Jewellery+Kit+B", rating: 4.9, reviewsCount: 82, badge: "BESTSELLER", badgeType: "bestseller", colors: ["#D4A96A"], colorNames: ["Beads & Findings Mix"], sizes: ["Complete Starter Box"], description: "Everything you need to craft your own beautiful earrings, bracelets, and necklaces.", materials: "Acrylic and glass beads, lead-free brass findings, carbon steel pliers.", shipping: "Dispatched in 24 hours. Delivers in 4 business days.", sku: "MC-DK-0003", stock: 18, lowStockThreshold: 10, weight: 600, status: "published", featured: true, showIn: ["bestsellers"], tags: ["diy","jewellery","beginner"], uploadedBy: "admin", createdAt: "2026-02-01" },
  { id: 4, name: "Terracotta Pendant Necklace", category: "Handmade Decor", subCategory: "Wearables & Gifts", originalPrice: 449, salePrice: 249, costPrice: 90, discount: "SAVE 45%", image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Terracotta+Pendant+A", image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Terracotta+Pendant+B", rating: 4.6, reviewsCount: 19, badge: "SAVE 45%", badgeType: "save", colors: ["#C07850","#D4A96A"], colorNames: ["Natural Clay","Gold Detailing"], sizes: ["One Size (Adjustable)"], description: "An authentic, handcrafted clay necklace fired and hand-painted by traditional potters.", materials: "Fired natural clay, organic acrylic colors, cotton thread loop.", shipping: "Delivers in 5 days.", sku: "MC-WD-0004", stock: 35, lowStockThreshold: 10, weight: 50, status: "published", featured: false, showIn: [], tags: ["handmade","terracotta","jewellery"], uploadedBy: "admin", createdAt: "2026-02-05" },
  { id: 5, name: "Fabric Painting Set — 12 Colors", category: "Craft Supplies", subCategory: "Colour & Paint", originalPrice: 799, salePrice: 449, costPrice: 200, discount: "SAVE 44%", image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Fabric+Paints+A", image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Fabric+Paints+B", rating: 4.7, reviewsCount: 22, badge: "SAVE 44%", badgeType: "save", colors: ["#FDF8F0"], colorNames: ["Standard 12 Colors Set"], sizes: ["12 Tubes x 20ml"], description: "Artist-grade fabric paints designed specifically for textile arts.", materials: "Non-toxic resin-acrylic base pigments.", shipping: "Dispatched in 24 hours. Delivers in 3 days.", sku: "MC-CS-0005", stock: 40, lowStockThreshold: 10, weight: 350, status: "published", featured: false, showIn: [], tags: ["fabric paint","art","textile"], uploadedBy: "admin", createdAt: "2026-02-10" },
  { id: 6, name: "Crochet Yarn Bundle — Pastel Set", category: "Craft Supplies", subCategory: "Fabric & Fibre", originalPrice: 999, salePrice: 599, costPrice: 250, discount: "SAVE 40%", image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Pastel+Yarn+A", image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Pastel+Yarn+B", rating: 4.8, reviewsCount: 30, badge: "SAVE 40%", badgeType: "save", colors: ["#F5E6CC","#C48B9F","#7A9E7E"], colorNames: ["Pastel Cream","Pastel Rose","Pastel Sage"], sizes: ["Set of 5 Balls (500g total)"], description: "Wonderfully soft, multi-ply acrylic yarn balls curated in soothing pastel hues.", materials: "100% premium soft-grade anti-pilling acrylic fibers.", shipping: "Shipped in eco-friendly reusable cotton pouch. Delivers in 4 business days.", sku: "MC-CS-0006", stock: 28, lowStockThreshold: 10, weight: 520, status: "published", featured: false, showIn: [], tags: ["crochet","yarn","pastel"], uploadedBy: "admin", createdAt: "2026-02-15" },
  { id: 7, name: "Handmade Jute Gift Hamper", category: "Handmade Decor", subCategory: "Wearables & Gifts", originalPrice: 1499, salePrice: 899, costPrice: 400, discount: "SAVE 40%", image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Jute+Hamper+A", image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Jute+Hamper+B", rating: 4.8, reviewsCount: 52, badge: "BESTSELLER", badgeType: "bestseller", colors: ["#D4A96A"], colorNames: ["Natural Golden Jute"], sizes: ["Medium Basket","Large Basket"], description: "A gorgeous luxury gift hamper wrapped in hand-woven organic jute fiber.", materials: "Organic biodegradable jute ropes, recycled cardboard frames.", shipping: "Delivers in 3-5 days.", sku: "MC-WD-0007", stock: 8, lowStockThreshold: 10, weight: 800, status: "published", featured: true, showIn: ["bestsellers"], tags: ["gift","jute","hamper"], uploadedBy: "admin", createdAt: "2026-02-20" },
  { id: 8, name: "Air-dry Clay Kit for Beginners", category: "DIY Kits", subCategory: "Clay & Resin", originalPrice: 1199, salePrice: 699, costPrice: 300, discount: "SAVE 42%", image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Air+Dry+Clay+A", image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Air+Dry+Clay+B", rating: 4.7, reviewsCount: 41, badge: "SAVE 42%", badgeType: "save", colors: ["#FDF8F0","#C07850"], colorNames: ["Stone White","Terracotta Clay"], sizes: ["1 kg Pack"], description: "Unlock your pottery potential at home. Air-drying clay hardens naturally in 24 hours.", materials: "100% organic kaolin mineral clay.", shipping: "Delivers in 4 days.", sku: "MC-DK-0008", stock: 3, lowStockThreshold: 10, weight: 1100, status: "published", featured: true, showIn: ["bestsellers"], tags: ["clay","diy","beginner","pottery"], uploadedBy: "admin", createdAt: "2026-03-01" },
  { id: 9, name: "Pressed Flower Wood Journal", category: "Seeds & Nature Craft", subCategory: "Nature Journal Sets", originalPrice: 899, salePrice: 549, costPrice: 220, discount: "SAVE 39%", image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Flower+Journal+A", image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Flower+Journal+B", rating: 4.9, reviewsCount: 14, badge: "NEW", badgeType: "new", colors: ["#6B3A2A"], colorNames: ["Walnut Finish"], sizes: ["A5 (200 Deckle Pages)"], description: "Write your thoughts on luxurious, tree-free, handmade recycled cotton deckle edge paper.", materials: "Real dried botanical specimens, birchwood, deckle cotton paper.", shipping: "Delivers in 3 business days.", sku: "MC-NC-0009", stock: 45, lowStockThreshold: 10, weight: 380, status: "published", featured: true, showIn: ["new_arrivals"], tags: ["journal","nature","pressed flower"], uploadedBy: "admin", createdAt: "2026-04-01" },
  { id: 10, name: "Ceramic Mandala Diya Set (Set of 6)", category: "Handmade Decor", subCategory: "Festival & Seasonal", originalPrice: 499, salePrice: 299, costPrice: 120, discount: "SAVE 40%", image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Mandala+Diya+A", image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Mandala+Diya+B", rating: 4.9, reviewsCount: 110, badge: "NEW", badgeType: "new", colors: ["#C48B9F","#D4A96A","#7A9E7E"], colorNames: ["Lotus Pink","Royal Gold","Sage Teal"], sizes: ["Set of 6"], description: "Exquisite clay diya lamps hand-cast and hand-painted with detailed mandala designs.", materials: "Fired terracotta clay, high-grade glossy metallic paint coatings.", shipping: "Delivers in 3 days.", sku: "MC-WD-0010", stock: 60, lowStockThreshold: 15, weight: 300, status: "published", featured: true, showIn: ["new_arrivals"], tags: ["diya","mandala","festival","diwali"], uploadedBy: "admin", createdAt: "2026-04-10" },
  { id: 11, name: "Eco-friendly Soy Wax Candle (Set of 3)", category: "Handmade Decor", subCategory: "Wall & Home Decor", originalPrice: 699, salePrice: 399, costPrice: 160, discount: "SAVE 43%", image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Soy+Candles+A", image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Soy+Candles+B", rating: 4.7, reviewsCount: 16, badge: "NEW", badgeType: "new", colors: ["#F5E6CC"], colorNames: ["Vanilla & Lavender Blend"], sizes: ["Set of 3 Jars"], description: "Indulge in organic relaxation. Hand-poured using clean-burning soy wax.", materials: "100% natural biodegradable soy wax, lead-free cotton wicks, essential oils.", shipping: "Delivers in 4 business days.", sku: "MC-WD-0011", stock: 32, lowStockThreshold: 10, weight: 650, status: "published", featured: false, showIn: ["new_arrivals"], tags: ["candle","soy wax","eco-friendly"], uploadedBy: "admin", createdAt: "2026-04-15" },
  { id: 12, name: "Macramé Plant Hanger DIY Kit", category: "DIY Kits", subCategory: "Macramé Kits", originalPrice: 499, salePrice: 299, costPrice: 110, discount: "SAVE 40%", image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Plant+Hanger+Kit+A", image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Plant+Hanger+Kit+B", rating: 4.6, reviewsCount: 28, badge: "NEW", badgeType: "new", colors: ["#EEDFC6","#7A9E7E"], colorNames: ["Natural Beige","Eco Sage Green"], sizes: ["Single Pot Size"], description: "Craft a beautiful hanging plant container. Ideal for beginners.", materials: "Premium organic cotton cords, solid wood rings, wood beads.", shipping: "Delivers in 3 days.", sku: "MC-DK-0012", stock: 22, lowStockThreshold: 10, weight: 250, status: "published", featured: false, showIn: ["new_arrivals"], tags: ["macrame","plant hanger","diy"], uploadedBy: "admin", createdAt: "2026-04-20" },
  { id: 13, name: "Glass Bead Jewelry Making Kit", category: "DIY Kits", subCategory: "Jewellery Kits", originalPrice: 599, salePrice: 349, costPrice: 140, discount: "SAVE 42%", image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Glass+Bead+Kit+A", image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Glass+Bead+Kit+B", rating: 4.5, reviewsCount: 15, badge: "NEW", badgeType: "new", colors: ["#C48B9F"], colorNames: ["Pastel Blossom Mix"], sizes: ["Standard Box"], description: "An interactive, fun kit featuring round glass beads, crystal beads, and charms.", materials: "Real glass micro-beads, elastic silicone thread strings.", shipping: "Delivers in 4 business days.", sku: "MC-DK-0013", stock: 0, lowStockThreshold: 10, weight: 320, status: "published", featured: false, showIn: ["new_arrivals"], tags: ["glass bead","jewellery","bracelet"], uploadedBy: "admin", createdAt: "2026-05-01" },
  { id: 14, name: "Felt Animal Sewing DIY Kit", category: "DIY Kits", subCategory: "Kids Kits (Age 5–12)", originalPrice: 799, salePrice: 449, costPrice: 180, discount: "SAVE 44%", image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Felt+Sewing+A", image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Felt+Sewing+B", rating: 4.8, reviewsCount: 39, badge: "NEW", badgeType: "new", colors: ["#7A9E7E"], colorNames: ["Woodland Forest Animals"], sizes: ["Age 5-12 Years"], description: "Introduce kids to handcrafting. Contains pre-punched felt templates.", materials: "Premium soft wool-felt templates, plastic safety needles, fiber fillings.", shipping: "Delivers in 4 days.", sku: "MC-DK-0014", stock: 15, lowStockThreshold: 10, weight: 280, status: "published", featured: false, showIn: ["new_arrivals"], tags: ["felt","kids","sewing","animals"], uploadedBy: "admin", createdAt: "2026-05-05" },
  { id: 15, name: "Organic Cotton Yarn Pack (5 Colors)", category: "Craft Supplies", subCategory: "Fabric & Fibre", originalPrice: 899, salePrice: 499, costPrice: 200, discount: "SAVE 44%", image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Cotton+Yarn+A", image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Cotton+Yarn+B", rating: 4.7, reviewsCount: 24, badge: "NEW", badgeType: "new", colors: ["#F5E6CC","#C07850","#C48B9F","#7A9E7E","#6B3A2A"], colorNames: ["Warm Earth Pack"], sizes: ["5 Balls x 100g"], description: "Luxurious, skin-friendly yarn dyed using eco-conscious organic vegetable colors.", materials: "100% organic combed cotton fibers.", shipping: "Delivers in 3-5 business days.", sku: "MC-CS-0015", stock: 38, lowStockThreshold: 10, weight: 510, status: "published", featured: false, showIn: ["new_arrivals"], tags: ["cotton yarn","organic","crochet"], uploadedBy: "admin", createdAt: "2026-05-10" },
  { id: 16, name: "Wooden Block Printing Kit", category: "DIY Kits", subCategory: "Beginner Kits", originalPrice: 1199, salePrice: 699, costPrice: 320, discount: "SAVE 42%", image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Block+Print+A", image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Block+Print+B", rating: 4.9, reviewsCount: 33, badge: "NEW", badgeType: "new", colors: ["#6B3A2A"], colorNames: ["Teak Wood Blocks"], sizes: ["Standard kit"], description: "Try the age-old art of Indian hand-block printing.", materials: "Hand-carved solid teakwood blocks, organic paint pigments.", shipping: "Delivers in 5 business days.", sku: "MC-DK-0016", stock: 12, lowStockThreshold: 10, weight: 750, status: "published", featured: false, showIn: ["new_arrivals"], tags: ["block print","wooden","traditional"], uploadedBy: "admin", createdAt: "2026-05-15" },
  { id: 17, name: "Craft Scissors & Rotary Cutter Set", category: "Tools & Accessories", subCategory: "Cutting Tools", originalPrice: 899, salePrice: 499, costPrice: 200, discount: "SAVE 44%", image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Scissors+Cutter+A", image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Scissors+Cutter+B", rating: 4.6, reviewsCount: 17, badge: "BESTSELLER", badgeType: "bestseller", colors: ["#6B3A2A"], colorNames: ["Rosewood Accents"], sizes: ["Standard Tools"], description: "A professional-grade cutting duo with rotary cutter and dressmaking shears.", materials: "Tungsten alloy steel, stainless steel shears, carbon ABS.", shipping: "Delivers in 4 business days.", sku: "MC-TA-0017", stock: 5, lowStockThreshold: 10, weight: 400, status: "published", featured: true, showIn: ["bestsellers"], tags: ["scissors","cutter","tools"], uploadedBy: "admin", createdAt: "2026-03-15" },
  { id: 18, name: "Ergonomic Crochet Hook Set (14 sizes)", category: "Tools & Accessories", subCategory: "Needles & Hooks", originalPrice: 899, salePrice: 549, costPrice: 220, discount: "SAVE 39%", image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Crochet+Hook+A", image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Crochet+Hook+B", rating: 4.8, reviewsCount: 104, badge: "BESTSELLER", badgeType: "bestseller", colors: ["#C07850"], colorNames: ["Multi-color Grips"], sizes: ["14 Hook Sizes (2mm - 10mm)"], description: "Minimize hand fatigue with ultra-comfortable soft silicone rubber grips.", materials: "Polished smooth aluminum hooks, soft organic silicone handles.", shipping: "Delivers in 3 days.", sku: "MC-TA-0018", stock: 65, lowStockThreshold: 15, weight: 180, status: "published", featured: true, showIn: ["bestsellers"], tags: ["crochet hook","ergonomic","tools"], uploadedBy: "admin", createdAt: "2026-03-20" },
  { id: 19, name: "Fine Detail Paint Brushes (9pcs)", category: "Tools & Accessories", subCategory: "Brushes & Organisers", originalPrice: 449, salePrice: 249, costPrice: 90, discount: "SAVE 45%", image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Detail+Brushes+A", image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Detail+Brushes+B", rating: 4.7, reviewsCount: 42, badge: "BESTSELLER", badgeType: "bestseller", colors: ["#D4A96A"], colorNames: ["Polished Birchwood Handles"], sizes: ["9 Brush Tips (000 to 6)"], description: "Achieve microscopic precision for mandala dotting, miniature styling.", materials: "Synthetic nylon hairs, birchwood handles, rustproof copper ferules.", shipping: "Delivers in 3 business days.", sku: "MC-TA-0019", stock: 48, lowStockThreshold: 10, weight: 120, status: "published", featured: true, showIn: ["bestsellers"], tags: ["brushes","paint","detail"], uploadedBy: "admin", createdAt: "2026-03-25" },
  { id: 20, name: "Folding Wooden Thread Rack Organizer", category: "Tools & Accessories", subCategory: "Storage & Organisers", originalPrice: 1299, salePrice: 799, costPrice: 350, discount: "SAVE 38%", image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Thread+Rack+A", image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Thread+Rack+B", rating: 4.6, reviewsCount: 26, badge: "BESTSELLER", badgeType: "bestseller", colors: ["#EEDFC6"], colorNames: ["Natural Pine Wood"], sizes: ["Holds 30 Spools"], description: "Clear up your craft table. Premium foldable rack stores up to 30 spools.", materials: "100% sustainably sourced solid natural pinewood.", shipping: "Delivers in 5 days.", sku: "MC-TA-0020", stock: 10, lowStockThreshold: 10, weight: 900, status: "published", featured: false, showIn: ["bestsellers"], tags: ["organizer","thread rack","wooden"], uploadedBy: "admin", createdAt: "2026-04-01" },
  { id: 21, name: "Resin Art Coasters (Set of 4)", category: "Handmade Decor", subCategory: "Wall & Home Decor", originalPrice: 899, salePrice: 549, costPrice: 200, discount: "SAVE 39%", image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Resin+Coasters+A", image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Resin+Coasters+B", rating: 4.5, reviewsCount: 8, badge: "", badgeType: "", colors: ["#D4A96A","#7A9E7E"], colorNames: ["Gold Marble","Ocean Teal"], sizes: ["Set of 4"], description: "Stunning ocean-inspired resin coasters with real dried flowers embedded.", materials: "Premium UV resin, dried botanicals, cork backing.", shipping: "Delivers in 4 days.", sku: "MC-WD-0021", stock: 20, lowStockThreshold: 10, weight: 300, status: "pending", featured: false, showIn: [], tags: ["resin","coasters","home decor"], uploadedBy: "staff1", createdAt: "2026-06-18" },
];

const SEED_ORDERS = [
  { id: 1001, customer: { name: "Aarti Raghavan", email: "aarti.r@gmail.com", phone: "+91 98765 43210", address: "42, MG Road, Indiranagar, Bangalore 560038" }, items: [{ productId: 1, name: "Handmade Macramé Wall Hanging", variant: "Natural Ivory / Standard", qty: 1, price: 599, image: "https://placehold.co/80x80/F5E6CC/6B3A2A?text=Macrame" }], subtotal: 599, shipping: 0, discount: 0, tax: 108, total: 707, payment: { method: "UPI", status: "Paid", transactionId: "UPI2026051200001" }, status: "delivered", notes: "", createdAt: "2026-05-12", updatedAt: "2026-05-16" },
  { id: 1002, customer: { name: "Simran Dhawan", email: "simran.d@outlook.com", phone: "+91 87654 32109", address: "15, Park Street, Salt Lake, Kolkata 700091" }, items: [{ productId: 10, name: "Ceramic Mandala Diya Set", variant: "Royal Gold / Set of 6", qty: 2, price: 299, image: "https://placehold.co/80x80/F5E6CC/6B3A2A?text=Diya" }], subtotal: 598, shipping: 0, discount: 60, tax: 97, total: 635, payment: { method: "Card", status: "Paid", transactionId: "CARD2026052800002" }, status: "delivered", notes: "", createdAt: "2026-05-28", updatedAt: "2026-06-02" },
  { id: 1003, customer: { name: "Pooja Kulkarni", email: "pooja.k@yahoo.com", phone: "+91 76543 21098", address: "8, FC Road, Shivajinagar, Pune 411004" }, items: [{ productId: 9, name: "Pressed Flower Wood Journal", variant: "Walnut Finish / A5", qty: 1, price: 549, image: "https://placehold.co/80x80/F5E6CC/6B3A2A?text=Journal" }, { productId: 5, name: "Fabric Painting Set", variant: "12 Colors", qty: 1, price: 449, image: "https://placehold.co/80x80/F5E6CC/6B3A2A?text=Paints" }], subtotal: 998, shipping: 0, discount: 0, tax: 180, total: 1178, payment: { method: "Net Banking", status: "Paid", transactionId: "NB2026060300003" }, status: "shipped", notes: "Tracking: DTDC-MH-9876543", createdAt: "2026-06-03", updatedAt: "2026-06-05" },
  { id: 1004, customer: { name: "Nisha Jain", email: "nisha.j@gmail.com", phone: "+91 65432 10987", address: "23, Civil Lines, Moradabad 244001" }, items: [{ productId: 2, name: "Embroidery Thread Kit", variant: "48 Skeins", qty: 1, price: 349, image: "https://placehold.co/80x80/F5E6CC/6B3A2A?text=Thread" }], subtotal: 349, shipping: 49, discount: 0, tax: 72, total: 470, payment: { method: "COD", status: "Pending", transactionId: "" }, status: "processing", notes: "", createdAt: "2026-06-10", updatedAt: "2026-06-10" },
  { id: 1005, customer: { name: "Ravi Sharma", email: "ravi.s@gmail.com", phone: "+91 54321 09876", address: "101, Sector 15, Noida 201301" }, items: [{ productId: 3, name: "DIY Jewellery Making Kit", variant: "Complete Starter Box", qty: 1, price: 799, image: "https://placehold.co/80x80/F5E6CC/6B3A2A?text=Jewellery" }, { productId: 18, name: "Crochet Hook Set", variant: "14 Sizes", qty: 1, price: 549, image: "https://placehold.co/80x80/F5E6CC/6B3A2A?text=Hooks" }], subtotal: 1348, shipping: 0, discount: 135, tax: 218, total: 1431, payment: { method: "UPI", status: "Paid", transactionId: "UPI2026061500005" }, status: "pending", notes: "", createdAt: "2026-06-15", updatedAt: "2026-06-15" },
  { id: 1006, customer: { name: "Meera Patel", email: "meera.p@hotmail.com", phone: "+91 43210 98765", address: "7, Ashram Road, Navrangpura, Ahmedabad 380009" }, items: [{ productId: 7, name: "Handmade Jute Gift Hamper", variant: "Large Basket", qty: 1, price: 899, image: "https://placehold.co/80x80/F5E6CC/6B3A2A?text=Hamper" }], subtotal: 899, shipping: 0, discount: 90, tax: 146, total: 955, payment: { method: "Card", status: "Paid", transactionId: "CARD2026061700006" }, status: "shipped", notes: "Gift wrap requested", createdAt: "2026-06-17", updatedAt: "2026-06-19" },
  { id: 1007, customer: { name: "Anjali Verma", email: "anjali.v@gmail.com", phone: "+91 32109 87654", address: "56, Hazratganj, Lucknow 226001" }, items: [{ productId: 8, name: "Air-dry Clay Kit", variant: "Stone White / 1 kg", qty: 2, price: 699, image: "https://placehold.co/80x80/F5E6CC/6B3A2A?text=Clay" }], subtotal: 1398, shipping: 0, discount: 0, tax: 252, total: 1650, payment: { method: "UPI", status: "Paid", transactionId: "UPI2026061900007" }, status: "processing", notes: "", createdAt: "2026-06-19", updatedAt: "2026-06-20" },
  { id: 1008, customer: { name: "Kavita Reddy", email: "kavita.r@gmail.com", phone: "+91 21098 76543", address: "3, Banjara Hills, Hyderabad 500034" }, items: [{ productId: 16, name: "Wooden Block Printing Kit", variant: "Standard", qty: 1, price: 699, image: "https://placehold.co/80x80/F5E6CC/6B3A2A?text=Block+Print" }], subtotal: 699, shipping: 0, discount: 70, tax: 113, total: 742, payment: { method: "Card", status: "Paid", transactionId: "CARD2026062000008" }, status: "pending", notes: "", createdAt: "2026-06-20", updatedAt: "2026-06-20" },
  { id: 1009, customer: { name: "Priya Nair", email: "priya.n@yahoo.com", phone: "+91 10987 65432", address: "12, Marine Drive, Ernakulam, Kochi 682031" }, items: [{ productId: 11, name: "Soy Wax Candle Set", variant: "Set of 3", qty: 1, price: 399, image: "https://placehold.co/80x80/F5E6CC/6B3A2A?text=Candles" }, { productId: 4, name: "Terracotta Pendant Necklace", variant: "Natural Clay", qty: 1, price: 249, image: "https://placehold.co/80x80/F5E6CC/6B3A2A?text=Pendant" }], subtotal: 648, shipping: 0, discount: 0, tax: 117, total: 765, payment: { method: "UPI", status: "Refunded", transactionId: "UPI2026060800009" }, status: "cancelled", notes: "Customer requested cancellation — wrong size", createdAt: "2026-06-08", updatedAt: "2026-06-09" },
  { id: 1010, customer: { name: "Deepa Menon", email: "deepa.m@gmail.com", phone: "+91 09876 54321", address: "45, T. Nagar, Chennai 600017" }, items: [{ productId: 14, name: "Felt Animal Sewing DIY Kit", variant: "Age 5-12", qty: 3, price: 449, image: "https://placehold.co/80x80/F5E6CC/6B3A2A?text=Felt+Kit" }], subtotal: 1347, shipping: 0, discount: 135, tax: 218, total: 1430, payment: { method: "COD", status: "Pending", transactionId: "" }, status: "pending", notes: "Birthday gift — needs by June 25", createdAt: "2026-06-21", updatedAt: "2026-06-21" },
  { id: 1011, customer: { name: "Aarti Raghavan", email: "aarti.r@gmail.com", phone: "+91 98765 43210", address: "42, MG Road, Indiranagar, Bangalore 560038" }, items: [{ productId: 6, name: "Crochet Yarn Bundle", variant: "Pastel Cream / Set of 5", qty: 1, price: 599, image: "https://placehold.co/80x80/F5E6CC/6B3A2A?text=Yarn" }], subtotal: 599, shipping: 0, discount: 60, tax: 97, total: 636, payment: { method: "UPI", status: "Paid", transactionId: "UPI2026062200011" }, status: "pending", notes: "", createdAt: "2026-06-22", updatedAt: "2026-06-22" },
];

const SEED_CUSTOMERS = [
  { id: 1, name: "Aarti Raghavan", email: "aarti.r@gmail.com", phone: "+91 98765 43210", totalOrders: 3, totalSpent: 1942, joined: "2026-01-20", status: "active", avatar: "AR" },
  { id: 2, name: "Simran Dhawan", email: "simran.d@outlook.com", phone: "+91 87654 32109", totalOrders: 1, totalSpent: 635, joined: "2026-03-12", status: "active", avatar: "SD" },
  { id: 3, name: "Pooja Kulkarni", email: "pooja.k@yahoo.com", phone: "+91 76543 21098", totalOrders: 2, totalSpent: 1178, joined: "2026-02-28", status: "active", avatar: "PK" },
  { id: 4, name: "Nisha Jain", email: "nisha.j@gmail.com", phone: "+91 65432 10987", totalOrders: 1, totalSpent: 470, joined: "2026-04-15", status: "active", avatar: "NJ" },
  { id: 5, name: "Ravi Sharma", email: "ravi.s@gmail.com", phone: "+91 54321 09876", totalOrders: 1, totalSpent: 1431, joined: "2026-05-01", status: "active", avatar: "RS" },
  { id: 6, name: "Meera Patel", email: "meera.p@hotmail.com", phone: "+91 43210 98765", totalOrders: 1, totalSpent: 955, joined: "2026-03-22", status: "active", avatar: "MP" },
  { id: 7, name: "Anjali Verma", email: "anjali.v@gmail.com", phone: "+91 32109 87654", totalOrders: 1, totalSpent: 1650, joined: "2026-05-18", status: "active", avatar: "AV" },
  { id: 8, name: "Kavita Reddy", email: "kavita.r@gmail.com", phone: "+91 21098 76543", totalOrders: 1, totalSpent: 742, joined: "2026-06-01", status: "active", avatar: "KR" },
  { id: 9, name: "Priya Nair", email: "priya.n@yahoo.com", phone: "+91 10987 65432", totalOrders: 1, totalSpent: 765, joined: "2026-04-08", status: "blocked", avatar: "PN" },
  { id: 10, name: "Deepa Menon", email: "deepa.m@gmail.com", phone: "+91 09876 54321", totalOrders: 1, totalSpent: 1430, joined: "2026-06-10", status: "active", avatar: "DM" },
];

const SEED_COUPONS = [
  { id: 1, code: "CRAFT10", type: "percentage", value: 10, minOrder: 499, usageLimit: 100, usedCount: 47, applicableTo: "all", startDate: "2026-01-01", endDate: "2026-12-31", active: true },
  { id: 2, code: "WELCOME20", type: "percentage", value: 20, minOrder: 799, usageLimit: 50, usedCount: 12, applicableTo: "all", startDate: "2026-03-01", endDate: "2026-09-30", active: true },
  { id: 3, code: "FESTIVE30", type: "flat", value: 300, minOrder: 1499, usageLimit: 30, usedCount: 8, applicableTo: "category:DIY Kits", startDate: "2026-10-01", endDate: "2026-11-30", active: false },
  { id: 4, code: "FLAT50", type: "flat", value: 50, minOrder: 299, usageLimit: 200, usedCount: 156, applicableTo: "all", startDate: "2026-01-01", endDate: "2026-06-30", active: true },
];

const SEED_REVIEWS = [
  { id: 1, customerId: 1, customerName: "Aarti R.", productId: 1, productName: "Handmade Macramé Wall Hanging", rating: 5, text: "This kit was a delight! The cotton cord is so soft, and the step-by-step video instructions made it extremely easy for a beginner. The result looks premium in my living room.", date: "2026-06-03", status: "approved", adminReply: "Thank you so much, Aarti! We're thrilled to hear this. 💛" },
  { id: 2, customerId: 2, customerName: "Simran D.", productId: 10, productName: "Ceramic Mandala Diya Set", rating: 5, text: "So beautiful! The mandala paintings are incredibly detailed. I was worried they would break during shipping, but they came securely double-bubble-wrapped.", date: "2026-05-28", status: "approved", adminReply: "" },
  { id: 3, customerId: 3, customerName: "Pooja K.", productId: 9, productName: "Pressed Flower Wood Journal", rating: 5, text: "Such a beautiful, deeply feminine journal! The raw textured deckle paper is perfect for sketching and journaling. Highly recommend for unique gifting.", date: "2026-05-20", status: "approved", adminReply: "" },
  { id: 4, customerId: 4, customerName: "Nisha J.", productId: 2, productName: "Embroidery Thread Kit — 48 Colors", rating: 5, text: "48 gorgeous colors. They have a brilliant sheen and don't bleed or knot up badly when sewing. The package arrived in Moradabad in just 3 days.", date: "2026-05-12", status: "approved", adminReply: "Thanks for the lovely review, Nisha! Fast delivery is our promise. 🚀" },
  { id: 5, customerId: 5, customerName: "Ravi S.", productId: 3, productName: "DIY Jewellery Making Kit", rating: 4, text: "Great kit overall! My daughter loves it. Just wish there were more earring hooks included. The beads are beautiful though.", date: "2026-06-16", status: "pending", adminReply: "" },
  { id: 6, customerId: 6, customerName: "Meera P.", productId: 7, productName: "Handmade Jute Gift Hamper", rating: 3, text: "The hamper looks nice but one candle was slightly chipped on arrival. The jute basket itself is gorgeous quality though.", date: "2026-06-19", status: "pending", adminReply: "" },
  { id: 7, customerId: 10, customerName: "Deepa M.", productId: 14, productName: "Felt Animal Sewing DIY Kit", rating: 5, text: "Perfect for my 8 year old! She made a fox and an owl by herself. The safety needles are a great touch.", date: "2026-06-21", status: "pending", adminReply: "" },
];

const SEED_ADMIN_USERS = [
  { id: 1, name: "Priya Motherscraft", email: "admin@motherscraft.in", password: "admin123", role: "super_admin", phone: "+91 99999 00001", status: "active", lastLogin: "2026-06-22", avatar: "PM" },
  { id: 2, name: "Riya Kapoor", email: "manager@motherscraft.in", password: "manager123", role: "manager", phone: "+91 99999 00002", status: "active", lastLogin: "2026-06-22", avatar: "RK" },
  { id: 3, name: "Aman Singh", email: "staff@motherscraft.in", password: "staff123", role: "staff", phone: "+91 99999 00003", status: "active", lastLogin: "2026-06-21", avatar: "AS" },
  { id: 4, name: "Neha Gupta", email: "support@motherscraft.in", password: "support123", role: "support", phone: "+91 99999 00004", status: "active", lastLogin: "2026-06-20", avatar: "NG" },
];

const SEED_ACTIVITY_LOGS = [
  { id: 1, adminId: 2, adminName: "Riya Kapoor", role: "manager", action: "stock_update", details: "Updated stock for 'Macramé Wall Hanging' (30 → 24)", ip: "103.21.58.xxx", timestamp: "2026-06-22 14:30" },
  { id: 2, adminId: 3, adminName: "Aman Singh", role: "staff", action: "product_upload", details: "Uploaded new product 'Resin Art Coasters (Set of 4)' — pending approval", ip: "182.75.44.xxx", timestamp: "2026-06-18 11:15" },
  { id: 3, adminId: 1, adminName: "Priya Motherscraft", role: "super_admin", action: "order_update", details: "Updated Order #1001 status to 'Delivered'", ip: "49.36.12.xxx", timestamp: "2026-05-16 16:45" },
  { id: 4, adminId: 2, adminName: "Riya Kapoor", role: "manager", action: "coupon_create", details: "Created coupon 'FLAT50' — ₹50 off, min order ₹299", ip: "103.21.58.xxx", timestamp: "2026-06-01 09:20" },
  { id: 5, adminId: 1, adminName: "Priya Motherscraft", role: "super_admin", action: "review_approve", details: "Approved review by Aarti R. on 'Macramé Wall Hanging' (5★)", ip: "49.36.12.xxx", timestamp: "2026-06-04 10:00" },
  { id: 6, adminId: 2, adminName: "Riya Kapoor", role: "manager", action: "refund", details: "Processed refund ₹765 for Order #1009 — customer cancellation", ip: "103.21.58.xxx", timestamp: "2026-06-09 15:30" },
  { id: 7, adminId: 1, adminName: "Priya Motherscraft", role: "super_admin", action: "admin_create", details: "Created staff account for 'Aman Singh' (staff@motherscraft.in)", ip: "49.36.12.xxx", timestamp: "2026-03-10 08:00" },
  { id: 8, adminId: 4, adminName: "Neha Gupta", role: "support", action: "review_reply", details: "Replied to Nisha J.'s review on 'Embroidery Thread Kit'", ip: "115.96.33.xxx", timestamp: "2026-05-13 11:45" },
  { id: 9, adminId: 2, adminName: "Riya Kapoor", role: "manager", action: "stock_update", details: "Updated stock for 'Air-dry Clay Kit' (10 → 3)", ip: "103.21.58.xxx", timestamp: "2026-06-20 13:00" },
  { id: 10, adminId: 1, adminName: "Priya Motherscraft", role: "super_admin", action: "settings_update", details: "Updated shipping rate for 'Rest of India' zone to ₹49", ip: "49.36.12.xxx", timestamp: "2026-06-15 17:20" },
];

const INITIAL_SETTINGS = {
  storeName: "Mothers Craft",
  tagline: "Crafted with Love, Made for You",
  contactEmail: "hello@motherscraft.in",
  contactPhone: "+91 98765 00000",
  address: "Plot 12, Artisan Lane, Jaipur, Rajasthan 302001",
  currency: "INR",
  currencySymbol: "₹",
  timezone: "Asia/Kolkata",
  gstPercent: 18,
  taxInclusive: false,
  freeShippingThreshold: 499,
  paymentMethods: { upi: true, cards: true, netBanking: true, cod: true, paytm: false },
  shippingZones: [
    { id: 1, name: "Metro Cities", rate: 0, freeAbove: 499 },
    { id: 2, name: "Rest of India", rate: 49, freeAbove: 499 },
  ],
  seo: { metaTitle: "Mothers Craft — Crafted with Love, Made for You", metaDescription: "Discover premium handcrafted decor, artisan supplies, starter DIY kits.", googleAnalyticsId: "", facebookPixelId: "" },
  maintenanceMode: false,
  maintenanceMessage: "We're updating our store. Please check back soon!",
};

const CATEGORIES = [
  { id: 1, name: "Handmade Decor", subcategories: ["Wall & Home Decor","Festival & Seasonal","Wearables & Gifts"] },
  { id: 2, name: "Craft Supplies", subcategories: ["Fabric & Fibre","Colour & Paint"] },
  { id: 3, name: "DIY Kits", subcategories: ["Jewellery Kits","Macramé Kits","Clay & Resin","Kids Kits (Age 5–12)","Beginner Kits"] },
  { id: 4, name: "Tools & Accessories", subcategories: ["Cutting Tools","Needles & Hooks","Brushes & Organisers","Storage & Organisers"] },
  { id: 5, name: "Seeds & Nature Craft", subcategories: ["Nature Journal Sets","Seed Kits"] },
];

// ════════════════════════════════════════════════════════════════
// CONTEXT
// ════════════════════════════════════════════════════════════════

export const StoreContext = createContext(null);

let nextProductId = 22;
let nextOrderId = 1012;
let nextCouponId = 5;
let nextReviewId = 8;
let nextAdminId = 5;
let nextLogId = 11;

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(SEED_PRODUCTS);
  const [orders, setOrders] = useState(SEED_ORDERS);
  const [customers, setCustomers] = useState(SEED_CUSTOMERS);
  const [coupons, setCoupons] = useState(SEED_COUPONS);
  const [reviews, setReviews] = useState(SEED_REVIEWS);
  const [adminUsers, setAdminUsers] = useState(SEED_ADMIN_USERS);
  const [activityLogs, setActivityLogs] = useState(SEED_ACTIVITY_LOGS);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [categories] = useState(CATEGORIES);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState('storefront');
  const [notifications, setNotifications] = useState([]);

  // Generate notifications from data
  const generateNotifications = useCallback(() => {
    const notifs = [];
    const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold && p.stock > 0 && p.status === 'published');
    lowStockProducts.forEach(p => notifs.push({ id: `low-${p.id}`, type: 'warning', text: `'${p.name}' is low on stock (${p.stock} left)`, time: 'Now' }));
    const pendingOrders = orders.filter(o => o.status === 'pending');
    pendingOrders.slice(0, 3).forEach(o => notifs.push({ id: `order-${o.id}`, type: 'info', text: `New order #${o.id} from ${o.customer.name}`, time: 'Recent' }));
    const pendingReviews = reviews.filter(r => r.status === 'pending');
    if (pendingReviews.length > 0) notifs.push({ id: 'reviews-pending', type: 'info', text: `${pendingReviews.length} new review(s) pending approval`, time: 'Today' });
    const outOfStock = products.filter(p => p.stock === 0 && p.status === 'published');
    outOfStock.forEach(p => notifs.push({ id: `oos-${p.id}`, type: 'danger', text: `'${p.name}' is out of stock!`, time: 'Now' }));
    return notifs;
  }, [products, orders, reviews]);

  // ── Auth ──
  const login = useCallback((email, password) => {
    const user = adminUsers.find(u => u.email === email && u.password === password && u.status === 'active');
    if (user) { 
      setCurrentAdmin(user); 
      setActiveTab('admin');
      return { success: true, user }; 
    }
    return { success: false, error: 'Invalid credentials or account suspended' };
  }, [adminUsers]);

  const logout = useCallback(() => {
    setCurrentAdmin(null);
    setActiveTab('storefront');
  }, []);

  const switchDemoRole = useCallback((role) => {
    const user = adminUsers.find(u => u.role === role);
    if (user) {
      setCurrentAdmin(user);
      setActiveTab('admin');
    }
  }, [adminUsers]);

  // ── Activity Logging ──
  const logActivity = useCallback((action, details) => {
    if (!currentAdmin) return;
    const newLog = { id: nextLogId++, adminId: currentAdmin.id, adminName: currentAdmin.name, role: currentAdmin.role, action, details, ip: "127.0.0.xxx", timestamp: new Date().toLocaleString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) };
    setActivityLogs(prev => [newLog, ...prev]);
  }, [currentAdmin]);

  // ── Products CRUD ──
  const addProduct = useCallback((product) => {
    const newProduct = { ...product, id: nextProductId++, createdAt: new Date().toISOString().split('T')[0] };
    setProducts(prev => [...prev, newProduct]);
    logActivity('product_create', `Added new product '${newProduct.name}'`);
    return newProduct;
  }, [logActivity]);

  const updateProduct = useCallback((id, updates) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    logActivity('product_update', `Updated product ID #${id}`);
  }, [logActivity]);

  const deleteProduct = useCallback((id) => {
    const product = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    if (product) logActivity('product_delete', `Deleted product '${product.name}'`);
  }, [products, logActivity]);

  const approveProduct = useCallback((id) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'published' } : p));
    const product = products.find(p => p.id === id);
    if (product) logActivity('product_approve', `Approved and published product '${product.name}'`);
  }, [products, logActivity]);

  // ── Orders ──
  const addOrder = useCallback((order) => {
    const newOrder = {
      ...order,
      id: nextOrderId++,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setOrders(prev => [newOrder, ...prev]);

    // Update customer total spend and order count if customer exists
    setCustomers(prev => {
      const exists = prev.some(c => c.email.toLowerCase() === order.customer.email.toLowerCase());
      if (exists) {
        return prev.map(c => {
          if (c.email.toLowerCase() === order.customer.email.toLowerCase()) {
            return {
              ...c,
              totalOrders: c.totalOrders + 1,
              totalSpent: c.totalSpent + order.total,
            };
          }
          return c;
        });
      } else {
        // Create new customer
        const newCust = {
          id: prev.length + 1,
          name: order.customer.name,
          email: order.customer.email,
          phone: order.customer.phone || '—',
          totalOrders: 1,
          totalSpent: order.total,
          joined: new Date().toISOString().split('T')[0],
          status: 'active',
          avatar: order.customer.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        };
        return [...prev, newCust];
      }
    });

    logActivity('order_create', `New order #${newOrder.id} placed by customer '${order.customer.name}'`);
    return newOrder;
  }, [logActivity]);

  const updateOrderStatus = useCallback((orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] } : o));
    logActivity('order_update', `Updated Order #${orderId} status to '${newStatus}'`);
  }, [logActivity]);

  const updateOrderNotes = useCallback((orderId, notes) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, notes } : o));
  }, []);

  // ── Coupons ──
  const addCoupon = useCallback((coupon) => {
    const newCoupon = { ...coupon, id: nextCouponId++, usedCount: 0 };
    setCoupons(prev => [...prev, newCoupon]);
    logActivity('coupon_create', `Created coupon '${newCoupon.code}'`);
    return newCoupon;
  }, [logActivity]);

  const updateCoupon = useCallback((id, updates) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const deleteCoupon = useCallback((id) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    logActivity('coupon_delete', `Deleted coupon ID #${id}`);
  }, [logActivity]);

  // ── Reviews ──
  const approveReview = useCallback((id) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    logActivity('review_approve', `Approved review #${id}`);
  }, [logActivity]);

  const rejectReview = useCallback((id) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    logActivity('review_reject', `Rejected review #${id}`);
  }, [logActivity]);

  const replyToReview = useCallback((id, reply) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, adminReply: reply } : r));
    logActivity('review_reply', `Replied to review #${id}`);
  }, [logActivity]);

  const deleteReview = useCallback((id) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    logActivity('review_delete', `Deleted review #${id}`);
  }, [logActivity]);

  // ── Customers ──
  const toggleCustomerBlock = useCallback((id) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'blocked' : 'active' } : c));
    const cust = customers.find(c => c.id === id);
    if (cust) logActivity('customer_update', `${cust.status === 'active' ? 'Blocked' : 'Unblocked'} customer '${cust.name}'`);
  }, [customers, logActivity]);

  // ── Admin Users ──
  const addAdminUser = useCallback((user) => {
    const newUser = { ...user, id: nextAdminId++, lastLogin: 'Never', avatar: user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) };
    setAdminUsers(prev => [...prev, newUser]);
    logActivity('admin_create', `Created ${user.role} account for '${user.name}'`);
    return newUser;
  }, [logActivity]);

  const updateAdminUser = useCallback((id, updates) => {
    setAdminUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    logActivity('admin_update', `Updated admin user ID #${id}`);
  }, [logActivity]);

  const deleteAdminUser = useCallback((id) => {
    const user = adminUsers.find(u => u.id === id);
    setAdminUsers(prev => prev.filter(u => u.id !== id));
    if (user) logActivity('admin_delete', `Deleted admin account '${user.name}'`);
  }, [adminUsers, logActivity]);

  // ── Settings ──
  const updateSettings = useCallback((updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
    logActivity('settings_update', `Updated store settings`);
  }, [logActivity]);

  // ── Stock ──
  const updateStock = useCallback((productId, newStock) => {
    const product = products.find(p => p.id === productId);
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p));
    if (product) logActivity('stock_update', `Updated stock for '${product.name}' (${product.stock} → ${newStock})`);
  }, [products, logActivity]);

  const value = {
    products, orders, customers, coupons, reviews, adminUsers, activityLogs, settings, categories, currentAdmin, notifications: generateNotifications(),
    login, logout, switchDemoRole,
    addProduct, updateProduct, deleteProduct, approveProduct, updateStock,
    addOrder, updateOrderStatus, updateOrderNotes,
    addCoupon, updateCoupon, deleteCoupon,
    approveReview, rejectReview, replyToReview, deleteReview,
    toggleCustomerBlock,
    addAdminUser, updateAdminUser, deleteAdminUser,
    updateSettings, logActivity,
    activeTab, setActiveTab,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
