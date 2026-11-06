import { create } from 'zustand';
import { persist } from 'zustand/middleware';

function lineKey(productId, variantId) {
  return `${productId}::${variantId || 'default'}`;
}

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, quantity = 1) => {
        const key = lineKey(item.productId, item.variantId);
        const items = get().items;
        const existing = items.find((i) => lineKey(i.productId, i.variantId) === key);

        if (existing) {
          set({
            items: items.map((i) =>
              lineKey(i.productId, i.variantId) === key ? { ...i, quantity: i.quantity + quantity } : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity }] });
        }
      },

      updateQuantity: (productId, variantId, quantity) => {
        const key = lineKey(productId, variantId);
        if (quantity < 1) {
          set({ items: get().items.filter((i) => lineKey(i.productId, i.variantId) !== key) });
          return;
        }
        set({
          items: get().items.map((i) => (lineKey(i.productId, i.variantId) === key ? { ...i, quantity } : i)),
        });
      },

      removeItem: (productId, variantId) => {
        const key = lineKey(productId, variantId);
        set({ items: get().items.filter((i) => lineKey(i.productId, i.variantId) !== key) });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'ikey-cart',
      version: 1,
    }
  )
);
