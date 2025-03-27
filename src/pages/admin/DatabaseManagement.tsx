
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Database,
  RefreshCw,
  ServerCrash,
  Upload,
  Download
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { mockProducts, mockCategories, mockXMLSources } from '@/lib/mockData';
import { mockCustomers } from '@/lib/mockCustomers';
import { mockOrders } from '@/lib/mockOrders';

const DatabaseManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('status');
  const [dbStatus, setDbStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  const [isInitializing, setIsInitializing] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);

  const checkConnection = async () => {
    if (typeof window !== 'undefined') {
      toast({
        title: "Інформація",
        description: "Операції з базою даних не підтримуються в браузері. Для повної функціональності використовуйте серверне оточення.",
      });
      return;
    }

    try {
      const { query } = await import('@/lib/db/config');
      await query('SELECT 1');
      setDbStatus('connected');
      toast({
        title: "З'єднання встановлено",
        description: "Підключення до бази даних успішне",
      });
    } catch (error) {
      console.error("Помилка підключення до бази даних:", error);
      setDbStatus('error');
      toast({
        title: "Помилка з'єднання",
        description: "Не вдалося підключитися до бази даних. Перевірте налаштування.",
        variant: "destructive",
      });
    }
  };

  const handleInitialize = async () => {
    if (typeof window !== 'undefined') {
      toast({
        title: "Інформація",
        description: "Ініціалізація бази даних не підтримується в браузері. Для повної функціональності використовуйте серверне оточення.",
      });
      return;
    }

    setIsInitializing(true);
    try {
      const { initializeDatabase } = await import('@/lib/db/init');
      const success = await initializeDatabase();
      if (success) {
        toast({
          title: "База даних ініціалізована",
          description: "Таблиці успішно створені",
        });
        setDbStatus('connected');
      } else {
        toast({
          title: "Помилка ініціалізації",
          description: "Не вдалося створити всі таблиці",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Помилка ініціалізації бази даних:", error);
      toast({
        title: "Помилка ініціалізації",
        description: "Виникла помилка при створенні таблиць",
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const importDemoData = async () => {
    if (typeof window !== 'undefined') {
      toast({
        title: "Інформація",
        description: "Імпорт демо-даних не підтримується в браузері. Для повної функціональності використовуйте серверне оточення.",
      });
      return;
    }

    setIsImporting(true);
    setImportProgress(0);
    
    try {
      setImportProgress(10);
      const { CategoryModel } = await import('@/lib/db/models/categoryModel');
      for (const category of mockCategories) {
        await CategoryModel.create(category);
      }
      
      setImportProgress(30);
      const { ProductModel } = await import('@/lib/db/models/productModel');
      for (const product of mockProducts) {
        await ProductModel.create(product);
      }
      
      setImportProgress(60);
      const { XMLSourceModel } = await import('@/lib/db/models/xmlSourceModel');
      for (const source of mockXMLSources) {
        await XMLSourceModel.create(source);
      }
      
      setImportProgress(100);
      
      toast({
        title: "Демо-дані імпортовано",
        description: "Тестові дані успішно імпортовано до бази даних",
      });
    } catch (error) {
      console.error("Помилка імпорту демо-даних:", error);
      toast({
        title: "Помилка імпорту",
        description: "Виникла помилка при імпорті демо-даних",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Environment warning message
  const BrowserWarning = () => (
    <Alert>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Браузерне оточення</AlertTitle>
      <AlertDescription>
        Операції з базою даних доступні лише в серверному оточенні. 
        У браузері ці функції недоступні через обмеження безпеки.
      </AlertDescription>
    </Alert>
  );

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <AdminSidebar activePage="database" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border flex items-center px-6">
          <h1 className="text-xl font-semibold">Управління базою даних</h1>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          {typeof window !== 'undefined' && <BrowserWarning />}
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 mt-4">
            <TabsList>
              <TabsTrigger value="status">Статус</TabsTrigger>
              <TabsTrigger value="initialize">Ініціалізація</TabsTrigger>
              <TabsTrigger value="import">Імпорт/Експорт</TabsTrigger>
            </TabsList>
            
            <TabsContent value="status" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Стан бази даних</CardTitle>
                  <CardDescription>
                    Перевірте підключення до бази даних MySQL
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full w-10 h-10 flex items-center justify-center bg-muted">
                      <Database className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">MySQL</p>
                      <p className="text-sm text-muted-foreground">
                        {process.env.VITE_DB_HOST || 'localhost'}:{process.env.VITE_DB_PORT || '3306'}
                      </p>
                    </div>
                    <div className="ml-auto">
                      {dbStatus === 'connected' && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          <span className="text-sm">Підключено</span>
                        </div>
                      )}
                      {dbStatus === 'error' && (
                        <div className="flex items-center text-red-600">
                          <ServerCrash className="h-4 w-4 mr-1" />
                          <span className="text-sm">Помилка</span>
                        </div>
                      )}
                      {dbStatus === 'unknown' && (
                        <div className="flex items-center text-muted-foreground">
                          <span className="text-sm">Не перевірено</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {dbStatus === 'error' && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Помилка підключення</AlertTitle>
                      <AlertDescription>
                        Не вдалося підключитися до бази даних. Перевірте налаштування у файлі .env 
                        або переконайтеся, що MySQL сервер запущено.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={checkConnection} 
                    className="w-full sm:w-auto"
                    variant="outline"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Перевірити підключення
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Налаштування підключення</CardTitle>
                  <CardDescription>
                    Поточні параметри підключення до бази даних
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Хост</p>
                        <div className="p-2 rounded bg-muted/50">
                          {process.env.VITE_DB_HOST || 'localhost'}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Порт</p>
                        <div className="p-2 rounded bg-muted/50">
                          {process.env.VITE_DB_PORT || '3306'}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">База даних</p>
                        <div className="p-2 rounded bg-muted/50">
                          {process.env.VITE_DB_NAME || 'dropshiply'}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Користувач</p>
                        <div className="p-2 rounded bg-muted/50">
                          {process.env.VITE_DB_USER || 'dropshiply_user'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">
                        Щоб змінити ці налаштування, оновіть змінні середовища в файлі .env проекту.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="initialize" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ініціалізація бази даних</CardTitle>
                  <CardDescription>
                    Створення необхідних таблиць у базі даних
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertTitle>Будуть створені наступні таблиці:</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>products - товари</li>
                        <li>product_images - зображення товарів</li>
                        <li>product_tags - теги товарів</li>
                        <li>categories - категорії</li>
                        <li>xml_sources - джерела XML імпорту</li>
                        <li>customers - клієнти</li>
                        <li>orders - замовлення</li>
                        <li>order_items - товари в замовленнях</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                  
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Увага</AlertTitle>
                    <AlertDescription>
                      Ініціалізація не видалить існуючі таблиці, а створить їх, якщо вони відсутні.
                      Якщо таблиці вже існують, вони не будуть змінені.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleInitialize} 
                    disabled={isInitializing || dbStatus === 'error' || typeof window !== 'undefined'}
                    className="w-full sm:w-auto"
                  >
                    {isInitializing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Ініціалізація...
                      </>
                    ) : (
                      <>
                        <Database className="h-4 w-4 mr-2" />
                        Ініціалізувати базу даних
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="import" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Імпорт демо-даних</CardTitle>
                  <CardDescription>
                    Імпорт демонстраційних даних для тестування
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <p>Наступні дані будуть імпортовані:</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="rounded-lg p-4 bg-muted/30">
                        <p className="font-medium mb-1">Товари</p>
                        <p className="text-2xl font-bold">{mockProducts.length}</p>
                      </div>
                      <div className="rounded-lg p-4 bg-muted/30">
                        <p className="font-medium mb-1">Категорії</p>
                        <p className="text-2xl font-bold">{mockCategories.length}</p>
                      </div>
                      <div className="rounded-lg p-4 bg-muted/30">
                        <p className="font-medium mb-1">XML-фіди</p>
                        <p className="text-2xl font-bold">{mockXMLSources.length}</p>
                      </div>
                      <div className="rounded-lg p-4 bg-muted/30">
                        <p className="font-medium mb-1">Клієнти</p>
                        <p className="text-2xl font-bold">{mockCustomers.length}</p>
                      </div>
                    </div>
                    
                    {isImporting && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Прогрес імпорту</span>
                          <span>{importProgress}%</span>
                        </div>
                        <Progress value={importProgress} />
                      </div>
                    )}
                    
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Увага</AlertTitle>
                      <AlertDescription>
                        Імпорт демо-даних може перезаписати існуючі дані з такими ж ідентифікаторами.
                        Використовуйте цю функцію лише для тестування.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                  <Button 
                    onClick={importDemoData} 
                    disabled={isImporting || dbStatus !== 'connected' || typeof window !== 'undefined'}
                    className="w-full sm:w-auto"
                  >
                    {isImporting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Імпортування...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Імпортувати демо-дані
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto"
                    disabled={true}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Експортувати дані
                  </Button>
                </CardFooter>
              </Card>
              
              <Separator />
              
              <Card>
                <CardHeader>
                  <CardTitle>Очищення бази даних</CardTitle>
                  <CardDescription>
                    Видалення всіх даних з бази даних
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Небезпечна операція</AlertTitle>
                    <AlertDescription>
                      Ця дія видалить всі дані з бази даних без можливості відновлення.
                      Використовуйте лише у випадку необхідності.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="destructive"
                    className="w-full sm:w-auto"
                    disabled={true}
                  >
                    Очистити базу даних
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default DatabaseManagement;
