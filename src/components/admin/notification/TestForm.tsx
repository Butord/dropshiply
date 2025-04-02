
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Mail, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { generateOrderNumber, sendOrderNotification } from "@/lib/services/notificationService";
import { EmailInfoDisplay } from "./EmailInfoDisplay";
import { TelegramInfoDisplay } from "./TelegramInfoDisplay";

const testNotificationSchema = z.object({
  email: z.string().email({ message: "Введіть коректну email адресу" }),
  name: z.string().min(2, { message: "Ім'я має містити принаймні 2 символи" }),
});

export type TestNotificationFormValues = z.infer<typeof testNotificationSchema>;

interface TestFormProps {
  activeTab: string;
  emailSettings: any;
  telegramSettings: any;
}

export const TestForm = ({ activeTab, emailSettings, telegramSettings }: TestFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TestNotificationFormValues>({
    resolver: zodResolver(testNotificationSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  });

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {activeTab === "email" && <EmailInfoDisplay emailSettings={emailSettings} />}
          {activeTab === "telegram" && <TelegramInfoDisplay telegramSettings={telegramSettings} />}
          
          {activeTab !== "viber" && (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{activeTab === "email" ? "Email отримувача" : "Email клієнта (для шаблону)"}</FormLabel>
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
                    <FormLabel>{activeTab === "email" ? "Ім'я отримувача" : "Ім'я клієнта (для шаблону)"}</FormLabel>
                    <FormControl>
                      <Input placeholder="Ім'я Прізвище" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>
        
        {activeTab === "email" && (
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
        )}
        
        {activeTab === "telegram" && (
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
        )}
        
        {activeTab === "viber" && (
          <div className="p-8 text-center">
            <div className="mb-4 text-muted-foreground">
              Функціональність Viber сповіщень ще не реалізована.
            </div>
            <Button variant="outline" disabled>
              <Send className="mr-2 h-4 w-4" />
              Відправити тестове повідомлення
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default TestForm;
