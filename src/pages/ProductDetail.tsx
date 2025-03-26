
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, 
  Minus, 
  Plus, 
  Heart, 
  Share, 
  ShoppingCart, 
  TruckIcon, 
  ShieldCheck, 
  RotateCcw 
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { mockProducts } from '@/lib/mockData';
import { toast } from '@/components/ui/use-toast';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    setIsPageLoaded(true);
    // Reset state when product changes
    setQuantity(1);
    setSelectedImageIndex(0);
  }, [id]);
  
  const product = mockProducts.find(p => p.id === id);
  const relatedProducts = mockProducts
    .filter(p => p.id !== id && p.category === product?.category)
    .slice(0, 4);
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Товар не знайдено</h1>
            <Link to="/products">
              <Button>Повернутися до товарів</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  const handleAddToCart = () => {
    toast({
      title: "Додано до кошика",
      description: `${quantity} x ${product.name} було додано до вашого кошика.`,
      duration: 3000,
    });
  };
  
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Видалено з обраного" : "Додано до обраного",
      description: `${product.name} було ${isFavorite ? "видалено з" : "додано до"} вашого обраного.`,
      duration: 3000,
    });
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Посилання скопійовано",
      description: "Посилання на товар було скопійовано до буфера обміну.",
      duration: 3000,
    });
  };
  
  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container px-4 md:px-6">
          <AnimatedSection className="mb-6" animation="fade-up">
            <Link to="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Назад до товарів
            </Link>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
            {/* Product Images */}
            <AnimatedSection animation="fade-up" delay={100}>
              <div className="space-y-4">
                <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
                  <img
                    src={product.images[selectedImageIndex]}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                  {product.compareAtPrice && (
                    <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full">
                      {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% ЗНИЖКА
                    </div>
                  )}
                </div>
                
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index 
                            ? 'border-primary' 
                            : 'border-transparent hover:border-gray-200'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} - вигляд ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </AnimatedSection>
            
            {/* Product Info */}
            <AnimatedSection animation="fade-up" delay={300}>
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-muted-foreground">{product.category}</div>
                  <h1 className="text-3xl font-bold tracking-tight mt-1">{product.name}</h1>
                  
                  <div className="flex items-baseline mt-4">
                    <span className="text-2xl font-semibold">₴{product.price.toFixed(2)}</span>
                    {product.compareAtPrice && (
                      <span className="ml-3 text-lg text-muted-foreground line-through">
                        ₴{product.compareAtPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Артикул</span>
                    <span>{product.sku}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Наявність</span>
                    <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                      {product.stock > 10
                        ? 'В наявності'
                        : product.stock > 0
                        ? `Залишилось лише ${product.stock}`
                        : 'Немає в наявності'}
                    </span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="h-10 w-10"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="w-16 mx-2">
                      <input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="h-10 w-full text-center border rounded-md"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={increaseQuantity}
                      disabled={quantity >= product.stock}
                      className="h-10 w-10"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      className="flex-1 h-12"
                      size="lg"
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Додати до кошика
                    </Button>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12"
                        onClick={handleToggleFavorite}
                      >
                        <Heart
                          className="h-5 w-5"
                          fill={isFavorite ? "currentColor" : "none"}
                        />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12"
                        onClick={handleShare}
                      >
                        <Share className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <TruckIcon className="h-5 w-5 text-muted-foreground mr-2" />
                    <span>Безкоштовна доставка від ₴1500</span>
                  </div>
                  <div className="flex items-center">
                    <ShieldCheck className="h-5 w-5 text-muted-foreground mr-2" />
                    <span>Гарантія 2 роки</span>
                  </div>
                  <div className="flex items-center">
                    <RotateCcw className="h-5 w-5 text-muted-foreground mr-2" />
                    <span>30 днів на повернення</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
          
          {/* Product Details Tabs */}
          <AnimatedSection animation="fade-up" delay={500}>
            <div className="mb-16">
              <Tabs defaultValue="description">
                <TabsList className="w-full grid grid-cols-3 mb-6">
                  <TabsTrigger value="description">Опис</TabsTrigger>
                  <TabsTrigger value="specifications">Характеристики</TabsTrigger>
                  <TabsTrigger value="shipping">Доставка та повернення</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="text-muted-foreground space-y-4">
                  <p>{product.description}</p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id.
                  </p>
                  <p>
                    Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi.
                  </p>
                </TabsContent>
                <TabsContent value="specifications">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Категорія</div>
                        <div className="font-medium">{product.category}</div>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Артикул</div>
                        <div className="font-medium">{product.sku}</div>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Вага</div>
                        <div className="font-medium">0.5 кг</div>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Розміри</div>
                        <div className="font-medium">20 × 15 × 5 см</div>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Матеріали</div>
                        <div className="font-medium">Метал, Пластик</div>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Гарантія</div>
                        <div className="font-medium">2 роки</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="shipping" className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Інформація про доставку</h3>
                    <p className="text-muted-foreground">
                      Ми пропонуємо безкоштовну стандартну доставку для всіх замовлень на суму понад ₴1500. Для замовлень на суму менше ₴1500 вартість доставки розраховується на основі адреси доставки.
                    </p>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                      <li>Стандартна доставка: 3-5 робочих днів</li>
                      <li>Експрес-доставка: 1-2 робочих дні (стягується додаткова плата)</li>
                      <li>Міжнародна доставка: 7-14 робочих днів (стягується додаткова плата)</li>
                    </ul>
                    
                    <h3 className="text-lg font-medium mt-6">Політика повернення</h3>
                    <p className="text-muted-foreground">
                      Ми пропонуємо 30-денну політику повернення для більшості товарів. Щоб мати право на повернення, ваш товар повинен бути невикористаним і в тому ж стані, в якому ви його отримали, з оригінальною упаковкою.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </AnimatedSection>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <AnimatedSection animation="fade-up" delay={600}>
                <h2 className="text-2xl font-bold tracking-tight mb-6">Пов'язані товари</h2>
              </AnimatedSection>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct, i) => (
                  <AnimatedSection key={relatedProduct.id} animation="fade-up" delay={700 + i * 50}>
                    <ProductCard product={relatedProduct} />
                  </AnimatedSection>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
