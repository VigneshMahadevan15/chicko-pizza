import { framePath, TOTAL_FRAMES } from "./frames";

/* ─── Types ──────────────────────────────────────────────────── */

export type MenuCategory = "Classic" | "Spicy" | "Premium" | "Veg Specials";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // INR ₹
  image: string;
  category: MenuCategory;
  ingredients: string[];
  badge?: string; // e.g. "BESTSELLER", "NEW"
}

/* ─── Helpers ────────────────────────────────────────────────── */

/** Distribute frame indices evenly across the sequence for visual variety */
function frameAt(percent: number): string {
  const idx = Math.max(1, Math.round(percent * (TOTAL_FRAMES - 1))) + 1;
  return framePath(idx);
}

/* ─── Menu Data (24 items) ───────────────────────────────────── */

export const MENU_ITEMS: MenuItem[] = [
  // ── Classic ──
  {
    id: "margherita",
    name: "Margherita",
    description:
      "The queen of Naples. San Marzano tomato, fresh mozzarella, basil, and extra virgin olive oil on a leopard-spotted crust.",
    price: 249,
    image: frameAt(0),
    category: "Classic",
    ingredients: ["San Marzano", "Mozzarella", "Basil", "EVOO"],
    badge: "BESTSELLER",
  },
  {
    id: "pepperoni-classica",
    name: "Pepperoni Classica",
    description:
      "Crispy-edged pepperoni layered over mozzarella and slow-simmered tomato sauce. A timeless crowd pleaser.",
    price: 299,
    image: frameAt(0.04),
    category: "Classic",
    ingredients: ["Pepperoni", "Mozzarella", "Tomato Sauce", "Oregano"],
  },
  {
    id: "quattro-formaggi",
    name: "Quattro Formaggi",
    description:
      "Four artisanal cheeses — mozzarella, gorgonzola, parmesan, and fontina — melted into creamy harmony.",
    price: 349,
    image: frameAt(0.08),
    category: "Classic",
    ingredients: ["Mozzarella", "Gorgonzola", "Parmesan", "Fontina"],
  },
  {
    id: "napoli-antica",
    name: "Napoli Antica",
    description:
      "Anchovies, capers, and Taggiasca olives over San Marzano. A faithful tribute to the old city.",
    price: 279,
    image: frameAt(0.12),
    category: "Classic",
    ingredients: ["Anchovies", "Capers", "Olives", "San Marzano"],
  },
  {
    id: "prosciutto-funghi",
    name: "Prosciutto e Funghi",
    description:
      "Thinly sliced prosciutto draped over roasted mushrooms and fior di latte. Earthy and delicate.",
    price: 329,
    image: frameAt(0.16),
    category: "Classic",
    ingredients: ["Prosciutto", "Mushrooms", "Fior di Latte", "Truffle Oil"],
  },
  {
    id: "hawaiian-twist",
    name: "Hawaiian Twist",
    description:
      "Caramelized pineapple, smoked chicken, and jalapeño on a mozzarella base. Sweet heat, reimagined.",
    price: 299,
    image: frameAt(0.2),
    category: "Classic",
    ingredients: ["Pineapple", "Smoked Chicken", "Jalapeño", "Mozzarella"],
  },

  // ── Spicy ──
  {
    id: "diavola",
    name: "Diavola",
    description:
      "Fiery Calabrian chili meets slow-cured salami on a bed of molten mozzarella and sugo rosso.",
    price: 319,
    image: frameAt(0.25),
    category: "Spicy",
    ingredients: ["Spicy Salami", "Calabrian Chili", "Mozzarella", "Sugo"],
    badge: "🔥 HOT",
  },
  {
    id: "inferno",
    name: "Inferno",
    description:
      "Ghost pepper sauce, nduja, pickled chili, and rocket on a charred crust. Only for the brave.",
    price: 349,
    image: frameAt(0.3),
    category: "Spicy",
    ingredients: ["Ghost Pepper", "Nduja", "Pickled Chili", "Rocket"],
    badge: "🔥🔥 EXTREME",
  },
  {
    id: "peri-peri-chicken",
    name: "Peri Peri Chicken",
    description:
      "Grilled peri peri chicken, roasted peppers, red onion, and a drizzle of spicy aioli.",
    price: 329,
    image: frameAt(0.34),
    category: "Spicy",
    ingredients: ["Peri Peri Chicken", "Roasted Peppers", "Red Onion", "Aioli"],
  },
  {
    id: "arrabiata-supreme",
    name: "Arrabiata Supreme",
    description:
      "Spicy arrabiata sauce, Italian sausage, cherry tomatoes, and fresh mozzarella with chili flakes.",
    price: 339,
    image: frameAt(0.38),
    category: "Spicy",
    ingredients: ["Italian Sausage", "Cherry Tomato", "Arrabiata", "Chili Flakes"],
  },
  {
    id: "tandoori-kick",
    name: "Tandoori Kick",
    description:
      "Tandoori spiced chicken, green chutney swirl, red onion, and coriander on a smoky base.",
    price: 299,
    image: frameAt(0.42),
    category: "Spicy",
    ingredients: ["Tandoori Chicken", "Green Chutney", "Red Onion", "Coriander"],
    badge: "NEW",
  },

  // ── Premium ──
  {
    id: "tartufo",
    name: "Tartufo Nero",
    description:
      "Shaved black truffle over wild mushrooms and fior di latte, finished with truffle oil. Pure opulence.",
    price: 599,
    image: frameAt(0.5),
    category: "Premium",
    ingredients: ["Black Truffle", "Wild Mushrooms", "Fior di Latte", "Truffle Oil"],
    badge: "CHEF'S PICK",
  },
  {
    id: "lobster-bianca",
    name: "Lobster Bianca",
    description:
      "Butter-poached lobster tail, ricotta, lemon zest, and chive on a white cream base. No tomato — pure luxury.",
    price: 699,
    image: frameAt(0.54),
    category: "Premium",
    ingredients: ["Lobster", "Ricotta", "Lemon Zest", "Cream Base"],
  },
  {
    id: "wagyu-rucola",
    name: "Wagyu & Rucola",
    description:
      "Seared wagyu strips, wild rocket, shaved parmesan, and aged balsamic reduction.",
    price: 649,
    image: frameAt(0.58),
    category: "Premium",
    ingredients: ["Wagyu Beef", "Rocket", "Parmesan", "Balsamic"],
  },
  {
    id: "burrata-prosciutto",
    name: "Burrata & Prosciutto",
    description:
      "Creamy burrata center-stage, San Daniele prosciutto, cherry tomato confit, and micro basil.",
    price: 549,
    image: frameAt(0.62),
    category: "Premium",
    ingredients: ["Burrata", "San Daniele", "Cherry Tomato", "Micro Basil"],
  },
  {
    id: "smoked-salmon",
    name: "Smoked Salmon",
    description:
      "Cold-smoked salmon, crème fraîche, capers, and dill on a crispy thin base. Nordic meets Naples.",
    price: 499,
    image: frameAt(0.66),
    category: "Premium",
    ingredients: ["Smoked Salmon", "Crème Fraîche", "Capers", "Dill"],
    badge: "NEW",
  },

  // ── Veg Specials ──
  {
    id: "garden-verde",
    name: "Garden Verde",
    description:
      "Roasted zucchini, bell peppers, artichoke hearts, and sun-dried tomatoes with pesto drizzle.",
    price: 249,
    image: frameAt(0.72),
    category: "Veg Specials",
    ingredients: ["Zucchini", "Bell Peppers", "Artichoke", "Pesto"],
  },
  {
    id: "paneer-tikka",
    name: "Paneer Tikka Pizza",
    description:
      "Tandoori-spiced paneer, capsicum, onion, and mint chutney on a smoky mozzarella base.",
    price: 279,
    image: frameAt(0.76),
    category: "Veg Specials",
    ingredients: ["Paneer Tikka", "Capsicum", "Onion", "Mint Chutney"],
    badge: "BESTSELLER",
  },
  {
    id: "mushroom-truffle",
    name: "Mushroom & Truffle",
    description:
      "A medley of shiitake, oyster, and portobello mushrooms with truffle cream and thyme.",
    price: 349,
    image: frameAt(0.8),
    category: "Veg Specials",
    ingredients: ["Shiitake", "Oyster Mushroom", "Portobello", "Truffle Cream"],
  },
  {
    id: "margherita-vegan",
    name: "Vegan Margherita",
    description:
      "Plant-based mozzarella, fresh basil, and San Marzano on our signature dough. 100% dairy-free.",
    price: 269,
    image: frameAt(0.84),
    category: "Veg Specials",
    ingredients: ["Vegan Mozzarella", "Basil", "San Marzano", "EVOO"],
  },
  {
    id: "spinach-ricotta",
    name: "Spinaci e Ricotta",
    description:
      "Wilted baby spinach, creamy ricotta, roasted garlic, and toasted pine nuts. Delicate and earthy.",
    price: 299,
    image: frameAt(0.88),
    category: "Veg Specials",
    ingredients: ["Spinach", "Ricotta", "Garlic", "Pine Nuts"],
  },
  {
    id: "corn-jalapeno",
    name: "Corn & Jalapeño",
    description:
      "Sweet charred corn, pickled jalapeño, cream cheese, and a coriander-lime drizzle.",
    price: 249,
    image: frameAt(0.92),
    category: "Veg Specials",
    ingredients: ["Charred Corn", "Jalapeño", "Cream Cheese", "Lime"],
  },
  {
    id: "mediterranean",
    name: "Mediterranean",
    description:
      "Kalamata olives, feta, sun-dried tomatoes, red onion, and oregano. A taste of the Aegean.",
    price: 299,
    image: frameAt(0.96),
    category: "Veg Specials",
    ingredients: ["Kalamata Olives", "Feta", "Sun-Dried Tomato", "Oregano"],
  },
  {
    id: "bbq-veggie",
    name: "BBQ Veggie Loaded",
    description:
      "Smoky BBQ sauce base with grilled paneer, caramelized onions, roasted corn, and jalapeño.",
    price: 279,
    image: frameAt(0.99),
    category: "Veg Specials",
    ingredients: ["BBQ Sauce", "Grilled Paneer", "Caramelized Onion", "Corn"],
  },
];

/** All unique categories in display order */
export const CATEGORIES: MenuCategory[] = [
  "Classic",
  "Spicy",
  "Premium",
  "Veg Specials",
];

/** Format price in INR */
export function formatINR(amount: number): string {
  return `₹${amount}`;
}
