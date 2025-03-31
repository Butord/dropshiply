
import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail, Send } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { getEmailSettings, sendOrderNotification, generateOrderNumber } from "@/lib/services/notificationService";

// Схема валідації для тестових даних
const testNotificationSchema = z.object({
  email: z.string().email({ message: "Введіть коректну email адресу" }),
  name: z.string().min(2, { message: "Ім'я має містити принаймні 2 символи" }),
});

type TestNotificationFormValues = z.infer<typeof testNotificationSchema>;

const NotificationTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("email");

  // Налаштування форми
  const form = useForm<TestNotificationFormValues>({
    resolver: zodResolver(testNotificationSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  });

  // Функція тестування email сповіщення
  const handleTestEmail = async (data: TestNotificationFormValues) => {
    setIsLoading(true);
    
    try {
      // Створюємо тестовий об'єкт повідомлення
      const testOrderNumber = generateOrderNumber();
      const testNotification = {
        orderNumber: testOrderNumber,
        customerName: data.name,
        customerEmail: data.email,
        amount: 1299.99,
        paymentMethod: "Тестова оплата",
        paymentDetails: "Тестові деталі оплати",
        items: [
          { name: "Тестовий товар 1", quantity: 2, price: 499.99 },
          { name: "Тестовий товар 2", quantity: 1, price: 300.01 },
        ],
      };

      // Відправляємо тестове повідомлення
      const success = await sendOrderNotification(testNotification);
      
      if (success) {
        toast({
          title: "Тестове повідомлення відправлено",
          description: `Повідомлення було успішно відправлено на ${data.email}`,
        });
      } else {
        toast({
          title: "Помилка відправки",
          description: "Не вдалося відправити тестове повідомлення. Перевірте налаштування пошти.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Помилка при відправці тестового повідомлення:", error);
      toast({
        title: "Помилка відправки",
        description: "Виникла непередбачувана помилка при відправці повідомлення.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Заглушки для інших каналів сповіщень
  const handleTestViber = (data: TestNotificationFormValues) => {
    toast({
      title: "Viber сповіщення",
      description: "Функціональність Viber сповіщень ще не реалізована.",
      variant: "default",
    });
  };

  const handleTestTelegram = (data: TestNotificationFormValues) => {
    toast({
      title: "Telegram сповіщення",
      description: "Функціональність Telegram сповіщень ще не реалізована.",
      variant: "default",
    });
  };

  // Обробка відправки форми в залежності від активного табу
  const onSubmit = (data: TestNotificationFormValues) => {
    switch (activeTab) {
      case "email":
        handleTestEmail(data);
        break;
      case "viber":
        handleTestViber(data);
        break;
      case "telegram":
        handleTestTelegram(data);
        break;
      default:
        handleTestEmail(data);
    }
  };

  // Отримання поточних налаштувань email
  const emailSettings = getEmailSettings();

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <AdminSidebar activePage="notification-test" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border flex items-center px-6">
          <h1 className="text-xl font-semibold">Тестування сповіщень</h1>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Тестування сповіщень</CardTitle>
                <CardDescription>
                  Відправте тестове сповіщення через різні канали зв'язку для перевірки налаштувань.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="email">Електронна пошта</TabsTrigger>
                    <TabsTrigger value="viber">Viber</TabsTrigger>
                    <TabsTrigger value="telegram">Telegram</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="email">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium mb-2">Поточні налаштування</h3>
                            <div className="text-sm bg-muted p-3 rounded-md">
                              <p><strong>Сервіс:</strong> FormSubmit</p>
                              <p><strong>Відправник:</strong> {emailSettings.senderName} &lt;{emailSettings.senderEmail}&gt;</p>
                              <p><strong>Статус:</strong> {emailSettings.enabled ? "Увімкнено" : "Вимкнено"}</p>
                            </div>
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email отримувача</FormLabel>
                                <FormControl>
                                  <Input placeholder="email@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Ім'я отримувача</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ім'я Прізвище" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Відправка...
                            </>
                          ) : (
                            <>
                              <Mail className="mr-2 h-4 w-4" />
                              Відправити тестове повідомлення
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                  
                  <TabsContent value="viber">
                    <div className="p-8 text-center">
                      <div className="mb-4 text-muted-foreground">
                        Функціональність Viber сповіщень ще не реалізована.
                      </div>
                      <Button variant="outline" disabled>
                        <Send className="mr-2 h-4 w-4" />
                        Відправити тестове повідомлення
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="telegram">
                    <div className="p-8 text-center">
                      <div className="mb-4 text-muted-foreground">
                        Функціональність Telegram сповіщень ще не реалізована.
                      </div>
                      <Button variant="outline" disabled>
                        <Send className="mr-2 h-4 w-4" />
                        Відправити тестове повідомлення
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationTest;
