export interface CartItem {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    quantity: number;
    isJain?: boolean;
    notes?: string;
  }
  
  const CART_KEY = "servora_cart";
  
  export function getCart(): CartItem[] {
    if (typeof window === "undefined") return [];
  
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  }
  
  export function saveCart(cart: CartItem[]) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }
  
  export function addToCart(item: CartItem) {
    const cart = getCart();

  const existing = cart.find(
    (c) => c.id === item.id && c.isJain === item.isJain
  );

  if (existing) {
    existing.quantity += item.quantity || 1;
  } else {
    cart.push({
      ...item,
      quantity: item.quantity || 1,
      isJain: item.isJain || false,
      notes: item.notes || "",
    });
  }

  saveCart(cart);
  }
  
  export function removeFromCart(id: string, isJain?: boolean) {
    const cart = getCart();
  
    const item = cart.find(
      (c) => c.id === id && c.isJain === isJain
    );
  
    if (!item) return;
  
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      const updated = cart.filter(
        (c) => !(c.id === id && c.isJain === isJain)
      );
      saveCart(updated);
      return;
    }
  
    saveCart(cart);
  }
  
  export function updateQuantity(id: string, quantity: number, isJain?: boolean) {
    const cart = getCart();
  
    const item = cart.find(
      (c) => c.id === id && c.isJain === isJain
    );
  
    if (item) {
      item.quantity = quantity;
    }
  
    saveCart(cart);
  }
  
  export function clearCart() {
    localStorage.removeItem(CART_KEY);
  }
  
  export function getCartCount() {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }
  export function getCartTotal() {
    const cart = getCart();
    return cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }