
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  Eye, 
  Mail, 
  Phone, 
  UserCheck,
  UserX,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose 
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { mockCustomers } from '@/lib/mockCustomers';
import { Customer } from '@/lib/types';

const CustomerManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const itemsPerPage = 5;

  // Filter customers based on search term and status filter
  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Customer metrics
  const totalCustomers = mockCustomers.length;
  const activeCustomers = mockCustomers.filter(c => c.status === 'active').length;
  const inactiveCustomers = mockCustomers.filter(c => c.status === 'inactive').length;
  
  // Total revenue from all customers
  const totalRevenue = mockCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0);

  const handleUpdateStatus = (customerId: string, newStatus: 'active' | 'inactive') => {
    // This would update the customer status in a real application
    toast({
      title: "Status Updated",
      description: `Customer status has been set to ${newStatus}.`,
    });
  };

  const handleExportCustomers = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredCustomers));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "customers.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast({
      title: "Export Successful",
      description: "Customers data has been exported.",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar - We would use a common sidebar component here */}
      <div className="w-64 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <Link to="/" className="text-xl font-semibold tracking-tight">
            dropshiply
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavItem href="/admin" icon={<Users className="h-4 w-4" />} label="Dashboard" />
          <NavItem href="/admin/products" icon={<Users className="h-4 w-4" />} label="Products" />
          <NavItem href="/admin/xml-import" icon={<Users className="h-4 w-4" />} label="XML Import" />
          <NavItem href="/admin/orders" icon={<Users className="h-4 w-4" />} label="Orders" />
          <NavItem href="/admin/customers" icon={<Users className="h-4 w-4" />} label="Customers" active />
          <NavItem href="/admin/settings" icon={<Users className="h-4 w-4" />} label="Settings" />
        </nav>
        
        <div className="p-4 border-t border-border">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
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
          <h1 className="text-xl font-semibold">Customer Management</h1>
          <div className="ml-auto flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleExportCustomers}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Customer</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="name" className="text-right">Name</label>
                    <Input id="name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="email" className="text-right">Email</label>
                    <Input id="email" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="phone" className="text-right">Phone</label>
                    <Input id="phone" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={() => toast({
                      title: "Customer Added",
                      description: "New customer has been added to the system."
                    })}>
                      Add Customer
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="all">
            <div className="flex flex-col space-y-6">
              <AnimatedSection animation="fade-up">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Total Customers</p>
                          <h3 className="text-2xl font-bold">{totalCustomers}</h3>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          <Users className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Active Customers</p>
                          <h3 className="text-2xl font-bold">{activeCustomers}</h3>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center">
                          <UserCheck className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Inactive Customers</p>
                          <h3 className="text-2xl font-bold">{inactiveCustomers}</h3>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 flex items-center justify-center">
                          <UserX className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Total Revenue</p>
                          <h3 className="text-2xl font-bold">${totalRevenue.toFixed(2)}</h3>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          <Users className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </AnimatedSection>
              
              <AnimatedSection animation="fade-up" delay={100}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Customer Database</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center w-full max-w-sm">
                        <div className="relative w-full">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search" 
                            placeholder="Search customers..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => {
                              setSearchTerm(e.target.value);
                              setCurrentPage(1); // Reset to first page on search
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Select value={statusFilter} onValueChange={(value) => {
                          setStatusFilter(value);
                          setCurrentPage(1); // Reset to first page on filter change
                        }}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="rounded-md border">
                      <div className="bg-muted/50 px-4 py-2.5 text-xs font-medium">
                        <div className="grid grid-cols-12">
                          <div className="col-span-4">Customer</div>
                          <div className="col-span-2">Orders</div>
                          <div className="col-span-2">Total Spent</div>
                          <div className="col-span-2">Status</div>
                          <div className="col-span-2 text-right">Actions</div>
                        </div>
                      </div>
                      
                      <div className="divide-y">
                        {paginatedCustomers.length > 0 ? (
                          paginatedCustomers.map((customer) => (
                            <div key={customer.id} className="px-4 py-3 text-sm">
                              <div className="grid grid-cols-12 items-center">
                                <div className="col-span-4 flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{customer.name}</div>
                                    <div className="text-xs text-muted-foreground">{customer.email}</div>
                                  </div>
                                </div>
                                <div className="col-span-2 font-medium">{customer.orders}</div>
                                <div className="col-span-2 font-medium">${customer.totalSpent.toFixed(2)}</div>
                                <div className="col-span-2">
                                  <Badge variant={customer.status === 'active' ? 'outline' : 'secondary'}>
                                    {customer.status === 'active' ? 'Active' : 'Inactive'}
                                  </Badge>
                                </div>
                                <div className="col-span-2 text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <Filter className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <DropdownMenuItem onSelect={(e) => {
                                            e.preventDefault();
                                            setSelectedCustomer(customer);
                                          }}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            View Details
                                          </DropdownMenuItem>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[625px]">
                                          <DialogHeader>
                                            <DialogTitle>Customer Details</DialogTitle>
                                          </DialogHeader>
                                          {selectedCustomer && (
                                            <div className="grid gap-4 py-4">
                                              <div className="flex items-center gap-4">
                                                <Avatar className="h-16 w-16">
                                                  <AvatarFallback className="text-lg">{getInitials(selectedCustomer.name)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                  <h3 className="text-lg font-semibold">{selectedCustomer.name}</h3>
                                                  <div className="flex items-center text-sm text-muted-foreground">
                                                    <Mail className="mr-1 h-4 w-4" />
                                                    {selectedCustomer.email}
                                                  </div>
                                                  {selectedCustomer.phone && (
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                      <Phone className="mr-1 h-4 w-4" />
                                                      {selectedCustomer.phone}
                                                    </div>
                                                  )}
                                                </div>
                                              </div>

                                              <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-muted/50 p-3 rounded-lg">
                                                  <div className="text-sm font-medium">Customer Since</div>
                                                  <div>{new Date(selectedCustomer.createdAt).toLocaleDateString()}</div>
                                                </div>
                                                <div className="bg-muted/50 p-3 rounded-lg">
                                                  <div className="text-sm font-medium">Status</div>
                                                  <Badge variant={selectedCustomer.status === 'active' ? 'outline' : 'secondary'}>
                                                    {selectedCustomer.status === 'active' ? 'Active' : 'Inactive'}
                                                  </Badge>
                                                </div>
                                                <div className="bg-muted/50 p-3 rounded-lg">
                                                  <div className="text-sm font-medium">Total Orders</div>
                                                  <div>{selectedCustomer.orders}</div>
                                                </div>
                                                <div className="bg-muted/50 p-3 rounded-lg">
                                                  <div className="text-sm font-medium">Total Spent</div>
                                                  <div>${selectedCustomer.totalSpent.toFixed(2)}</div>
                                                </div>
                                              </div>

                                              {selectedCustomer.address && (
                                                <div>
                                                  <h4 className="text-sm font-medium mb-2">Address</h4>
                                                  <div className="bg-muted/50 p-3 rounded-lg">
                                                    <div>{selectedCustomer.address.street}</div>
                                                    <div>{selectedCustomer.address.city}, {selectedCustomer.address.state} {selectedCustomer.address.postalCode}</div>
                                                    <div>{selectedCustomer.address.country}</div>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          )}
                                          <DialogFooter>
                                            <DialogClose asChild>
                                              <Button variant="outline">Close</Button>
                                            </DialogClose>
                                          </DialogFooter>
                                        </DialogContent>
                                      </Dialog>
                                      
                                      <DropdownMenuItem
                                        onClick={() => handleUpdateStatus(
                                          customer.id, 
                                          customer.status === 'active' ? 'inactive' : 'active'
                                        )}
                                      >
                                        {customer.status === 'active' ? (
                                          <>
                                            <UserX className="mr-2 h-4 w-4" />
                                            Mark as Inactive
                                          </>
                                        ) : (
                                          <>
                                            <UserCheck className="mr-2 h-4 w-4" />
                                            Mark as Active
                                          </>
                                        )}
                                      </DropdownMenuItem>
                                      
                                      <DropdownMenuSeparator />
                                      
                                      <DropdownMenuItem 
                                        onClick={() => toast({
                                          title: "Email Sent",
                                          description: `Email has been sent to ${customer.email}.`
                                        })}
                                      >
                                        <Mail className="mr-2 h-4 w-4" />
                                        Email Customer
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-6 text-center text-muted-foreground">
                            No customers found matching the search criteria.
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {totalPages > 1 && (
                      <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        <div className="text-sm">
                          Page {currentPage} of {totalPages}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
          </Tabs>
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

export default CustomerManagement;
