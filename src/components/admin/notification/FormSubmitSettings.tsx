
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { activateFormSubmit, getEmailSettings, updateEmailSettings } from "@/lib/services/notificationService";

const formSubmitSchema = z.object({
  email: z.string().email({ message: "Введіть коректну email адресу" }),
});

export type FormSubmitFormValues = z.infer<typeof formSubmitSchema>;

interface FormSubmitSettingsProps {
  emailSettings: any;
  onUpdate: () => void;
}

export const FormSubmitSettings = ({ emailSettings, onUpdate }: FormSubmitSettingsProps) => {
  const [isActivating, setIsActivating] = useState(false);
  const [showFormSubmitInfo, setShowFormSubmitInfo] = useState(false);

  // Ініціалізуємо форму з актуальними даними
  const formSubmitForm = useForm<FormSubmitFormValues>({
    resolver: zodResolver(formSubmitSchema),
    defaultValues: {
      email: emailSettings.senderEmail || "",
    },
  });

  // Оновлюємо форму при зміні налаштувань
  useEffect(() => {
    formSubmitForm.setValue("email", emailSettings.senderEmail || "");
  }, [emailSettings, formSubmitForm]);

  const handleActivateFormSubmit = async (data: FormSubmitFormValues) => {
    setIsActivating(true);
    
    try {
      console.log("Початок активації FormSubmit для email:", data.email);
      
      // Спочатку оновлюємо налаштування email
      updateEmailSettings({
        senderEmail: data.email,
        enabled: true
      });
      
      const success = await activateFormSubmit(data.email);
      console.log("Результат активації FormSubmit:", success ? "Успішно" : "Невдало");
      
      if (success) {
        toast({
          title: "FormSubmit активовано",
          description: `Email ${data.email} був успішно активований для FormSubmit.`,
          variant: "success",
        });
        onUpdate();
        
        // Додатково перевіряємо налаштування
        const updatedSettings = getEmailSettings();
        console.log("Оновлені налаштування після активації:", updatedSettings);
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

  return (
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
              <p>2. Важливо: перший лист підтвердження може потрапити у <strong>СПАМ</strong>. Обов'язково перевірте!</p>
              <p>3. Після активації введена адреса електронної пошти буде використовуватися як відправник для нотифікацій.</p>
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
            <p className="mt-2 text-sm font-medium">Обов'язково перевірте <strong>папку СПАМ</strong>, якщо не бачите повідомлень.</p>
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
  );
};
