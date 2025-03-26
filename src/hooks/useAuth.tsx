
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

// Тимчасові мок-дані для демонстрації
const MOCK_ADMIN_USER: User = {
  id: "1",
  email: "admin@example.com",
  name: "Адміністратор",
  role: "admin",
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Перевіряємо чи користувач уже авторизований при завантаженні
  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // В реальному додатку тут має бути запит до API
      // Для демонстрації просто перевіряємо фіксовані креденціали
      if (email === "admin@example.com" && password === "admin123") {
        setUser(MOCK_ADMIN_USER);
        localStorage.setItem("auth_user", JSON.stringify(MOCK_ADMIN_USER));
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Помилка входу:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth має використовуватись всередині AuthProvider");
  }
  return context;
};
