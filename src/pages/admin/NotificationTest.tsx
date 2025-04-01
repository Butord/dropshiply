
import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail, MessageSquare, Send, Settings, Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { 
  getEmailSettings, 
  updateEmailSettings,
  getTelegramSettings, 
  updateTelegramSettings,
  sendOrderNotification, 
  generateOrderNumber,
  activateFormSubmit
} from "@/lib/services/notificationService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const testNotificationSchema = z.object({
  email: z.string().email({ message: "Введіть коректну email адресу" }),
  name: z.string().min(2, { message: "Ім'я має містити принаймні 2 символи" }),
});

const formSubmitSchema = z.object({
  email: z.string().email({ message: "Введіть коректну email адресу" }),
});

const telegramSettingsSchema = z.object({
  botToken: z.string().min(1, { message: "Введіть токен бота" }),
  chatId: z.string().min(1, { message: "Введіть ID чату" }),
});

type TestNotificationFormValues = z.infer<typeof testNotificationSchema>;
type FormSubmitFormValues = z.infer<typeof formSubmitSchema>;
type TelegramSettingsFormValues = z.infer<typeof telegramSettingsSchema>;

const NotificationTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [isSavingTelegram, setIsSavingTelegram] = useState(false);
  const [activeTab, setActiveTab] = useState("email");
  const [activeSettingsTab, setActiveSettingsTab] = useState("formsubmit");

  // Отримуємо поточні налаштування
  const [emailSettings, setEmailSettings] = useState(getEmailSettings());
  const [telegramSettings, setTelegramSettings] = useState(getTelegramSettings());

  // Переключення між вкладками тестування і налаштувань
  const [showSettings, setShowSettings] = useState(false);
  
  // Показувати детальну інформацію про FormSubmit
  const [showFormSubmitInfo, setShowFormSubmitInfo] = useState(false);

  useEffect(() => {
    // Оновлюємо налаштування при кожному перемиканні вкладок
    setEmailSettings(getEmailSettings());
    setTelegramSettings(getTelegramSettings());
  }, [activeTab, showSettings]);

  const form = useForm<TestNotificationFormValues>({
    resolver: zodResolver(testNotificationSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  });

  const formSubmitForm = useForm<FormSubmitFormValues>({
    resolver: zodResolver(formSubmitSchema),
    defaultValues: {
      email: emailSettings.senderEmail,
    },
  });

  const telegramForm = useForm<TelegramSettingsFormValues>({
    resolver: zodResolver(telegramSettingsSchema),
    defaultValues: {
      botToken: telegramSettings.botToken,
      chatId: telegramSettings.chatId,
    },
  });

  // Оновлення значень форми при зміні налаштувань
  useEffect(() => {
    formSubmitForm.reset({
      email: emailSettings.senderEmail,
    });
    telegramForm.reset({
      botToken: telegramSettings.botToken,
      chatId: telegramSettings.chatId,
    });
  }, [emailSettings, telegramSettings]);

  const createTestNotification = (data: TestNotificationFormValues) => {
    const testOrderNumber = generateOrderNumber();
    return {
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
  };

  const handleTestEmail = async (data: TestNotificationFormValues) => {
    setIsLoading(true);
    
    try {
      // Перевіряємо чи активовано FormSubmit
      if (!emailSettings.formSubmitActivated) {
        toast({
          title: "FormSubmit не активовано",
          description: "Перейдіть до вкладки Налаштування для активації FormSubmit",
          variant: "warning",
        });
        setIsLoading(false);
        return;
      }
      
      const testNotification = createTestNotification(data);
      const success = await sendOrderNotification(testNotification);
      
      if (success) {
        toast({
          title: "Тестове повідомлення відправлено",
          description: `Повідомлення було успішно відправлено на ${data.email}`,
        });
      } else {
        toast({
          title: "Помилка відправки",
          description: "Не вдалося відправити тестове повідомлення. Перевірте налаштування пошти та консоль для деталей.",
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

  const handleTestTelegram = async (data: TestNotificationFormValues) => {
    setIsLoading(true);
    
    try {
      if (!telegramSettings.enabled || !telegramSettings.botToken || !telegramSettings.chatId) {
        toast({
          title: "Telegram не налаштовано",
          description: "Будь ласка, налаштуйте параметри Telegram в налаштуваннях перед тестуванням.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      const testNotification = createTestNotification(data);
      
      const success = await sendOrderNotification(testNotification);
      
      if (success) {
        toast({
          title: "Тестове повідомлення відправлено",
          description: `Повідомлення було успішно відправлено в Telegram (chat_id: ${telegramSettings.chatId})`,
        });
      } else {
        toast({
          title: "Помилка відправки",
          description: "Не вдалося відправити тестове повідомлення в Telegram. Перевірте налаштування та консоль для деталей.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Помилка при відправці тестового повідомлення в Telegram:", error);
      toast({
        title: "Помилка відправки",
        description: "Виникла непередбачувана помилка при відправці повідомлення.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivateFormSubmit = async (data: FormSubmitFormValues) => {
    setIsActivating(true);
    try {
      const success = await activateFormSubmit(data.email);
      
      if (success) {
        updateEmailSettings({
          senderEmail: data.email,
          formSubmitActivated: true,
        });
        
        // Оновлюємо локальний стан
        setEmailSettings(getEmailSettings());
        
        toast({
          title: "FormSubmit активовано",
          description: `Email ${data.email} був успішно активований для FormSubmit.`,
          variant: "success",
        });
      } else {
        toast({
          title: "Помилка активації",
          description: "Не вдалося активувати FormSubmit. Перевірте консоль для деталей.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Помилка при активації FormSubmit:", error);
      toast({
        title: "Помилка активації",
        description: "Виникла непередбачувана помилка при активації FormSubmit.",
        variant: "destructive",
      });
    } finally {
      setIsActivating(false);
    }
  };

  const handleSaveTelegramSettings = async (data: TelegramSettingsFormValues) => {
    setIsSavingTelegram(true);
    try {
      updateTelegramSettings({
        botToken: data.botToken,
        chatId: data.chatId,
        enabled: true,
      });
      
      // Оновлюємо локальний стан
      setTelegramSettings(getTelegramSettings());
      
      toast({
        title: "Налаштування Telegram збережено",
        description: "Параметри бота Telegram були успішно збережені.",
        variant: "success",
      });
    } catch (error) {
      console.error("Помилка при збереженні налаштувань Telegram:", error);
      toast({
        title: "Помилка збереження",
        description: "Виникла непередбачувана помилка при збереженні налаштувань Telegram.",
        variant: "destructive",
      });
    } finally {
      setIsSavingTelegram(false);
    }
  };

  const handleTestViber = (data: TestNotificationFormValues) => {
    toast({
      title: "Viber сповіщення",
      description: "Функціональність Viber сповіщень ще не реалізована.",
      variant: "default",
    });
  };

  const onSubmit = (data: TestNotificationFormValues) => {
    switch (activeTab) {
      case "email":
        handleTestEmail(data);
        break;
      case "telegram":
        handleTestTelegram(data);
        break;
      case "viber":
        handleTestViber(data);
        break;
      default:
        handleTestEmail(data);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <AdminSidebar activePage="notification-test" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border flex items-center px-6">
          <h1 className="text-xl font-semibold">Тестування сповіщень</h1>
          <div className="ml-auto">
            <Button 
              variant={showSettings ? "default" : "outline"} 
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Налаштування
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            {!showSettings ? (
              // Вкладка тестування
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
                      <TabsTrigger value="telegram">Telegram</TabsTrigger>
                      <TabsTrigger value="viber">Viber</TabsTrigger>
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
                                <p><strong>FormSubmit активовано:</strong> {emailSettings.formSubmitActivated ? "Так" : "Ні"}</p>
                              </div>
                              
                              {!emailSettings.formSubmitActivated && (
                                <Alert className="mt-3" variant="warning">
                                  <AlertTriangle className="h-4 w-4" />
                                  <AlertTitle>FormSubmit не активовано</AlertTitle>
                                  <AlertDescription>
                                    Перейдіть до вкладки Налаштування, щоб активувати FormSubmit для відправки електронних листів.
                                  </AlertDescription>
                                </Alert>
                              )}
                              
                              {emailSettings.formSubmitActivated && (
                                <Alert className="mt-3" variant="info">
                                  <Info className="h-4 w-4" />
                                  <AlertDescription>
                                    FormSubmit активовано для адреси {emailSettings.senderEmail}. Ви можете тестувати відправку.
                                  </AlertDescription>
                                </Alert>
                              )}
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
                          
                          <Button 
                            type="submit" 
                            disabled={isLoading || !emailSettings.formSubmitActivated}
                          >
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
                    
                    <TabsContent value="telegram">
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-sm font-medium mb-2">Поточні налаштування</h3>
                              <div className="text-sm bg-muted p-3 rounded-md">
                                <p><strong>Статус:</strong> {telegramSettings.enabled ? "Увімкнено" : "Вимкнено"}</p>
                                <p><strong>Bot Token:</strong> {telegramSettings.botToken ? "Налаштовано" : "Не налаштовано"}</p>
                                <p><strong>Chat ID:</strong> {telegramSettings.chatId || "Не вказано"}</p>
                              </div>
                              
                              {(!telegramSettings.enabled || !telegramSettings.botToken || !telegramSettings.chatId) && (
                                <Alert className="mt-3" variant="warning">
                                  <AlertTriangle className="h-4 w-4" />
                                  <AlertTitle>Telegram не налаштовано</AlertTitle>
                                  <AlertDescription>
                                    Перейдіть до вкладки Налаштування, щоб налаштувати параметри Telegram бота.
                                  </AlertDescription>
                                </Alert>
                              )}
                              
                              {telegramSettings.enabled && telegramSettings.botToken && telegramSettings.chatId && (
                                <Alert className="mt-3" variant="info">
                                  <Info className="h-4 w-4" />
                                  <AlertDescription>
                                    Telegram бот налаштовано. Повідомлення будуть надсилатися до вказаного чату/групи.
                                  </AlertDescription>
                                </Alert>
                              )}
                            </div>
                            
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email клієнта (для шаблону)</FormLabel>
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
                                  <FormLabel>Ім'я клієнта (для шаблону)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Ім'я Прізвище" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <Button 
                            type="submit" 
                            disabled={isLoading || !telegramSettings.enabled || !telegramSettings.botToken || !telegramSettings.chatId}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Відправка...
                              </>
                            ) : (
                              <>
                                <MessageSquare className="mr-2 h-4 w-4" />
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
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              // Вкладка налаштувань
              <Card>
                <CardHeader>
                  <CardTitle>Налаштування сповіщень</CardTitle>
                  <CardDescription>
                    Налаштуйте параметри для різних каналів сповіщення.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeSettingsTab} onValueChange={setActiveSettingsTab}>
                    <TabsList className="mb-6">
                      <TabsTrigger value="formsubmit">FormSubmit</TabsTrigger>
                      <TabsTrigger value="telegram">Telegram</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="formsubmit">
                      <div className="space-y-6">
                        <div className="bg-muted p-4 rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">Про FormSubmit</h3>
                            <Button variant="ghost" size="sm" onClick={() => setShowFormSubmitInfo(!showFormSubmitInfo)}>
                              {showFormSubmitInfo ? "Приховати деталі" : "Показати деталі"}
                            </Button>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            FormSubmit - це безкоштовний сервіс для відправки форм через email без необхідності
                            налаштування серверної частини.
                          </p>
                          
                          {showFormSubmitInfo && (
                            <Alert variant="info" className="mt-3 mb-3">
                              <Info className="h-4 w-4" />
                              <AlertTitle>Як працює FormSubmit?</AlertTitle>
                              <AlertDescription className="space-y-2">
                                <p>1. Коли ви активуєте FormSubmit для вашої email адреси, сервіс надсилає підтвердження на цю адресу.</p>
                                <p>2. Після активації всі форми, налаштовані з цією адресою, будуть автоматично переспрямовувати дані на ваш email.</p>
                                <p>3. Перший тестовий лист може потрапити в спам, перевірте папку спаму.</p>
                                <p>4. Переконайтеся, що ви використовуєте робочу email адресу, до якої маєте доступ.</p>
                              </AlertDescription>
                            </Alert>
                          )}
                          
                          <p className="text-sm text-muted-foreground">
                            Для використання FormSubmit необхідно вказати email адресу відправника та активувати її.
                          </p>
                        </div>
                        
                        <Form {...formSubmitForm}>
                          <form onSubmit={formSubmitForm.handleSubmit(handleActivateFormSubmit)} className="space-y-4">
                            <FormField
                              control={formSubmitForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email для FormSubmit</FormLabel>
                                  <FormDescription>
                                    Вкажіть email, з якого будуть відправлятися сповіщення. Переконайтеся, що ви маєте доступ до цієї скриньки.
                                  </FormDescription>
                                  <FormControl>
                                    <Input placeholder="sender@yourstore.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <Button type="submit" disabled={isActivating}>
                              {isActivating ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Активація...
                                </>
                              ) : (
                                "Активувати FormSubmit"
                              )}
                            </Button>
                          </form>
                        </Form>
                        
                        {emailSettings.formSubmitActivated && (
                          <Alert variant="success" className="mt-4">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertTitle>FormSubmit активовано</AlertTitle>
                            <AlertDescription>
                              FormSubmit успішно активовано для email: {emailSettings.senderEmail}. 
                              Ви можете перейти до вкладки тестування, щоб відправити тестове повідомлення.
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        {!emailSettings.formSubmitActivated && (
                          <Alert variant="warning" className="mt-4">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>FormSubmit не активовано</AlertTitle>
                            <AlertDescription>
                              FormSubmit ще не активовано. Натисніть кнопку "Активувати FormSubmit" вище.
                              Перевірте папку зі спамом, якщо не отримуєте листів після активації.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="telegram">
                      <div className="space-y-6">
                        <div className="bg-muted p-4 rounded-md">
                          <h3 className="font-medium mb-2">Налаштування Telegram</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Для відправки сповіщень через Telegram вам потрібно створити бота за допомогою
                            BotFather та отримати токен бота та ID чату, куди будуть відправлятися повідомлення.
                          </p>
                          <Alert variant="info" className="mt-3 mb-3">
                            <Info className="h-4 w-4" />
                            <AlertTitle>Інструкція з налаштування</AlertTitle>
                            <AlertDescription className="space-y-2">
                              <p>1. Відкрийте Telegram і знайдіть @BotFather.</p>
                              <p>2. Напишіть /newbot і виконайте всі кроки.</p>
                              <p>3. Скопіюйте отриманий токен бота.</p>
                              <p>4. Створіть групу або канал і додайте вашого бота туди.</p>
                              <p>5. Відправте будь-яке повідомлення в групу.</p>
                              <p>6. Відкрийте в браузері: https://api.telegram.org/bot[ВАШ_ТОКЕН]/getUpdates</p>
                              <p>7. Знайдіть "chat":{'"id":'} [ЧИСЛО] - це і є потрібний Chat ID.</p>
                            </AlertDescription>
                          </Alert>
                          <p className="text-sm text-muted-foreground">
                            Увага: Повідомлення надсилаються в чат/групу з вказаним Chat ID, а не на особистий номер телефону!
                          </p>
                        </div>
                        
                        <Form {...telegramForm}>
                          <form onSubmit={telegramForm.handleSubmit(handleSaveTelegramSettings)} className="space-y-4">
                            <FormField
                              control={telegramForm.control}
                              name="botToken"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Токен бота</FormLabel>
                                  <FormDescription>
                                    Токен, отриманий від BotFather (наприклад, 123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ)
                                  </FormDescription>
                                  <FormControl>
                                    <Input placeholder="Токен бота Telegram" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={telegramForm.control}
                              name="chatId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>ID чату</FormLabel>
                                  <FormDescription>
                                    ID групи, каналу чи приватного чату (наприклад, -1001234567890)
                                  </FormDescription>
                                  <FormControl>
                                    <Input placeholder="ID чату Telegram" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <Button type="submit" disabled={isSavingTelegram}>
                              {isSavingTelegram ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Збереження...
                                </>
                              ) : (
                                "Зберегти налаштування Telegram"
                              )}
                            </Button>
                          </form>
                        </Form>
                        
                        {telegramSettings.enabled && telegramSettings.botToken && telegramSettings.chatId && (
                          <Alert variant="success" className="mt-4">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertTitle>Telegram налаштовано</AlertTitle>
                            <AlertDescription>
                              Telegram налаштовано успішно. Ви можете перейти до вкладки тестування, 
                              щоб відправити тестове повідомлення.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="outline" onClick={() => setShowSettings(false)}>
                    Повернутися до тестування
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationTest;
