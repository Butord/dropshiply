
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tag, Grid3X3, List } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { mockCategories, mockProducts } from '@/lib/mockData';

const Categories = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  useEffect(() => {
    setIsPageLoaded(true);
  }, []);
  
  const categoriesWithProductCount = mockCategories.map(category => {
    const productCount = mockProducts.filter(p => p.category === category.name).length;
    return {
      ...category,
      productCount
    };
  });
  
  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container px-4 md:px-6">
          <AnimatedSection className="mb-8" animation="fade-up">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Categories</h1>
            <p className="text-muted-foreground">Browse our product categories to find what you're looking for</p>
          </AnimatedSection>
          
          <AnimatedSection 
            className="flex justify-between items-center mb-6"
            animation="fade-up"
            delay={100}
          >
            <div className="flex items-center space-x-2">
              <Tag className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">{categoriesWithProductCount.length} Categories</span>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="aspect-square p-0 h-9 w-9"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="aspect-square p-0 h-9 w-9"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </AnimatedSection>
          
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categoriesWithProductCount.map((category, i) => (
                <AnimatedSection 
                  key={category.id} 
                  animation="fade-up" 
                  delay={200 + i * 50}
                >
                  <Link to={`/products?category=${category.slug}`}>
                    <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md">
                      <div className="aspect-video relative overflow-hidden bg-gray-100">
                        {category.image ? (
                          <img 
                            src={category.image} 
                            alt={category.name} 
                            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <Tag className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                        {category.description && (
                          <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                            {category.description}
                          </p>
                        )}
                        <div className="text-sm text-muted-foreground">
                          {category.productCount} Products
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {categoriesWithProductCount.map((category, i) => (
                <AnimatedSection 
                  key={category.id} 
                  animation="fade-up" 
                  delay={200 + i * 50}
                >
                  <Link to={`/products?category=${category.slug}`}>
                    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-48 aspect-video md:aspect-square relative overflow-hidden bg-gray-100">
                          {category.image ? (
                            <img 
                              src={category.image} 
                              alt={category.name} 
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <Tag className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4 flex-grow">
                          <h3 className="font-semibold text-xl mb-2">{category.name}</h3>
                          {category.description && (
                            <p className="text-muted-foreground mb-4">
                              {category.description}
                            </p>
                          )}
                          <div className="text-sm text-muted-foreground">
                            {category.productCount} Products
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                  {i < categoriesWithProductCount.length - 1 && (
                    <Separator className="mt-4 md:hidden" />
                  )}
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Categories;
