
import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockOrders } from "@/lib/mockOrders";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DownloadIcon, Search, Filter, Printer, ExternalLink, FileText, PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedSection from "@/components/ui/AnimatedSection";

const OrderManagement = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [exportOpen, setExportOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState<"all" | "today" | "week" | "month" | "custom">("all");
  const [activeTab, setActiveTab] = useState("all");

  // Filter orders
  const filteredOrders = orders.filter(order => {
    // Status filter
    if (statusFilter !== "all" && order.fulfillmentStatus !== statusFilter) {
      return false;
    }
    
    // Search filter (search by order number or customer name)
    if (searchQuery !== "") {
      const query = searchQuery.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(query) ||
        order.customer.name.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "unfulfilled":
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
      case "delivered":
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
      case "returned":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string): string => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
      case "refunded":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <AdminSidebar activePage="orders" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border flex items-center px-6">
          <h1 className="text-xl font-semibold">Order Management</h1>
          <div className="ml-auto flex items-center space-x-4">
            <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
              <Button variant="outline" onClick={() => setFilterOpen(true)}>
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Filter Orders</DialogTitle>
                  <DialogDescription>
                    Narrow down the order list using these filters.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Order Status</Label>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="unfulfilled">Unfulfilled</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <Select
                      value={dateRange}
                      onValueChange={(value: any) => setDateRange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setStatusFilter("all");
                    setDateRange("all");
                  }}>Reset</Button>
                  <Button onClick={() => setFilterOpen(false)}>Apply Filters</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={exportOpen} onOpenChange={setExportOpen}>
              <Button variant="outline" onClick={() => setExportOpen(true)}>
                <DownloadIcon className="h-4 w-4 mr-2" />
                Export
              </Button>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Export Orders</DialogTitle>
                  <DialogDescription>
                    Choose a format to export your order data.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Export Format</Label>
                    <Select defaultValue="csv">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Which Orders</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Orders" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Orders</SelectItem>
                        <SelectItem value="filtered">Current Filtered View</SelectItem>
                        <SelectItem value="selected">Selected Orders</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setExportOpen(false)}>Cancel</Button>
                  <Button onClick={() => setExportOpen(false)}>Export</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Order
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatedSection animation="fade-up">
            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Search orders by number or customer name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full"
                  />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="unfulfilled">Unfulfilled</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={100}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="unfulfilled">Unfulfilled</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="shipped">Shipped</TabsTrigger>
              </TabsList>
            </Tabs>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={150}>
            <div className="grid grid-cols-1 gap-4">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No orders found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter settings.
                  </p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="grid md:grid-cols-5 border-b">
                        <div className="p-4 md:border-r">
                          <div className="text-sm text-muted-foreground mb-1">Order Number</div>
                          <div className="font-medium">{order.orderNumber}</div>
                        </div>
                        <div className="p-4 md:border-r">
                          <div className="text-sm text-muted-foreground mb-1">Customer</div>
                          <div className="font-medium">{order.customer.name}</div>
                        </div>
                        <div className="p-4 md:border-r">
                          <div className="text-sm text-muted-foreground mb-1">Date</div>
                          <div className="font-medium">{formatDate(order.createdAt)}</div>
                        </div>
                        <div className="p-4 md:border-r">
                          <div className="text-sm text-muted-foreground mb-1">Total</div>
                          <div className="font-medium">${order.total.toFixed(2)}</div>
                        </div>
                        <div className="p-4">
                          <div className="text-sm text-muted-foreground mb-1">Status</div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className={`${getStatusColor(order.fulfillmentStatus)}`}>
                              {order.fulfillmentStatus.charAt(0).toUpperCase() + order.fulfillmentStatus.slice(1)}
                            </Badge>
                            <Badge variant="outline" className={`${getPaymentStatusColor(order.paymentStatus)}`}>
                              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Printer className="h-4 w-4 mr-1" />
                            Print
                          </Button>
                          <div className="ml-auto text-sm text-muted-foreground">
                            {order.products.length} {order.products.length === 1 ? 'item' : 'items'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </AnimatedSection>
        </main>
      </div>
    </div>
  );
};

export default OrderManagement;
