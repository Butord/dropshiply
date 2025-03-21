
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  BarChart3, 
  Box, 
  Clock, 
  FileText, 
  LineChart, 
  Package, 
  Settings, 
  ShoppingCart, 
  Users, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { mockProducts, mockXMLSources } from '@/lib/mockData';
import AnimatedSection from '@/components/ui/AnimatedSection';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const totalProducts = mockProducts.length;
  const lowStockProducts = mockProducts.filter(p => p.stock < 10).length;
  const totalSources = mockXMLSources.length;

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
          <NavItem href="/admin" icon={<LineChart className="h-4 w-4" />} label="Dashboard" active />
          <NavItem href="/admin/products" icon={<Package className="h-4 w-4" />} label="Products" />
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
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <AnimatedSection animation="fade-up">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <DashboardCard
                    title="Total Products"
                    value={totalProducts}
                    icon={<Box className="h-5 w-5" />}
                    trend="+5%"
                    trendUp={true}
                  />
                  <DashboardCard
                    title="Low Stock Items"
                    value={lowStockProducts}
                    icon={<AlertTriangle className="h-5 w-5" />}
                    trend="+2"
                    trendUp={false}
                    attention={lowStockProducts > 0}
                  />
                  <DashboardCard
                    title="XML Feeds"
                    value={totalSources}
                    icon={<FileText className="h-5 w-5" />}
                    trend="0"
                    trendUp={true}
                  />
                  <DashboardCard
                    title="Next Update"
                    value="2h 15m"
                    icon={<Clock className="h-5 w-5" />}
                    subtitle="Today, 15:30"
                  />
                </div>
              </AnimatedSection>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <AnimatedSection className="lg:col-span-2" animation="fade-up" delay={100}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-base font-medium">Import Activity</CardTitle>
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        View All
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <div className="bg-muted/50 px-4 py-2.5 text-xs font-medium">
                          <div className="grid grid-cols-5">
                            <div className="col-span-2">Source</div>
                            <div>Products</div>
                            <div>Last Import</div>
                            <div>Status</div>
                          </div>
                        </div>
                        <div className="divide-y">
                          {mockXMLSources.map((source) => (
                            <div key={source.id} className="px-4 py-3 text-sm">
                              <div className="grid grid-cols-5 items-center">
                                <div className="col-span-2 font-medium">{source.name}</div>
                                <div>124</div>
                                <div className="text-muted-foreground">
                                  {new Date(source.lastImport || '').toLocaleDateString()}
                                </div>
                                <div>
                                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
                                    Success
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
                
                <AnimatedSection animation="fade-up" delay={200}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-base font-medium">Recent Tasks</CardTitle>
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        View All
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-muted/30 p-3 rounded-lg flex items-start">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">Update product inventory</div>
                            <div className="text-xs text-muted-foreground mt-0.5">Scheduled for today, 15:00</div>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="bg-muted/30 p-3 rounded-lg flex items-start">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <Package className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">Review low stock items</div>
                            <div className="text-xs text-muted-foreground mt-0.5">5 items need attention</div>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="bg-muted/30 p-3 rounded-lg flex items-start">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <Settings className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">Configure update schedules</div>
                            <div className="text-xs text-muted-foreground mt-0.5">2 sources need configuration</div>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <AnimatedSection animation="fade-up">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics Dashboard</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[400px] flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                      <h3 className="font-medium text-lg mb-2">Analytics Coming Soon</h3>
                      <p className="text-muted-foreground max-w-md">
                        Product import and sales analytics will be available in the next update.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </TabsContent>
            
            <TabsContent value="reports">
              <AnimatedSection animation="fade-up">
                <Card>
                  <CardHeader>
                    <CardTitle>Reports</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[400px] flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                      <h3 className="font-medium text-lg mb-2">Reports Coming Soon</h3>
                      <p className="text-muted-foreground max-w-md">
                        Detailed reports on product performance and import activity will be available soon.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </TabsContent>
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

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  subtitle?: string;
  attention?: boolean;
}

const DashboardCard = ({
  title,
  value,
  icon,
  trend,
  trendUp,
  subtitle,
  attention = false,
}: DashboardCardProps) => {
  return (
    <Card className={attention ? 'border-amber-300 dark:border-amber-600' : undefined}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
            attention 
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              : 'bg-primary/10 text-primary'
          }`}>
            {icon}
          </div>
        </div>
        
        {trend && (
          <div className="mt-4 flex items-center text-xs">
            <span className={trendUp ? 'text-green-600' : 'text-red-600'}>
              {trend}
            </span>
            <span className="text-muted-foreground ml-1">vs. last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Dashboard;
