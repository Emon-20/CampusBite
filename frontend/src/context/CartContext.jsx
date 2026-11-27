import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (food) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.foodId === food._id);
      if (existing) {
        if (existing.quantity >= food.stock) return prev;
        return prev.map((item) =>
          item.foodId === food._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          foodId: food._id,
          name: food.name,
          price: food.price,
          stock: food.stock,
          image: food.image,
          quantity: 1
        }
      ];
    });
  };

  const updateQuantity = (foodId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.foodId !== foodId) return item;
          const nextQty = item.quantity + delta;
          if (nextQty > item.stock) return item;
          return { ...item, quantity: nextQty };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (foodId) => {
    setCartItems((prev) => prev.filter((item) => item.foodId !== foodId));
  };

  const clearCart = () => setCartItems([]);

  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, totalCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
