export interface CartItem {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    quantity: number;
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
  
    const existing = cart.find((c) => c.id === item.id);
  
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
  
    saveCart(cart);
  }
  
  export function removeFromCart(id: string) {
    const cart = getCart().filter((item) => item.id !== id);
    saveCart(cart);
  }
  
  export function updateQuantity(id: string, quantity: number) {
    const cart = getCart();
  
    const item = cart.find((c) => c.id === id);
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