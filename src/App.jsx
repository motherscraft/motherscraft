import { useState, useEffect } from 'react';
import { useStore } from './StoreContext';
import UserAccount from './UserAccount';
import './user-account.css';
import { 
  ShoppingBag, Heart, Search, User, Menu, X, ChevronLeft, ChevronRight, 
  Star, ArrowRight, Check, Plus, Minus, ArrowUp, Compass, 
  ChevronDown, Award, LogOut, AlertCircle
} from 'lucide-react';

// ============================================================================
// 1. PRODUCT DATABASE & STATIC SITE CONTENT
// ============================================================================

const PRODUCTS = [
  // 8 Bestsellers (IDs 1-8)
  {
    id: 1,
    name: "Handmade Macramé Wall Hanging",
    category: "Handmade Decor",
    subCategory: "Wall & Home Decor",
    originalPrice: 999,
    salePrice: 599,
    discount: "SAVE 40%",
    image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Macrame+Hanging+A",
    image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Macrame+Hanging+B",
    rating: 4.8,
    reviewsCount: 48,
    badge: "BESTSELLER",
    badgeType: "bestseller",
    colors: ["#EEDFC6", "#C07850", "#7A9E7E"],
    colorNames: ["Natural Ivory", "Terracotta", "Sage Green"],
    sizes: ["Standard (2.5x2 ft)", "Large (3.5x2.5 ft)"],
    description: "Introduce a gorgeous bohemian warmth to your spaces. Expertly hand-woven by Indian women artisans, this macramé wall hanging showcases geometric patterns, delicate fringe details, and authentic wooden bead highlights.",
    materials: "100% natural organic cotton cord, premium hand-polished solid pine wood dowel.",
    shipping: "Dispatched in 24 hours. Standard delivery across India in 3-5 business days. Free shipping available."
  },
  {
    id: 2,
    name: "Embroidery Thread Kit — 48 Colors",
    category: "Craft Supplies",
    subCategory: "Fabric & Fibre",
    originalPrice: 599,
    salePrice: 349,
    discount: "SAVE 42%",
    image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Embroidery+Threads+A",
    image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Embroidery+Threads+B",
    rating: 4.7,
    reviewsCount: 36,
    badge: "SAVE 42%",
    badgeType: "save",
    colors: ["#F5E6CC"],
    colorNames: ["Assorted Rainbow Set"],
    sizes: ["48 Skeins Pack"],
    description: "A premium curated box of 48 brilliant colored embroidery threads. Each skein is 8 meters of 6-ply long-staple mercerized cotton, offering a beautiful silk-like sheen that is split-resistant and non-bleeding.",
    materials: "100% long-staple mercerized organic cotton.",
    shipping: "Dispatched in 24 hours. Safe box packaging. Delivers in 3-5 days."
  },
  {
    id: 3,
    name: "DIY Jewellery Making Starter Kit",
    category: "DIY Kits",
    subCategory: "Jewellery Kits",
    originalPrice: 1499,
    salePrice: 799,
    discount: "SAVE 47%",
    image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Jewellery+Kit+A",
    image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Jewellery+Kit+B",
    rating: 4.9,
    reviewsCount: 82,
    badge: "BESTSELLER",
    badgeType: "bestseller",
    colors: ["#D4A96A"],
    colorNames: ["Beads & Findings Mix"],
    sizes: ["Complete Starter Box"],
    description: "Everything you need to craft your own beautiful earrings, bracelets, and necklaces. Features thousands of colourful glass seed beads, charms, earring hooks, metal spacers, wire cutters, and elastic strings.",
    materials: "Acrylic and glass beads, lead-free brass findings, carbon steel pliers.",
    shipping: "Dispatched in 24 hours. Reusable plastic organiser container. Delivers in 4 business days."
  },
  {
    id: 4,
    name: "Terracotta Pendant Necklace — Handmade",
    category: "Handmade Decor",
    subCategory: "Wearables & Gifts",
    originalPrice: 449,
    salePrice: 249,
    discount: "SAVE 45%",
    image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Terracotta+Pendant+A",
    image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Terracotta+Pendant+B",
    rating: 4.6,
    reviewsCount: 19,
    badge: "SAVE 45%",
    badgeType: "save",
    colors: ["#C07850", "#D4A96A"],
    colorNames: ["Natural Clay", "Gold Detailing"],
    sizes: ["One Size (Adjustable)"],
    description: "An authentic, handcrafted clay necklace fired and hand-painted by traditional potters. Showcases gorgeous ethnic motifs on a durable adjustable fabric thread loop. Extremely lightweight.",
    materials: "Fired natural clay, organic acrylic colors, cotton thread loop.",
    shipping: "Wrapped in heavy bubble sheet inside a secure cardboard gift box. Delivers in 5 days."
  },
  {
    id: 5,
    name: "Fabric Painting Set — 12 Colors",
    category: "Craft Supplies",
    subCategory: "Colour & Paint",
    originalPrice: 799,
    salePrice: 449,
    discount: "SAVE 44%",
    image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Fabric+Paints+A",
    image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Fabric+Paints+B",
    rating: 4.7,
    reviewsCount: 22,
    badge: "SAVE 44%",
    badgeType: "save",
    colors: ["#FDF8F0"],
    colorNames: ["Standard 12 Colors Set"],
    sizes: ["12 Tubes x 20ml"],
    description: "Artist-grade fabric paints designed specifically for textile arts. They dry soft and flexible, ensuring no cracking or peeling even after dozens of machine wash cycles. Works on cotton, denim, and linen.",
    materials: "Non-toxic resin-acrylic base pigments.",
    shipping: "Packed in a durable plastic storage case. Dispatched in 24 hours. Delivers in 3 days."
  },
  {
    id: 6,
    name: "Crochet Yarn Bundle — Pastel Set",
    category: "Craft Supplies",
    subCategory: "Fabric & Fibre",
    originalPrice: 999,
    salePrice: 599,
    discount: "SAVE 40%",
    image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Pastel+Yarn+A",
    image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Pastel+Yarn+B",
    rating: 4.8,
    reviewsCount: 30,
    badge: "SAVE 40%",
    badgeType: "save",
    colors: ["#F5E6CC", "#C48B9F", "#7A9E7E"],
    colorNames: ["Pastel Cream", "Pastel Rose", "Pastel Sage"],
    sizes: ["Set of 5 Balls (500g total)"],
    description: "Wonderfully soft, multi-ply acrylic yarn balls curated in soothing pastel hues. Perfect for crafting blankets, summer cardigans, plush toys (amigurumi), and warm cozy winter mufflers.",
    materials: "100% premium soft-grade anti-pilling acrylic fibers.",
    shipping: "Shipped in eco-friendly reusable cotton pouch. Delivers in 4 business days."
  },
  {
    id: 7,
    name: "Handmade Jute Gift Hamper",
    category: "Handmade Decor",
    subCategory: "Wearables & Gifts",
    originalPrice: 1499,
    salePrice: 899,
    discount: "SAVE 40%",
    image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Jute+Hamper+A",
    image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Jute+Hamper+B",
    rating: 4.8,
    reviewsCount: 52,
    badge: "BESTSELLER",
    badgeType: "bestseller",
    colors: ["#D4A96A"],
    colorNames: ["Natural Golden Jute"],
    sizes: ["Medium Basket", "Large Basket"],
    description: "A gorgeous luxury gift hamper wrapped in hand-woven organic jute fiber. Includes handcrafted scented soy wax candles, artisanal wooden block printed coasters, and a customized message card.",
    materials: "Organic biodegradable jute ropes, recycled cardboard frames.",
    shipping: "Individually wrapped and reinforced box to avoid transit shifting. Delivers in 3-5 days."
  },
  {
    id: 8,
    name: "Air-dry Clay Kit for Beginners",
    category: "DIY Kits",
    subCategory: "Clay & Resin",
    originalPrice: 1199,
    salePrice: 699,
    discount: "SAVE 42%",
    image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Air+Dry+Clay+A",
    image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Air+Dry+Clay+B",
    rating: 4.7,
    reviewsCount: 41,
    badge: "SAVE 42%",
    badgeType: "save",
    colors: ["#FDF8F0", "#C07850"],
    colorNames: ["Stone White", "Terracotta Clay"],
    sizes: ["1 kg Pack"],
    description: "Unlock your pottery potential at home. This air-drying clay hardens naturally in 24 hours without kiln firing. Includes 5 wooden sculpting tools, acrylic colors, gloss glaze finish, and detailed ideas guide.",
    materials: "100% organic kaolin mineral clay.",
    shipping: "Vacuum sealed foil pack to prevent premature hardening. Delivers in 4 days."
  },

  // New Arrivals (IDs 9-16)
  {
    id: 9,
    name: "Pressed Flower Wood Journal",
    category: "Seeds & Nature Craft",
    subCategory: "Nature Journal Sets",
    originalPrice: 899,
    salePrice: 549,
    discount: "SAVE 39%",
    image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Flower+Journal+A",
    image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Flower+Journal+B",
    rating: 4.9,
    reviewsCount: 14,
    badge: "NEW",
    badgeType: "new",
    colors: ["#6B3A2A"],
    colorNames: ["Walnut Finish"],
    sizes: ["A5 (200 Deckle Pages)"],
    description: "Write your thoughts on luxurious, tree-free, handmade recycled cotton deckle edge paper. Encased in a beautiful wooden hard cover decorated with real pressed hydrangeas and pansies.",
    materials: "Real dried botanical specimens, birchwood, deckle cotton paper.",
    shipping: "Includes padded cotton protective pouch. Delivers in 3 business days."
  },
  {
    id: 10,
    name: "Ceramic Mandala Diya Set (Set of 6)",
    category: "Handmade Decor",
    subCategory: "Festival & Seasonal",
    originalPrice: 499,
    salePrice: 299,
    discount: "SAVE 40%",
    image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Mandala+Diya+A",
    image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Mandala+Diya+B",
    rating: 4.9,
    reviewsCount: 110,
    badge: "NEW",
    badgeType: "new",
    colors: ["#C48B9F", "#D4A96A", "#7A9E7E"],
    colorNames: ["Lotus Pink", "Royal Gold", "Sage Teal"],
    sizes: ["Set of 6"],
    description: "Exquisite clay diya lamps hand-cast and hand-painted with detailed mandala designs by traditional Indian potters. Adds a sacred, artistic radiance to your home during Diwali and rituals.",
    materials: "Fired terracotta clay, high-grade glossy metallic paint coatings.",
    shipping: "Individually cushioned bubble partitions inside a heavy box. Delivers in 3 days."
  },
  {
    id: 11,
    name: "Eco-friendly Soy Wax Candle (Set of 3)",
    category: "Handmade Decor",
    subCategory: "Wall & Home Decor",
    originalPrice: 699,
    salePrice: 399,
    discount: "SAVE 43%",
    image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Soy+Candles+A",
    image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Soy+Candles+B",
    rating: 4.7,
    reviewsCount: 16,
    badge: "NEW",
    badgeType: "new",
    colors: ["#F5E6CC"],
    colorNames: ["Vanilla & Lavender Blend"],
    sizes: ["Set of 3 Jars"],
    description: "Indulge in organic relaxation. Hand-poured using clean-burning soy wax in reusable amber glass jars. Infused with natural essential oils to soothe your senses and mind.",
    materials: "100% natural biodegradable soy wax, lead-free cotton wicks, essential oils.",
    shipping: "Safe cardboard packing with eco-friendly filler. Delivers in 4 business days."
  },
  {
    id: 12,
    name: "Macramé Plant Hanger DIY Kit",
    category: "DIY Kits",
    subCategory: "Macramé Kits",
    originalPrice: 499,
    salePrice: 299,
    discount: "SAVE 40%",
    image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Plant+Hanger+Kit+A",
    image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Plant+Hanger+Kit+B",
    rating: 4.6,
    reviewsCount: 28,
    badge: "NEW",
    badgeType: "new",
    colors: ["#EEDFC6", "#7A9E7E"],
    colorNames: ["Natural Beige", "Eco Sage Green"],
    sizes: ["Single Pot Size"],
    description: "Craft a beautiful hanging plant container. Ideal for beginners, this kit includes 100% organic cotton cords cut to length, natural wooden hanging rings, geometric beads, and step-by-step instructions.",
    materials: "Premium organic cotton cords, solid wood rings, wood beads.",
    shipping: "Comes in an elegant cardboard envelope. Delivers in 3 days."
  },
  {
    id: 13,
    name: "Glass Bead Jewelry Making Kit",
    category: "DIY Kits",
    subCategory: "Jewellery Kits",
    originalPrice: 599,
    salePrice: 349,
    discount: "SAVE 42%",
    image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Glass+Bead+Kit+A",
    image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Glass+Bead+Kit+B",
    rating: 4.5,
    reviewsCount: 15,
    badge: "NEW",
    badgeType: "new",
    colors: ["#C48B9F"],
    colorNames: ["Pastel Blossom Mix"],
    sizes: ["Standard Box"],
    description: "An interactive, fun kit featuring round glass beads, crystal beads, floral charms, and elastic wires. Create dozens of customized bracelets and rings for your friends and family.",
    materials: "Real glass micro-beads, elastic silicone thread strings.",
    shipping: "Packed in a handy multi-grid organiser tray. Delivers in 4 business days."
  },
  {
    id: 14,
    name: "Felt Animal Sewing DIY Kit",
    category: "DIY Kits",
    subCategory: "Kids Kits (Age 5–12)",
    originalPrice: 799,
    salePrice: 449,
    discount: "SAVE 44%",
    image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Felt+Sewing+A",
    image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Felt+Sewing+B",
    rating: 4.8,
    reviewsCount: 39,
    badge: "NEW",
    badgeType: "new",
    colors: ["#7A9E7E"],
    colorNames: ["Woodland Forest Animals"],
    sizes: ["Age 5-12 Years"],
    description: "Introduce kids to handcrafting. Contains pre-punched high-quality felt templates to easily sew 5 adorable plush animals. Includes dull plastic safety needles and embroidery threads.",
    materials: "Premium soft wool-felt templates, plastic safety needles, fiber fillings.",
    shipping: "Bright colorful kids packaging box. Delivers in 4 days."
  },
  {
    id: 15,
    name: "Organic Cotton Yarn Pack (5 Colors)",
    category: "Craft Supplies",
    subCategory: "Fabric & Fibre",
    originalPrice: 899,
    salePrice: 499,
    discount: "SAVE 44%",
    image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Cotton+Yarn+A",
    image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Cotton+Yarn+B",
    rating: 4.7,
    reviewsCount: 24,
    badge: "NEW",
    badgeType: "new",
    colors: ["#F5E6CC", "#C07850", "#C48B9F", "#7A9E7E", "#6B3A2A"],
    colorNames: ["Warm Earth Pack"],
    sizes: ["5 Balls x 100g"],
    description: "Luxurious, skin-friendly yarn dyed using eco-conscious organic vegetable colors. Exceptionally smooth, perfect for baby sweaters, crochet bags, dishcloths, and sensitive-skin garments.",
    materials: "100% organic combed cotton fibers.",
    shipping: "Eco-friendly organic paper wrap bundle. Delivers in 3-5 business days."
  },
  {
    id: 16,
    name: "Wooden Block Printing Kit",
    category: "DIY Kits",
    subCategory: "Beginner Kits",
    originalPrice: 1199,
    salePrice: 699,
    discount: "SAVE 42%",
    image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Block+Print+A",
    image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Block+Print+B",
    rating: 4.9,
    reviewsCount: 33,
    badge: "NEW",
    badgeType: "new",
    colors: ["#6B3A2A"],
    colorNames: ["Teak Wood Blocks"],
    sizes: ["Standard kit"],
    description: "Try the age-old art of Indian hand-block printing. Contains 4 hand-carved teakwood stamping blocks, 3 fabric paints, a print sponge pad, and 2 pure cotton blank tote bags to design.",
    materials: "Hand-carved solid teakwood blocks, organic paint pigments.",
    shipping: "Packed in a rustic cotton drawstring storage bag. Delivers in 5 business days."
  },

  // Tools & Accessories (IDs 17-20)
  {
    id: 17,
    name: "Craft Scissors & Rotary Cutter Set",
    category: "Tools & Accessories",
    subCategory: "Cutting Tools",
    originalPrice: 899,
    salePrice: 499,
    discount: "SAVE 44%",
    image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Scissors+Cutter+A",
    image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Scissors+Cutter+B",
    rating: 4.6,
    reviewsCount: 17,
    badge: "BESTSELLER",
    badgeType: "bestseller",
    colors: ["#6B3A2A"],
    colorNames: ["Rosewood Accents"],
    sizes: ["Standard Tools"],
    description: "A professional-grade cutting duo. Includes a 45mm fabric rotary cutter with replacement tungsten steel blades and an 8-inch heavy-duty vintage tailoring dressmaking shears.",
    materials: "Tungsten alloy steel, stainless steel shears, carbon ABS.",
    shipping: "Sealed blister protective pack. Delivers in 4 business days."
  },
  {
    id: 18,
    name: "Ergonomic Crochet Hook Set (14 sizes)",
    category: "Tools & Accessories",
    subCategory: "Needles & Hooks",
    originalPrice: 899,
    salePrice: 549,
    discount: "SAVE 39%",
    image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Crochet+Hook+A",
    image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Crochet+Hook+B",
    rating: 4.8,
    reviewsCount: 104,
    badge: "BESTSELLER",
    badgeType: "bestseller",
    colors: ["#C07850"],
    colorNames: ["Multi-color Grips"],
    sizes: ["14 Hook Sizes (2mm - 10mm)"],
    description: "Minimize hand fatigue. These crochet hooks feature ultra-comfortable soft silicone rubber grips. Includes metal tapestry needles, row counters, stitch markers, and a zippered storage case.",
    materials: "Polished smooth aluminum hooks, soft organic silicone handles.",
    shipping: "Comes in a compact zippered travel folder bag. Delivers in 3 days."
  },
  {
    id: 19,
    name: "Fine Detail Paint Brushes (9pcs)",
    category: "Tools & Accessories",
    subCategory: "Brushes & Organisers",
    originalPrice: 449,
    salePrice: 249,
    discount: "SAVE 45%",
    image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Detail+Brushes+A",
    image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Detail+Brushes+B",
    rating: 4.7,
    reviewsCount: 42,
    badge: "BESTSELLER",
    badgeType: "bestseller",
    colors: ["#D4A96A"],
    colorNames: ["Polished Birchwood Handles"],
    sizes: ["9 Brush Tips (000 to 6)"],
    description: "Achieve microscopic precision. Ideal for mandala dotting, miniature styling, acrylic canvas painting, and fine outlining. Designed with anti-shedding synthetic bristles.",
    materials: "Synthetic nylon hairs, birchwood handles, rustproof copper ferules.",
    shipping: "Shipped in protective tubular sleeve caps. Delivers in 3 business days."
  },
  {
    id: 20,
    name: "Folding Wooden Thread Rack Organizer",
    category: "Tools & Accessories",
    subCategory: "Storage & Organisers",
    originalPrice: 1299,
    salePrice: 799,
    discount: "SAVE 38%",
    image1: "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Thread+Rack+A",
    image2: "https://placehold.co/500x500/E8D0B0/3D2010?text=Thread+Rack+B",
    rating: 4.6,
    reviewsCount: 26,
    badge: "BESTSELLER",
    badgeType: "bestseller",
    colors: ["#EEDFC6"],
    colorNames: ["Natural Pine Wood"],
    sizes: ["Holds 30 Spools"],
    description: "Clear up your craft table. This premium foldable rack stores up to 30 small to medium sewing/embroidery spools. Can stand freely on tables or be mounted directly to walls.",
    materials: "100% sustainably sourced solid natural pinewood.",
    shipping: "Delivered fully pre-assembled in protective flat pack carton. Delivers in 5 days."
  }
];

// Deal of the Week (ID 21)
const DEAL_OF_THE_WEEK = {
  id: 21,
  name: "Premium Macramé DIY Kit + Tutorial Bundle",
  category: "DIY Kits",
  subCategory: "Macramé Kits",
  originalPrice: 1799,
  salePrice: 899,
  discount: "YOU SAVE ₹900 (50% OFF)",
  images: [
    "https://placehold.co/500x500/F5E6CC/6B3A2A?text=Deal+Macrame+Kit+1",
    "https://placehold.co/500x500/E8D0B0/3D2010?text=Deal+Macrame+Kit+2",
    "https://placehold.co/500x500/FDF8F0/C07850?text=Deal+Macrame+Kit+3",
    "https://placehold.co/500x500/C48B9F/1E1209?text=Deal+Macrame+Kit+4",
    "https://placehold.co/500x500/7A9E7E/FDF8F0?text=Deal+Macrame+Kit+5"
  ],
  rating: 4.9,
  reviewsCount: 124,
  colors: ["#EEDFC6", "#7A9E7E", "#C07850"],
  colorNames: ["Natural Beige", "Sage Green", "Terracotta"],
  sizes: ["Standard Kit", "Deluxe Kit"],
  description: "The ultimate beginner-friendly craft package. Contains premium pre-measured cotton ropes, natural wooden rings, geometric beads, and an easy photo-illustrated booklet with full access to step-by-step video tutorials.",
  materials: "100% natural organic cotton cords, solid wood rings, polished wood beads.",
  shipping: "Shipped in a stylish eco-friendly cardboard gift box. Delivers in 3 days."
};

// 3 Promo Banners
const PROMO_BANNERS = [
  {
    id: 1,
    pill: "✦ Eco Supplies ✦",
    title: "Upto 70% Off — Craft Supplies",
    image: "https://placehold.co/420x240/F5E6CC/6B3A2A?text=Yarn+%26+Floss+Collection",
    categoryFilter: "Craft Supplies"
  },
  {
    id: 2,
    pill: "🎁 DIY Crafts 🎁",
    title: "Creative Starter Kits for Beginners",
    image: "https://placehold.co/420x240/E8D0B0/3D2010?text=DIY+Artisan+Kits",
    categoryFilter: "DIY Kits"
  },
  {
    id: 3,
    pill: "🌸 Home Accent 🌸",
    title: "Handmade Decor — Upto 50% Off",
    image: "https://placehold.co/420x240/1E1209/D4A96A?text=Boho+Decor+Sale",
    categoryFilter: "Handmade Decor"
  }
];

// 3 Blog posts
const BLOG_POSTS = [
  {
    id: 1,
    category: "DIY Tips",
    title: "5 Simple Macramé Knots Every Beginner Should Master",
    excerpt: "Unlock the art of beautiful knotting with our step-by-step illustrations of square, larks head, and clove hitch knots.",
    image: "https://placehold.co/400x220/F5E6CC/6B3A2A?text=Macrame+Knots+Tutorial",
    date: "Jun 2, 2026",
    readTime: "5 min read"
  },
  {
    id: 2,
    category: "Craft Supplies",
    title: "How to Choose the Right Thread for Your Embroidery Projects",
    excerpt: "From mercerized cotton to rayon and metallic silk, we break down thread weights and shine levels for different fabrics.",
    image: "https://placehold.co/400x220/E8D0B0/3D2010?text=Embroidery+Thread+Guide",
    date: "May 28, 2026",
    readTime: "6 min read"
  },
  {
    id: 3,
    category: "Nature Craft",
    title: "Preserving Memories: The Art of Pressing Spring Flowers",
    excerpt: "Learn how to dry and press wildflowers without losing their vibrant colors using simple household materials.",
    image: "https://placehold.co/400x220/1E1209/D4A96A?text=Pressed+Flower+Art",
    date: "May 15, 2026",
    readTime: "8 min read"
  }
];

// Pre-seeded customer reviews
const CUSTOMER_REVIEWS = [
  {
    id: 1,
    initial: "AR",
    name: "Aarti R.",
    verified: true,
    stars: 5,
    date: "Jun 3, 2026",
    product: "Bought: Macramé Wall Hanging Kit",
    text: "This kit was a delight! The cotton cord is so soft, and the step-by-step video instructions made it extremely easy for a beginner. The result looks premium in my living room."
  },
  {
    id: 2,
    initial: "SD",
    name: "Simran D.",
    verified: true,
    stars: 5,
    date: "May 28, 2026",
    product: "Bought: Ceramic Mandala Diya Set",
    text: "So beautiful! The mandala paintings are incredibly detailed. I was worried they would break during shipping, but they came securely double-bubble-wrapped."
  },
  {
    id: 3,
    initial: "PK",
    name: "Pooja K.",
    verified: true,
    stars: 5,
    date: "May 20, 2026",
    product: "Bought: Pressed Flower Wood Journal",
    text: "Such a beautiful, deeply feminine journal! The raw textured deckle paper is perfect for sketching and journaling. Highly recommend for unique gifting."
  },
  {
    id: 4,
    initial: "NJ",
    name: "Nisha J.",
    verified: true,
    stars: 5,
    date: "May 12, 2026",
    product: "Bought: Embroidery Thread Kit",
    text: "48 gorgeous colors. They have a brilliant sheen and don't bleed or knot up badly when sewing. The package arrived in Moradabad in just 3 days."
  }
];

// Search Suggestion Pills
const SUGGESTION_PILLS = [
  "Macramé", "Yarn", "Bead Kit", "Diyas", "Clay Kit", "Journal"
];

// Global count trackers (outside React component to keep state triggers pure)
let toastCounter = 0;
let cartIdCounter = 0;

export default function MothersCraft() {
  const {
    products, settings, addOrder, coupons, setActiveTab,
    currentUser, userLogin, userRegister, userLogout, updateUserProfile
  } = useStore();
  const PRODUCTS = products.filter(p => p.status === 'published');

  // ============================================================================
  // 2. CENTRAL STATE ENGINE
  // ============================================================================

  // User Auth States
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'register'
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirm, setRegisterConfirm] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Core Arrays (No localStorage or sessionStorage)
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Checkout modal state
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutPhone, setCheckoutPhone] = useState("");
  const [checkoutAddress, setCheckoutAddress] = useState("");
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState("UPI");

  // UI Navigation & Modals
  const [view, setView] = useState({ page: 'home', productId: null });
  const [activeSlide, setActiveSlide] = useState(0);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cookieDismissed, setCookieDismissed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Interactive UI helpers
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [backToTopVisible, setBackToTopVisible] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(""); // accepts "CRAFT10"
  
  // Pincode validation state
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState(null); // { status: 'success'|'error', text: string }
  
  // Add to cart animated button IDs
  const [addingProductIds, setAddingProductIds] = useState({}); // { [productId]: boolean }

  // Deal of the Week active variants
  const [dealColor, setDealColor] = useState(DEAL_OF_THE_WEEK.colors[0]);
  const [dealSize, setDealSize] = useState(DEAL_OF_THE_WEEK.sizes[0]);
  const [dealQty, setDealQty] = useState(1);
  const [dealThumbIndex, setDealThumbIndex] = useState(0);
  const [countdownSeconds, setCountdownSeconds] = useState(86399); // 23:59:59 start

  // Product Detail View active variants
  const [detailColor, setDetailColor] = useState("");
  const [detailSize, setDetailSize] = useState("");
  const [detailQty, setDetailQty] = useState(1);
  const [detailThumbIndex, setDetailThumbIndex] = useState(0);

  // Quick View active variants
  const [quickColor, setQuickColor] = useState("");
  const [quickSize, setQuickSize] = useState("");
  const [quickQty, setQuickQty] = useState(1);
  const [quickThumbIndex, setQuickThumbIndex] = useState(0);

  // Active Category Quick Filters
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("All");

  // Custom Notifications / Toasts
  const [toasts, setToasts] = useState([]);

  // ============================================================================
  // 3. EVENT HANDLERS & WORKFLOW EFFECTS
  // ============================================================================

  // Shrink header on scroll & Show back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setHeaderScrolled(true);
      } else {
        setHeaderScrolled(false);
      }

      if (window.scrollY > 400) {
        setBackToTopVisible(true);
      } else {
        setBackToTopVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hero Slider Auto-rotation (4500ms)
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(slideTimer);
  }, []);

  // Keyboard navigation for Hero Slider (ArrowLeft, ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (view.page === 'home' && !searchOpen && !quickViewProduct && !cartOpen) {
        if (e.key === 'ArrowLeft') {
          setActiveSlide((prev) => (prev - 1 + 3) % 3);
        } else if (e.key === 'ArrowRight') {
          setActiveSlide((prev) => (prev + 1) % 3);
        }
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setQuickViewProduct(null);
        setCartOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view.page, searchOpen, quickViewProduct, cartOpen]);

  // Deal of the week Live Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 86399));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Toast System trigger
  const addToast = (message) => {
    const id = ++toastCounter;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  };

  // Add to Wishlist toggle
  const toggleWishlist = (productId, e) => {
    if (e) e.stopPropagation();
    if (wishlistItems.includes(productId)) {
      setWishlistItems((prev) => prev.filter((id) => id !== productId));
      addToast("Removed from Wishlist");
    } else {
      setWishlistItems((prev) => [...prev, productId]);
      addToast("Added to Wishlist!");
    }
  };

  // Add to Cart workflow
  const triggerAddToCart = (product, selectedColor, selectedSize, quantity = 1, e) => {
    if (e) e.stopPropagation();

    // Trigger visual feedback loading/success state on button
    setAddingProductIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddingProductIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);

    const colorVal = selectedColor || (product.colors ? product.colors[0] : "Standard");
    const colorName = product.colorNames ? product.colorNames[product.colors ? product.colors.indexOf(colorVal) : 0] : "Standard";
    const sizeVal = selectedSize || (product.sizes ? product.sizes[0] : "Standard");

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.color === colorName && item.size === sizeVal
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            cartId: ++cartIdCounter,
            product,
            color: colorName,
            size: sizeVal,
            quantity
          }
        ];
      }
    });

    addToast(`Added ${product.name} to Cart!`);
  };

  // Update cart item quantity
  const updateCartQty = (cartId, delta) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.cartId === cartId) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty < 1 ? 1 : newQty };
        }
        return item;
      })
    );
  };

  // Remove cart item
  const removeCartItem = (cartId) => {
    setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
    addToast("Removed item from cart");
  };

  // Apply Coupon code
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const enteredCode = couponCode.trim().toUpperCase();
    const coupon = coupons?.find(c => c.code.toUpperCase() === enteredCode && c.active);
    if (coupon) {
      const subtotal = getCartSubtotal();
      if (subtotal < coupon.minOrder) {
        addToast(`Min. order of ₹${coupon.minOrder} required for this coupon.`);
      } else {
        setAppliedCoupon(enteredCode);
        addToast(`✓ Coupon ${enteredCode} applied!`);
      }
    } else {
      addToast("Invalid or expired coupon code.");
    }
  };

  // Check pincode delivery status
  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeStatus({ status: "error", text: "Please enter a valid 6-digit Pincode." });
      return;
    }
    const standardDays = [3, 4, 5, 2];
    const delay = standardDays[parseInt(pincode.charAt(3)) % 4];
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + delay);
    const dateStr = deliveryDate.toLocaleDateString("en-IN", { weekday: 'long', day: 'numeric', month: 'short' });
    setPincodeStatus({
      status: "success",
      text: `📦 Standard delivery by ${dateStr} | Free Shipping available!`
    });
  };

  // Search filter
  const filteredProducts = PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.subCategory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Subtotal details
  const getCartSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.product.salePrice * item.quantity, 0);
  };

  const formatTimerValue = (totalSeconds) => {
    const hh = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const mm = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const ss = (totalSeconds % 60).toString().padStart(2, '0');
    return { hh, mm, ss };
  };

  const navigateToProductDetails = (product) => {
    setDetailColor(product.colors ? product.colors[0] : "");
    setDetailSize(product.sizes ? product.sizes[0] : "");
    setDetailQty(1);
    setDetailThumbIndex(0);
    setPincode("");
    setPincodeStatus(null);
    setView({ page: 'product', productId: product.id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSearchOpen(false);
  };

  // ============================================================================
  // 4. DESIGN PARTS / COMPONENT RENDERS
  // ============================================================================

  // Layer 1 & 2: Header Component
  const renderHeader = () => {
    return (
      <div style={{ position: 'sticky', top: 0, zIndex: 999 }}>
        {/* Layer 1: Announcement Bar */}
        {!announcementDismissed && (
          <div style={{
            backgroundColor: 'var(--espresso)',
            color: 'var(--gold-light)',
            height: '36px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            fontSize: '12px',
            fontFamily: "'Inter', sans-serif"
          }}>
            <div style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <div className="animate-marquee" style={{ gap: '40px', paddingLeft: '100%' }}>
                <span>✦ Trusted by 1 Lakh+ Happy Crafters Across India ✦</span>
                <span>Free Shipping Above ₹499 ✦</span>
                <span>New: Festival DIY Kits — Shop Now ✦</span>
                <span>100% Handmade with Love ✦</span>
                <span>Easy 7-Day Returns ✦</span>
                <span>Secure Payments — UPI, Cards, COD ✦</span>
                <span>Trusted by 1 Lakh+ Happy Crafters Across India ✦</span>
                <span>Free Shipping Above ₹499 ✦</span>
                <span>New: Festival DIY Kits — Shop Now ✦</span>
                <span>100% Handmade with Love ✦</span>
                <span>Easy 7-Day Returns ✦</span>
                <span>Secure Payments — UPI, Cards, COD ✦</span>
              </div>
            </div>
            <button 
              onClick={() => setAnnouncementDismissed(true)}
              style={{
                position: 'absolute',
                right: '16px',
                background: 'none',
                border: 'none',
                color: 'var(--gold)',
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center'
              }}
              aria-label="Dismiss Announcement"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Layer 2: Main Header Navbar */}
        <header className={headerScrolled ? "glass-header" : ""} style={{
          backgroundColor: headerScrolled ? 'rgba(253, 248, 240, 0.95)' : 'var(--ivory)',
          borderBottom: headerScrolled ? '1px solid var(--border-warm)' : 'none',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.3s ease',
          padding: '0 24px',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          {/* Left: Logo & Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              className="mobile-only"
              onClick={() => setMobileMenuOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--mahogany)',
                cursor: 'pointer'
              }}
              aria-label="Open mobile menu"
            >
              <Menu size={24} />
            </button>

            <div 
              onClick={() => setView({ page: 'home', productId: null })}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <img 
                src="/logo.jpg?v=3" 
                alt="Mothers Craft Logo" 
                style={{ 
                  height: '44px', 
                  width: '44px', 
                  borderRadius: '50%', 
                  objectFit: 'cover',
                  border: '1.5px solid var(--gold)'
                }} 
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="logo-title" style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '24px',
                  fontWeight: '700',
                  fontStyle: 'italic',
                  color: 'var(--mahogany)',
                  lineHeight: '1'
                }}>
                  {settings?.storeName ?? 'Mothers Craft'}
                </span>
                <span className="logo-tagline" style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '9px',
                  color: 'var(--terracotta)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginTop: '2px'
                }}>
                  {settings?.tagline ?? 'Handmade Home Decor'}
                </span>
              </div>
            </div>
          </div>

          {/* Center: Navigation Menu (Desktop) */}
          <nav className="desktop-only" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '28px',
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {/* Handmade Mega Dropdown */}
            <div style={{ position: 'relative' }} className="group-hover-anchor">
              <span style={{ color: 'var(--text-body)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Handmade <ChevronDown size={12} />
              </span>
              {/* Mega Dropdown Menu */}
              <div className="mega-menu" style={{
                position: 'absolute',
                top: '100%',
                left: '-120px',
                width: '740px',
                backgroundColor: '#FFFFFF',
                borderTop: '3px solid var(--gold)',
                boxShadow: '0 10px 30px rgba(30,18,9,0.12)',
                borderRadius: '0 0 12px 12px',
                padding: '24px',
                display: 'none',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '20px',
                zIndex: 100
              }}>
                <div>
                  <h4 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--mahogany)', fontSize: '15px', marginBottom: '12px', borderBottom: '1px solid var(--border-warm)', paddingBottom: '6px' }}>Wall & Home</h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', textTransform: 'none', letterSpacing: 'normal' }}>
                    <li><span onClick={() => { setView({ page: 'home', productId: null }); setActiveCategoryFilter("Handmade Decor"); }} style={{ color: 'var(--text-body)', cursor: 'pointer' }}>Wall Hangings</span></li>
                    <li><span onClick={() => { setView({ page: 'home', productId: null }); setActiveCategoryFilter("Handmade Decor"); }} style={{ color: 'var(--text-body)', cursor: 'pointer' }}>Table Decor</span></li>
                    <li><span onClick={() => { setView({ page: 'home', productId: null }); setActiveCategoryFilter("Handmade Decor"); }} style={{ color: 'var(--text-body)', cursor: 'pointer' }}>Cushion Covers</span></li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--mahogany)', fontSize: '15px', marginBottom: '12px', borderBottom: '1px solid var(--border-warm)', paddingBottom: '6px' }}>Wearables</h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', textTransform: 'none', letterSpacing: 'normal' }}>
                    <li><span onClick={() => { setView({ page: 'home', productId: null }); setActiveCategoryFilter("Handmade Decor"); }} style={{ color: 'var(--text-body)', cursor: 'pointer' }}>Jewellery</span></li>
                    <li><span onClick={() => { setView({ page: 'home', productId: null }); setActiveCategoryFilter("Handmade Decor"); }} style={{ color: 'var(--text-body)', cursor: 'pointer' }}>Gift Boxes & Hampers</span></li>
                    <li><span onClick={() => { setView({ page: 'home', productId: null }); setActiveCategoryFilter("Handmade Decor"); }} style={{ color: 'var(--text-body)', cursor: 'pointer' }}>Personalised Items</span></li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--mahogany)', fontSize: '15px', marginBottom: '12px', borderBottom: '1px solid var(--border-warm)', paddingBottom: '6px' }}>Festivals</h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', textTransform: 'none', letterSpacing: 'normal' }}>
                    <li><span onClick={() => { setView({ page: 'home', productId: null }); setActiveCategoryFilter("Handmade Decor"); }} style={{ color: 'var(--text-body)', cursor: 'pointer' }}>Diwali Collection</span></li>
                    <li><span onClick={() => { setView({ page: 'home', productId: null }); setActiveCategoryFilter("Handmade Decor"); }} style={{ color: 'var(--text-body)', cursor: 'pointer' }}>Rakhi Specials</span></li>
                    <li><span onClick={() => { setView({ page: 'home', productId: null }); setActiveCategoryFilter("Handmade Decor"); }} style={{ color: 'var(--text-body)', cursor: 'pointer' }}>Christmas Decor</span></li>
                  </ul>
                </div>
                <div style={{ backgroundColor: 'var(--gold-light)', padding: '12px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <img src="https://placehold.co/120x80/F5E6CC/6B3A2A?text=Bestseller" style={{ borderRadius: '6px', width: '100%', height: '80px', objectFit: 'cover', marginBottom: '8px' }} alt="Featured Wall hanging" />
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--mahogany)', display: 'block', marginBottom: '4px' }}>TOP SELLER</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-body)' }}>Macramé Wall Hanging ₹599</span>
                </div>
              </div>
            </div>

            {/* Craft Supplies Mega Dropdown */}
            <div style={{ position: 'relative' }} className="group-hover-anchor">
              <span style={{ color: 'var(--text-body)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Supplies <ChevronDown size={12} />
              </span>
              <div className="mega-menu" style={{
                position: 'absolute',
                top: '100%',
                left: '-180px',
                width: '740px',
                backgroundColor: '#FFFFFF',
                borderTop: '3px solid var(--gold)',
                boxShadow: '0 10px 30px rgba(30,18,9,0.12)',
                borderRadius: '0 0 12px 12px',
                padding: '24px',
                display: 'none',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '20px',
                zIndex: 100
              }}>
                <div>
                  <h4 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--mahogany)', fontSize: '15px', marginBottom: '12px', borderBottom: '1px solid var(--border-warm)', paddingBottom: '6px' }}>Fabric & Fibre</h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', textTransform: 'none', letterSpacing: 'normal' }}>
                    <li><span onClick={() => { setView({ page: 'home', productId: null }); setActiveCategoryFilter("Craft Supplies"); }} style={{ color: 'var(--text-body)', cursor: 'pointer' }}>Cotton & Jute</span></li>
                    <li><span onClick={() => { setView({ page: 'home', productId: null }); setActiveCategoryFilter("Craft Supplies"); }} style={{ color: 'var(--text-body)', cursor: 'pointer' }}>Felt Roll</span></li>
                    <li><span onClick={() => { setView({ page: 'home', productId: null }); setActiveCategoryFilter("Craft Supplies"); }} style={{ color: 'var(--text-body)', cursor: 'pointer' }}>Velvet & Canvas</span></li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--mahogany)', fontSize: '15px', marginBottom: '12px', borderBottom: '1px solid var(--border-warm)', paddingBottom: '6px' }}>Colour & Paint</h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', textTransform: 'none', letterSpacing: 'normal' }}>
                    <li><span onClick={() => { setView({ page: 'home', productId: null }); setActiveCategoryFilter("Craft Supplies"); }} style={{ color: 'var(--text-body)', cursor: 'pointer' }}>Fabric Acrylics</span></li>
                    <li><span onClick={() => { setView({ page: 'home', productId: null }); setActiveCategoryFilter("Craft Supplies"); }} style={{ color: 'var(--text-body)', cursor: 'pointer' }}>Watercolors</span></li>
                    <li><span onClick={() => { setView({ page: 'home', productId: null }); setActiveCategoryFilter("Craft Supplies"); }} style={{ color: 'var(--text-body)', cursor: 'pointer' }}>Glitters</span></li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--mahogany)', fontSize: '15px', marginBottom: '12px', borderBottom: '1px solid var(--border-warm)', paddingBottom: '6px' }}>Beads & Stones</h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', textTransform: 'none', letterSpacing: 'normal' }}>
                    <li><span onClick={() => { setView({ page: 'home', productId: null }); setActiveCategoryFilter("Craft Supplies"); }} style={{ color: 'var(--text-body)', cursor: 'pointer' }}>Glass Beads</span></li>
                    <li><span onClick={() => { setView({ page: 'home', productId: null }); setActiveCategoryFilter("Craft Supplies"); }} style={{ color: 'var(--text-body)', cursor: 'pointer' }}>Wooden Beads</span></li>
                    <li><span onClick={() => { setView({ page: 'home', productId: null }); setActiveCategoryFilter("Craft Supplies"); }} style={{ color: 'var(--text-body)', cursor: 'pointer' }}>Metal & Rhinestones</span></li>
                  </ul>
                </div>
                <div style={{ backgroundColor: 'var(--gold-light)', padding: '12px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <img src="https://placehold.co/120x80/F5E6CC/6B3A2A?text=New+Kit" style={{ borderRadius: '6px', width: '100%', height: '80px', objectFit: 'cover', marginBottom: '8px' }} alt="Resin kit" />
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--mahogany)', display: 'block', marginBottom: '4px' }}>NEW ARRIVAL</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-body)' }}>Resin Starter Kit ₹899</span>
                </div>
              </div>
            </div>

            {/* Direct Sections */}
            <span onClick={() => { setView({ page: 'home', productId: null }); setActiveCategoryFilter("DIY Kits"); }} style={{ color: 'var(--text-body)', cursor: 'pointer' }}>DIY Kits</span>
            <span onClick={() => { setView({ page: 'home', productId: null }); setActiveCategoryFilter("Tools & Accessories"); }} style={{ color: 'var(--text-body)', cursor: 'pointer' }}>Tools</span>
            <span onClick={() => { setView({ page: 'home', productId: null }); setActiveCategoryFilter("Seeds & Nature Craft"); }} style={{ color: 'var(--text-body)', cursor: 'pointer' }}>Seeds</span>

            {/* Accent Labels */}
            <span 
              onClick={() => { setView({ page: 'home', productId: null }); setActiveCategoryFilter("New Arrivals"); }} 
              style={{ color: 'var(--rose)', cursor: 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              New Arrivals <span className="blinking-dot"></span>
            </span>

            <span 
              onClick={() => { setView({ page: 'home', productId: null }); setActiveCategoryFilter("Sale"); }} 
              style={{ color: '#D32F2F', cursor: 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Sale <span style={{ fontSize: '9px', backgroundColor: '#D32F2F', color: '#FFF', padding: '1px 4px', borderRadius: '4px', lineHeight: '1' }}>HOT</span>
            </span>
          </nav>

          {/* Right: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--espresso)' }}>
            <button 
              onClick={() => setSearchOpen(true)}
              className="desktop-only"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: '6px' }}
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <button 
              onClick={() => {
                if (wishlistItems.length === 0) {
                  addToast("Wishlist is empty!");
                } else {
                  addToast(`Your wishlist has ${wishlistItems.length} items`);
                }
              }}
              className="desktop-only"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: '6px', position: 'relative' }}
              aria-label="Wishlist"
            >
              <Heart size={20} style={{ fill: wishlistItems.length > 0 ? 'var(--rose)' : 'none', color: wishlistItems.length > 0 ? 'var(--rose)' : 'inherit' }} />
              {wishlistItems.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  backgroundColor: 'var(--rose)',
                  color: 'white',
                  borderRadius: '50%',
                  fontSize: '9px',
                  width: '15px',
                  height: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {currentUser ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="ua-header-user-btn"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <div className="ua-header-avatar-sm">{currentUser.avatar}</div>
                  <span className="desktop-only" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--espresso)' }}>{currentUser.name.split(' ')[0]}</span>
                </button>
                {showUserDropdown && (
                  <div className="ua-header-dropdown">
                    <div className="ua-header-dropdown-header">
                      <div className="ua-header-dropdown-name">{currentUser.name}</div>
                      <div className="ua-header-dropdown-email">{currentUser.email}</div>
                    </div>
                    <button className="ua-header-dropdown-item" onClick={() => { setView({ page: 'account', productId: null }); setShowUserDropdown(false); }}>
                      <User size={14} style={{ marginRight: 6 }} /> My Account
                    </button>
                    <button className="ua-header-dropdown-item" onClick={() => { setActiveTab('admin'); setShowUserDropdown(false); }}>
                      <Award size={14} style={{ marginRight: 6 }} /> Admin Panel
                    </button>
                    <div className="ua-header-dropdown-divider"></div>
                    <button className="ua-header-dropdown-item danger" onClick={() => { userLogout(); setView({ page: 'home', productId: null }); setShowUserDropdown(false); }}>
                      <LogOut size={14} style={{ marginRight: 6 }} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => { setAuthTab('login'); setAuthModalOpen(true); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: '6px' }}
                aria-label="Account Login"
              >
                <User size={20} />
              </button>
            )}

            <button 
              onClick={() => setCartOpen(true)}
              className="desktop-only"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: '6px', position: 'relative' }}
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={20} />
              {cartItems.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  backgroundColor: 'var(--mahogany)',
                  color: 'var(--gold-light)',
                  borderRadius: '50%',
                  fontSize: '9px',
                  width: '15px',
                  height: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Global Mega-Menu hover trigger script */}
        <style>{`
          .group-hover-anchor:hover .mega-menu {
            display: grid !important;
          }
        `}</style>
      </div>
    );
  };

  // Section 1: Hero Slider Component
  const renderHero = () => {
    const slides = [
      {
        tag: "✦ 100% Handmade",
        tagBg: 'var(--rose)',
        title: "Handmade with Heart, Crafted for You",
        subtitle: "Discover India's finest handmade crafts, artisan gifts, and premium craft supplies.",
        btn1Text: "Shop Now →",
        btn2Text: "Explore Collections",
        bg: 'var(--gold-light)',
        img: "https://placehold.co/560x480/F5E6CC/6B3A2A?text=Handmade+Crafts",
        light: false,
        trust: "⭐ Rated 4.8 by 1 Lakh+ Crafters"
      },
      {
        tag: "🎁 Festival Collection is Live",
        tagBg: 'var(--mahogany)',
        title: "Create Magical Moments This Season",
        subtitle: "Festival DIY kits, handmade decor & personalised gifts — all in one place.",
        btn1Text: "Shop Festival Kits →",
        bg: '#F5E6CC',
        gradient: 'linear-gradient(135deg, #F5E6CC 0%, #FDF8F0 100%)',
        img: "https://placehold.co/560x480/FDF8F0/C07850?text=Festival+Kits",
        light: false
      },
      {
        tag: "🔥 Limited Time Offer",
        tagBg: 'var(--rose)',
        title: "Upto 60% Off This Week",
        subtitle: "On handmade decor, craft tools, supplies and gift hampers.",
        btn1Text: "View All Offers →",
        btn1Bg: 'var(--gold)',
        btn1Color: 'var(--espresso)',
        bg: 'var(--espresso)',
        img: "https://placehold.co/560x480/1E1209/D4A96A?text=Special+Offers",
        light: true
      }
    ];

    const currentSlide = slides[activeSlide];

    return (
      <section style={{
        height: '600px',
        width: '100%',
        position: 'relative',
        backgroundColor: currentSlide.bg,
        backgroundImage: currentSlide.gradient || 'none',
        overflow: 'hidden',
        transition: 'background-color 0.8s ease-in-out'
      }}>
        {/* Leaf/Thread Overlay (faint) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 10c10 0 10 20 20 20-10 0-10-20-20-20zm0 40c-10 0-10-20-20-20 10 0 10 20 20 20z' fill='%236b3a2a'/%3E%3C/svg%3E")`,
          pointerEvents: 'none'
        }} />

        <div className="container" style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          gap: '32px'
        }}>
          {/* Left Contents */}
          <div style={{ flex: '1', maxWidth: '600px', color: currentSlide.light ? 'var(--ivory)' : 'var(--text-body)' }}>
            <span style={{
              display: 'inline-block',
              backgroundColor: currentSlide.tagBg,
              color: '#FFF',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '20px'
            }}>
              {currentSlide.tag}
            </span>

            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '52px',
              fontWeight: '700',
              lineHeight: '1.15',
              color: currentSlide.light ? 'var(--gold-light)' : 'var(--mahogany)',
              marginBottom: '20px'
            }}>
              {currentSlide.title}
            </h1>

            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '16px',
              lineHeight: '1.75',
              marginBottom: '32px',
              color: currentSlide.light ? 'rgba(245,230,204,0.85)' : 'var(--text-body)'
            }}>
              {currentSlide.subtitle}
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => {
                  setActiveCategoryFilter("All");
                  setTimeout(() => document.getElementById('bestsellers-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
                }}
                className="btn-base" 
                style={{
                  backgroundColor: currentSlide.btn1Bg || 'var(--mahogany)',
                  color: currentSlide.btn1Color || 'var(--ivory)'
                }}
              >
                {currentSlide.btn1Text}
              </button>
              
              {currentSlide.btn2Text && (
                <button 
                  onClick={() => {
                    setTimeout(() => document.getElementById('category-quick-links')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}
                  className="btn-base btn-secondary" 
                  style={{
                    borderColor: 'var(--mahogany)',
                    color: 'var(--mahogany)'
                  }}
                >
                  {currentSlide.btn2Text}
                </button>
              )}
            </div>

            {currentSlide.trust && (
              <div style={{ marginTop: '24px', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{currentSlide.trust}</span>
              </div>
            )}
          </div>

          {/* Right Contents: Product Image Mock */}
          <div className="desktop-only" style={{ flex: '1', display: 'flex', justifyContent: 'flex-end', height: '480px' }}>
            <img 
              src={currentSlide.img} 
              alt={currentSlide.title}
              style={{
                width: '100%',
                maxWidth: '520px',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '24px',
                boxShadow: '0 20px 40px rgba(30,18,9,0.15)',
                border: '1px solid var(--border-warm)'
              }}
            />
          </div>
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={() => setActiveSlide((prev) => (prev - 1 + 3) % 3)}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.7)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--mahogany)'
          }}
          aria-label="Previous Slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={() => setActiveSlide((prev) => (prev + 1) % 3)}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.7)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--mahogany)'
          }}
          aria-label="Next Slide"
        >
          <ChevronRight size={20} />
        </button>

        {/* Slide Indicators / Dots */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px'
        }}>
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeSlide === idx ? 'var(--mahogany)' : 'var(--gold)'
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Mobile height adaptation */}
        <style>{`
          @media (max-width: 768px) {
            section { height: 420px !important; }
            h1 { font-size: 28px !important; }
            section p { font-size: 14px !important; margin-bottom: 20px !important; }
          }
        `}</style>
      </section>
    );
  };

  // Section 2: Trust Strip Component
  const renderTrustStrip = () => {
    const items = [
      { icon: "🚚", label: "Free Shipping Above ₹499" },
      { icon: "🔄", label: "Easy 7-Day Returns" },
      { icon: "💯", label: "100% Handmade" },
      { icon: "🔒", label: "Secure Payments" },
      { icon: "🌿", label: "Eco-Friendly Packaging" }
    ];

    return (
      <div style={{ backgroundColor: 'var(--mahogany)', color: 'var(--ivory)', padding: '16px 0' }}>
        <div className="container">
          <div className="trust-strip-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {items.map((item, index) => (
              <div key={index} className="trust-strip-item" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: '500',
                letterSpacing: '0.04em',
                fontFamily: "'Inter', sans-serif"
              }}>
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <span>{item.label}</span>
                {index < items.length - 1 && (
                  <span className="trust-strip-divider" style={{
                    marginLeft: '28px',
                    width: '1px',
                    height: '14px',
                    backgroundColor: 'var(--gold)',
                    opacity: 0.45,
                    display: 'inline-block'
                  }}></span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Section 3: Category Quick Links Component
  const renderCategoryQuickLinks = () => {
    const categories = [
      { name: "Handmade", filter: "Handmade Decor", img: "https://placehold.co/100x100/F5E6CC/6B3A2A?text=Handmade" },
      { name: "Supplies", filter: "Craft Supplies", img: "https://placehold.co/100x100/E8D0B0/3D2010?text=Supplies" },
      { name: "Tools", filter: "Tools & Accessories", img: "https://placehold.co/100x100/FDF8F0/C07850?text=Tools" },
      { name: "DIY Kits", filter: "DIY Kits", img: "https://placehold.co/100x100/C48B9F/1E1209?text=DIY+Kits" },
      { name: "Decor", filter: "Handmade Decor", img: "https://placehold.co/100x100/7A9E7E/FDF8F0?text=Decor" },
      { name: "Seeds", filter: "Seeds & Nature Craft", img: "https://placehold.co/100x100/F5E6CC/6B3A2A?text=Seeds" },
      { name: "New Arrivals", filter: "New Arrivals", img: "https://placehold.co/100x100/E8D0B0/3D2010?text=New" },
      { name: "Sale", filter: "Sale", img: "https://placehold.co/100x100/1E1209/D4A96A?text=Sale" }
    ];

    return (
      <section id="category-quick-links" style={{ padding: '60px 0', backgroundColor: 'var(--ivory)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: 'var(--mahogany)', fontWeight: '600' }}>
              Shop by Category
            </h2>
            <div className="gold-decorative-divider"></div>
          </div>

          <div className="category-links-container" style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
            {categories.map((cat, idx) => (
              <div 
                key={idx} 
                className="category-link-item"
                onClick={() => setActiveCategoryFilter(cat.filter)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  textAlign: 'center',
                  width: '110px'
                }}
              >
                <div className="cat-img-wrapper" style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  border: cat.filter === activeCategoryFilter ? '3px solid var(--gold)' : '3px solid var(--border-warm)',
                  overflow: 'hidden',
                  marginBottom: '10px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 10px rgba(107,58,42,0.06)'
                }}>
                  <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.3s ease' }} />
                </div>
                <span style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '13px',
                  fontWeight: '500',
                  color: cat.filter === activeCategoryFilter ? 'var(--terracotta)' : 'var(--text-body)'
                }}>
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          .category-link-item:hover .cat-img-wrapper {
            transform: scale(1.08);
            border-color: var(--gold) !important;
          }
          .category-link-item:hover span {
            color: var(--terracotta) !important;
          }
        `}</style>
      </section>
    );
  };

  // Section 4: Promo Banner Cards Component
  const renderPromoBanners = () => {
    return (
      <section style={{ padding: '60px 0', backgroundColor: 'var(--gold-light)' }}>
        <div className="container">
          <div className="responsive-grid-3">
            {PROMO_BANNERS.map((banner) => (
              <div 
                key={banner.id} 
                onClick={() => setActiveCategoryFilter(banner.categoryFilter)}
                className="promo-card" 
                style={{
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  height: '240px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(30,18,9,0.08)'
                }}
              >
                {/* Background Image */}
                <img 
                  className="promo-bg"
                  src={banner.image} 
                  alt={banner.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                />
                
                {/* Overlay gradient */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(30,18,9,0.1) 0%, rgba(30,18,9,0.8) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '24px',
                  color: '#FFFFFF'
                }}>
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(4px)',
                    color: '#FFF',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '10px',
                    fontWeight: '600',
                    letterSpacing: '0.08em',
                    width: 'fit-content',
                    marginBottom: '10px',
                    textTransform: 'uppercase'
                  }}>
                    {banner.pill}
                  </span>
                  
                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '22px',
                    fontWeight: '600',
                    lineHeight: '1.25',
                    marginBottom: '12px'
                  }}>
                    {banner.title}
                  </h3>
                  
                  <span style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    Shop Now <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          .promo-card:hover .promo-bg {
            transform: scale(1.05);
          }
          .promo-card:hover {
            box-shadow: 0 12px 30px rgba(30,18,9,0.15);
          }
        `}</style>
      </section>
    );
  };

  // Reusable Product Card Component
  const renderProductCard = (product) => {
    const isWishlisted = wishlistItems.includes(product.id);
    const isAdding = addingProductIds[product.id] || false;

    // Badges determination
    let badgeText = "";
    let badgeStyle = {};
    if (product.badgeType === "save") {
      badgeText = product.discount;
      badgeStyle = { backgroundColor: 'var(--rose)', color: '#FFFFFF' };
    } else if (product.badgeType === "new") {
      badgeText = "NEW";
      badgeStyle = { backgroundColor: 'var(--sage)', color: '#FFFFFF' };
    } else if (product.badgeType === "bestseller") {
      badgeText = "BESTSELLER";
      badgeStyle = { backgroundColor: 'var(--gold)', color: 'var(--espresso)' };
    }

    return (
      <div key={product.id} className="artisan-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Image Area */}
        <div className="image-hover-wrapper" onClick={() => navigateToProductDetails(product)} style={{ cursor: 'pointer' }}>
          <img src={product.image1} alt={product.name} className="image-hover-primary" />
          <img src={product.image2} alt={product.name} className="image-hover-secondary" />

          {/* Top Left Badge */}
          {badgeText && (
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: '600',
              letterSpacing: '0.04em',
              zIndex: 10,
              ...badgeStyle
            }}>
              {badgeText}
            </div>
          )}

          {/* Top Right Wishlist Heart */}
          <button 
            onClick={(e) => toggleWishlist(product.id, e)}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(30,18,9,0.1)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              color: isWishlisted ? 'var(--rose)' : 'var(--text-muted)',
              transition: 'transform 0.2s ease'
            }}
            className={isWishlisted ? "heart-pulse" : ""}
            aria-label="Toggle Wishlist"
          >
            <Heart size={18} fill={isWishlisted ? "var(--rose)" : "none"} />
          </button>

          {/* Hover Quick View Trigger */}
          <div className="quickview-btn-container" style={{ zIndex: 11 }}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setQuickViewProduct(product);
                setQuickColor(product.colors ? product.colors[0] : "");
                setQuickSize(product.sizes ? product.sizes[0] : "");
                setQuickQty(1);
                setQuickThumbIndex(0);
              }}
              style={{
                backgroundColor: 'rgba(107, 58, 42, 0.9)',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
              }}
            >
              QUICK VIEW
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ padding: '16px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '10px',
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '6px'
          }}>
            MOTHERS CRAFT
          </span>

          <h3 
            onClick={() => navigateToProductDetails(product)}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '18px',
              fontWeight: '500',
              color: 'var(--text-body)',
              cursor: 'pointer',
              marginBottom: '8px',
              lineHeight: '1.3',
              height: '46px',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {product.name}
          </h3>

          {/* Rating Stars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', color: 'var(--gold)' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} fill={i < Math.floor(product.rating) ? "var(--gold)" : "none"} />
              ))}
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              ({product.reviewsCount} reviews)
            </span>
          </div>

          {/* Color Swatches */}
          {product.colors && product.colors.length > 1 && (
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
              {product.colors.map((colorHex, colorIdx) => (
                <div 
                  key={colorIdx} 
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: colorHex,
                    border: '1px solid var(--border-warm)',
                    cursor: 'pointer'
                  }}
                  title={product.colorNames ? product.colorNames[colorIdx] : ""}
                />
              ))}
            </div>
          )}

          {/* Price Block */}
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px',
            marginBottom: '16px',
            marginTop: 'auto'
          }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '20px', fontWeight: '700', color: 'var(--mahogany)' }}>
              ₹{product.salePrice}
            </span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
              ₹{product.originalPrice}
            </span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: '500', color: 'var(--sage)' }}>
              Save ₹{product.originalPrice - product.salePrice}
            </span>
          </div>

          {/* Add to Cart CTA */}
          <button 
            onClick={(e) => triggerAddToCart(product, null, null, 1, e)}
            className="btn-base btn-primary"
            style={{
              width: '100%',
              padding: '10px 0',
              fontSize: '13px',
              backgroundColor: isAdding ? 'var(--sage)' : 'var(--mahogany)'
            }}
          >
            {isAdding ? <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={14} /> Added!</span> : "ADD TO CART"}
          </button>
        </div>
      </div>
    );
  };

  // Section 5: Bestsellers of the Week Component
  const renderBestsellers = () => {
    // Show first 8 products
    const bestsellers = PRODUCTS.slice(0, 8);

    return (
      <section id="bestsellers-section" style={{ padding: '80px 0', backgroundColor: 'var(--ivory)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '40px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', color: 'var(--mahogany)', fontWeight: '600' }}>
                Bestsellers of the Week
              </h2>
              <p style={{ color: 'var(--terracotta)', fontSize: '14px', marginTop: '4px', fontFamily: "'Inter', sans-serif" }}>
                Our most-loved products, handpicked for you
              </p>
            </div>
            <span 
              onClick={() => {
                setActiveCategoryFilter("All");
                addToast("Showing all products below.");
              }} 
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--terracotta)',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              View All →
            </span>
          </div>

          <div className="responsive-grid-4">
            {bestsellers.map((prod) => renderProductCard(prod))}
          </div>
        </div>
      </section>
    );
  };

  // Section 6: Split Feature Banners Component
  const renderSplitBanners = () => {
    return (
      <section style={{ padding: '40px 0', backgroundColor: 'var(--ivory)' }}>
        <div className="container">
          <div className="responsive-grid-2">
            {/* Banner 1: Privilege Club */}
            <div style={{
              backgroundColor: 'var(--mahogany)',
              color: 'var(--gold-light)',
              borderRadius: '16px',
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(30,18,9,0.1)'
            }}>
              <span style={{ fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
                🌸 Join Our Craft Circle
              </span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#FFFFFF', fontWeight: '600', marginBottom: '12px' }}>
                Exclusive Member Benefits
              </h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: 'rgba(245,230,204,0.8)', lineHeight: '1.6', marginBottom: '28px' }}>
                Sign up to our Privilege Club for early catalog access, special subscriber discounts, free online workshops, and birthday gifts.
              </p>
              <button 
                onClick={() => addToast("Privilege Club registrations opening soon!")}
                className="btn-base" 
                style={{ backgroundColor: 'var(--gold)', color: 'var(--espresso)', width: 'fit-content' }}
              >
                Join Free →
              </button>
            </div>

            {/* Banner 2: Corporate Gifting */}
            <div style={{
              backgroundColor: 'var(--espresso)',
              color: 'var(--gold-light)',
              borderRadius: '16px',
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(30,18,9,0.12)'
            }}>
              <span style={{ fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
                🎁 Corporate Gifting
              </span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#FFFFFF', fontWeight: '600', marginBottom: '12px' }}>
                Bulk Handmade Gifts
              </h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: 'rgba(245,230,204,0.8)', lineHeight: '1.6', marginBottom: '28px' }}>
                Personalise handmade gift hampers, diary journals, or candle boxes for your team, clients, and corporate events. Bulk pricing available.
              </p>
              <a 
                href="tel:7983611108"
                className="btn-base" 
                style={{ backgroundColor: 'var(--gold)', color: 'var(--espresso)', width: 'fit-content' }}
              >
                Get a Quote →
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Section 7: New Arrivals Component
  const renderNewArrivals = () => {
    // Show products 9-16
    const newArrivals = PRODUCTS.slice(8, 16);

    return (
      <section style={{ padding: '80px 0', backgroundColor: 'var(--gold-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', color: 'var(--mahogany)', fontWeight: '600' }}>
              New Arrivals ✦
            </h2>
            <p style={{ color: 'var(--terracotta)', fontSize: '14px', marginTop: '4px', fontFamily: "'Inter', sans-serif" }}>
              Fresh from our artisans' hands
            </p>
            <div className="gold-decorative-divider"></div>
          </div>

          <div className="responsive-grid-4">
            {newArrivals.map((prod) => renderProductCard(prod))}
          </div>
        </div>
      </section>
    );
  };

  // Section 8: Deal of the Week Component
  const renderDealOfTheWeek = () => {
    const timeVal = formatTimerValue(countdownSeconds);
    const isAdding = addingProductIds[DEAL_OF_THE_WEEK.id] || false;

    return (
      <section id="deal-of-week" style={{ padding: '80px 0', backgroundColor: 'var(--espresso)', color: 'var(--gold-light)' }}>
        <div className="container">
          <div className="responsive-grid-2" style={{ alignItems: 'center' }}>
            
            {/* Left: Image Gallery */}
            <div>
              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px', marginBottom: '16px' }}>
                <img 
                  src={DEAL_OF_THE_WEEK.images[dealThumbIndex]} 
                  alt={DEAL_OF_THE_WEEK.name} 
                  style={{ width: '100%', height: '500px', objectFit: 'cover' }} 
                />
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  backgroundColor: 'var(--rose)',
                  color: 'white',
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: '600',
                  borderRadius: '4px',
                  textTransform: 'uppercase'
                }}>
                  DEAL OF THE WEEK
                </div>
              </div>

              {/* Thumbnails strip */}
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
                {DEAL_OF_THE_WEEK.images.map((thumb, idx) => (
                  <img 
                    key={idx}
                    src={thumb}
                    alt=""
                    onClick={() => setDealThumbIndex(idx)}
                    style={{
                      width: '70px',
                      height: '70px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: dealThumbIndex === idx ? '2px solid var(--gold)' : '2px solid transparent',
                      opacity: dealThumbIndex === idx ? 1 : 0.7
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Right: Product Details Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span style={{ color: 'var(--rose)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                ⏰ Limited Time Offer
              </span>

              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '30px', fontWeight: '700', color: 'var(--gold-light)' }}>
                {DEAL_OF_THE_WEEK.name}
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ display: 'flex', color: 'var(--gold)' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="var(--gold)" />
                  ))}
                </div>
                <span style={{ fontSize: '13px', color: 'rgba(245,230,204,0.7)' }}>
                  ({DEAL_OF_THE_WEEK.reviewsCount} reviews)
                </span>
              </div>

              {/* Price Details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '34px', fontWeight: '700', color: 'var(--gold)' }}>
                  ₹{DEAL_OF_THE_WEEK.salePrice}
                </span>
                <span style={{ fontSize: '18px', textDecoration: 'line-through', color: 'rgba(245,230,204,0.5)' }}>
                  ₹{DEAL_OF_THE_WEEK.originalPrice}
                </span>
                <span style={{
                  backgroundColor: 'var(--sage)',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  {DEAL_OF_THE_WEEK.discount}
                </span>
              </div>

              {/* Bullet points description */}
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: 'rgba(245,230,204,0.85)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--gold)' }}>✓</span> Complete kit with all materials included
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--gold)' }}>✓</span> Step-by-step video tutorial access
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--gold)' }}>✓</span> Suitable for beginners — no experience needed
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--gold)' }}>✓</span> Makes a perfect handmade home decor gift
                </li>
              </ul>

              {/* Variant Selector: Color */}
              <div>
                <span style={{ display: 'block', fontSize: '12px', color: 'rgba(245,230,204,0.7)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Color: {DEAL_OF_THE_WEEK.colorNames[DEAL_OF_THE_WEEK.colors.indexOf(dealColor)]}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {DEAL_OF_THE_WEEK.colors.map((hexVal, hexIdx) => (
                    <button 
                      key={hexIdx}
                      onClick={() => setDealColor(hexVal)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: hexVal,
                        border: dealColor === hexVal ? '2px solid var(--gold)' : '2px solid transparent',
                        padding: '1px',
                        cursor: 'pointer'
                      }}
                      title={DEAL_OF_THE_WEEK.colorNames[hexIdx]}
                    />
                  ))}
                </div>
              </div>

              {/* Variant Selector: Size */}
              <div>
                <span style={{ display: 'block', fontSize: '12px', color: 'rgba(245,230,204,0.7)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Kit Size: {dealSize}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {DEAL_OF_THE_WEEK.sizes.map((s, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setDealSize(s)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--gold)',
                        backgroundColor: dealSize === s ? 'var(--mahogany)' : 'transparent',
                        color: dealSize === s ? '#FFFFFF' : 'var(--gold-light)',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper & CTAs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px', flexWrap: 'wrap' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid var(--gold)',
                  borderRadius: '6px',
                  overflow: 'hidden'
                }}>
                  <button 
                    onClick={() => setDealQty((prev) => Math.max(1, prev - 1))}
                    style={{ background: 'none', border: 'none', color: 'var(--gold-light)', padding: '10px 14px', cursor: 'pointer' }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ width: '30px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
                    {dealQty}
                  </span>
                  <button 
                    onClick={() => setDealQty((prev) => prev + 1)}
                    style={{ background: 'none', border: 'none', color: 'var(--gold-light)', padding: '10px 14px', cursor: 'pointer' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button 
                  onClick={(e) => triggerAddToCart(DEAL_OF_THE_WEEK, dealColor, dealSize, dealQty, e)}
                  className="btn-base"
                  style={{
                    backgroundColor: isAdding ? 'var(--sage)' : 'var(--mahogany)',
                    color: 'var(--ivory)',
                    padding: '14px 28px'
                  }}
                >
                  {isAdding ? <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={14} /> Added!</span> : "🛒 Add to Cart"}
                </button>

                <button 
                  onClick={(e) => {
                    triggerAddToCart(DEAL_OF_THE_WEEK, dealColor, dealSize, dealQty, e);
                    setCartOpen(true);
                  }}
                  className="btn-base btn-gold"
                  style={{ padding: '14px 28px' }}
                >
                  ⚡ Buy Now
                </button>
              </div>

              {/* Countdown timer */}
              <div style={{ marginTop: '12px' }}>
                <span style={{ fontSize: '12px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
                  ⏰ Offer Ends In:
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px', fontSize: '20px', fontWeight: '700' }}>
                      {timeVal.hh}
                    </div>
                    <span style={{ fontSize: '9px', textTransform: 'uppercase', color: 'rgba(245,230,204,0.5)', marginTop: '4px' }}>Hours</span>
                  </div>
                  <span style={{ fontSize: '20px', fontWeight: '700' }}>:</span>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px', fontSize: '20px', fontWeight: '700' }}>
                      {timeVal.mm}
                    </div>
                    <span style={{ fontSize: '9px', textTransform: 'uppercase', color: 'rgba(245,230,204,0.5)', marginTop: '4px' }}>Mins</span>
                  </div>
                  <span style={{ fontSize: '20px', fontWeight: '700' }}>:</span>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px', fontSize: '20px', fontWeight: '700' }}>
                      {timeVal.ss}
                    </div>
                    <span style={{ fontSize: '9px', textTransform: 'uppercase', color: 'rgba(245,230,204,0.5)', marginTop: '4px' }}>Secs</span>
                  </div>
                </div>
              </div>

              {/* Share and Socials */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px', borderTop: '1px solid rgba(245,230,204,0.15)', paddingTop: '16px' }}>
                <span style={{ fontSize: '13px', color: 'rgba(245,230,204,0.6)' }}>Share Deal:</span>
                <a 
                  href="https://wa.me/917983611108?text=Check+out+this+incredible+Mothers+Craft+Macrame+DIY+Kit+deal!" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: 'rgba(245,230,204,0.7)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                >
                  WhatsApp
                </a>
              </div>

              {/* Mini trust icons strip */}
              <div style={{
                display: 'flex',
                gap: '16px',
                fontSize: '11px',
                color: 'rgba(245,230,204,0.6)',
                marginTop: '8px',
                flexWrap: 'wrap'
              }}>
                <span>🔒 Secure Checkout</span>
                <span>🔄 Easy Returns</span>
                <span>💯 100% Handmade</span>
                <span>🚚 Fast Delivery</span>
              </div>

            </div>

          </div>
        </div>
      </section>
    );
  };

  // Section 9: Category Product Sections
  const renderCategorySections = () => {
    const categories = [
      {
        title: "Handmade Decor ✦",
        bg: 'var(--ivory)',
        items: PRODUCTS.filter(p => p.category === "Handmade Decor").slice(0, 4)
      },
      {
        title: "Craft Supplies ✦",
        bg: 'var(--gold-light)',
        items: PRODUCTS.filter(p => p.category === "Craft Supplies").slice(0, 4)
      },
      {
        title: "DIY Kits ✦",
        bg: 'var(--ivory)',
        items: PRODUCTS.filter(p => p.category === "DIY Kits").slice(0, 4)
      },
      {
        title: "Tools & Accessories ✦",
        bg: 'var(--gold-light)',
        items: PRODUCTS.slice(16, 20) // Tools list
      }
    ];

    return (
      <div id="category-sections">
        {categories.map((cat, idx) => (
          <section key={idx} style={{ padding: '80px 0', backgroundColor: cat.bg }}>
            <div className="container">
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: '32px',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: 'var(--mahogany)', fontWeight: '600' }}>
                    {cat.title}
                  </h3>
                  <div className="gold-decorative-divider" style={{ margin: '8px 0 0 0' }}></div>
                </div>
                <span 
                  onClick={() => {
                    const cleanName = cat.title.replace(" ✦", "");
                    setActiveCategoryFilter(cleanName);
                    addToast(`Filtered by ${cleanName}`);
                  }}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--terracotta)',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  View All →
                </span>
              </div>

              <div className="responsive-grid-4">
                {cat.items.map((prod) => renderProductCard(prod))}
              </div>
            </div>
          </section>
        ))}
      </div>
    );
  };

  // Section 10: Why Choose Us Component
  const renderWhyChooseUs = () => {
    const reasons = [
      {
        icon: "🎨",
        title: "100% Handmade",
        desc: "Every product is lovingly crafted by skilled Indian artisans, keeping ancient crafts alive."
      },
      {
        icon: "🚀",
        title: "Fast Pan India Delivery",
        desc: "Dispatched within 24 hours, delivered straight to your doorstep in 3–7 business days."
      },
      {
        icon: "🔄",
        title: "Hassle-Free Returns",
        desc: "7-day easy returns, no questions asked — your total craft satisfaction is guaranteed."
      },
      {
        icon: "💬",
        title: "Dedicated Support",
        desc: "Reach out to our customer care on Call, Email, or WhatsApp — always here to support you."
      }
    ];

    return (
      <section style={{ padding: '80px 0', backgroundColor: 'var(--mahogany)', color: 'var(--gold-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', color: 'var(--gold-light)', fontWeight: '600' }}>
              Why Crafters Love Us
            </h2>
            <div className="gold-decorative-divider" style={{ background: 'linear-gradient(90deg, var(--gold), var(--gold-light))' }}></div>
          </div>

          <div className="responsive-grid-4">
            {reasons.map((item, idx) => (
              <div key={idx} style={{
                backgroundColor: 'rgba(255, 255, 255, 0.07)',
                border: '1px solid rgba(212, 169, 106, 0.3)',
                borderRadius: '16px',
                padding: '32px 24px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  marginBottom: '20px'
                }}>
                  {item.icon}
                </div>
                
                <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600', fontSize: '18px', color: 'var(--gold-light)', marginBottom: '12px' }}>
                  {item.title}
                </h3>
                
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', lineHeight: '1.6', color: 'rgba(245, 230, 204, 0.8)' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Section 11: Customer Reviews Component
  const renderReviews = () => {
    return (
      <section style={{ padding: '80px 0', backgroundColor: 'var(--ivory)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', color: 'var(--mahogany)', fontWeight: '600' }}>
              What Our Crafters Say ❤️
            </h2>
            <div className="gold-decorative-divider"></div>
          </div>

          {/* Overall Rating Block */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '48px'
          }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '64px', fontWeight: '700', color: 'var(--mahogany)', lineHeight: '1' }}>
              4.8
            </span>
            <div style={{ display: 'flex', color: 'var(--gold)', margin: '8px 0', fontSize: '28px' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={24} fill="var(--gold)" color="var(--gold)" />)}
            </div>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Based on 1,200+ Verified Reviews
            </span>

            {/* Rating breakdown bars */}
            <div style={{ width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { stars: 5, pct: 68 },
                { stars: 4, pct: 22 },
                { stars: 3, pct: 7 },
                { stars: 2, pct: 2 },
                { stars: 1, pct: 1 }
              ].map((row) => (
                <div key={row.stars} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-body)' }}>
                  <span style={{ width: '24px' }}>{row.stars} ★</span>
                  <div className="rating-bar">
                    <div className="rating-bar-fill" style={{ width: `${row.pct}%` }} />
                  </div>
                  <span style={{ width: '32px', textAlign: 'right', color: 'var(--text-muted)' }}>{row.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="responsive-grid-4">
            {CUSTOMER_REVIEWS.map((rev) => (
              <div key={rev.id} className="artisan-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--gold-light)',
                        color: 'var(--mahogany)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '14px'
                      }}>
                        {rev.initial}
                      </div>
                      <div>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-body)', display: 'block' }}>{rev.name}</span>
                        <span style={{ fontSize: '10px', backgroundColor: 'var(--sage)', color: 'white', padding: '1px 4px', borderRadius: '3px', fontWeight: 'bold' }}>VERIFIED ✓</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', color: 'var(--gold)' }}>
                      {[...Array(rev.stars)].map((_, i) => <Star key={i} size={12} fill="var(--gold)" color="var(--gold)" />)}
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{rev.date}</span>
                  </div>

                  <span style={{ fontSize: '12px', color: 'var(--terracotta)', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                    {rev.product}
                  </span>

                  <p style={{ fontSize: '13px', color: 'var(--text-body)', fontStyle: 'italic', lineHeight: '1.6' }}>
                    "{rev.text}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Section 12: Instagram Gallery Component
  const renderInstagramGallery = () => {
    const images = [
      "https://placehold.co/300x300/F5E6CC/6B3A2A?text=Insta+Macrame",
      "https://placehold.co/300x300/E8D0B0/3D2010?text=Insta+Beads",
      "https://placehold.co/300x300/FDF8F0/C07850?text=Insta+Painting",
      "https://placehold.co/300x300/C48B9F/1E1209?text=Insta+Embroidery",
      "https://placehold.co/300x300/7A9E7E/FDF8F0?text=Insta+Journaling",
      "https://placehold.co/300x300/E8D0B0/3D2010?text=Insta+Crochet"
    ];

    return (
      <section style={{ padding: '60px 0', backgroundColor: 'var(--gold-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: 'var(--mahogany)', fontWeight: '600' }}>
              Follow Our Craft Journey 📸
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px', fontFamily: "'Inter', sans-serif" }}>
              @MothersCraft — Tag us to be featured
            </p>
            <div className="gold-decorative-divider"></div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '12px',
            marginBottom: '32px'
          }} className="insta-grid">
            {images.map((imgUrl, index) => (
              <div 
                key={index} 
                className="insta-item" 
                style={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  paddingTop: '100%', /* 1:1 square ratio */
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(30,18,9,0.05)'
                }}
              >
                <img 
                  src={imgUrl} 
                  alt="" 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }} 
                />
                
                {/* Overlay details on hover */}
                <div className="insta-overlay" style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(107, 58, 42, 0.75)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  color: '#FFFFFF',
                  fontWeight: '600',
                  fontSize: '12px',
                  textAlign: 'center',
                  padding: '8px'
                }}>
                  Shop This Look →
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button 
              onClick={() => addToast("Redirecting to Instagram...")}
              className="btn-base btn-secondary"
            >
              Follow on Instagram
            </button>
          </div>
        </div>

        <style>{`
          .insta-item:hover .insta-overlay {
            opacity: 1 !important;
          }
          @media (max-width: 768px) {
            .insta-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 8px !important;
            }
          }
        `}</style>
      </section>
    );
  };

  // Section 13: Craft Tips Blog Component
  const renderBlog = () => {
    return (
      <section style={{ padding: '80px 0', backgroundColor: 'var(--ivory)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', color: 'var(--mahogany)', fontWeight: '600' }}>
              Craft Tips & Inspiration ✦
            </h2>
            <p style={{ color: 'var(--terracotta)', fontSize: '14px', marginTop: '4px', fontFamily: "'Inter', sans-serif" }}>
              Ideas, tutorials and stories from our community
            </p>
            <div className="gold-decorative-divider"></div>
          </div>

          <div className="responsive-grid-3">
            {BLOG_POSTS.map((post) => (
              <div key={post.id} className="artisan-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <img src={post.image} alt={post.title} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: 'var(--gold-light)',
                    color: 'var(--mahogany)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    width: 'fit-content',
                    marginBottom: '12px'
                  }}>
                    {post.category}
                  </span>

                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '22px',
                    fontWeight: '700',
                    color: 'var(--mahogany)',
                    lineHeight: '1.3',
                    marginBottom: '10px'
                  }}>
                    {post.title}
                  </h3>

                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px', flexGrow: 1 }}>
                    {post.excerpt}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    borderTop: '1px solid var(--border-warm)',
                    paddingTop: '14px'
                  }}>
                    <span>{post.date} · {post.readTime}</span>
                    <span 
                      onClick={() => addToast("Blog reader coming soon!")}
                      style={{ color: 'var(--terracotta)', fontWeight: '600', cursor: 'pointer' }}
                    >
                      Read More →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Section 14: Newsletter Signup Component
  const renderNewsletter = () => {
    const handleNewsSubmit = (e) => {
      e.preventDefault();
      if (!newsletterEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
        addToast("Please enter a valid email address.");
        return;
      }
      setNewsletterSuccess(true);
      addToast("🎉 Welcome to the Mothers Craft Family!");
    };

    return (
      <section style={{
        padding: '80px 0',
        background: 'linear-gradient(90deg, var(--mahogany), var(--terracotta))',
        color: 'var(--ivory)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '560px', margin: '0 auto', padding: '0 24px' }}>
          <span style={{ fontSize: '40px', display: 'block', marginBottom: '16px' }}>🌸</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', fontWeight: '700', marginBottom: '12px' }}>
            Join the Mothers Craft Family
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(253, 248, 240, 0.85)', lineHeight: '1.6', marginBottom: '32px' }}>
            Get 10% off your first order + craft tips, new arrivals & exclusive deals.
          </p>

          {!newsletterSuccess ? (
            <form onSubmit={handleNewsSubmit} className="newsletter-form" style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input 
                type="email"
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                style={{
                  flexGrow: 1,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(212,169,106,0.5)',
                  borderRadius: '8px',
                  padding: '14px 18px',
                  color: 'var(--ivory)',
                  fontSize: '14px',
                  outline: 'none'
                }}
                required
              />
              <button 
                type="submit"
                className="btn-base"
                style={{ backgroundColor: 'var(--gold)', color: 'var(--espresso)' }}
              >
                Subscribe
              </button>
            </form>
          ) : (
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '15px',
              fontWeight: '500',
              marginBottom: '16px'
            }}>
              🎉 Welcome! Check your email for your 10% off code
            </div>
          )}

          <span style={{ fontSize: '12px', color: 'rgba(245,230,204,0.6)' }}>
            No spam, ever. Unsubscribe anytime.
          </span>
        </div>
      </section>
    );
  };

  // Detailed Product Detail View routing screen
  const renderProductDetailView = (productId) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return null;

    const isAdding = addingProductIds[product.id] || false;
    const relatedProducts = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

    const checkPincodeColor = pincodeStatus ? (pincodeStatus.status === 'success' ? 'var(--sage)' : '#D32F2F') : 'inherit';

    return (
      <main style={{ padding: '40px 0', backgroundColor: 'var(--ivory)' }}>
        <div className="container">
          
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => setView({ page: 'home', productId: null })}>Home</span>
            <span>/</span>
            <span>{product.category}</span>
            <span>/</span>
            <span style={{ color: 'var(--mahogany)', fontWeight: '600' }}>{product.name}</span>
          </div>

          <div className="responsive-grid-2" style={{ gap: '48px', marginBottom: '60px' }}>
            {/* Left: Product Images with Switcher */}
            <div>
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-warm)', marginBottom: '16px', backgroundColor: '#000' }}>
                {(() => {
                  const mediaItems = [];
                  if (product.image1) mediaItems.push({ type: 'image', url: product.image1 });
                  if (product.image2) mediaItems.push({ type: 'image', url: product.image2 });
                  if (product.image3) mediaItems.push({ type: 'image', url: product.image3 });
                  if (product.image4) mediaItems.push({ type: 'image', url: product.image4 });
                  if (product.image5) mediaItems.push({ type: 'image', url: product.image5 });
                  if (product.image6) mediaItems.push({ type: 'image', url: product.image6 });
                  if (product.image7) mediaItems.push({ type: 'image', url: product.image7 });
                  if (product.image8) mediaItems.push({ type: 'image', url: product.image8 });
                  if (product.video) mediaItems.push({ type: 'video', url: product.video });

                  const activeMedia = mediaItems[detailThumbIndex] || mediaItems[0];
                  if (!activeMedia) return <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>No Media</div>;

                  return (
                    <div>
                      {activeMedia.type === 'video' ? (
                        <video 
                          src={activeMedia.url} 
                          controls 
                          style={{ width: '100%', height: '500px', objectFit: 'contain' }} 
                        />
                      ) : (
                        <img 
                          src={activeMedia.url} 
                          alt={product.name} 
                          style={{ width: '100%', height: '500px', objectFit: 'cover' }} 
                        />
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Thumbnails strip */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {(() => {
                  const mediaItems = [];
                  if (product.image1) mediaItems.push({ type: 'image', url: product.image1 });
                  if (product.image2) mediaItems.push({ type: 'image', url: product.image2 });
                  if (product.image3) mediaItems.push({ type: 'image', url: product.image3 });
                  if (product.image4) mediaItems.push({ type: 'image', url: product.image4 });
                  if (product.image5) mediaItems.push({ type: 'image', url: product.image5 });
                  if (product.image6) mediaItems.push({ type: 'image', url: product.image6 });
                  if (product.image7) mediaItems.push({ type: 'image', url: product.image7 });
                  if (product.image8) mediaItems.push({ type: 'image', url: product.image8 });
                  if (product.video) mediaItems.push({ type: 'video', url: product.video });

                  return mediaItems.map((item, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setDetailThumbIndex(idx)}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        position: 'relative',
                        border: (detailThumbIndex === idx || (detailThumbIndex >= mediaItems.length && idx === 0)) ? '2px solid var(--gold)' : '1px solid var(--border-warm)'
                      }}
                    >
                      {item.type === 'video' ? (
                        <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--espresso)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '24px' }}>🎥</span>
                        </div>
                      ) : (
                        <img 
                          src={item.url} 
                          alt="" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      )}
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Right: Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span style={{ color: 'var(--terracotta)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {product.subCategory}
              </span>

              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', fontWeight: '700', color: 'var(--mahogany)', lineHeight: '1.2' }}>
                {product.name}
              </h1>

              {/* Star review summaries */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ display: 'flex', color: 'var(--gold)' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill={i < Math.floor(product.rating) ? "var(--gold)" : "none"} />
                  ))}
                </div>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  ({product.reviewsCount} verified customer reviews)
                </span>
              </div>

              {/* Price details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '30px', fontWeight: '700', color: 'var(--mahogany)' }}>
                  ₹{product.salePrice}
                </span>
                <span style={{ fontSize: '16px', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                  ₹{product.originalPrice}
                </span>
                <span style={{
                  backgroundColor: 'var(--rose)',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '3px 6px',
                  borderRadius: '4px'
                }}>
                  {product.discount}
                </span>
              </div>

              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: '1.75' }}>
                {product.description}
              </p>

              {/* Variant Selector: Color */}
              {product.colors && (
                <div>
                  <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Color: {detailColor ? product.colorNames[product.colors.indexOf(detailColor)] : "Not selected"}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {product.colors.map((hex, index) => (
                      <button 
                        key={index}
                        onClick={() => setDetailColor(hex)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: hex,
                          border: detailColor === hex ? '2px solid var(--gold)' : '1px solid var(--border-warm)',
                          cursor: 'pointer'
                        }}
                        title={product.colorNames[index]}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Variant Selector: Size */}
              {product.sizes && (
                <div>
                  <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Size: {detailSize || "Not selected"}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {product.sizes.map((sz, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setDetailSize(sz)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          border: detailSize === sz ? '1.5px solid var(--mahogany)' : '1px solid var(--border-warm)',
                          backgroundColor: detailSize === sz ? 'var(--mahogany)' : 'transparent',
                          color: detailSize === sz ? '#FFFFFF' : 'var(--text-body)',
                          fontSize: '13px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Buy */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid var(--border-warm)',
                  borderRadius: '6px'
                }}>
                  <button 
                    onClick={() => setDetailQty((prev) => Math.max(1, prev - 1))}
                    style={{ background: 'none', border: 'none', color: 'var(--text-body)', padding: '10px 14px', cursor: 'pointer' }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ width: '30px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
                    {detailQty}
                  </span>
                  <button 
                    onClick={() => setDetailQty((prev) => prev + 1)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-body)', padding: '10px 14px', cursor: 'pointer' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button 
                  onClick={(e) => triggerAddToCart(product, detailColor, detailSize, detailQty, e)}
                  className="btn-base"
                  style={{
                    backgroundColor: isAdding ? 'var(--sage)' : 'var(--mahogany)',
                    color: 'var(--ivory)',
                    padding: '14px 28px',
                    flexGrow: 1
                  }}
                >
                  {isAdding ? <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={14} /> Added!</span> : "ADD TO CART"}
                </button>
              </div>

              {/* Pincode availability Checker */}
              <div style={{
                marginTop: '16px',
                border: '1px solid var(--border-warm)',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: 'var(--gold-light)'
              }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--mahogany)', display: 'block', marginBottom: '8px' }}>
                  Delivery Availability Check
                </span>
                <form onSubmit={handleCheckPincode} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input 
                    type="text" 
                    placeholder="Enter 6-digit pin code"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-warm)',
                      fontSize: '13px',
                      flexGrow: 1,
                      outline: 'none'
                    }}
                  />
                  <button 
                    type="submit"
                    className="btn-base"
                    style={{
                      backgroundColor: 'var(--mahogany)',
                      color: 'var(--ivory)',
                      padding: '8px 16px',
                      fontSize: '12px'
                    }}
                  >
                    Check
                  </button>
                </form>
                {pincodeStatus && (
                  <span style={{ fontSize: '12px', color: checkPincodeColor, fontWeight: '500' }}>
                    {pincodeStatus.text}
                  </span>
                )}
              </div>

              {/* Technical Specifications list */}
              <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-warm)', paddingTop: '20px' }}>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: 'var(--mahogany)', marginBottom: '8px' }}>
                  Details & Materials
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '6px' }}>
                  <strong>Materials:</strong> {product.materials}
                </p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  <strong>Shipping:</strong> {product.shipping}
                </p>
              </div>

            </div>
          </div>

          {/* Related products recommendation row */}
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', color: 'var(--mahogany)', marginBottom: '24px' }}>
              You May Also Like
            </h3>
            <div className="responsive-grid-4">
              {relatedProducts.map((relProd) => renderProductCard(relProd))}
            </div>
          </div>

        </div>
      </main>
    );
  };

  // Product Quick View Modal
  const renderQuickViewModal = () => {
    if (!quickViewProduct) return null;
    const isAdding = addingProductIds[quickViewProduct.id] || false;

    return (
      <div 
        className="modal-backdrop"
        onClick={() => setQuickViewProduct(null)}
      >
        <div 
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            maxWidth: '860px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            display: 'flex',
            boxShadow: '0 20px 50px rgba(30,18,9,0.25)'
          }}
          className="quickview-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button 
            onClick={() => setQuickViewProduct(null)}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)'
            }}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>

          <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }}>
            {/* Left side: Images */}
            <div style={{ flex: '1 1 400px', padding: '24px' }}>
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-warm)', marginBottom: '12px', backgroundColor: '#000' }}>
                {(() => {
                  const mediaItems = [];
                  if (quickViewProduct.image1) mediaItems.push({ type: 'image', url: quickViewProduct.image1 });
                  if (quickViewProduct.image2) mediaItems.push({ type: 'image', url: quickViewProduct.image2 });
                  if (quickViewProduct.image3) mediaItems.push({ type: 'image', url: quickViewProduct.image3 });
                  if (quickViewProduct.image4) mediaItems.push({ type: 'image', url: quickViewProduct.image4 });
                  if (quickViewProduct.image5) mediaItems.push({ type: 'image', url: quickViewProduct.image5 });
                  if (quickViewProduct.image6) mediaItems.push({ type: 'image', url: quickViewProduct.image6 });
                  if (quickViewProduct.image7) mediaItems.push({ type: 'image', url: quickViewProduct.image7 });
                  if (quickViewProduct.image8) mediaItems.push({ type: 'image', url: quickViewProduct.image8 });
                  if (quickViewProduct.video) mediaItems.push({ type: 'video', url: quickViewProduct.video });

                  const activeMedia = mediaItems[quickThumbIndex] || mediaItems[0];
                  if (!activeMedia) return <div style={{ height: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>No Media</div>;

                  return (
                    <div>
                      {activeMedia.type === 'video' ? (
                        <video 
                          src={activeMedia.url} 
                          controls 
                          style={{ width: '100%', height: '360px', objectFit: 'contain' }} 
                        />
                      ) : (
                        <img 
                          src={activeMedia.url} 
                          alt={quickViewProduct.name} 
                          style={{ width: '100%', height: '360px', objectFit: 'cover' }} 
                        />
                      )}
                    </div>
                  );
                })()}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(() => {
                  const mediaItems = [];
                  if (quickViewProduct.image1) mediaItems.push({ type: 'image', url: quickViewProduct.image1 });
                  if (quickViewProduct.image2) mediaItems.push({ type: 'image', url: quickViewProduct.image2 });
                  if (quickViewProduct.image3) mediaItems.push({ type: 'image', url: quickViewProduct.image3 });
                  if (quickViewProduct.image4) mediaItems.push({ type: 'image', url: quickViewProduct.image4 });
                  if (quickViewProduct.image5) mediaItems.push({ type: 'image', url: quickViewProduct.image5 });
                  if (quickViewProduct.image6) mediaItems.push({ type: 'image', url: quickViewProduct.image6 });
                  if (quickViewProduct.image7) mediaItems.push({ type: 'image', url: quickViewProduct.image7 });
                  if (quickViewProduct.image8) mediaItems.push({ type: 'image', url: quickViewProduct.image8 });
                  if (quickViewProduct.video) mediaItems.push({ type: 'video', url: quickViewProduct.video });

                  return mediaItems.map((item, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setQuickThumbIndex(idx)}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        position: 'relative',
                        border: (quickThumbIndex === idx || (quickThumbIndex >= mediaItems.length && idx === 0)) ? '2px solid var(--gold)' : '1px solid var(--border-warm)'
                      }}
                    >
                      {item.type === 'video' ? (
                        <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--espresso)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '18px' }}>🎥</span>
                        </div>
                      ) : (
                        <img 
                          src={item.url} 
                          alt="" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      )}
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Right side: Info */}
            <div style={{ flex: '1 1 400px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ color: 'var(--terracotta)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>
                {quickViewProduct.subCategory}
              </span>

              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: '700', color: 'var(--mahogany)', lineHeight: '1.2' }}>
                {quickViewProduct.name}
              </h2>

              {/* Price Details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--mahogany)' }}>
                  ₹{quickViewProduct.salePrice}
                </span>
                <span style={{ fontSize: '14px', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                  ₹{quickViewProduct.originalPrice}
                </span>
              </div>

              <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: '1.6' }}>
                {quickViewProduct.description}
              </p>

              {/* Colors */}
              {quickViewProduct.colors && (
                <div>
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Color: {quickColor ? quickViewProduct.colorNames[quickViewProduct.colors.indexOf(quickColor)] : "Default"}
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {quickViewProduct.colors.map((hex, index) => (
                      <button 
                        key={index}
                        onClick={() => setQuickColor(hex)}
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          backgroundColor: hex,
                          border: quickColor === hex ? '2px solid var(--gold)' : '1px solid var(--border-warm)',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {quickViewProduct.sizes && (
                <div>
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Size: {quickSize || "Standard"}
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {quickViewProduct.sizes.map((sz, index) => (
                      <button 
                        key={index}
                        onClick={() => setQuickSize(sz)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '4px',
                          border: quickSize === sz ? '1.5px solid var(--mahogany)' : '1px solid var(--border-warm)',
                          backgroundColor: quickSize === sz ? 'var(--mahogany)' : 'transparent',
                          color: quickSize === sz ? '#FFFFFF' : 'var(--text-body)',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and Cart button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-warm)', borderRadius: '6px' }}>
                  <button 
                    onClick={() => setQuickQty((prev) => Math.max(1, prev - 1))}
                    style={{ background: 'none', border: 'none', color: 'var(--text-body)', padding: '6px 12px', cursor: 'pointer' }}
                  >
                    <Minus size={12} />
                  </button>
                  <span style={{ width: '24px', textAlign: 'center', fontSize: '13px', fontWeight: '600' }}>
                    {quickQty}
                  </span>
                  <button 
                    onClick={() => setQuickQty((prev) => prev + 1)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-body)', padding: '6px 12px', cursor: 'pointer' }}
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <button 
                  onClick={(e) => {
                    triggerAddToCart(quickViewProduct, quickColor, quickSize, quickQty, e);
                    setQuickViewProduct(null);
                  }}
                  className="btn-base"
                  style={{
                    backgroundColor: isAdding ? 'var(--sage)' : 'var(--mahogany)',
                    color: 'var(--ivory)',
                    padding: '12px 20px',
                    flexGrow: 1
                  }}
                >
                  {isAdding ? "Added!" : "ADD TO CART"}
                </button>
              </div>

              <span 
                onClick={() => {
                  navigateToProductDetails(quickViewProduct);
                  setQuickViewProduct(null);
                }}
                style={{
                  fontSize: '13px',
                  color: 'var(--terracotta)',
                  fontWeight: '600',
                  textAlign: 'center',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  marginTop: '12px'
                }}
              >
                View Full Details →
              </span>

            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .quickview-modal-content {
              flex-direction: column !important;
              max-height: 95vh !important;
            }
          }
        `}</style>
      </div>
    );
  };

  // Cart Sidebar Drawer Component
  const renderCartDrawer = () => {
    if (!cartOpen) return null;

    const subtotal = getCartSubtotal();
    const shippingFee = getShippingCost(subtotal);
    const discount = getPromoDiscount();
    const total = subtotal + shippingFee - discount;

    // Free shipping threshold calculations
    const shippingThreshold = 499;
    const progressPercent = Math.min(100, (subtotal / shippingThreshold) * 100);
    const remainingToFree = shippingThreshold - subtotal;

    return (
      <div className="cart-drawer-backdrop" onClick={() => setCartOpen(false)}>
        <div 
          className="cart-drawer"
          onClick={(e) => e.stopPropagation()}
          style={{ transform: cartOpen ? 'translateX(0)' : 'translateX(100%)' }}
        >
          {/* Header */}
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-warm)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--mahogany)', fontWeight: '600' }}>
              Your Bag ({cartItems.reduce((acc, c) => acc + c.quantity, 0)} Items)
            </h3>
            <button 
              onClick={() => setCartOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-body)' }}
              aria-label="Close Cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress bar */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-warm)', backgroundColor: 'var(--gold-light)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '13px',
              fontWeight: '500',
              color: remainingToFree > 0 ? 'var(--terracotta)' : 'var(--sage)',
              marginBottom: '8px'
            }}>
              <span>🚚</span>
              <span>
                {remainingToFree > 0 
                  ? `Add ₹${remainingToFree} more for FREE Shipping!` 
                  : "🎉 You've unlocked Free Shipping!"
                }
              </span>
            </div>
            
            <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-warm)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                background: 'linear-gradient(90deg, var(--terracotta), var(--gold))',
                width: `${progressPercent}%`,
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>

          {/* Cart items list scrollable */}
          <div style={{ flexGrow: 1, overflowY: 'auto', padding: '16px 24px' }}>
            {cartItems.length === 0 ? (
              <div style={{ textAlign: 'center', marginTop: '60px', color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🛍️</span>
                <p style={{ fontSize: '15px' }}>Your craft bag is empty</p>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="btn-base btn-primary"
                  style={{ marginTop: '20px' }}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {cartItems.map((item) => (
                  <div key={item.cartId} style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-warm)', paddingBottom: '16px' }}>
                    <img 
                      src={item.product.image1} 
                      alt={item.product.name} 
                      style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-warm)' }} 
                    />
                    
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <h4 style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '16px',
                        fontWeight: '600',
                        color: 'var(--text-body)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {item.product.name}
                      </h4>
                      <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        Color: {item.color} | Size: {item.size}
                      </span>
                      
                      {/* Compacter quantity selectors */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--mahogany)', borderRadius: '4px' }}>
                          <button 
                            onClick={() => updateCartQty(item.cartId, -1)}
                            style={{ background: 'none', border: 'none', color: 'var(--mahogany)', padding: '2px 8px', cursor: 'pointer' }}
                          >
                            <Minus size={10} />
                          </button>
                          <span style={{ width: '20px', textAlign: 'center', fontSize: '12px', fontWeight: '700' }}>
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateCartQty(item.cartId, 1)}
                            style={{ background: 'none', border: 'none', color: 'var(--mahogany)', padding: '2px 8px', cursor: 'pointer' }}
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: '700', color: 'var(--mahogany)', marginLeft: '8px' }}>
                          ₹{item.product.salePrice * item.quantity}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => removeCartItem(item.cartId)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', height: 'fit-content' }}
                      title="Remove product"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom summary and Coupon */}
          {cartItems.length > 0 && (
            <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-warm)', backgroundColor: '#FAFAFA' }}>
              
              {/* Coupon Row */}
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input 
                  type="text" 
                  placeholder="CRAFT10 (for ₹200 off)" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{
                    flexGrow: 1,
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-warm)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <button 
                  type="submit"
                  className="btn-base"
                  style={{
                    backgroundColor: 'var(--mahogany)',
                    color: 'var(--ivory)',
                    padding: '8px 16px',
                    fontSize: '12px'
                  }}
                >
                  Apply
                </button>
              </form>
              {appliedCoupon && (
                <div style={{ fontSize: '12px', color: 'var(--sage)', fontWeight: '600', marginBottom: '12px' }}>
                  ✓ {appliedCoupon} applied — ₹{discount} saved!
                </div>
              )}

              {/* Order calculations */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-body)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyBetween: 'space-between', justifyContent: 'space-between' }}>
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Shipping</span>
                  <span style={{ color: shippingFee === 0 ? 'var(--sage)' : 'var(--text-body)' }}>
                    {shippingFee === 0 ? "FREE ✓" : `₹${shippingFee}`}
                  </span>
                </div>
                {appliedCoupon && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--sage)' }}>
                    <span>Discount</span>
                    <span>−₹{discount}</span>
                  </div>
                )}
                
                <div style={{
                  borderTop: '2px solid var(--border-warm)',
                  paddingTop: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: 'var(--mahogany)'
                }}>
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {/* Checkout buttons */}
              <button 
                onClick={() => {
                  setCheckoutName(currentUser?.name || "");
                  setCheckoutEmail(currentUser?.email || "");
                  setCheckoutPhone(currentUser?.phone || "");
                  const defaultAddr = currentUser?.addresses?.find(a => a.isDefault) || currentUser?.addresses?.[0];
                  setCheckoutAddress(defaultAddr ? `${defaultAddr.line1}${defaultAddr.line2 ? ', ' + defaultAddr.line2 : ''}, ${defaultAddr.city}, ${defaultAddr.state} - ${defaultAddr.pincode}` : "");
                  setCheckoutOpen(true);
                }}
                className="btn-base btn-primary"
                style={{ width: '100%', height: '50px', fontSize: '16px' }}
              >
                Proceed to Checkout →
              </button>

              <button 
                onClick={() => setCartOpen(false)}
                style={{
                  display: 'block',
                  margin: '12px auto 0',
                  background: 'none',
                  border: 'none',
                  color: 'var(--terracotta)',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Continue Shopping
              </button>

              {/* Security badges */}
              <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>100% Secure Checkout 🔒</span>
              </div>

            </div>
          )}

        </div>
      </div>
    );
  };

  // Customer Auth Modal Component
  const renderAuthModal = () => {
    if (!authModalOpen) return null;

    const handleLoginSubmit = (e) => {
      e.preventDefault();
      setAuthError('');
      setAuthSuccess('');
      if (!loginEmail || !loginPassword) {
        setAuthError('Please enter both email and password.');
        return;
      }
      const res = userLogin(loginEmail, loginPassword);
      if (res.success) {
        setAuthSuccess('Logged in successfully!');
        setTimeout(() => {
          setAuthModalOpen(false);
          setView({ page: 'account', productId: null });
          setLoginEmail('');
          setLoginPassword('');
          setAuthSuccess('');
        }, 1000);
      } else {
        setAuthError(res.error);
      }
    };

    const handleRegisterSubmit = (e) => {
      e.preventDefault();
      setAuthError('');
      setAuthSuccess('');
      if (!registerName || !registerEmail || !registerPassword || !registerConfirm) {
        setAuthError('Please fill in all required fields.');
        return;
      }
      if (registerPassword !== registerConfirm) {
        setAuthError('Passwords do not match.');
        return;
      }
      const res = userRegister({
        name: registerName,
        email: registerEmail,
        phone: registerPhone,
        password: registerPassword
      });
      if (res.success) {
        setAuthSuccess('Account registered successfully! Welcome to Mothers Craft.');
        setTimeout(() => {
          setAuthModalOpen(false);
          setView({ page: 'account', productId: null });
          setRegisterName('');
          setRegisterEmail('');
          setRegisterPhone('');
          setRegisterPassword('');
          setRegisterConfirm('');
          setAuthSuccess('');
        }, 1200);
      } else {
        setAuthError(res.error);
      }
    };

    return (
      <div className="ua-auth-overlay" onClick={() => setAuthModalOpen(false)}>
        <div className="ua-auth-modal" onClick={e => e.stopPropagation()}>
          <div className="ua-auth-header">
            <h2 className="ua-auth-title">Mothers Craft</h2>
            <button className="ua-auth-close" onClick={() => setAuthModalOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="ua-auth-tabs">
            <button 
              className={`ua-auth-tab ${authTab === 'login' ? 'active' : ''}`}
              onClick={() => { setAuthTab('login'); setAuthError(''); }}
            >
              Sign In
            </button>
            <button 
              className={`ua-auth-tab ${authTab === 'register' ? 'active' : ''}`}
              onClick={() => { setAuthTab('register'); setAuthError(''); }}
            >
              Register
            </button>
          </div>

          <div className="ua-auth-body">
            {authError && (
              <div className="ua-auth-error">
                <AlertCircle size={16} /> {authError}
              </div>
            )}
            {authSuccess && (
              <div className="ua-auth-success">
                {authSuccess}
              </div>
            )}

            {authTab === 'login' ? (
              <form onSubmit={handleLoginSubmit}>
                <div className="ua-demo-creds">
                  <strong>Demo Login:</strong> aarti.r@gmail.com / user123
                </div>
                <div className="ua-form-group">
                  <label className="ua-form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="ua-form-input" 
                    value={loginEmail} 
                    onChange={e => setLoginEmail(e.target.value)} 
                    placeholder="Enter email"
                    required
                  />
                </div>
                <div className="ua-form-group">
                  <label className="ua-form-label">Password</label>
                  <input 
                    type="password" 
                    className="ua-form-input" 
                    value={loginPassword} 
                    onChange={e => setLoginPassword(e.target.value)} 
                    placeholder="Enter password"
                    required
                  />
                </div>
                <button type="submit" className="ua-btn ua-btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>
                  Sign In
                </button>
                <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--ua-text-secondary)' }}>
                  Are you an Admin?{' '}
                  <button 
                    type="button"
                    onClick={() => { 
                      setAuthModalOpen(false); 
                      setActiveTab('admin'); 
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--terracotta)', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                  >
                    Go to Admin Login
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit}>
                <div className="ua-form-group">
                  <label className="ua-form-label">Full Name *</label>
                  <input 
                    type="text" 
                    className="ua-form-input" 
                    value={registerName} 
                    onChange={e => setRegisterName(e.target.value)} 
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="ua-form-group">
                  <label className="ua-form-label">Email Address *</label>
                  <input 
                    type="email" 
                    className="ua-form-input" 
                    value={registerEmail} 
                    onChange={e => setRegisterEmail(e.target.value)} 
                    placeholder="Enter email"
                    required
                  />
                </div>
                <div className="ua-form-group">
                  <label className="ua-form-label">Phone Number</label>
                  <input 
                    type="text" 
                    className="ua-form-input" 
                    value={registerPhone} 
                    onChange={e => setRegisterPhone(e.target.value)} 
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div className="ua-form-group">
                  <label className="ua-form-label">Password *</label>
                  <input 
                    type="password" 
                    className="ua-form-input" 
                    value={registerPassword} 
                    onChange={e => setRegisterPassword(e.target.value)} 
                    placeholder="Min 6 characters"
                    required
                  />
                </div>
                <div className="ua-form-group">
                  <label className="ua-form-label">Confirm Password *</label>
                  <input 
                    type="password" 
                    className="ua-form-input" 
                    value={registerConfirm} 
                    onChange={e => setRegisterConfirm(e.target.value)} 
                    placeholder="Re-enter password"
                    required
                  />
                </div>
                <button type="submit" className="ua-btn ua-btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>
                  Create Account
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Helper shipping calculators
  const getShippingCost = (subtotal) => {
    if (subtotal === 0) return 0;
    const threshold = settings?.freeShippingThreshold ?? 499;
    if (subtotal >= threshold) return 0;
    return settings?.shippingZones?.[1]?.rate ?? 49;
  };

  const getPromoDiscount = () => {
    if (!appliedCoupon) return 0;
    const coupon = coupons?.find(c => c.code.toUpperCase() === appliedCoupon.toUpperCase() && c.active);
    if (!coupon) return 0;
    const subtotal = getCartSubtotal();
    if (coupon.type === 'percentage') {
      return Math.round((subtotal * coupon.value) / 100);
    } else {
      return coupon.value;
    }
  };

  // Checkout Modal Component
  const renderCheckoutModal = () => {
    if (!checkoutOpen) return null;

    const subtotal = getCartSubtotal();
    const shippingFee = getShippingCost(subtotal);
    const discount = getPromoDiscount();
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + shippingFee - discount + gst;

    const handlePlaceOrderSubmit = (e) => {
      e.preventDefault();
      if (!checkoutName || !checkoutEmail || !checkoutPhone || !checkoutAddress) {
        addToast("Please fill in all details.");
        return;
      }
      
      const orderDetails = {
        customer: {
          name: checkoutName,
          email: checkoutEmail,
          phone: checkoutPhone,
          address: checkoutAddress + (pincode ? `, PIN: ${pincode}` : '')
        },
        items: cartItems.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          variant: `${item.color} / ${item.size}`,
          qty: item.quantity,
          price: item.product.salePrice,
          image: item.product.image1
        })),
        subtotal: subtotal,
        shipping: shippingFee,
        discount: discount,
        tax: gst,
        total: total,
        payment: {
          method: checkoutPaymentMethod,
          status: checkoutPaymentMethod === 'COD' ? 'Pending' : 'Paid',
          transactionId: checkoutPaymentMethod === 'COD' ? '' : 'UPI' + Math.round(Math.random() * 10000000000)
        },
        status: 'pending',
        notes: ''
      };

      addOrder(orderDetails);
      setCartItems([]);
      setCheckoutOpen(false);
      setCartOpen(false);
      addToast("🎉 Order Placed Successfully! Real-time synced with Admin panel.");
    };

    return (
      <div className="modal-backdrop" onClick={() => setCheckoutOpen(false)}>
        <div 
          className="artisan-card"
          onClick={(e) => e.stopPropagation()}
          style={{ 
            maxWidth: '600px', 
            width: '100%', 
            maxHeight: '90vh', 
            overflowY: 'auto', 
            backgroundColor: 'var(--ivory)', 
            padding: '30px',
            position: 'relative'
          }}
        >
          {/* Close button */}
          <button 
            onClick={() => setCheckoutOpen(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--mahogany)'
            }}
          >
            <X size={24} />
          </button>

          <h2 style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: '28px', 
            color: 'var(--mahogany)', 
            marginBottom: '20px',
            textAlign: 'center' 
          }}>
            Secure Checkout
          </h2>

          <form onSubmit={handlePlaceOrderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-body)', display: 'block', marginBottom: '6px' }}>Full Name *</label>
              <input 
                type="text" 
                required 
                value={checkoutName} 
                onChange={(e) => setCheckoutName(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-warm)', outline: 'none' }}
                placeholder="Aarti Raghavan"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-body)', display: 'block', marginBottom: '6px' }}>Email Address *</label>
                <input 
                  type="email" 
                  required 
                  value={checkoutEmail} 
                  onChange={(e) => setCheckoutEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-warm)', outline: 'none' }}
                  placeholder="aarti.r@gmail.com"
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-body)', display: 'block', marginBottom: '6px' }}>Phone Number *</label>
                <input 
                  type="text" 
                  required 
                  value={checkoutPhone} 
                  onChange={(e) => setCheckoutPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-warm)', outline: 'none' }}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-body)', display: 'block', marginBottom: '6px' }}>Shipping Address *</label>
              <textarea 
                required 
                rows="3" 
                value={checkoutAddress} 
                onChange={(e) => setCheckoutAddress(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-warm)', outline: 'none', resize: 'none' }}
                placeholder="42, MG Road, Indiranagar, Bangalore, Karnataka"
              />
              {pincode && (
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Pincode: <b>{pincode}</b> (Pre-loaded from delivery checker)
                </p>
              )}
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-body)', display: 'block', marginBottom: '6px' }}>Payment Method *</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button 
                  type="button" 
                  onClick={() => setCheckoutPaymentMethod("UPI")}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: `2px solid ${checkoutPaymentMethod === 'UPI' ? 'var(--terracotta)' : 'var(--border-warm)'}`,
                    backgroundColor: checkoutPaymentMethod === 'UPI' ? 'rgba(192, 120, 80, 0.08)' : 'transparent',
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: 'var(--mahogany)'
                  }}
                >
                  📱 UPI / Net Banking
                </button>
                <button 
                  type="button" 
                  onClick={() => setCheckoutPaymentMethod("COD")}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: `2px solid ${checkoutPaymentMethod === 'COD' ? 'var(--terracotta)' : 'var(--border-warm)'}`,
                    backgroundColor: checkoutPaymentMethod === 'COD' ? 'rgba(192, 120, 80, 0.08)' : 'transparent',
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: 'var(--mahogany)'
                  }}
                >
                  💵 Cash on Delivery (COD)
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div style={{ padding: '16px', background: 'var(--gold-light)', borderRadius: '10px', marginTop: '10px' }}>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', color: 'var(--mahogany)', marginBottom: '10px' }}>Order Summary</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal ({cartItems.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                  <span>₹{subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--sage)' }}>
                    <span>Discount</span>
                    <span>−₹{discount}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>GST (18%)</span>
                  <span>₹{gst}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '16px', borderTop: '1px solid var(--border-warm)', paddingTop: '6px', color: 'var(--mahogany)', marginTop: '4px' }}>
                  <span>Grand Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-base btn-primary"
              style={{ width: '100%', height: '50px', fontSize: '16px', marginTop: '10px' }}
            >
              Confirm & Place Order ₹{total}
            </button>
          </form>
        </div>
      </div>
    );
  };

  // Floating search Overlay Component
  const renderSearchOverlay = () => {
    if (!searchOpen) return null;

    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(253, 248, 240, 0.97)',
        backdropFilter: 'blur(8px)',
        zIndex: 1100,
        display: 'flex',
        flexDirection: 'column',
        padding: '32px'
      }}>
        {/* Close Button */}
        <button 
          onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
          style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mahogany)' }}
        >
          <X size={32} />
        </button>

        <div style={{ maxWidth: '640px', width: '100%', margin: '80px auto 0', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ position: 'relative', borderBottom: '2px solid var(--gold)', paddingBottom: '12px' }}>
            <input 
              type="text" 
              placeholder="Search products, crafts, supplies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                fontSize: '24px',
                fontFamily: "'Inter', sans-serif', font-weight: '300'",
                outline: 'none',
                color: 'var(--text-body)'
              }}
              autoFocus
            />
            <Search size={24} style={{ position: 'absolute', right: '0', top: '4px', color: 'var(--text-muted)' }} />
          </div>

          {/* Suggested quick pills */}
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '12px', textTransform: 'uppercase' }}>
              Suggested Searches:
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {SUGGESTION_PILLS.map((pill, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSearchQuery(pill)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid var(--border-warm)',
                    backgroundColor: 'white',
                    color: 'var(--text-body)',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>

          {/* Results list */}
          {searchQuery && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto', paddingRight: '6px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Found {filteredProducts.length} results
              </span>
              {filteredProducts.map((p) => (
                <div 
                  key={p.id}
                  onClick={() => navigateToProductDetails(p)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '1px solid var(--border-warm)',
                    cursor: 'pointer'
                  }}
                  className="search-result-row"
                >
                  <img src={p.image1} alt={p.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div style={{ flexGrow: 1 }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-body)' }}>{p.name}</span>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>{p.category}</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--mahogany)' }}>
                    ₹{p.salePrice}
                  </span>
                </div>
              ))}
            </div>
          )}

        </div>

        <style>{`
          .search-result-row:hover {
            background-color: var(--gold-light) !important;
          }
        `}</style>
      </div>
    );
  };

  // Footer Component
  const renderFooter = () => {
    return (
      <footer style={{
        backgroundColor: 'var(--espresso)',
        color: 'var(--gold-light)',
        borderTop: '3px solid var(--gold)',
        paddingTop: '60px',
        paddingBottom: '20px',
        fontFamily: "'Inter', sans-serif"
      }}>
        <div className="container">
          
          {/* Main Footer columns */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '32px',
            marginBottom: '40px'
          }} className="footer-cols">
            
            {/* Column 1: Brand details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img 
                  src="/logo.jpg?v=3" 
                  alt="Mothers Craft Logo" 
                  style={{ height: '40px', width: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--gold)' }} 
                />
                <span style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '22px',
                  fontWeight: '700',
                  fontStyle: 'italic',
                  color: '#FFFFFF',
                  lineHeight: '1'
                }}>
                  {settings?.storeName ?? 'Mothers Craft'}
                </span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {settings?.tagline ?? 'Crafted with Love, Made for You'}
              </span>
              <p style={{ fontSize: '13px', color: 'rgba(245,230,204,0.7)', lineHeight: '1.6' }}>
                Every stitch tells a story, and every craft brings warmth. Explore premium handmade goods.
              </p>
              
              {/* Ratings */}
              <div style={{ fontSize: '13px', color: 'var(--gold)' }}>
                ⭐ 4.8 · Rated by 1 Lakh+ Crafters
              </div>
            </div>

            {/* Column 2: Support Center */}
            <div>
              <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)', marginBottom: '20px', fontWeight: '600' }}>
                Support Centre
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <li><span onClick={() => addToast("Support details...")} style={{ color: 'var(--gold-light)', cursor: 'pointer', textDecoration: 'none' }} className="footer-link">Contact Us</span></li>
                <li><span onClick={() => addToast("Return portal...")} style={{ color: 'var(--gold-light)', cursor: 'pointer', textDecoration: 'none' }} className="footer-link">Request Return / Exchange</span></li>
                <li><span onClick={() => addToast("Order tracking...")} style={{ color: 'var(--gold-light)', cursor: 'pointer', textDecoration: 'none' }} className="footer-link">Track Your Order</span></li>
                <li style={{ marginTop: '8px' }}>
                  <a href={`tel:${settings?.contactPhone ?? '7983611108'}`} style={{ color: 'var(--gold-light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    📞 {settings?.contactPhone ?? '7983611108'}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${settings?.contactEmail ?? 'motherscraft07@gmail.com'}`} style={{ color: 'var(--gold-light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    ✉️ {settings?.contactEmail ?? 'motherscraft07@gmail.com'}
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Important Links */}
            <div>
              <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)', marginBottom: '20px', fontWeight: '600' }}>
                Important Links
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <li><span onClick={() => addToast("About details...")} style={{ color: 'var(--gold-light)', cursor: 'pointer' }} className="footer-link">About Us</span></li>
                <li><span onClick={() => addToast("Our story...")} style={{ color: 'var(--gold-light)', cursor: 'pointer' }} className="footer-link">Our Story</span></li>
                <li><span onClick={() => addToast("Blog and tips...")} style={{ color: 'var(--gold-light)', cursor: 'pointer' }} className="footer-link">Blog & Craft Tips</span></li>
                <li><span onClick={() => addToast("Careers page...")} style={{ color: 'var(--gold-light)', cursor: 'pointer' }} className="footer-link">Careers</span></li>
                <li><span onClick={() => addToast("Gallery portal...")} style={{ color: 'var(--gold-light)', cursor: 'pointer' }} className="footer-link">Happy Customers Gallery</span></li>
              </ul>
            </div>

            {/* Column 4: Policies Links */}
            <div>
              <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)', marginBottom: '20px', fontWeight: '600' }}>
                Our Policies
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <li><span onClick={() => addToast("Shipping policies...")} style={{ color: 'var(--gold-light)', cursor: 'pointer' }} className="footer-link">Shipping Policy</span></li>
                <li><span onClick={() => addToast("Privacy details...")} style={{ color: 'var(--gold-light)', cursor: 'pointer' }} className="footer-link">Privacy Policy</span></li>
                <li><span onClick={() => addToast("Terms & conditions...")} style={{ color: 'var(--gold-light)', cursor: 'pointer' }} className="footer-link">T&C</span></li>
                <li><span onClick={() => addToast("Refund details...")} style={{ color: 'var(--gold-light)', cursor: 'pointer' }} className="footer-link">Refund Policy</span></li>
                <li><span onClick={() => addToast("Return policies...")} style={{ color: 'var(--gold-light)', cursor: 'pointer' }} className="footer-link">Return Policy</span></li>
              </ul>
            </div>

            {/* Column 5: Company details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)', marginBottom: '8px', fontWeight: '600' }}>
                Mothers Craft
              </h4>
              <address style={{ fontSize: '12px', color: 'rgba(245,230,204,0.65)', fontStyle: 'normal', lineHeight: '1.5' }}>
                DHEEMRI ROAD, KHWAJA NAGAR NEAR NATIONAL MODERN INTER COLLEGE Moradabad<br />
                District: Moradabad, Uttar Pradesh, 244001
              </address>
              
              <div style={{ fontSize: '12px', color: 'rgba(245,230,204,0.65)' }}>
                <strong>GSTIN:</strong> 09FYJPB1688F1Z7
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(245,230,204,0.65)' }}>
                <strong>Hours:</strong> Mon–Sat, 9 AM – 6 PM
              </div>

              {/* Chat on WhatsApp */}
              <a 
                href="https://wa.me/917983611108" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  backgroundColor: 'var(--sage)',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  width: 'fit-content',
                  marginTop: '4px'
                }}
              >
                💬 Chat with Us
              </a>
            </div>

          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--gold)', opacity: 0.3, margin: '24px 0' }} />

          {/* Bottom Copyright details */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: 'rgba(245,230,204,0.55)',
            flexWrap: 'wrap',
            gap: '12px'
          }} className="footer-bottom">
            <span>© 2025 Mothers Craft | All Rights Reserved</span>
            
            {/* Payment support icons indicator */}
            <span style={{ fontSize: '11px', color: 'rgba(245,230,204,0.45)' }}>
              UPI | PhonePe | Paytm | Visa | Mastercard | COD Support
            </span>

            <span>Made with ❤️ in India</span>
          </div>

        </div>

        <style>{`
          .footer-link:hover {
            color: var(--gold) !important;
            text-decoration: underline !important;
          }
          @media (max-width: 1024px) {
            .footer-cols {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 24px !important;
            }
          }
          @media (max-width: 480px) {
            .footer-cols {
              grid-template-columns: 1fr !important;
            }
            .footer-bottom {
              flex-direction: column;
              text-align: center;
            }
          }
        `}</style>
      </footer>
    );
  };

  // Floating WhatsApp, Back-to-top, Cookie banner Component
  const renderFloatingControls = () => {
    return (
      <>
        {/* WhatsApp Floating button */}
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end'
        }} className="whats-float-wrapper">
          
          {/* Tooltip on hover wrapper */}
          <span className="whats-tooltip" style={{
            backgroundColor: 'var(--espresso)',
            color: 'var(--gold-light)',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            marginBottom: '8px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
            whiteSpace: 'nowrap',
            display: 'none',
            fontFamily: "'Inter', sans-serif"
          }}>
            Chat on WhatsApp
          </span>

          <a 
            href="https://wa.me/917983611108?text=Hello+Mothers+Craft!+I+need+help+with+my+order." 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#25D366',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(37,211,102,0.4)',
              color: 'white',
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
            className="whatsapp-float-btn"
            aria-label="Chat with us on WhatsApp"
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.967C16.528 2.025 14.068.995 11.94.995 6.51 1.05 2.083 5.422 2.08 10.85c-.001 1.748.473 3.328 1.373 4.887L2.453 22.39l6.772-1.78a9.753 9.753 0 0 0 4.422 1.044h.005zm12.383-7.535c-.33-.165-1.951-.963-2.253-1.073-.302-.11-.522-.165-.741.165-.22.33-.85.1.073-1.072-.22-.12-.345-.165-.565-.565-.22-.399-.022-.614.078-.714.099-.099.22-.25.33-.374.11-.12.146-.207.22-.346.074-.14.037-.26-.018-.37-.056-.11-.522-1.258-.715-1.724-.188-.453-.378-.39-.522-.397-.134-.007-.288-.008-.442-.008-.154 0-.405.058-.616.288-.21.23-.8.78-.8 1.901 0 1.12.815 2.203.929 2.355.114.152 1.605 2.45 3.886 3.435.543.235.966.375 1.296.48.545.173 1.04.149 1.432.09.438-.066 1.951-.798 2.227-1.57.275-.77.275-1.43.193-1.57-.083-.14-.303-.22-.633-.385z" />
            </svg>
          </a>
        </div>

        {/* Back to top button */}
        {backToTopVisible && (
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              position: 'fixed',
              bottom: '90px',
              right: '26px',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--mahogany)',
              color: 'var(--ivory)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              zIndex: 1000
            }}
            aria-label="Back to top"
          >
            <ArrowUp size={20} />
          </button>
        )}

        {/* Cookie Consent banner */}
        {!cookieDismissed && (
          <div className="cookie-bar" style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'var(--espresso)',
            color: 'var(--gold-light)',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1200,
            fontFamily: "'Inter', sans-serif', font-size: '13px'",
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <span>🍪 We use cookies to enhance your artisan browsing experience. By using our website, you agree to our policies.</span>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setCookieDismissed(true)}
                className="btn-base"
                style={{ backgroundColor: 'var(--gold)', color: 'var(--espresso)', padding: '8px 16px', fontSize: '12px' }}
              >
                Accept All
              </button>
              <button 
                onClick={() => setCookieDismissed(true)}
                className="btn-base"
                style={{ border: '1px solid var(--gold)', color: 'var(--gold)', backgroundColor: 'transparent', padding: '8px 16px', fontSize: '12px' }}
              >
                Decline
              </button>
            </div>
          </div>
        )}

        <style>{`
          .whats-float-wrapper:hover .whats-tooltip {
            display: block !important;
          }
          .whatsapp-float-btn:hover {
            transform: scale(1.1);
          }
        `}</style>
      </>
    );
  };

  // Mobile Hamburger Navigation Drawer
  const renderMobileMenuDrawer = () => {
    if (!mobileMenuOpen) return null;

    const accordionCategories = [
      { name: "Handmade Decor", filter: "Handmade Decor" },
      { name: "Craft Supplies", filter: "Craft Supplies" },
      { name: "DIY Kits", filter: "DIY Kits" },
      { name: "Tools & Accessories", filter: "Tools & Accessories" },
      { name: "Seeds & Nature", filter: "Seeds & Nature Craft" }
    ];

    return (
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(30,18,9,0.4)',
          backdropFilter: 'blur(2px)',
          zIndex: 1300
        }}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '80vw',
            maxWidth: '340px',
            backgroundColor: '#FFFFFF',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '8px 0 24px rgba(30,18,9,0.15)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', width: '100%', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img 
                  src="/logo.jpg?v=3" 
                  alt="Mothers Craft Logo" 
                  style={{ height: '36px', width: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--gold)' }} 
                />
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: '700', color: 'var(--mahogany)', fontStyle: 'italic', lineHeight: '1' }}>
                  Mothers Craft
                </span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* List Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: '500' }}>
              <span 
                onClick={() => { setView({ page: 'home', productId: null }); setMobileMenuOpen(false); setActiveCategoryFilter("All"); }}
                style={{ cursor: 'pointer', color: 'var(--text-body)' }}
              >
                Home
              </span>
              
              {accordionCategories.map((c, i) => (
                <span 
                  key={i}
                  onClick={() => { 
                    setView({ page: 'home', productId: null }); 
                    setActiveCategoryFilter(c.filter); 
                    setMobileMenuOpen(false); 
                  }}
                  style={{ cursor: 'pointer', color: 'var(--text-body)', borderBottom: '1px solid var(--border-warm)', paddingBottom: '8px' }}
                >
                  {c.name}
                </span>
              ))}

              <span 
                onClick={() => { setView({ page: 'home', productId: null }); setActiveCategoryFilter("New Arrivals"); setMobileMenuOpen(false); }}
                style={{ cursor: 'pointer', color: 'var(--rose)', fontWeight: '700' }}
              >
                New Arrivals ✨
              </span>

              <span 
                onClick={() => { setView({ page: 'home', productId: null }); setActiveCategoryFilter("Sale"); setMobileMenuOpen(false); }}
                style={{ cursor: 'pointer', color: '#D32F2F', fontWeight: '700' }}
              >
                Festival Sale %
              </span>
            </div>
          </div>

          {/* Bottom Socials & Contact */}
          <div style={{ borderTop: '1px solid var(--border-warm)', paddingTop: '20px' }}>
            <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Let's connect:
            </span>
            <a href="tel:7983611108" style={{ display: 'block', fontSize: '13px', color: 'var(--text-body)', textDecoration: 'none', marginBottom: '6px' }}>
              📞 Call: 7983611108
            </a>
            <a href="mailto:motherscraft07@gmail.com" style={{ display: 'block', fontSize: '13px', color: 'var(--text-body)', textDecoration: 'none' }}>
              ✉️ motherscraft07@gmail.com
            </a>
          </div>

        </div>
      </div>
    );
  };

  // Mobile Left Fixed Side Navigation Toolbar
  const renderMobileSideNavigation = () => {
    return (
      <div className="mobile-only" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--border-warm)',
        zIndex: 950,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '8px 0',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
      }}>
        <button 
          onClick={() => { setView({ page: 'home', productId: null }); setActiveCategoryFilter("All"); }}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer' }}
        >
          <Compass size={20} style={{ color: view.page === 'home' && activeCategoryFilter === "All" ? 'var(--mahogany)' : 'var(--text-muted)' }} />
          <span style={{ fontSize: '10px', color: view.page === 'home' && activeCategoryFilter === "All" ? 'var(--mahogany)' : 'var(--text-muted)', fontWeight: '600' }}>Home</span>
        </button>

        <button 
          onClick={() => { setView({ page: 'home', productId: null }); setActiveCategoryFilter("DIY Kits"); }}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer' }}
        >
          <Award size={20} style={{ color: activeCategoryFilter === "DIY Kits" ? 'var(--mahogany)' : 'var(--text-muted)' }} />
          <span style={{ fontSize: '10px', color: activeCategoryFilter === "DIY Kits" ? 'var(--mahogany)' : 'var(--text-muted)', fontWeight: '600' }}>DIY Kits</span>
        </button>

        <button 
          onClick={() => setSearchOpen(true)}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer' }}
        >
          <Search size={20} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600' }}>Search</span>
        </button>

        <button 
          onClick={() => {
            if (wishlistItems.length === 0) {
              addToast("Wishlist is empty!");
            } else {
              addToast(`Wishlist contains ${wishlistItems.length} items.`);
            }
          }}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer', position: 'relative' }}
        >
          <Heart size={20} style={{ color: wishlistItems.length > 0 ? 'var(--rose)' : 'var(--text-muted)' }} />
          {wishlistItems.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '12px',
              backgroundColor: 'var(--rose)',
              color: 'white',
              borderRadius: '50%',
              fontSize: '8px',
              width: '12px',
              height: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              {wishlistItems.length}
            </span>
          )}
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600' }}>Wishlist</span>
        </button>

        <button 
          onClick={() => setCartOpen(true)}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer', position: 'relative' }}
        >
          <ShoppingBag size={20} style={{ color: cartItems.length > 0 ? 'var(--mahogany)' : 'var(--text-muted)' }} />
          {cartItems.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '4px',
              backgroundColor: 'var(--mahogany)',
              color: 'var(--gold-light)',
              borderRadius: '50%',
              fontSize: '8px',
              width: '12px',
              height: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              {cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
            </span>
          )}
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600' }}>Cart</span>
        </button>

        <button 
          onClick={() => {
            if (currentUser) {
              setView({ page: 'account', productId: null });
            } else {
              setAuthTab('login');
              setAuthModalOpen(true);
            }
          }}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer' }}
        >
          <User size={20} style={{ color: view.page === 'account' ? 'var(--mahogany)' : 'var(--text-muted)' }} />
          <span style={{ fontSize: '10px', color: view.page === 'account' ? 'var(--mahogany)' : 'var(--text-muted)', fontWeight: '600' }}>Account</span>
        </button>
      </div>
    );
  };

  // Toast Notification elements rendered dynamically
  const renderToasts = () => {
    return (
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none'
      }}>
        {toasts.map((t) => (
          <div 
            key={t.id}
            style={{
              backgroundColor: 'var(--espresso)',
              color: 'var(--gold-light)',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(30,18,9,0.15)',
              pointerEvents: 'auto',
              borderLeft: '4px solid var(--gold)',
              animation: 'slideIn 0.2s ease forwards'
            }}
          >
            {t.message}
          </div>
        ))}

        <style>{`
          @keyframes slideIn {
            from { transform: translateX(120%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}</style>
      </div>
    );
  };

  // ============================================================================
  // 5. MAIN CORE PAGE ASSEMBLY
  // ============================================================================

  // Filter products by the current Category Selection
  const getFilteredCollectionProducts = () => {
    if (activeCategoryFilter === "All") {
      return PRODUCTS;
    }
    if (activeCategoryFilter === "New Arrivals") {
      return PRODUCTS.slice(8, 16);
    }
    if (activeCategoryFilter === "Sale") {
      // Products with discounts >= 40%
      return PRODUCTS.filter((p) => p.badgeType === "save" || p.id === 21);
    }
    return PRODUCTS.filter((p) => p.category === activeCategoryFilter);
  };

  const collectionProducts = getFilteredCollectionProducts();

  if (settings?.maintenanceMode) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--espresso)',
        color: 'var(--gold-light)',
        fontFamily: "'Playfair Display', serif",
        textAlign: 'center',
        padding: '24px'
      }}>
        {renderToasts()}
        <div style={{
          maxWidth: '500px',
          padding: '40px',
          borderRadius: '16px',
          border: '1.5px solid var(--gold)',
          backgroundColor: 'rgba(107, 58, 42, 0.2)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
        }}>
          <h1 style={{ fontSize: '36px', color: 'var(--gold)', marginBottom: '16px' }}>
            {settings.storeName || 'Mothers Craft'}
          </h1>
          <div style={{ width: '60px', height: '3px', background: 'var(--gold)', margin: '0 auto 24px' }}></div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', color: '#FFFFFF', marginBottom: '20px', lineHeight: '1.6' }}>
            {settings.maintenanceMessage || "We're updating our store. Please check back soon!"}
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: 'var(--terracotta)', letterSpacing: '0.05em' }}>
            Traditional Craftsmanship · Modern Warmth
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--ivory)', position: 'relative' }}>
      
      {/* Toast notifications */}
      {renderToasts()}

      {/* Header and announcements */}
      {renderHeader()}

      {/* Navigation drawer (Left on mobile) */}
      {renderMobileMenuDrawer()}

      {/* Route Views switcher */}
      {view.page === 'product' ? (
        // Product detailed subpage
        renderProductDetailView(view.productId)
      ) : view.page === 'account' ? (
        // Customer account subpage
        <UserAccount 
          onNavigateHome={() => setView({ page: 'home', productId: null })}
          wishlistItems={wishlistItems.map(id => ({ id }))}
          onMoveToCart={(product) => {
            triggerAddToCart(product, null, null, 1);
            setWishlistItems(prev => prev.filter(id => id !== product.id));
            addToast(`${product.name} moved to cart!`);
          }}
          onRemoveFromWishlist={(id) => {
            setWishlistItems(prev => prev.filter(item => item !== id));
            addToast("Item removed from wishlist");
          }}
        />
      ) : (
        // Standard full homepage flow
        <>
          {/* Section 1: Hero Slider */}
          {renderHero()}

          {/* Section 2: Trust Strip banner */}
          {renderTrustStrip()}

          {/* Section 3: Category Quick Links */}
          {renderCategoryQuickLinks()}

          {/* Dynamic Catalog Section — changes on quick link selection */}
          {activeCategoryFilter !== "All" && (
            <section style={{ padding: '60px 0', backgroundColor: 'var(--ivory)' }}>
              <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: 'var(--mahogany)' }}>
                    Category: {activeCategoryFilter}
                  </h2>
                  <button 
                    onClick={() => setActiveCategoryFilter("All")}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--terracotta)',
                      textDecoration: 'underline',
                      fontSize: '14px',
                      cursor: 'pointer',
                      marginTop: '6px'
                    }}
                  >
                    Reset Filter (Show Home page)
                  </button>
                  <div className="gold-decorative-divider"></div>
                </div>
                <div className="responsive-grid-4">
                  {collectionProducts.map((p) => renderProductCard(p))}
                </div>
              </div>
            </section>
          )}

          {/* Section 4: Promo Banner Cards */}
          {renderPromoBanners()}

          {/* Section 5: Bestsellers of the Week */}
          {renderBestsellers()}

          {/* Section 6: Split Feature Banners */}
          {renderSplitBanners()}

          {/* Section 7: New Arrivals */}
          {renderNewArrivals()}

          {/* Section 8: Deal of the Week */}
          {renderDealOfTheWeek()}

          {/* Section 9: Category Product sections (4 Categories) */}
          {renderCategorySections()}

          {/* Section 10: Why Choose Us */}
          {renderWhyChooseUs()}

          {/* Section 11: Customer Reviews */}
          {renderReviews()}

          {/* Section 12: Instagram Gallery Grid */}
          {renderInstagramGallery()}

          {/* Section 13: Craft Tips Blog */}
          {renderBlog()}

          {/* Section 14: Newsletter signup */}
          {renderNewsletter()}
        </>
      )}

      {/* Footer multi-column */}
      {renderFooter()}

      {/* Floating utility panels */}
      {renderFloatingControls()}

      {/* Left side fixed menu toolbar (Mobile under 768px only) */}
      {renderMobileSideNavigation()}

      {/* Quick View Modal */}
      {renderQuickViewModal()}

      {/* Cart drawer overlay panel */}
      {renderCartDrawer()}

      {/* Search overlay panel */}
      {renderSearchOverlay()}

      {/* Checkout overlay modal */}
      {renderCheckoutModal()}

      {/* Customer authentication modal */}
      {renderAuthModal()}

      {/* Layout mobile fixes padding bottom to clear fixed bottom side nav bar and responsive grid overrides */}
      <style>{`
        @media (max-width: 768px) {
          body {
            padding-left: 0 !important;
            padding-bottom: 60px !important;
          }
          .cookie-bar {
            left: 0 !important;
            bottom: 60px !important;
          }
          .trust-strip-container {
            flex-wrap: wrap !important;
            justify-content: center !important;
            gap: 12px 24px !important;
          }
          .trust-strip-divider {
            display: none !important;
          }
          .insta-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .logo-title {
            font-size: 18px !important;
          }
          .logo-tagline {
            display: none !important;
          }
          .insta-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .newsletter-form {
            flex-direction: column !important;
          }
          .newsletter-form button {
            width: 100% !important;
          }
        }
      `}</style>

    </div>
  );
}
