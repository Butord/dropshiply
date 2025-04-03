
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Info, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { updateTelegramSettings, getTelegramSettings } from "@/lib/services/notificationService";

const telegramSettingsSchema = z.object({
  botToken: z.string().min(1, { message: "Введіть токен бота" }),
  chatId: z.string().min(1, { message: "Введіть ID чату" }),
});

export type TelegramSettingsFormValues = z.infer<typeof telegramSettingsSchema>;

interface TelegramSettingsProps {
  telegramSettings: any;
  onUpdate: () => void;
}

export const TelegramSettings = ({ telegramSettings, onUpdate }: TelegramSettingsProps) => {
  const [isSavingTelegram, setIsSavingTelegram] = useState(false);

  const telegramForm = useForm<TelegramSettingsFormValues>({
    resolver: zodResolver(telegramSettingsSchema),
    defaultValues: {
      botToken: telegramSettings.botToken,
      chatId: telegramSettings.chatId,
    },
  });

  // Оновлюємо форму при зміні налаштувань
  useEffect(() => {
    telegramForm.setValue("botToken", telegramSettings.botToken || "");
    telegramForm.setValue("chatId", telegramSettings.chatId || "");
  }, [telegramSettings, telegramForm]);

  const handleSaveTelegramSettings = async (data: TelegramSettingsFormValues) => {
    setIsSavingTelegram(true);
    try {
      console.log("Збереження налаштувань Telegram:", data);
      
      updateTelegramSettings({
        botToken: data.botToken,
        chatId: data.chatId,
        enabled: true,
      });
      
      toast({
        title: "Налаштування Telegram збережено",
        description: "Параметри бота Telegram були успішно збережені.",
        variant: "success",
      });
      
      onUpdate();
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

  return (
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
  );
};
