
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getTotal: () => number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  // Завантаження кошика при ініціалізації
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        // Якщо користувач авторизований, спробуємо отримати кошик з бази даних
        if (user && typeof window !== 'undefined') {
          // В браузері ми не можемо безпосередньо звертатись до MySQL,
          // тому тут має бути API-запит до сервера (який ми реалізуємо пізніше)
          // Наразі повертаємось до localStorage
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            try {
              setItems(JSON.parse(savedCart));
            } catch (error) {
              console.error('Помилка при завантаженні кошика:', error);
              localStorage.removeItem('cart');
            }
          }
        } else {
          // Для неавторизованих користувачів використовуємо localStorage
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            try {
              setItems(JSON.parse(savedCart));
            } catch (error) {
              console.error('Помилка при завантаженні кошика:', error);
              localStorage.removeItem('cart');
            }
          }
        }
      } catch (error) {
        console.error('Помилка при завантаженні кошика:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [user]);

  // Збереження кошика при зміні
  useEffect(() => {
    if (!isLoading) {
      // Завжди зберігаємо в localStorage незалежно від авторизації
      // (це гарантує, що кошик не втратиться при виході/вході в систему)
      localStorage.setItem('cart', JSON.stringify(items));

      // Якщо користувач авторизований, зберігаємо також в базу даних
      if (user && typeof window !== 'undefined') {
        // Тут буде API-запит до сервера для оновлення кошика в MySQL
        // Наразі тільки логуємо дію
        console.log('Синхронізація кошика з базою даних для користувача', user.id);
      }
    }
  }, [items, isLoading, user]);

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      // Перевіряємо, чи є товар уже у кошику
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id);
      
      if (existingItemIndex !== -1) {
        // Якщо товар уже є у кошику, оновлюємо його кількість
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
        return updatedItems;
      } else {
        // Якщо товару ще немає у кошику, додаємо його
        return [...prevItems, item];
      }
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    setItems((prevItems) => 
      prevItems.map((item) => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        getCartCount,
        getTotal,
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};
