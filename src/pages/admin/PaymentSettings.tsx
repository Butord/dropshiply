
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
import { CreditCard, Mail, MessageCircle } from 'lucide-react';

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

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Налаштування платежів</h1>
      
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
      
      <Tabs defaultValue="email">
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
                  Використовуйте наступні змінні у шаблоні: {{'{{'}}name{{'}}'}}, {{'{{'}}orderNumber{{'}}'}}, {{'{{'}}amount{{'}}'}}
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
                  Використовуйте наступні змінні у шаблоні: {{'{{'}}name{{'}}'}}, {{'{{'}}orderNumber{{'}}'}}, {{'{{'}}amount{{'}}'}}
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
                  Використовуйте наступні змінні у шаблоні: {{'{{'}}name{{'}}'}}, {{'{{'}}orderNumber{{'}}'}}, {{'{{'}}amount{{'}}'}}
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
  );
};

export default PaymentSettings;
