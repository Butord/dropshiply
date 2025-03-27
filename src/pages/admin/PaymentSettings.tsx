
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Mail, MessageCircle, Smartphone, CreditCard as CreditCardIcon, Wallet, Banknote } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

const PaymentSettings = () => {
  const { toast } = useToast();
  const [emailSettings, setEmailSettings] = useState({
    enabled: true,
    senderEmail: 'no-reply@yourstore.com',
    subject: 'Ваші платіжні реквізити',
    template: 'Шановний(а) {{name}},\n\nДякуємо за ваше замовлення #{{orderNumber}}.\n\nДля оплати замовлення, будь ласка, здійсніть переказ на наступні реквізити:\n\nКартка: 4444 5555 6666 7777\nОтримувач: ТОВ "Ваш Магазин"\nСума до сплати: {{amount}} грн\n\nПісля оплати, ваше замовлення буде відправлено протягом 24 годин.\n\nЗ повагою,\nКоманда вашого магазину',
  });

  const [viberSettings, setViberSettings] = useState({
    enabled: false,
    apiKey: '',
    template: 'Дякуємо за замовлення #{{orderNumber}}. Платіжні реквізити: Картка 4444 5555 6666 7777, Сума: {{amount}} грн',
  });

  const [telegramSettings, setTelegramSettings] = useState({
    enabled: false,
    botToken: '',
    template: 'Дякуємо за замовлення #{{orderNumber}}. Платіжні реквізити: Картка 4444 5555 6666 7777, Сума: {{amount}} грн',
  });

  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4444 5555 6666 7777',
    cardHolder: 'ТОВ "Ваш Магазин"',
    bankName: 'ПриватБанк',
  });

  // Нові налаштування для різних платіжних систем
  const [paymentGateways, setPaymentGateways] = useState({
    privat24: {
      enabled: true,
      merchantId: '',
      secretKey: '',
      redirectUrl: 'https://your-store.com/payment/success',
    },
    monobank: {
      enabled: true,
      token: '',
      redirectUrl: 'https://your-store.com/payment/success',
    },
    liqpay: {
      enabled: false,
      publicKey: '',
      privateKey: '',
      sandboxMode: true,
    },
    cod: {
      enabled: true,
      additionalFee: '30',
      allowedRegions: 'Київ, Одеса, Харків, Львів',
    }
  });

  const handleSaveSettings = () => {
    // В реальному додатку тут був би API запит для збереження налаштувань
    toast({
      title: 'Налаштування збережено',
      description: 'Ваші налаштування платежів були успішно оновлені',
    });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailSettings(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleViberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setViberSettings(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTelegramChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTelegramSettings(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentGatewayChange = (gateway: string, field: string, value: string | boolean) => {
    setPaymentGateways(prev => ({
      ...prev,
      [gateway]: {
        ...prev[gateway as keyof typeof prev],
        [field]: value,
      }
    }));
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <AdminSidebar activePage="settings" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border flex items-center px-6">
          <h1 className="text-xl font-semibold">Налаштування платежів</h1>
          <div className="ml-auto">
            <Button onClick={handleSaveSettings}>
              Зберегти налаштування
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="container">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Платіжні реквізити
                </CardTitle>
                <CardDescription>
                  Ці дані будуть відправлятися клієнтам для оплати замовлень
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cardNumber">Номер картки</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      value={cardDetails.cardNumber}
                      onChange={handleCardDetailsChange}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="cardHolder">Власник картки / Назва компанії</Label>
                    <Input
                      id="cardHolder"
                      name="cardHolder"
                      value={cardDetails.cardHolder}
                      onChange={handleCardDetailsChange}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="bankName">Назва банку</Label>
                    <Input
                      id="bankName"
                      name="bankName"
                      value={cardDetails.bankName}
                      onChange={handleCardDetailsChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="privat24" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="privat24" className="flex items-center gap-1">
                  <CreditCardIcon className="h-4 w-4" />
                  Приват24
                </TabsTrigger>
                <TabsTrigger value="monobank" className="flex items-center gap-1">
                  <Smartphone className="h-4 w-4" />
                  Монобанк
                </TabsTrigger>
                <TabsTrigger value="liqpay" className="flex items-center gap-1">
                  <Wallet className="h-4 w-4" />
                  LiqPay
                </TabsTrigger>
                <TabsTrigger value="cod" className="flex items-center gap-1">
                  <Banknote className="h-4 w-4" />
                  Накладений платіж
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="privat24">
                <Card>
                  <CardHeader>
                    <CardTitle>Налаштування Приват24</CardTitle>
                    <CardDescription>
                      Налаштуйте інтеграцію з платіжною системою Приват24
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="privat24Enabled" 
                        checked={paymentGateways.privat24.enabled}
                        onCheckedChange={(checked) => 
                          handlePaymentGatewayChange('privat24', 'enabled', checked === true)
                        }
                      />
                      <Label htmlFor="privat24Enabled">Увімкнути оплату через Приват24</Label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="privat24MerchantId">ID мерчанта</Label>
                        <Input
                          id="privat24MerchantId"
                          value={paymentGateways.privat24.merchantId}
                          onChange={(e) => handlePaymentGatewayChange('privat24', 'merchantId', e.target.value)}
                          placeholder="Отримайте в особистому кабінеті Приват24"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="privat24SecretKey">Секретний ключ</Label>
                        <Input
                          id="privat24SecretKey"
                          type="password"
                          value={paymentGateways.privat24.secretKey}
                          onChange={(e) => handlePaymentGatewayChange('privat24', 'secretKey', e.target.value)}
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="privat24RedirectUrl">URL перенаправлення після оплати</Label>
                      <Input
                        id="privat24RedirectUrl"
                        value={paymentGateways.privat24.redirectUrl}
                        onChange={(e) => handlePaymentGatewayChange('privat24', 'redirectUrl', e.target.value)}
                        placeholder="https://your-store.com/payment/success"
                      />
                    </div>
                    
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm text-yellow-800">
                        Для роботи з Приват24 необхідно зареєструватися як мерчант у системі Приват24 
                        та отримати ідентифікаційні дані для інтеграції. 
                        <a href="https://api.privatbank.ua/#p24/" target="_blank" rel="noopener" className="underline ml-1">
                          Документація API Приват24
                        </a>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="monobank">
                <Card>
                  <CardHeader>
                    <CardTitle>Налаштування Монобанк</CardTitle>
                    <CardDescription>
                      Налаштуйте інтеграцію з платіжною системою Монобанк
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="monobankEnabled" 
                        checked={paymentGateways.monobank.enabled}
                        onCheckedChange={(checked) => 
                          handlePaymentGatewayChange('monobank', 'enabled', checked === true)
                        }
                      />
                      <Label htmlFor="monobankEnabled">Увімкнути оплату через Монобанк</Label>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="monobankToken">API Токен</Label>
                      <Input
                        id="monobankToken"
                        type="password"
                        value={paymentGateways.monobank.token}
                        onChange={(e) => handlePaymentGatewayChange('monobank', 'token', e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="monobankRedirectUrl">URL перенаправлення після оплати</Label>
                      <Input
                        id="monobankRedirectUrl"
                        value={paymentGateways.monobank.redirectUrl}
                        onChange={(e) => handlePaymentGatewayChange('monobank', 'redirectUrl', e.target.value)}
                        placeholder="https://your-store.com/payment/success"
                      />
                    </div>
                    
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm text-yellow-800">
                        Для інтеграції з Монобанк вам необхідно створити обліковий запис в системі 
                        <a href="https://api.monobank.ua/" target="_blank" rel="noopener" className="underline mx-1">
                          Монобанк для підприємців
                        </a>
                        та отримати API ключ для доступу до функцій оплати.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="liqpay">
                <Card>
                  <CardHeader>
                    <CardTitle>Налаштування LiqPay</CardTitle>
                    <CardDescription>
                      Налаштуйте інтеграцію з платіжною системою LiqPay
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="liqpayEnabled" 
                        checked={paymentGateways.liqpay.enabled}
                        onCheckedChange={(checked) => 
                          handlePaymentGatewayChange('liqpay', 'enabled', checked === true)
                        }
                      />
                      <Label htmlFor="liqpayEnabled">Увімкнути оплату через LiqPay</Label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="liqpayPublicKey">Публічний ключ</Label>
                        <Input
                          id="liqpayPublicKey"
                          value={paymentGateways.liqpay.publicKey}
                          onChange={(e) => handlePaymentGatewayChange('liqpay', 'publicKey', e.target.value)}
                          placeholder="Публічний ключ LiqPay"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="liqpayPrivateKey">Приватний ключ</Label>
                        <Input
                          id="liqpayPrivateKey"
                          type="password"
                          value={paymentGateways.liqpay.privateKey}
                          onChange={(e) => handlePaymentGatewayChange('liqpay', 'privateKey', e.target.value)}
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="liqpaySandbox" 
                        checked={paymentGateways.liqpay.sandboxMode}
                        onCheckedChange={(checked) => 
                          handlePaymentGatewayChange('liqpay', 'sandboxMode', checked === true)
                        }
                      />
                      <Label htmlFor="liqpaySandbox">Тестовий режим (Sandbox)</Label>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm text-yellow-800">
                        Ключі для інтеграції з LiqPay можна отримати, зареєструвавшись в
                        <a href="https://www.liqpay.ua/dashboard/store" target="_blank" rel="noopener" className="underline mx-1">
                          особистому кабінеті LiqPay
                        </a>.
                        Рекомендуємо спочатку протестувати інтеграцію в тестовому режимі.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="cod">
                <Card>
                  <CardHeader>
                    <CardTitle>Налаштування накладеного платежу</CardTitle>
                    <CardDescription>
                      Налаштуйте параметри оплати післяплатою при отриманні
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="codEnabled" 
                        checked={paymentGateways.cod.enabled}
                        onCheckedChange={(checked) => 
                          handlePaymentGatewayChange('cod', 'enabled', checked === true)
                        }
                      />
                      <Label htmlFor="codEnabled">Увімкнути накладений платіж</Label>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="codFee">Додаткова плата за накладений платіж (грн)</Label>
                      <Input
                        id="codFee"
                        value={paymentGateways.cod.additionalFee}
                        onChange={(e) => handlePaymentGatewayChange('cod', 'additionalFee', e.target.value)}
                        type="number"
                        min="0"
                      />
                      <p className="text-xs text-muted-foreground">
                        Додаткова плата, яка буде додана до суми замовлення при виборі накладеного платежу
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="codRegions">Дозволені регіони</Label>
                      <Textarea
                        id="codRegions"
                        value={paymentGateways.cod.allowedRegions}
                        onChange={(e) => handlePaymentGatewayChange('cod', 'allowedRegions', e.target.value)}
                        placeholder="Київ, Одеса, Львів, Харків"
                      />
                      <p className="text-xs text-muted-foreground">
                        Введіть через кому назви регіонів, де доступний накладений платіж, або залиште поле 
                        порожнім, щоб дозволити накладений платіж в усіх регіонах
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <Tabs defaultValue="email" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="email" className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="viber" className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4 text-purple-600" />
                  Viber
                </TabsTrigger>
                <TabsTrigger value="telegram" className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  Telegram
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="email">
                <Card>
                  <CardHeader>
                    <CardTitle>Налаштування Email</CardTitle>
                    <CardDescription>
                      Налаштуйте шаблон електронних листів для відправки платіжних реквізитів
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="emailEnabled" 
                        checked={emailSettings.enabled}
                        onCheckedChange={(checked) => 
                          setEmailSettings(prev => ({ ...prev, enabled: checked === true }))
                        }
                      />
                      <Label htmlFor="emailEnabled">Увімкнути відправку по email</Label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="senderEmail">Email відправника</Label>
                        <Input
                          id="senderEmail"
                          name="senderEmail"
                          value={emailSettings.senderEmail}
                          onChange={handleEmailChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="subject">Тема листа</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={emailSettings.subject}
                          onChange={handleEmailChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="template">Шаблон листа</Label>
                      <Textarea
                        id="template"
                        name="template"
                        rows={10}
                        value={emailSettings.template}
                        onChange={handleEmailChange}
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Використовуйте наступні змінні у шаблоні: {"{{name}}"}, {"{{orderNumber}}"}, {"{{amount}}"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="viber">
                <Card>
                  <CardHeader>
                    <CardTitle>Налаштування Viber</CardTitle>
                    <CardDescription>
                      Налаштуйте відправку повідомлень через Viber для платіжних реквізитів
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="viberEnabled" 
                        checked={viberSettings.enabled}
                        onCheckedChange={(checked) => 
                          setViberSettings(prev => ({ ...prev, enabled: checked === true }))
                        }
                      />
                      <Label htmlFor="viberEnabled">Увімкнути відправку через Viber</Label>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="viberApiKey">API ключ Viber</Label>
                      <Input
                        id="viberApiKey"
                        name="apiKey"
                        value={viberSettings.apiKey}
                        onChange={handleViberChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="viberTemplate">Шаблон повідомлення</Label>
                      <Textarea
                        id="viberTemplate"
                        name="template"
                        rows={4}
                        value={viberSettings.template}
                        onChange={handleViberChange}
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Використовуйте наступні змінні у шаблоні: {"{{name}}"}, {"{{orderNumber}}"}, {"{{amount}}"}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm text-yellow-800">
                        Для відправки повідомлень через Viber необхідно 
                        <a href="https://developers.viber.com/" target="_blank" rel="noopener" className="underline mx-1">
                          створити Viber бота
                        </a>
                        та отримати API ключ.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="telegram">
                <Card>
                  <CardHeader>
                    <CardTitle>Налаштування Telegram</CardTitle>
                    <CardDescription>
                      Налаштуйте відправку повідомлень через Telegram для платіжних реквізитів
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="telegramEnabled" 
                        checked={telegramSettings.enabled}
                        onCheckedChange={(checked) => 
                          setTelegramSettings(prev => ({ ...prev, enabled: checked === true }))
                        }
                      />
                      <Label htmlFor="telegramEnabled">Увімкнути відправку через Telegram</Label>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="botToken">Токен Telegram бота</Label>
                      <Input
                        id="botToken"
                        name="botToken"
                        value={telegramSettings.botToken}
                        onChange={handleTelegramChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="telegramTemplate">Шаблон повідомлення</Label>
                      <Textarea
                        id="telegramTemplate"
                        name="template"
                        rows={4}
                        value={telegramSettings.template}
                        onChange={handleTelegramChange}
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Використовуйте наступні змінні у шаблоні: {"{{name}}"}, {"{{orderNumber}}"}, {"{{amount}}"}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm text-yellow-800">
                        Для відправки повідомлень через Telegram необхідно створити Telegram бота
                        через 
                        <a href="https://t.me/BotFather" target="_blank" rel="noopener" className="underline mx-1">
                          BotFather
                        </a>
                        та отримати токен бота.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSaveSettings}>
                Зберегти налаштування
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PaymentSettings;
