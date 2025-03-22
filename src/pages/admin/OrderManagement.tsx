
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Filter, 
  Package, 
  FileText, 
  Truck, 
  ShoppingCart,
  Clock, 
  Check, 
  X, 
  Eye, 
  Edit, 
  RefreshCw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Order } from '@/lib/types';
import { mockOrders } from '@/lib/mockOrders';

const OrderManagement = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditStatusDialogOpen, setIsEditStatusDialogOpen] = useState(false);
  
  const ordersPerPage = 5;
  
  // Calculate pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  
  // Filter functions
  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    
    if (value === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.fulfillmentStatus === value));
    }
    setCurrentPage(1);
  };
  
  // Search function
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    
    const results = orders.filter(order => 
      order.orderNumber.toLowerCase().includes(value) ||
      order.customer.name.toLowerCase().includes(value) ||
      order.customer.email.toLowerCase().includes(value)
    );
    
    setFilteredOrders(statusFilter === "all" ? results : results.filter(order => order.fulfillmentStatus === statusFilter));
    setCurrentPage(1);
  };
  
  // View order details
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };
  
  // Handle order status update
  const handleStatusUpdate = (order: Order) => {
    setSelectedOrder(order);
    setIsEditStatusDialogOpen(true);
  };
  
  const updateOrderStatus = (paymentStatus: Order['paymentStatus'], fulfillmentStatus: Order['fulfillmentStatus']) => {
    if (!selectedOrder) return;
    
    const updatedOrders = orders.map(order => {
      if (order.id === selectedOrder.id) {
        return {
          ...order,
          paymentStatus,
          fulfillmentStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    if (statusFilter === "all" || statusFilter === fulfillmentStatus) {
      setFilteredOrders(
        updatedOrders.filter(order => 
          statusFilter === "all" || order.fulfillmentStatus === statusFilter
        )
      );
    } else {
      setFilteredOrders(
        updatedOrders.filter(order => order.fulfillmentStatus === statusFilter)
      );
    }
    
    setIsEditStatusDialogOpen(false);
    toast({
      title: "Status Updated",
      description: `Order ${selectedOrder.orderNumber} status has been updated.`,
    });
  };
  
  // Render payment status badge
  const renderPaymentStatusBadge = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>;
      case 'refunded':
        return <Badge className="bg-blue-500">Refunded</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Render fulfillment status badge
  const renderFulfillmentStatusBadge = (status: Order['fulfillmentStatus']) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-green-500">Delivered</Badge>;
      case 'shipped':
        return <Badge className="bg-blue-500">Shipped</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-500">Processing</Badge>;
      case 'unfulfilled':
        return <Badge className="bg-gray-500">Unfulfilled</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case 'returned':
        return <Badge className="bg-purple-500">Returned</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
          <p className="text-muted-foreground">
            View and manage all customer orders
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button size="sm" variant="outline" className="gap-1">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" variant="outline" className="gap-1">
            <FileText className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(Math.random() * 10) + 1} from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.fulfillmentStatus === 'unfulfilled' || o.fulfillmentStatus === 'processing').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Require fulfillment
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Shipped Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.fulfillmentStatus === 'shipped').length}
            </div>
            <p className="text-xs text-muted-foreground">
              In transit to customers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Delivered Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.fulfillmentStatus === 'delivered').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-1/2 lg:w-2/3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search order #, customer name or email..."
              className="pl-9"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3 flex gap-2">
          <Select value={statusFilter} onValueChange={handleFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Order Status</SelectLabel>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="unfulfilled">Unfulfilled</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardHeader className="py-4">
          <CardTitle>Orders</CardTitle>
          <CardDescription>
            {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div>{order.customer.name}</div>
                      <div className="text-xs text-muted-foreground">{order.customer.email}</div>
                    </TableCell>
                    <TableCell>{order.products.length}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>{renderPaymentStatusBadge(order.paymentStatus)}</TableCell>
                    <TableCell>{renderFulfillmentStatusBadge(order.fulfillmentStatus)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => handleViewOrder(order)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleStatusUpdate(order)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          {filteredOrders.length > 0 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center">
                  <span>Order #{selectedOrder.orderNumber}</span>
                  <div className="flex items-center gap-2">
                    {renderPaymentStatusBadge(selectedOrder.paymentStatus)}
                    {renderFulfillmentStatusBadge(selectedOrder.fulfillmentStatus)}
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Order Details</TabsTrigger>
                  <TabsTrigger value="customer">Customer</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <Package className="mr-2 h-5 w-5" /> Products
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.products.map((product, index) => (
                          <TableRow key={index}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell className="text-right">{product.quantity}</TableCell>
                            <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">${product.total.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <Truck className="mr-2 h-5 w-5" /> Shipping Details
                      </h3>
                      <Card>
                        <CardContent className="pt-4">
                          <div className="space-y-2">
                            <div>
                              <span className="font-medium">Address:</span>
                              <p>{selectedOrder.shippingAddress.street}</p>
                              <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}</p>
                              <p>{selectedOrder.shippingAddress.country}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <FileText className="mr-2 h-5 w-5" /> Order Summary
                      </h3>
                      <Card>
                        <CardContent className="pt-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Subtotal:</span>
                              <span>${selectedOrder.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Tax:</span>
                              <span>${selectedOrder.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Shipping:</span>
                              <span>${selectedOrder.shipping.toFixed(2)}</span>
                            </div>
                            {selectedOrder.discount > 0 && (
                              <div className="flex justify-between">
                                <span>Discount:</span>
                                <span>-${selectedOrder.discount.toFixed(2)}</span>
                              </div>
                            )}
                            <Separator />
                            <div className="flex justify-between font-bold">
                              <span>Total:</span>
                              <span>${selectedOrder.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  {selectedOrder.notes && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Order Notes</h3>
                      <Card>
                        <CardContent className="pt-4">
                          <p>{selectedOrder.notes}</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="customer">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                      <Card>
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            <div>
                              <span className="font-medium">Name:</span>
                              <p>{selectedOrder.customer.name}</p>
                            </div>
                            <div>
                              <span className="font-medium">Email:</span>
                              <p>{selectedOrder.customer.email}</p>
                            </div>
                            {selectedOrder.customer.phone && (
                              <div>
                                <span className="font-medium">Phone:</span>
                                <p>{selectedOrder.customer.phone}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
                        <Card>
                          <CardContent className="pt-4">
                            <div className="space-y-1">
                              <p>{selectedOrder.shippingAddress.street}</p>
                              <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}</p>
                              <p>{selectedOrder.shippingAddress.country}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      {selectedOrder.billingAddress && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Billing Address</h3>
                          <Card>
                            <CardContent className="pt-4">
                              <div className="space-y-1">
                                <p>{selectedOrder.billingAddress.street}</p>
                                <p>{selectedOrder.billingAddress.city}, {selectedOrder.billingAddress.state} {selectedOrder.billingAddress.postalCode}</p>
                                <p>{selectedOrder.billingAddress.country}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setIsViewDialogOpen(false);
                  handleStatusUpdate(selectedOrder);
                }}>
                  Update Status
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Edit Status Dialog */}
      <Dialog open={isEditStatusDialogOpen} onOpenChange={setIsEditStatusDialogOpen}>
        <DialogContent>
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Update Order Status</DialogTitle>
                <DialogDescription>
                  Update status for order #{selectedOrder.orderNumber}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="payment-status" className="text-right">
                    Payment Status
                  </Label>
                  <Select 
                    defaultValue={selectedOrder.paymentStatus}
                    onValueChange={(value) => {
                      setSelectedOrder({
                        ...selectedOrder,
                        paymentStatus: value as Order['paymentStatus']
                      });
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fulfillment-status" className="text-right">
                    Fulfillment Status
                  </Label>
                  <Select 
                    defaultValue={selectedOrder.fulfillmentStatus}
                    onValueChange={(value) => {
                      setSelectedOrder({
                        ...selectedOrder,
                        fulfillmentStatus: value as Order['fulfillmentStatus']
                      });
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select fulfillment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unfulfilled">Unfulfilled</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="returned">Returned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditStatusDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => updateOrderStatus(
                  selectedOrder.paymentStatus, 
                  selectedOrder.fulfillmentStatus
                )}>
                  Save Changes
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagement;
