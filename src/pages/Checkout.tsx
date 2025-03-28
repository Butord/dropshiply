
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  CreditCard, 
  Truck, 
  MapPin, 
  Phone,
  Mail,
  User,
  CheckCircle,
  MessageCircle,
  Smartphone,
  Wallet,
  Banknote
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { useCart } from '@/contexts/CartContext';

const Checkout = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    saveInfo: false,
    paymentMethod: 'card',
    notificationMethod: 'email'
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, getTotal, clearCart } = useCart();
  
  useEffect(() => {
    setIsPageLoaded(true);
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handlePaymentMethodChange = (method: string) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: method
    }));
  };

  const handleNotificationMethodChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      notificationMethod: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Тут в реальному додатку була б логіка відправки замовлення на сервер
    
    // Симуляція завантаження
    toast({
      title: "Обробка замовлення",
      description: "Будь ласка, зачекайте поки ми обробляємо ваше замовлення",
    });
    
    setTimeout(() => {
      // Clear the cart after successful order
      clearCart();
      setOrderComplete(true);
    }, 1500);
  };
  
  const handleContinueShopping = () => {
    setOrderComplete(false);
    navigate('/');
  };
  
  const subTotal = getTotal();
  const shipping = 150;
  const totalAmount = subTotal + shipping;
  
  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container px-4 md:px-6">
          <AnimatedSection className="mb-8" animation="fade-up">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Оформлення замовлення</h1>
            <p className="text-muted-foreground">Заповніть дані для оформлення вашого замовлення</p>
          </AnimatedSection>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <AnimatedSection animation="fade-up" delay={100}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Контактна інформація
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">Ім'я</Label>
                            <Input
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Прізвище</Label>
                            <Input
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-1">
                              <Mail className="h-3.5 w-3.5" />
                              Email
                            </Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="flex items-center gap-1">
                              <Phone className="h-3.5 w-3.5" />
                              Телефон
                            </Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          Адреса доставки
                        </h2>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="address">Адреса</Label>
                            <Input
                              id="address"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="city">Місто</Label>
                              <Input
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="postalCode">Поштовий індекс</Label>
                              <Input
                                id="postalCode"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="saveInfo"
                              name="saveInfo"
                              checked={formData.saveInfo}
                              onCheckedChange={(checked) => 
                                setFormData(prev => ({ ...prev, saveInfo: checked === true }))
                              }
                            />
                            <Label htmlFor="saveInfo" className="text-sm font-normal">
                              Зберегти цю інформацію для наступних замовлень
                            </Label>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                          <CreditCard className="h-5 w-5" />
                          Спосіб оплати
                        </h2>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <div
                                className={`border rounded-md p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                                  formData.paymentMethod === 'card' ? 'border-primary bg-muted/50' : ''
                                }`}
                                onClick={() => handlePaymentMethodChange('card')}
                              >
                                <div className="flex items-center gap-3">
                                  <CreditCard className="h-5 w-5" />
                                  <div>
                                    <p className="font-medium">Картка</p>
                                    <p className="text-xs text-muted-foreground">Visa, Mastercard</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <div
                                className={`border rounded-md p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                                  formData.paymentMethod === 'privat24' ? 'border-primary bg-muted/50' : ''
                                }`}
                                onClick={() => handlePaymentMethodChange('privat24')}
                              >
                                <div className="flex items-center gap-3">
                                  <Smartphone className="h-5 w-5 text-green-600" />
                                  <div>
                                    <p className="font-medium">Приват24</p>
                                    <p className="text-xs text-muted-foreground">Оплата через Приват24</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <div
                                className={`border rounded-md p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                                  formData.paymentMethod === 'monobank' ? 'border-primary bg-muted/50' : ''
                                }`}
                                onClick={() => handlePaymentMethodChange('monobank')}
                              >
                                <div className="flex items-center gap-3">
                                  <Wallet className="h-5 w-5 text-yellow-600" />
                                  <div>
                                    <p className="font-medium">Монобанк</p>
                                    <p className="text-xs text-muted-foreground">Оплата через Монобанк</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <div
                                className={`border rounded-md p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                                  formData.paymentMethod === 'cod' ? 'border-primary bg-muted/50' : ''
                                }`}
                                onClick={() => handlePaymentMethodChange('cod')}
                              >
                                <div className="flex items-center gap-3">
                                  <Banknote className="h-5 w-5" />
                                  <div>
                                    <p className="font-medium">Накладений платіж</p>
                                    <p className="text-xs text-muted-foreground">Оплата при отриманні</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {(formData.paymentMethod === 'card' || formData.paymentMethod === 'privat24' || formData.paymentMethod === 'monobank') && (
                            <div className="space-y-4 mt-4">
                              <p className="text-sm text-muted-foreground">
                                Ми надішлемо вам платіжні реквізити через обраний метод повідомлення. 
                                Ваші платіжні дані ніколи не зберігаються на нашому сайті.
                              </p>
                              
                              <div className="space-y-3">
                                <Label>Як отримати реквізити для оплати?</Label>
                                <RadioGroup 
                                  value={formData.notificationMethod} 
                                  onValueChange={handleNotificationMethodChange}
                                  className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="email" id="email-option" />
                                    <Label htmlFor="email-option" className="flex items-center gap-1 cursor-pointer">
                                      <Mail className="h-4 w-4" />
                                      Email
                                    </Label>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="viber" id="viber-option" />
                                    <Label htmlFor="viber-option" className="flex items-center gap-1 cursor-pointer">
                                      <MessageCircle className="h-4 w-4 text-purple-600" />
                                      Viber
                                    </Label>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="telegram" id="telegram-option" />
                                    <Label htmlFor="telegram-option" className="flex items-center gap-1 cursor-pointer">
                                      <MessageCircle className="h-4 w-4 text-blue-500" />
                                      Telegram
                                    </Label>
                                  </div>
                                </RadioGroup>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              </div>
              
              <div>
                <AnimatedSection animation="fade-up" delay={200}>
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Ваше замовлення</h2>
                      
                      <div className="space-y-4">
                        {items.length > 0 ? (
                          items.map((item) => (
                            <div key={item.id} className="flex justify-between">
                              <span className="text-muted-foreground">
                                {item.name} × {item.quantity}
                              </span>
                              <span>{(item.price * item.quantity).toLocaleString()} грн</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-muted-foreground text-center py-4">
                            Ваш кошик порожній
                          </div>
                        )}
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Підсумок</span>
                            <span>{subTotal.toLocaleString()} грн</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Доставка</span>
                            <span>{shipping.toLocaleString()} грн</span>
                          </div>
                          
                          {formData.paymentMethod === 'cod' && (
                            <div className="flex justify-between font-medium text-amber-600">
                              <span>Комісія за накладений платіж</span>
                              <span>30 грн</span>
                            </div>
                          )}
                        </div>
                        
                        <Separator />
                        
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Всього</span>
                          <span>{(totalAmount + (formData.paymentMethod === 'cod' ? 30 : 0)).toLocaleString()} грн</span>
                        </div>
                        
                        <Button 
                          className="w-full mt-4"
                          size="lg"
                          type="submit"
                          disabled={items.length === 0}
                        >
                          Підтвердити замовлення
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              </div>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
      
      {/* Діалог успішного замовлення */}
      <Dialog open={orderComplete} onOpenChange={setOrderComplete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Замовлення успішно оформлено!</DialogTitle>
            <DialogDescription className="text-center">
              {formData.paymentMethod === 'card' || formData.paymentMethod === 'privat24' || formData.paymentMethod === 'monobank' ? 
                `Дякуємо за ваше замовлення. Ми надіслали деталі оплати на ваш ${
                  formData.notificationMethod === 'email' ? 'email' : 
                  formData.notificationMethod === 'viber' ? 'Viber' : 'Telegram'
                }.` :
                'Дякуємо за ваше замовлення. Ви зможете оплатити його при отриманні.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center py-6">
            <div className="bg-green-100 rounded-full p-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          
          <div className="text-center mb-4">
            <h3 className="font-semibold">Номер замовлення: #ORDER-{Math.floor(Math.random() * 10000)}</h3>
            <p className="text-muted-foreground mt-1">
              Ви можете перевірити стан вашого замовлення у своєму обліковому записі
            </p>
          </div>
          
          <div className="flex justify-center">
            <Button onClick={handleContinueShopping}>
              Продовжити покупки
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;
