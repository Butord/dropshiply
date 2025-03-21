
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, ChevronRight, Package, Truck, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { mockProducts, mockCategories } from '@/lib/mockData';

const Index = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  
  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  const featuredProducts = mockProducts.slice(0, 4);
  const categories = mockCategories.slice(0, 4);

  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-24 pb-16 md:pt-32 md:pb-24">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <AnimatedSection className="space-y-6" animation="fade-up">
                <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  Premium Dropshipping Platform
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Automate Your <br /> 
                  <span className="text-primary">E-commerce Business</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-md">
                  Access high-quality products, automate inventory, and scale your business with our advanced dropshipping tools.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Button size="lg" className="h-12 px-6">
                    Get Started
                  </Button>
                  <Button variant="outline" size="lg" className="h-12 px-6">
                    Learn More
                  </Button>
                </div>
              </AnimatedSection>
              
              <AnimatedSection 
                className="relative" 
                animation="scale-in" 
                delay={300}
              >
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden glass-card">
                  <div 
                    className="absolute inset-0 bg-cover bg-center" 
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070')" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
                </div>
                <div className="absolute -bottom-6 -right-6 rotate-6">
                  <div 
                    className="w-32 h-32 bg-cover bg-center rounded-lg shadow-lg" 
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1586880244406-556ebe35f282?q=80&w=1287')" }}
                  />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 md:px-6">
            <AnimatedSection className="text-center max-w-2xl mx-auto mb-12" animation="fade-up">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Why Choose dropshiply</h2>
              <p className="text-muted-foreground">Our platform provides everything you need to run a successful dropshipping business</p>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <AnimatedSection className="glass-card p-6" animation="fade-up" delay={100}>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
                <p className="text-muted-foreground">
                  All products on our platform are carefully selected and vetted for quality, ensuring customer satisfaction.
                </p>
              </AnimatedSection>
              
              <AnimatedSection className="glass-card p-6" animation="fade-up" delay={200}>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
                <p className="text-muted-foreground">
                  Our global network of suppliers ensures fast shipping times to customers worldwide.
                </p>
              </AnimatedSection>
              
              <AnimatedSection className="glass-card p-6" animation="fade-up" delay={300}>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Reliable Platform</h3>
                <p className="text-muted-foreground">
                  Our automated system keeps your inventory in sync and makes sure orders are processed smoothly.
                </p>
              </AnimatedSection>
            </div>
          </div>
        </section>
        
        {/* Featured Products */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="flex justify-between items-center mb-8">
              <AnimatedSection animation="fade-up">
                <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
              </AnimatedSection>
              <AnimatedSection animation="fade-up" delay={100}>
                <Link to="/products">
                  <Button variant="ghost" className="group">
                    View all
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </AnimatedSection>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, i) => (
                <AnimatedSection key={product.id} animation="fade-up" delay={i * 100}>
                  <ProductCard product={product} />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
        
        {/* Categories Section */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 md:px-6">
            <AnimatedSection className="text-center max-w-2xl mx-auto mb-12" animation="fade-up">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Shop by Category</h2>
              <p className="text-muted-foreground">Explore our wide range of product categories</p>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, i) => (
                <AnimatedSection key={category.id} animation="fade-up" delay={i * 100}>
                  <Link to={`/categories/${category.slug}`}>
                    <div className="relative group overflow-hidden rounded-lg glass-card">
                      <div 
                        className="aspect-[3/2] bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                        style={{ backgroundImage: `url(${category.image})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-xl font-semibold text-white mb-1">{category.name}</h3>
                        <div className="flex items-center text-sm text-white/80 group-hover:text-white transition-colors">
                          Browse products <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1172')" }}
              />
              <div className="relative z-10 px-6 py-16 md:px-12 md:py-20 lg:py-24 max-w-3xl mx-auto text-center">
                <AnimatedSection animation="fade-up">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                    Ready to Start Your Dropshipping Business?
                  </h2>
                  <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                    Join thousands of successful entrepreneurs who are scaling their businesses with our platform.
                  </p>
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-12 px-8">
                    Get Started Today
                  </Button>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
