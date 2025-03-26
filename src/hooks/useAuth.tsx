
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
  register: (name: string, email: string, password: string) => Promise<boolean>;
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
      
      // Перевіряємо, чи є збережені користувачі в localStorage
      const users = JSON.parse(localStorage.getItem("registered_users") || "[]");
      const foundUser = users.find((u: any) => u.email === email);
      
      if (foundUser && foundUser.password === password) {
        const userObj = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          role: foundUser.role || "user",
        };
        setUser(userObj);
        localStorage.setItem("auth_user", JSON.stringify(userObj));
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

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // В реальному додатку тут має бути запит до API
      // Для демонстрації зберігаємо користувачів в localStorage
      
      // Перевіряємо, чи існує вже користувач з таким email
      const users = JSON.parse(localStorage.getItem("registered_users") || "[]");
      if (users.some((u: any) => u.email === email)) {
        setIsLoading(false);
        return false; // Користувач вже існує
      }
      
      // Створюємо нового користувача
      const newUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        password, // В реальному додатку пароль повинен бути хешований
        role: "user",
      };
      
      // Додаємо до списку зареєстрованих користувачів
      users.push(newUser);
      localStorage.setItem("registered_users", JSON.stringify(users));
      
      // Автоматично авторизуємо нового користувача
      const userObj = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      };
      setUser(userObj);
      localStorage.setItem("auth_user", JSON.stringify(userObj));
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Помилка реєстрації:", error);
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
        register,
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
