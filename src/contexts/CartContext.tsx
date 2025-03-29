import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

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
  syncWithDatabase: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        if (user && typeof window !== 'undefined') {
          try {
            loadFromLocalStorage();
          } catch (error) {
            console.error('Помилка при отриманні кошика з localStorage:', error);
            loadFromLocalStorage();
          }
        } else {
          loadFromLocalStorage();
        }
      } catch (error) {
        console.error('Помилка при завантаженні кошика:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const loadFromLocalStorage = () => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Помилка при завантаженні кошика з localStorage:', error);
          localStorage.removeItem('cart');
        }
      }
    };

    loadCart();
  }, [user]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('cart', JSON.stringify(items));

      if (user && typeof window !== 'undefined') {
        syncWithDatabase();
      }
    }
  }, [items, isLoading, user]);

  const syncWithDatabase = async (): Promise<void> => {
    if (!user) return;
    
    try {
      console.log('Синхронізація кошика з базою даних для користувача', user.id, items);
    } catch (error) {
      console.error('Помилка при синхронізації кошика з базою даних:', error);
      toast.error('Не вдалося синхронізувати кошик з базою даних');
    }
  };

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id);
      
      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
        return updatedItems;
      } else {
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
        isLoading,
        syncWithDatabase
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
