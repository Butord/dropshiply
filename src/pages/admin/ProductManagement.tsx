
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
  DialogTrigger,
  DialogFooter,
  DialogDescription,
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Create a schema for product validation
const productSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().positive({ message: "Price must be a positive number" }),
  compareAtPrice: z.coerce.number().nonnegative({ message: "Compare at price must be zero or positive" }).optional(),
  category: z.string().min(1, { message: "Category is required" }),
  stock: z.coerce.number().int().nonnegative({ message: "Stock must be a non-negative integer" }),
  sku: z.string().min(3, { message: "SKU must be at least 3 characters" }),
  imageUrl: z.string().url({ message: "A valid image URL is required" }),
});

type ProductFormValues = z.infer<typeof productSchema>;

const ProductManagement = () => {
  const [products, setProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStock, setSelectedStock] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  
  // Setup form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      compareAtPrice: undefined,
      category: mockCategories[0].name,
      stock: 0,
      sku: '',
      imageUrl: 'https://placehold.co/600x400',
    },
  });

  // Filter products based on search, category, stock status, and active tab
  const filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch = 
      searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = 
      selectedCategory === 'all' || 
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

  // Function to handle adding a new product
  const handleAddProduct = (data: ProductFormValues) => {
    // Generate a unique ID using a timestamp
    const newId = `prod_${Date.now()}`;
    
    // Create a new product object
    const newProduct: Product = {
      id: newId,
      name: data.name,
      description: data.description,
      price: data.price,
      compareAtPrice: data.compareAtPrice,
      images: [data.imageUrl],
      category: data.category,
      tags: [],
      sku: data.sku,
      stock: data.stock,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Add the new product to the products array
    setProducts([newProduct, ...products]);
    
    // Show a success toast
    toast({
      title: "Product Added",
      description: `${data.name} has been added successfully.`,
    });
    
    // Close the dialog
    setAddProductOpen(false);
    
    // Reset the form
    form.reset();
  };

  // Function to handle product import
  const handleImportProducts = () => {
    // Simulating import by adding a dummy product
    const dummyProduct: Product = {
      id: `imported_${Date.now()}`,
      name: "Imported Product",
      description: "This is an imported product",
      price: 99.99,
      images: ["https://placehold.co/600x400"],
      category: mockCategories[0].name,
      tags: ["imported"],
      sku: `SKU-${Date.now()}`,
      stock: 25,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setProducts([dummyProduct, ...products]);
    
    toast({
      title: "Import Successful",
      description: "1 product has been imported.",
    });
    
    setImportDialogOpen(false);
  };

  // Function to handle product export
  const handleExportProducts = () => {
    // In a real application, this would generate a CSV or JSON file for download
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "products_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast({
      title: "Export Successful",
      description: `${products.length} products have been exported.`,
    });
    
    setExportDialogOpen(false);
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
            <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Products</DialogTitle>
                  <DialogDescription>
                    Upload a CSV, Excel, or JSON file to import products in bulk.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="border-2 border-dashed rounded-md p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop your file here, or click to browse
                    </p>
                    <Button variant="outline" size="sm">Browse Files</Button>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setImportDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleImportProducts}>Import Products</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Export Products</DialogTitle>
                  <DialogDescription>
                    Choose a format to export your product data.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Export Format</Label>
                    <Select defaultValue="json">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setExportDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleExportProducts}>Export Products</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Fill out the form below to add a new product to your store.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddProduct)} className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Product name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="sku"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SKU</FormLabel>
                            <FormControl>
                              <Input placeholder="SKU-123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter product description" 
                              {...field} 
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="compareAtPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Compare at Price (Optional)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {mockCategories.map(category => (
                                  <SelectItem key={category.id} value={category.name}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stock Quantity</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button variant="outline" type="button" onClick={() => setAddProductOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Add Product</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
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
                    <SelectItem value="all">All Categories</SelectItem>
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
