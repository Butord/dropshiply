
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { useCart } from "@/contexts/CartContext";
import { generateOrderNumber } from "@/lib/services/notificationService";
import { sendOrderNotification } from "@/lib/services/notificationService";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, ShoppingCart, Check, Loader2, AlertTriangle } from "lucide-react";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "Ім'я повинно містити щонайменше 2 символи" }),
  lastName: z.string().min(2, { message: "Прізвище повинно містити щонайменше 2 символи" }),
  email: z.string().email({ message: "Введіть коректну електронну адресу" }),
  phone: z.string().min(10, { message: "Телефон повинен містити щонайменше 10 цифр" }),
  address: z.string().min(5, { message: "Адреса повинна містити щонайменше 5 символів" }),
  city: z.string().min(2, { message: "Місто повинно містити щонайменше 2 символи" }),
  region: z.string().min(2, { message: "Область повинна містити щонайменше 2 символи" }),
  postalCode: z.string().min(5, { message: "Поштовий індекс повинен містити щонайменше 5 символів" }),
  paymentMethod: z.enum(["credit_card", "cash_on_delivery", "bank_transfer", "googlepay", "applepay"], { 
    required_error: "Виберіть спосіб оплати" 
  }),
});

type CheckoutFormValues = z.infer<typeof formSchema>;

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Google Pay and Apple Pay availability checks
  const [isGooglePayAvailable, setIsGooglePayAvailable] = useState(true);
  const [isApplePayAvailable, setIsApplePayAvailable] = useState(false);
  
  // Shipping costs, tax, etc.
  const shipping = 150;
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + shipping + tax;

  useEffect(() => {
    setIsPageLoaded(true);
    
    // Check if we're on an Apple device for Apple Pay
    const isAppleDevice = /Mac|iPhone|iPod|iPad/.test(navigator.platform);
    setIsApplePayAvailable(isAppleDevice);

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      region: "",
      postalCode: "",
      paymentMethod: "credit_card",
    },
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    if (items.length === 0) {
      toast({
        title: "Кошик порожній",
        description: "Додайте товари в кошик перед оформленням замовлення",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate order number
      const orderNumber = generateOrderNumber();
      
      // Create order notification
      const notification = {
        orderNumber,
        customerName: `${data.firstName} ${data.lastName}`,
        customerEmail: data.email,
        amount: total,
        paymentMethod: getPaymentMethodName(data.paymentMethod),
        paymentDetails: getPaymentDetails(data.paymentMethod),
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      };
      
      // Send email notification
      await sendOrderNotification(notification);
      
      // Show success toast
      toast({
        title: "Замовлення успішно оформлено!",
        description: `Ваше замовлення #${orderNumber} прийнято до обробки. Деталі було надіслано на вашу електронну пошту.`,
      });
      
      // Clear cart
      clearCart();
      
      // Redirect to success page or home
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error processing order:", error);
      toast({
        title: "Помилка при оформленні замовлення",
        description: "Спробуйте ще раз або зв'яжіться з нами для допомоги.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getPaymentMethodName = (method: string): string => {
    switch (method) {
      case "credit_card": return "Кредитна карта";
      case "cash_on_delivery": return "Накладений платіж";
      case "bank_transfer": return "Банківський переказ";
      case "googlepay": return "Google Pay";
      case "applepay": return "Apple Pay";
      default: return "Невідомий метод оплати";
    }
  };
  
  const getPaymentDetails = (method: string): string => {
    switch (method) {
      case "bank_transfer": 
        return "Номер рахунку: UA213223130000026007233566001\nОтримувач: ТОВ \"Ваш Магазин\"\nПризначення: Оплата замовлення";
      case "cash_on_delivery": 
        return "Оплата при отриманні. Комісія за накладений платіж: 20 грн + 2% від суми замовлення.";
      default: 
        return "";
    }
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container px-4 md:px-6">
            <AnimatedSection animation="fade-up">
              <div className="max-w-md mx-auto text-center py-12">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground" />
                <h1 className="text-2xl font-bold mt-4 mb-2">Кошик порожній</h1>
                <p className="text-muted-foreground mb-8">
                  Додайте товари в кошик перед оформленням замовлення
                </p>
                <Button onClick={() => navigate("/products")}>
                  Перейти до товарів
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container px-4 md:px-6">
          <AnimatedSection animation="fade-up">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Оформлення замовлення</h1>
            <p className="text-muted-foreground mb-8">Введіть ваші дані та оберіть спосіб оплати</p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AnimatedSection animation="fade-up" delay={100}>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Контактна інформація</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Ім'я</FormLabel>
                                <FormControl>
                                  <Input placeholder="Іван" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Прізвище</FormLabel>
                                <FormControl>
                                  <Input placeholder="Петренко" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="example@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Телефон</FormLabel>
                                <FormControl>
                                  <Input placeholder="+380XXXXXXXXX" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Адреса доставки</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Адреса</FormLabel>
                              <FormControl>
                                <Input placeholder="вул. Шевченка, 10, кв. 5" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Місто</FormLabel>
                                <FormControl>
                                  <Input placeholder="Київ" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="region"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Область</FormLabel>
                                <FormControl>
                                  <Input placeholder="Київська" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="postalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Поштовий індекс</FormLabel>
                              <FormControl>
                                <Input placeholder="01001" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Спосіб оплати</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <FormField
                          control={form.control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="space-y-3"
                                >
                                  <div className="flex items-center space-x-2 border p-4 rounded-md">
                                    <RadioGroupItem value="credit_card" id="credit_card" />
                                    <Label htmlFor="credit_card" className="flex items-center">
                                      <CreditCard className="h-5 w-5 mr-2" />
                                      <span>Кредитна карта</span>
                                    </Label>
                                  </div>
                                  
                                  {isGooglePayAvailable && (
                                    <div className="flex items-center space-x-2 border p-4 rounded-md">
                                      <RadioGroupItem value="googlepay" id="googlepay" />
                                      <Label htmlFor="googlepay" className="flex items-center">
                                        <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M6 9h12l-5 7H6z" />
                                          <path d="M9 17v-6" />
                                          <path d="M15 17v-6" />
                                        </svg>
                                        <span>Google Pay</span>
                                      </Label>
                                    </div>
                                  )}
                                  
                                  {isApplePayAvailable && (
                                    <div className="flex items-center space-x-2 border p-4 rounded-md">
                                      <RadioGroupItem value="applepay" id="applepay" />
                                      <Label htmlFor="applepay" className="flex items-center">
                                        <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06z" />
                                          <path d="M10 2c1 .5 2 2 2 5" />
                                        </svg>
                                        <span>Apple Pay</span>
                                      </Label>
                                    </div>
                                  )}
                                  
                                  <div className="flex items-center space-x-2 border p-4 rounded-md">
                                    <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                                    <Label htmlFor="cash_on_delivery">Накладений платіж</Label>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2 border p-4 rounded-md">
                                    <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                                    <Label htmlFor="bank_transfer">Банківський переказ</Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {form.watch("paymentMethod") === "bank_transfer" && (
                          <div className="mt-4 p-4 bg-muted rounded-md text-sm">
                            <p className="font-medium mb-2">Інформація для оплати:</p>
                            <p>Номер рахунку: UA213223130000026007233566001</p>
                            <p>Отримувач: ТОВ "Ваш Магазин"</p>
                            <p>Призначення: Оплата замовлення</p>
                          </div>
                        )}
                        
                        {form.watch("paymentMethod") === "cash_on_delivery" && (
                          <div className="mt-4 p-4 bg-muted rounded-md text-sm">
                            <p>Оплата при отриманні. Комісія за накладений платіж: 20 грн + 2% від суми замовлення.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Обробка замовлення...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Підтвердити замовлення
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </AnimatedSection>
            </div>
            
            <div>
              <AnimatedSection animation="fade-up" delay={150}>
                <Card>
                  <CardHeader>
                    <CardTitle>Ваше замовлення</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between py-2">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Кількість: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{(item.price * item.quantity).toFixed(2)} грн</p>
                            {item.quantity > 1 && (
                              <p className="text-sm text-muted-foreground">{item.price.toFixed(2)} грн за од.</p>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      <Separator />
                      
                      <div className="flex justify-between">
                        <p>Проміжний підсумок</p>
                        <p>{subtotal.toFixed(2)} грн</p>
                      </div>
                      
                      <div className="flex justify-between">
                        <p>Доставка</p>
                        <p>{shipping.toFixed(2)} грн</p>
                      </div>
                      
                      <div className="flex justify-between">
                        <p>ПДВ (5%)</p>
                        <p>{tax.toFixed(2)} грн</p>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between font-bold text-lg">
                        <p>Загальна сума</p>
                        <p>{total.toFixed(2)} грн</p>
                      </div>
                      
                      <div className="pt-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                          <p>Доставка може змінюватись в залежності від місця доставки</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
