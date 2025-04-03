
import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings } from "lucide-react";
import { getEmailSettings, getTelegramSettings } from "@/lib/services/notificationService";
import TestForm from "@/components/admin/notification/TestForm";
import { FormSubmitSettings } from "@/components/admin/notification/FormSubmitSettings";
import { TelegramSettings } from "@/components/admin/notification/TelegramSettings";

const NotificationTest = () => {
  const [activeTab, setActiveTab] = useState("email");
  const [activeSettingsTab, setActiveSettingsTab] = useState("formsubmit");
  const [showSettings, setShowSettings] = useState(false);
  const [emailSettings, setEmailSettings] = useState(getEmailSettings());
  const [telegramSettings, setTelegramSettings] = useState(getTelegramSettings());

  // Оновлюємо налаштування при зміні вкладок та при монтуванні компонента
  useEffect(() => {
    const loadSettings = () => {
      setEmailSettings(getEmailSettings());
      setTelegramSettings(getTelegramSettings());
      console.log("Налаштування завантажено:", {
        email: getEmailSettings(),
        telegram: getTelegramSettings()
      });
    };

    loadSettings();
    
    // Також встановлюємо інтервал для періодичного оновлення налаштувань
    const intervalId = setInterval(loadSettings, 5000);
    
    return () => clearInterval(intervalId);
  }, [activeTab, showSettings]);

  // Функція для примусового оновлення налаштувань
  const refreshSettings = () => {
    console.log("Примусове оновлення налаштувань");
    setEmailSettings(getEmailSettings());
    setTelegramSettings(getTelegramSettings());
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
                      <TestForm 
                        activeTab="email" 
                        emailSettings={emailSettings} 
                        telegramSettings={telegramSettings} 
                      />
                    </TabsContent>
                    
                    <TabsContent value="telegram">
                      <TestForm 
                        activeTab="telegram" 
                        emailSettings={emailSettings} 
                        telegramSettings={telegramSettings} 
                      />
                    </TabsContent>
                    
                    <TabsContent value="viber">
                      <TestForm 
                        activeTab="viber" 
                        emailSettings={emailSettings} 
                        telegramSettings={telegramSettings} 
                      />
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
                      <FormSubmitSettings 
                        emailSettings={emailSettings}
                        onUpdate={refreshSettings}
                      />
                    </TabsContent>
                    
                    <TabsContent value="telegram">
                      <TelegramSettings 
                        telegramSettings={telegramSettings}
                        onUpdate={refreshSettings}
                      />
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
