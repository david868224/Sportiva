/* ==========================================================================
   SPORTIVA — Carrinho de compras (localStorage)
   ========================================================================== */

const CART_KEY = "sportiva_cart";
const FAV_KEY = "sportiva_favorites";
const SHIPPING_COST = 3500;
const FREE_SHIPPING_THRESHOLD = 60000;

const Cart = {
  read() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  write(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    Cart.updateBadge();
  },

  /** cartKey combina id do produto + tamanho, para tratar variantes como linhas distintas */
  cartKey(id, size) {
    return `${id}::${size || "unico"}`;
  },

  add(product, qty = 1, size = null) {
    const items = Cart.read();
    const key = Cart.cartKey(product.id, size);
    const existing = items.find((i) => Cart.cartKey(i.id, i.size) === key);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        category: CATEGORY_META[product.category]?.label || product.category,
        size: size,
        qty: qty,
      });
    }
    Cart.write(items);
  },

  remove(id, size) {
    const items = Cart.read().filter((i) => Cart.cartKey(i.id, i.size) !== Cart.cartKey(id, size));
    Cart.write(items);
  },

  setQty(id, size, qty) {
    const items = Cart.read();
    const item = items.find((i) => Cart.cartKey(i.id, i.size) === Cart.cartKey(id, size));
    if (item) {
      item.qty = Math.max(1, qty);
      Cart.write(items);
    }
  },

  clear() {
    Cart.write([]);
  },

  totalItems() {
    return Cart.read().reduce((sum, i) => sum + i.qty, 0);
  },

  subtotal() {
    return Cart.read().reduce((sum, i) => sum + i.qty * i.price, 0);
  },

  shipping() {
    const sub = Cart.subtotal();
    if (sub === 0) return 0;
    return sub >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  },

  total() {
    return Cart.subtotal() + Cart.shipping();
  },

  updateBadge() {
    const count = Cart.totalItems();
    document.querySelectorAll(".cart-count").forEach((el) => {
      el.textContent = count > 99 ? "99+" : count;
      el.classList.toggle("show", count > 0);
    });
  },
};

const Favorites = {
  read() {
    try {
      const raw = localStorage.getItem(FAV_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },
  write(ids) {
    localStorage.setItem(FAV_KEY, JSON.stringify(ids));
  },
  toggle(id) {
    let ids = Favorites.read();
    if (ids.includes(id)) {
      ids = ids.filter((x) => x !== id);
    } else {
      ids.push(id);
    }
    Favorites.write(ids);
    return ids.includes(id);
  },
  has(id) {
    return Favorites.read().includes(id);
  },
};

document.addEventListener("DOMContentLoaded", Cart.updateBadge);
