
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { mockProducts, mockCategories } from '@/lib/mockData';

const Products = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);
  const [sortOption, setSortOption] = useState('featured');
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  
  useEffect(() => {
    setIsPageLoaded(true);
  }, []);
  
  useEffect(() => {
    let results = [...mockProducts];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        product => 
          product.name.toLowerCase().includes(query) || 
          product.description.toLowerCase().includes(query) ||
          product.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply category filter
    if (selectedCategory && selectedCategory !== 'all') {
      results = results.filter(product => product.category === selectedCategory);
    }
    
    // Apply price range filter
    results = results.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Apply sorting
    if (sortOption === 'priceLow') {
      results.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'priceHigh') {
      results.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'newest') {
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    setFilteredProducts(results);
  }, [searchQuery, selectedCategory, priceRange, sortOption]);
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange([0, 3000]);
    setSortOption('featured');
  };
  
  const maxPrice = Math.max(...mockProducts.map(p => p.price));
  
  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container px-4 md:px-6">
          <AnimatedSection className="mb-8" animation="fade-up">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Products</h1>
            <p className="text-muted-foreground">Explore our curated selection of high-quality products</p>
          </AnimatedSection>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters for desktop */}
            <AnimatedSection 
              className="hidden lg:block w-64 flex-shrink-0 space-y-6"
              animation="fade-up"
              delay={100}
            >
              <div>
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="all-categories" 
                      checked={selectedCategory === 'all'} 
                      onCheckedChange={() => setSelectedCategory('all')}
                    />
                    <label 
                      htmlFor="all-categories" 
                      className="text-sm cursor-pointer"
                    >
                      All Categories
                    </label>
                  </div>
                  
                  {mockCategories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${category.id}`} 
                        checked={selectedCategory === category.name}
                        onCheckedChange={() => setSelectedCategory(
                          selectedCategory === category.name ? 'all' : category.name
                        )}
                      />
                      <label 
                        htmlFor={`category-${category.id}`} 
                        className="text-sm cursor-pointer"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-3">Price Range</h3>
                <Slider
                  value={[priceRange[0], priceRange[1]]}
                  min={0}
                  max={Math.ceil(maxPrice / 100) * 100}
                  step={10}
                  onValueChange={(value) => setPriceRange([value[0], value[1]])}
                  className="my-6"
                />
                <div className="flex items-center justify-between text-sm">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
              
              <Separator />
              
              <Button onClick={clearFilters} variant="outline" className="w-full">
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </AnimatedSection>
            
            {/* Mobile filters button */}
            <div className="lg:hidden mb-4">
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>
            
            {/* Mobile filters */}
            {showFilters && (
              <AnimatedSection 
                className="lg:hidden space-y-6 p-4 rounded-lg border mb-4"
                animation="fade-up"
              >
                <div>
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={!selectedCategory ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory('')}
                    >
                      All
                    </Button>
                    
                    {mockCategories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.name ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(
                          selectedCategory === category.name ? '' : category.name
                        )}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <Slider
                    value={[priceRange[0], priceRange[1]]}
                    min={0}
                    max={Math.ceil(maxPrice / 100) * 100}
                    step={10}
                    onValueChange={(value) => setPriceRange([value[0], value[1]])}
                    className="my-6"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
                
                <Button onClick={clearFilters} variant="outline" className="w-full">
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </AnimatedSection>
            )}
            
            <div className="flex-1">
              <AnimatedSection 
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
                animation="fade-up"
                delay={200}
              >
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full"
                  />
                </div>
                
                <div className="flex items-center w-full sm:w-auto">
                  <SlidersHorizontal className="h-4 w-4 mr-2 text-muted-foreground hidden sm:block" />
                  <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="priceLow">Price: Low to High</SelectItem>
                      <SelectItem value="priceHigh">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </AnimatedSection>
              
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product, i) => (
                    <AnimatedSection key={product.id} animation="fade-up" delay={300 + i * 50}>
                      <ProductCard product={product} />
                    </AnimatedSection>
                  ))}
                </div>
              ) : (
                <AnimatedSection 
                  className="text-center py-16"
                  animation="fade-up"
                  delay={300}
                >
                  <h3 className="text-xl font-medium mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button onClick={clearFilters}>Clear all filters</Button>
                </AnimatedSection>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Products;
