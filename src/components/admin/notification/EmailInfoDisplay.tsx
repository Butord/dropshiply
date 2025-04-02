
import { Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface EmailInfoDisplayProps {
  emailSettings: {
    enabled: boolean;
    formSubmitActivated: boolean;
    senderName: string;
    senderEmail: string;
  };
}

export const EmailInfoDisplay = ({ emailSettings }: EmailInfoDisplayProps) => {
  return (
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
  );
};
