
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type ProtectedRouteProps = {
  children: React.ReactNode;
  adminOnly?: boolean;
};

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  // Показуємо завантаження, поки перевіряємо статус авторизації
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Перенаправляємо неавторизованих користувачів на сторінку входу
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Перевіряємо чи користувач має права адміністратора для адмін-сторінок
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Якщо все гаразд, показуємо вміст сторінки
  return <>{children}</>;
};

export default ProtectedRoute;
