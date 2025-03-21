
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  AlertCircle, 
  ArrowUpDown, 
  Download, 
  Edit, 
  FileText, 
  Filter, 
  LineChart, 
  Package, 
  Plus, 
  Search, 
  Settings, 
  ShoppingCart, 
  Trash2, 
  Upload, 
  Users, 
  XCircle 
} from 'lucide-react';
import { mockProducts, mockCategories } from '@/lib/mockData';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { Product } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';

const ProductManagement = () => {
  const [products, setProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStock, setSelectedStock] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  // Filter products based on search, category, stock status, and active tab
  const filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch = 
      searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = 
      selectedCategory === '' || 
      product.category === selectedCategory;
    
    // Stock filter
    const matchesStock = 
      selectedStock === 'all' || 
      (selectedStock === 'inStock' && product.stock > 0) ||
      (selectedStock === 'lowStock' && product.stock > 0 && product.stock < 10) ||
      (selectedStock === 'outOfStock' && product.stock === 0);
    
    return matchesSearch && matchesCategory && matchesStock;
  });
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let valueA, valueB;
    
    switch (sortColumn) {
      case 'name':
        valueA = a.name;
        valueB = b.name;
        break;
      case 'sku':
        valueA = a.sku;
        valueB = b.sku;
        break;
      case 'price':
        valueA = a.price;
        valueB = b.price;
        break;
      case 'stock':
        valueA = a.stock;
        valueB = b.stock;
        break;
      default:
        valueA = a.name;
        valueB = b.name;
    }
    
    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(sortedProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };
  
  const handleSelectProduct = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, id]);
    } else {
      setSelectedProducts(selectedProducts.filter(productId => productId !== id));
    }
  };
  
  const handleDeleteSelected = () => {
    // Implement delete functionality
    setProducts(products.filter(product => !selectedProducts.includes(product.id)));
    toast({
      title: "Products Deleted",
      description: `${selectedProducts.length} products have been deleted.`,
    });
    setSelectedProducts([]);
  };
  
  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
    toast({
      title: "Product Deleted",
      description: "The product has been deleted successfully.",
    });
  };
  
  const stockStatusColor = (stock: number) => {
    if (stock === 0) return 'text-red-500';
    if (stock < 10) return 'text-amber-500';
    return 'text-green-500';
  };
  
  const stockStatusText = (stock: number) => {
    if (stock === 0) return 'Out of Stock';
    if (stock < 10) return `Low: ${stock}`;
    return `In Stock: ${stock}`;
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <Link to="/" className="text-xl font-semibold tracking-tight">
            dropshiply
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavItem href="/admin" icon={<LineChart className="h-4 w-4" />} label="Dashboard" />
          <NavItem href="/admin/products" icon={<Package className="h-4 w-4" />} label="Products" active />
          <NavItem href="/admin/xml-import" icon={<FileText className="h-4 w-4" />} label="XML Import" />
          <NavItem href="/admin/orders" icon={<ShoppingCart className="h-4 w-4" />} label="Orders" />
          <NavItem href="/admin/customers" icon={<Users className="h-4 w-4" />} label="Customers" />
          <NavItem href="/admin/settings" icon={<Settings className="h-4 w-4" />} label="Settings" />
        </nav>
        
        <div className="p-4 border-t border-border">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src="https://i.pravatar.cc/150?img=1" alt="Admin" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium">Admin User</div>
              <div className="text-xs text-muted-foreground">admin@example.com</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border flex items-center px-6">
          <h1 className="text-xl font-semibold">Product Management</h1>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatedSection animation="fade-up">
            <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex-1 w-full md:max-w-md relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search products by name or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
              
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {mockCategories.map(category => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedStock} onValueChange={setSelectedStock}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Stock Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stock</SelectItem>
                    <SelectItem value="inStock">In Stock</SelectItem>
                    <SelectItem value="lowStock">Low Stock</SelectItem>
                    <SelectItem value="outOfStock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={100}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Products</TabsTrigger>
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
              </TabsList>
            </Tabs>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={200}>
            <div className="rounded-md border">
              {/* Product Table Header */}
              <div className="bg-muted/50 px-4 py-3 text-xs font-medium">
                <div className="grid grid-cols-12 items-center">
                  <div className="col-span-1">
                    <Checkbox 
                      checked={
                        sortedProducts.length > 0 && 
                        selectedProducts.length === sortedProducts.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </div>
                  <SortableHeader 
                    col={4} 
                    label="Product" 
                    field="name" 
                    currentSort={sortColumn} 
                    direction={sortDirection} 
                    onSort={handleSort} 
                  />
                  <SortableHeader 
                    col={2} 
                    label="SKU" 
                    field="sku" 
                    currentSort={sortColumn} 
                    direction={sortDirection} 
                    onSort={handleSort} 
                  />
                  <div className="col-span-1">Category</div>
                  <SortableHeader 
                    col={1} 
                    label="Price" 
                    field="price" 
                    currentSort={sortColumn} 
                    direction={sortDirection} 
                    onSort={handleSort} 
                  />
                  <SortableHeader 
                    col={1} 
                    label="Stock" 
                    field="stock" 
                    currentSort={sortColumn} 
                    direction={sortDirection} 
                    onSort={handleSort} 
                  />
                  <div className="col-span-2 text-right">Actions</div>
                </div>
              </div>
              
              {/* Product List */}
              <div>
                {sortedProducts.length === 0 ? (
                  <div className="px-4 py-10 text-center">
                    <XCircle className="h-8 w-8 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground">No products found</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {sortedProducts.map((product) => (
                      <div key={product.id} className="px-4 py-3 text-sm hover:bg-muted/30 transition-colors">
                        <div className="grid grid-cols-12 items-center">
                          <div className="col-span-1">
                            <Checkbox 
                              checked={selectedProducts.includes(product.id)}
                              onCheckedChange={(checked) => 
                                handleSelectProduct(product.id, checked as boolean)
                              }
                            />
                          </div>
                          <div className="col-span-4 flex items-center">
                            <div className="h-10 w-10 rounded bg-muted mr-3 overflow-hidden">
                              <img 
                                src={product.images[0]} 
                                alt={product.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="truncate font-medium">{product.name}</div>
                          </div>
                          <div className="col-span-2 text-muted-foreground">{product.sku}</div>
                          <div className="col-span-1">{product.category}</div>
                          <div className="col-span-1">
                            ${product.price.toFixed(2)}
                            {product.compareAtPrice && (
                              <div className="text-xs text-muted-foreground line-through">
                                ${product.compareAtPrice.toFixed(2)}
                              </div>
                            )}
                          </div>
                          <div className={`col-span-1 ${stockStatusColor(product.stock)}`}>
                            {stockStatusText(product.stock)}
                          </div>
                          <div className="col-span-2 flex justify-end space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Bulk Actions */}
              {selectedProducts.length > 0 && (
                <div className="bg-muted/50 px-4 py-3 border-t">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      {selectedProducts.length} products selected
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedProducts([])}
                      >
                        Deselect All
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={handleDeleteSelected}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete Selected
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Pagination (placeholder) */}
            <div className="flex justify-between items-center mt-4 text-sm">
              <div className="text-muted-foreground">
                Showing {sortedProducts.length} of {products.length} products
              </div>
              <div className="flex space-x-1">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="px-3">
                  1
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </main>
      </div>
    </div>
  );
};

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem = ({ href, icon, label, active }: NavItemProps) => {
  return (
    <Link
      to={href}
      className={`flex items-center h-10 rounded-md px-3 text-sm font-medium ${
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted transition-colors'
      }`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </Link>
  );
};

interface SortableHeaderProps {
  col: number;
  label: string;
  field: string;
  currentSort: string;
  direction: 'asc' | 'desc';
  onSort: (field: string) => void;
}

const SortableHeader = ({
  col,
  label,
  field,
  currentSort,
  direction,
  onSort,
}: SortableHeaderProps) => {
  return (
    <div 
      className={`col-span-${col} cursor-pointer group flex items-center`}
      onClick={() => onSort(field)}
    >
      <span>{label}</span>
      <ArrowUpDown 
        className={`h-3 w-3 ml-1 transition-opacity ${
          currentSort === field 
            ? 'opacity-100' 
            : 'opacity-0 group-hover:opacity-70'
        } ${
          currentSort === field && direction === 'desc' ? 'transform rotate-180' : ''
        }`}
      />
    </div>
  );
};

export default ProductManagement;
