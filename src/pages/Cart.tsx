
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight,
  ShoppingBag 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { useCart } from '@/contexts/CartContext';

const Cart = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items: cartItems, updateQuantity, removeItem, getTotal } = useCart();
  
  useEffect(() => {
    setIsPageLoaded(true);
  }, []);
  
  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'discount10') {
      setPromoApplied(true);
      setDiscount(10);
      toast({
        title: "Промокод застосовано",
        description: "Знижка 10% додана до вашого замовлення",
      });
    } else {
      toast({
        title: "Невірний промокод",
        description: "Перевірте введений промокод та спробуйте ще раз",
        variant: "destructive"
      });
    }
  };
  
  const subTotal = getTotal();
  const discountAmount = (subTotal * discount) / 100;
  const totalAmount = subTotal - discountAmount;
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container px-4 md:px-6">
          <AnimatedSection className="mb-8" animation="fade-up">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Кошик</h1>
            <p className="text-muted-foreground">Перегляд товарів у вашому кошику</p>
          </AnimatedSection>
          
          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <AnimatedSection animation="fade-up" delay={100}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {cartItems.map((item, index) => (
                          <div key={item.id}>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                              <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                                {item.image && (
                                  <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = 'https://via.placeholder.com/150';
                                    }}
                                  />
                                )}
                              </div>
                              
                              <div className="flex-grow">
                                <h3 className="font-medium">{item.name}</h3>
                                <p className="text-lg font-semibold mt-1">{item.price.toLocaleString()} грн</p>
                              </div>
                              
                              <div className="flex items-center mt-2 sm:mt-0">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="mx-3 text-center w-8">{item.quantity}</span>
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                                
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="ml-4 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => {
                                    removeItem(item.id);
                                    toast({
                                      title: "Товар видалено",
                                      description: "Товар був видалений з вашої корзини",
                                    });
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            {index < cartItems.length - 1 && <Separator className="my-6" />}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              </div>
              
              <div>
                <AnimatedSection animation="fade-up" delay={200}>
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Разом</h2>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Підсумок</span>
                          <span>{subTotal.toLocaleString()} грн</span>
                        </div>
                        
                        {promoApplied && (
                          <div className="flex justify-between text-green-600">
                            <span>Знижка ({discount}%)</span>
                            <span>-{discountAmount.toLocaleString()} грн</span>
                          </div>
                        )}
                        
                        <Separator />
                        
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Всього</span>
                          <span>{totalAmount.toLocaleString()} грн</span>
                        </div>
                        
                        <div className="pt-4">
                          <div className="flex gap-2 mb-4">
                            <Input
                              placeholder="Промокод"
                              value={promoCode}
                              onChange={(e) => setPromoCode(e.target.value)}
                              disabled={promoApplied}
                            />
                            <Button 
                              variant="outline" 
                              onClick={applyPromoCode}
                              disabled={promoApplied || !promoCode}
                            >
                              Застосувати
                            </Button>
                          </div>
                          
                          <Button 
                            className="w-full"
                            size="lg"
                            onClick={handleCheckout}
                          >
                            Оформити замовлення
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                          
                          <div className="mt-4">
                            <Link to="/products" className="text-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                              <ShoppingBag className="mr-1 h-4 w-4" />
                              Продовжити покупки
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              </div>
            </div>
          ) : (
            <AnimatedSection animation="fade-up" delay={100} className="text-center py-16">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="bg-muted rounded-full p-6">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-semibold">Ваш кошик порожній</h2>
                <p className="text-muted-foreground max-w-md">
                  Схоже, ви ще не додали жодного товару до вашого кошика
                </p>
                <Button asChild className="mt-4">
                  <Link to="/products">
                    Перейти до товарів
                  </Link>
                </Button>
              </div>
            </AnimatedSection>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
