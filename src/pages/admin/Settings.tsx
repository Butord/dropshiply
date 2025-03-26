import { useState } from 'react';
import { 
  Globe, 
  CreditCard, 
  Bell, 
  Shield, 
  Save,
  FileText,
  Database,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import AnimatedSection from '@/components/ui/AnimatedSection';
import AdminSidebar from '@/components/admin/AdminSidebar';

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  
  const handleSaveSettings = () => {
    toast({
      title: "Налаштування збережено",
      description: "Ваші налаштування були успішно оновлені.",
    });
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      <AdminSidebar activePage="settings" />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border flex items-center px-6">
          <h1 className="text-xl font-semibold">Налаштування</h1>
          <div className="ml-auto">
            <Button onClick={handleSaveSettings}>
              <Save className="h-4 w-4 mr-2" />
              Зберегти зміни
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="general">Загальні</TabsTrigger>
              <TabsTrigger value="payment">Оплата</TabsTrigger>
              <TabsTrigger value="notifications">Сповіщення</TabsTrigger>
              <TabsTrigger value="security">Безпека</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-6">
              <AnimatedSection animation="fade-up">
                <Card>
                  <CardHeader>
                    <CardTitle>Інформація про магазин</CardTitle>
                    <CardDescription>
                      Основна інформація про ваш магазин
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="store-name">Назва магазину</Label>
                        <Input id="store-name" defaultValue="Dropshiply Ukraine" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="store-url">URL магазину</Label>
                        <Input id="store-url" defaultValue="https://dropshiply.ua" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="store-description">Опис магазину</Label>
                      <Textarea 
                        id="store-description" 
                        defaultValue="Ми продаємо високоякісні товари за доступними цінами з доставкою по всій Україні." 
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="support-email">Електронна пошта підтримки</Label>
                        <Input id="support-email" defaultValue="support@dropshiply.ua" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="support-phone">Телефон підтримки</Label>
                        <Input id="support-phone" defaultValue="+380 (50) 123-4567" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
              
              <AnimatedSection animation="fade-up" delay={100}>
                <Card>
                  <CardHeader>
                    <CardTitle>Регіональні налаштування</CardTitle>
                    <CardDescription>
                      Налаштуйте регіональні параметри для вашого магазину
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Часовий пояс</Label>
                        <Select defaultValue="utc+2">
                          <SelectTrigger id="timezone">
                            <SelectValue placeholder="Виберіть часовий пояс" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="utc-12">UTC-12:00</SelectItem>
                            <SelectItem value="utc-11">UTC-11:00</SelectItem>
                            <SelectItem value="utc-10">UTC-10:00</SelectItem>
                            <SelectItem value="utc-9">UTC-09:00</SelectItem>
                            <SelectItem value="utc-8">UTC-08:00 (PST)</SelectItem>
                            <SelectItem value="utc-7">UTC-07:00 (MST)</SelectItem>
                            <SelectItem value="utc-6">UTC-06:00 (CST)</SelectItem>
                            <SelectItem value="utc-5">UTC-05:00 (EST)</SelectItem>
                            <SelectItem value="utc-4">UTC-04:00</SelectItem>
                            <SelectItem value="utc-3">UTC-03:00</SelectItem>
                            <SelectItem value="utc-2">UTC-02:00</SelectItem>
                            <SelectItem value="utc-1">UTC-01:00</SelectItem>
                            <SelectItem value="utc-0">UTC±00:00</SelectItem>
                            <SelectItem value="utc+1">UTC+01:00</SelectItem>
                            <SelectItem value="utc+2">UTC+02:00 (Київ, EET)</SelectItem>
                            <SelectItem value="utc+3">UTC+03:00 (EEST - літній час)</SelectItem>
                            <SelectItem value="utc+4">UTC+04:00</SelectItem>
                            <SelectItem value="utc+5">UTC+05:00</SelectItem>
                            <SelectItem value="utc+5:30">UTC+05:30</SelectItem>
                            <SelectItem value="utc+6">UTC+06:00</SelectItem>
                            <SelectItem value="utc+7">UTC+07:00</SelectItem>
                            <SelectItem value="utc+8">UTC+08:00</SelectItem>
                            <SelectItem value="utc+9">UTC+09:00</SelectItem>
                            <SelectItem value="utc+10">UTC+10:00</SelectItem>
                            <SelectItem value="utc+11">UTC+11:00</SelectItem>
                            <SelectItem value="utc+12">UTC+12:00</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="currency">Валюта</Label>
                        <Select defaultValue="uah">
                          <SelectTrigger id="currency">
                            <SelectValue placeholder="Виберіть валюту" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="uah">UAH (₴)</SelectItem>
                            <SelectItem value="usd">USD ($)</SelectItem>
                            <SelectItem value="eur">EUR (€)</SelectItem>
                            <SelectItem value="gbp">GBP (£)</SelectItem>
                            <SelectItem value="pln">PLN (zł)</SelectItem>
                            <SelectItem value="czk">CZK (Kč)</SelectItem>
                            <SelectItem value="ron">RON (lei)</SelectItem>
                            <SelectItem value="mdl">MDL (L)</SelectItem>
                            <SelectItem value="bgn">BGN (лв)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="language">Мова</Label>
                        <Select defaultValue="uk">
                          <SelectTrigger id="language">
                            <SelectValue placeholder="Виберіть мову" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="uk">Українська</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="pl">Polski</SelectItem>
                            <SelectItem value="ru">Русский</SelectItem>
                            <SelectItem value="de">Deutsch</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="it">Italiano</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date-format">Формат дати</Label>
                        <Select defaultValue="dd-mm-yyyy">
                          <SelectTrigger id="date-format">
                            <SelectValue placeholder="Виберіть формат дати" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dd-mm-yyyy">ДД/ММ/РРРР</SelectItem>
                            <SelectItem value="mm-dd-yyyy">ММ/ДД/РРРР</SelectItem>
                            <SelectItem value="yyyy-mm-dd">РРРР/ММ/ДД</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="weight-unit">Одиниця ваги</Label>
                        <Select defaultValue="kg">
                          <SelectTrigger id="weight-unit">
                            <SelectValue placeholder="Виберіть одиницю ваги" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">Кілограми (кг)</SelectItem>
                            <SelectItem value="g">Грами (г)</SelectItem>
                            <SelectItem value="lb">Фунти (lb)</SelectItem>
                            <SelectItem value="oz">Унції (oz)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </TabsContent>
            
            <TabsContent value="payment" className="space-y-6">
              <AnimatedSection animation="fade-up">
                <Card>
                  <CardHeader>
                    <CardTitle>Методи оплати</CardTitle>
                    <CardDescription>
                      Налаштуйте методи оплати для вашого магазину
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Кредитна картка</p>
                          <p className="text-sm text-muted-foreground">Приймайте Visa, Mastercard, Amex</p>
                        </div>
                      </div>
                      <Switch defaultChecked id="credit-card" />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Приват24</p>
                          <p className="text-sm text-muted-foreground">Приймайте платежі через Приват24</p>
                        </div>
                      </div>
                      <Switch defaultChecked id="privat24" />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Monobank</p>
                          <p className="text-sm text-muted-foreground">Приймайте платежі через Monobank</p>
                        </div>
                      </div>
                      <Switch defaultChecked id="monobank" />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Готівка при отриманні</p>
                          <p className="text-sm text-muted-foreground">Приймайте оплату готів��ою при доставці</p>
                        </div>
                      </div>
                      <Switch defaultChecked id="cash-on-delivery" />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">PayPal</p>
                          <p className="text-sm text-muted-foreground">Приймайте платежі через PayPal</p>
                        </div>
                      </div>
                      <Switch id="paypal" />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Apple Pay</p>
                          <p className="text-sm text-muted-foreground">Приймайте платежі через Apple Pay</p>
                        </div>
                      </div>
                      <Switch id="apple-pay" />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Google Pay</p>
                          <p className="text-sm text-muted-foreground">Приймайте платежі через Google Pay</p>
                        </div>
                      </div>
                      <Switch id="google-pay" />
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
              
              <AnimatedSection animation="fade-up" delay={100}>
                <Card>
                  <CardHeader>
                    <CardTitle>Налаштування валюти</CardTitle>
                    <CardDescription>
                      Налаштуйте, як відображаються валюти
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currency-format">Формат валюти</Label>
                        <Select defaultValue="symbol-after">
                          <SelectTrigger id="currency-format">
                            <SelectValue placeholder="Виберіть формат валюти" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="symbol-before">₴100.00</SelectItem>
                            <SelectItem value="symbol-after">100.00₴</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="decimal-separator">Десятковий роздільник</Label>
                        <Select defaultValue="comma">
                          <SelectTrigger id="decimal-separator">
                            <SelectValue placeholder="Виберіть десятковий роздільник" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dot">Крапка (100.00)</SelectItem>
                            <SelectItem value="comma">Кома (100,00)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="thousand-separator">Роздільник тисяч</Label>
                        <Select defaultValue="space">
                          <SelectTrigger id="thousand-separator">
                            <SelectValue placeholder="Виберіть роздільник тисяч" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="comma">Кома (1,000.00)</SelectItem>
                            <SelectItem value="dot">Крапка (1.000,00)</SelectItem>
                            <SelectItem value="space">Пробіл (1 000,00)</SelectItem>
                            <SelectItem value="none">Немає (1000,00)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="decimal-places">Кількість знаків після коми</Label>
                        <Select defaultValue="2">
                          <SelectTrigger id="decimal-places">
                            <SelectValue placeholder="Виберіть кількість знаків після коми" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">0 (100)</SelectItem>
                            <SelectItem value="1">1 (100,0)</SelectItem>
                            <SelectItem value="2">2 (100,00)</SelectItem>
                            <SelectItem value="3">3 (100,000)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6">
              <AnimatedSection animation="fade-up">
                <Card>
                  <CardHeader>
                    <CardTitle>Сповіщення електронною поштою</CardTitle>
                    <CardDescription>
                      Налаштуйте сповіщення електронною поштою для різних подій
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium">Нове замовлення</p>
                        <p className="text-sm text-muted-foreground">Отримуйте електронний лист, коли розміщено нове замовлення</p>
                      </div>
                      <Switch defaultChecked id="new-order-email" />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium">Зміна статусу замовлення</p>
                        <p className="text-sm text-muted-foreground">Отримуйте електронний лист, коли змінюється статус замовлення</p>
                      </div>
                      <Switch defaultChecked id="order-status-email" />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium">Сповіщення про запаси</p>
                        <p className="text-sm text-muted-foreground">Отримуйте електронний лист, коли запаси низькі</p>
                      </div>
                      <Switch defaultChecked id="inventory-email" />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium">Реєстрація клієнта</p>
                        <p className="text-sm text-muted-foreground">Отримуйте електронний лист, коли реєструється новий клієнт</p>
                      </div>
                      <Switch id="customer-email" />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium">Завершення імпорту XML</p>
                        <p className="text-sm text-muted-foreground">Отримуйте електронний лист, коли завершується імпорт XML</p>
                      </div>
                      <Switch defaultChecked id="xml-import-email" />
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
              
              <AnimatedSection animation="fade-up" delay={100}>
                <Card>
                  <CardHeader>
                    <CardTitle>Налаштування SMTP</CardTitle>
                    <CardDescription>
                      Налаштуйте свій SMTP-сервер для надсилання електронних листів
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtp-host">SMTP Host</Label>
                        <Input id="smtp-host" placeholder="smtp.example.com" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="smtp-port">SMTP Port</Label>
                        <Input id="smtp-port" placeholder="587" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtp-username">SMTP Username</Label>
                        <Input id="smtp-username" placeholder="username@example.com" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="smtp-password">SMTP Password</Label>
                        <Input id="smtp-password" type="password" placeholder="••••••••" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sender-email">Sender Email</Label>
                        <Input id="sender-email" placeholder="noreply@yourdomain.com" />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="smtp-ssl" />
                      <Label htmlFor="smtp-ssl">Use SSL/TLS</Label>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => toast({
                        title: "Test Email Sent",
                        description: "A test email has been sent to your inbox."
                      })}
                    >
                      Send Test Email
                    </Button>
                  </CardFooter>
                </Card>
              </AnimatedSection>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-6">
              <AnimatedSection animation="fade-up">
                <Card>
                  <CardHeader>
                    <CardTitle>Налаштування безпеки</CardTitle>
                    <CardDescription>
                      Налаштуйте параметри безпеки для вашого магазину
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium">Двофакторна аутентифікація</p>
                        <p className="text-sm text-muted-foreground">Вимагати двофакторну аутентифікацію для входу адміністратора</p>
                      </div>
                      <Switch id="two-factor" />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium">Примусове використання SSL</p>
                        <p className="text-sm text-muted-foreground">Примусово використовувати SSL для всіх сторінок</p>
                      </div>
                      <Switch defaultChecked id="ssl" />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium">Обмеження спроб входу</p>
                        <p className="text-sm text-muted-foreground">Заблокувати обліковий запис після 5 невдалих спроб входу</p>
                      </div>
                      <Switch defaultChecked id="login-limits" />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="password-policy">Політика паролів</Label>
                      <Select defaultValue="strong">
                        <SelectTrigger id="password-policy">
                          <SelectValue placeholder="Виберіть політику паролів" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                          <SelectItem value="medium">Medium (8+ chars, letters and numbers)</SelectItem>
                          <SelectItem value="strong">Strong (8+ chars, letters, numbers, special chars)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Тайм-аут сесії (хвилини)</Label>
                      <Select defaultValue="30">
                        <SelectTrigger id="session-timeout">
                          <SelectValue placeholder="Виберіть тайм-аут сесії" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="120">120 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </TabsContent>
            
            <TabsContent value="api" className="space-y-6">
              <AnimatedSection animation="fade-up">
                <Card>
                  <CardHeader>
                    <CardTitle>Налаштування API</CardTitle>
                    <CardDescription>
                      Керуйте ключами API та доступом
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium">API Key</h4>
                          <p className="text-sm text-muted-foreground mt-1">Your private API key for accessing the API</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => toast({
                          title: "API Key Regenerated",
                          description: "Your API key has been regenerated successfully."
                        })}>
                          Regenerate
                        </Button>
                      </div>
                      <div className="mt-4 relative">
                        <Input 
                          readOnly 
                          value="sk_••••••••••••••••••••••••••••••" 
                          className="pr-24 font-mono text-sm"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="absolute right-0 top-0 h-full"
                          onClick={() => toast({
                            title: "API Key Copied",
                            description: "API key has been copied to your clipboard."
                          })}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>API Access Controls</Label>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Switch id="product-api" defaultChecked />
                          <Label htmlFor="product-api">Products API</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="order-api" defaultChecked />
                          <Label htmlFor="order-api">Orders API</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="customer-api" defaultChecked />
                          <Label htmlFor="customer-api">Customers API</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="inventory-api" defaultChecked />
                          <Label htmlFor="inventory-api">Inventory API</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="webhook-url">Webhook URL</Label>
                      <Input id="webhook-url" placeholder="https://your-domain.com/webhook" />
                      <p className="text-sm text-muted-foreground mt-1">
                        Webhook notifications will be sent to this URL
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
              
              <AnimatedSection animation="fade-up" delay={100}>
                <Card>
                  <CardHeader>
                    <CardTitle>API Documentation</CardTitle>
                    <CardDescription>
                      Links to API documentation and resources
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">API Documentation</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Comprehensive documentation for all API endpoints
                          </p>
                          <Button variant="link" className="h-auto p-0 mt-2">
                            View Documentation
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                          <Database className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Data Models</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Documentation for all data models and schemas
                          </p>
                          <Button variant="link" className="h-auto p-0 mt-2">
                            View Data Models
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                          <Globe className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">API Changelog</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            History of API changes and version updates
                          </p>
                          <Button variant="link" className="h-auto p-0 mt-2">
                            View Changelog
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Settings;
