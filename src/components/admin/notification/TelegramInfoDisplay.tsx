
import { Info, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TelegramInfoDisplayProps {
  telegramSettings: {
    enabled: boolean;
    botToken: string;
    chatId: string;
  };
}

export const TelegramInfoDisplay = ({ telegramSettings }: TelegramInfoDisplayProps) => {
  return (
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
  );
};
