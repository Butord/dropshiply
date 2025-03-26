
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Логуємо спроби доступу до неіснуючих сторінок для моніторингу безпеки
    console.error(
      "404 Помилка: Користувач намагався отримати доступ до неіснуючого маршруту:",
      location.pathname
    );
    
    // Тут можна було б додати відправку даних про помилку на сервер безпеки
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-4">
          Упс! Сторінку не знайдено
        </p>
        <p className="text-gray-500 mb-6">
          Сторінка, яку ви шукаєте, не існує або була переміщена.
        </p>
        <div className="flex justify-center">
          <Button 
            variant="default" 
            className="mr-2"
            onClick={() => window.location.href = '/'}
          >
            Повернутися на головну
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.history.back()}
          >
            Назад
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
