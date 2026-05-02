"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
  type Dispatch,
} from "react";

/* ─── Types ──────────────────────────────────────────────────── */

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "INCREMENT"; payload: string }
  | { type: "DECREMENT"; payload: string }
  | { type: "CLEAR" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "HYDRATE"; payload: CartItem[] };

/* ─── Helpers ────────────────────────────────────────────────── */

const STORAGE_KEY = "chickopizza-cart";

function persistCart(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage unavailable (SSR / private mode)
  }
}

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as CartItem[];
  } catch {
    // ignore
  }
  return [];
}

/* ─── Reducer ────────────────────────────────────────────────── */

function cartReducer(state: CartState, action: CartAction): CartState {
  let next: CartState;

  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        next = {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      } else {
        next = {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
        };
      }
      persistCart(next.items);
      return next;
    }

    case "REMOVE_ITEM": {
      next = {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
      };
      persistCart(next.items);
      return next;
    }

    case "INCREMENT": {
      next = {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
      persistCart(next.items);
      return next;
    }

    case "DECREMENT": {
      const item = state.items.find((i) => i.id === action.payload);
      if (item && item.quantity <= 1) {
        next = {
          ...state,
          items: state.items.filter((i) => i.id !== action.payload),
        };
      } else {
        next = {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload ? { ...i, quantity: i.quantity - 1 } : i
          ),
        };
      }
      persistCart(next.items);
      return next;
    }

    case "CLEAR": {
      persistCart([]);
      return { ...state, items: [] };
    }

    case "OPEN_CART":
      return { ...state, isOpen: true };

    case "CLOSE_CART":
      return { ...state, isOpen: false };

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };

    case "HYDRATE":
      return { ...state, items: action.payload };

    default:
      return state;
  }
}

/* ─── Context ────────────────────────────────────────────────── */

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  dispatch: Dispatch<CartAction>;
  totalCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/* ─── Provider ───────────────────────────────────────────────── */

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = loadCart();
    if (saved.length > 0) {
      dispatch({ type: "HYDRATE", payload: saved });
    }
  }, []);

  const totalCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">) =>
      dispatch({ type: "ADD_ITEM", payload: item }),
    []
  );
  const removeItem = useCallback(
    (id: string) => dispatch({ type: "REMOVE_ITEM", payload: id }),
    []
  );
  const increment = useCallback(
    (id: string) => dispatch({ type: "INCREMENT", payload: id }),
    []
  );
  const decrement = useCallback(
    (id: string) => dispatch({ type: "DECREMENT", payload: id }),
    []
  );
  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);
  const openCart = useCallback(() => dispatch({ type: "OPEN_CART" }), []);
  const closeCart = useCallback(() => dispatch({ type: "CLOSE_CART" }), []);
  const toggleCart = useCallback(() => dispatch({ type: "TOGGLE_CART" }), []);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        dispatch,
        totalCount,
        subtotal,
        addItem,
        removeItem,
        increment,
        decrement,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* ─── Hook ───────────────────────────────────────────────────── */

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a <CartProvider>");
  }
  return ctx;
}
