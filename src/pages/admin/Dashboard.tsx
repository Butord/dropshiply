
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
import AdminSidebar from '@/components/admin/AdminSidebar';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const totalProducts = mockProducts.length;
  const lowStockProducts = mockProducts.filter(p => p.stock < 10).length;
  const totalSources = mockXMLSources.length;

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      <AdminSidebar activePage="dashboard" />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border flex items-center px-6">
          <h1 className="text-xl font-semibold">Головна панель</h1>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Налаштування
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Огляд</TabsTrigger>
              <TabsTrigger value="analytics">Аналітика</TabsTrigger>
              <TabsTrigger value="reports">Звіти</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <AnimatedSection animation="fade-up">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <DashboardCard
                    title="Всього товарів"
                    value={totalProducts}
                    icon={<Box className="h-5 w-5" />}
                    trend="+5%"
                    trendUp={true}
                  />
                  <DashboardCard
                    title="Товари на межі"
                    value={lowStockProducts}
                    icon={<AlertTriangle className="h-5 w-5" />}
                    trend="+2"
                    trendUp={false}
                    attention={lowStockProducts > 0}
                  />
                  <DashboardCard
                    title="XML Фіди"
                    value={totalSources}
                    icon={<FileText className="h-5 w-5" />}
                    trend="0"
                    trendUp={true}
                  />
                  <DashboardCard
                    title="Наступне оновлення"
                    value="2г 15хв"
                    icon={<Clock className="h-5 w-5" />}
                    subtitle="Сьогодні, 15:30"
                  />
                </div>
              </AnimatedSection>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <AnimatedSection className="lg:col-span-2" animation="fade-up" delay={100}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-base font-medium">Активність імпорту</CardTitle>
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        Переглянути все
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <div className="bg-muted/50 px-4 py-2.5 text-xs font-medium">
                          <div className="grid grid-cols-5">
                            <div className="col-span-2">Джерело</div>
                            <div>Товари</div>
                            <div>Останній імпорт</div>
                            <div>Статус</div>
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
                                    Успішно
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
                      <CardTitle className="text-base font-medium">Поточні завдання</CardTitle>
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        Переглянути все
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-muted/30 p-3 rounded-lg flex items-start">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">Оновити інвентар товарів</div>
                            <div className="text-xs text-muted-foreground mt-0.5">Заплановано на сьогодні, 15:00</div>
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
                            <div className="font-medium text-sm">Перевірити товари на межі</div>
                            <div className="text-xs text-muted-foreground mt-0.5">5 товарів потребують уваги</div>
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
                            <div className="font-medium text-sm">Налаштувати розклад оновлень</div>
                            <div className="text-xs text-muted-foreground mt-0.5">2 джерела потребують налаштування</div>
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
                    <CardTitle>Панель аналітики</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[400px] flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                      <h3 className="font-medium text-lg mb-2">Аналітика скоро буде доступна</h3>
                      <p className="text-muted-foreground max-w-md">
                        Статистика імпорту та продажів товарів буде доступна у наступному оновленні.
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
                    <CardTitle>Звіти</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[400px] flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                      <h3 className="font-medium text-lg mb-2">Звіти скоро будуть доступні</h3>
                      <p className="text-muted-foreground max-w-md">
                        Детальні звіти про ефективність товарів та активність імпорту будуть доступні незабаром.
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
            <span className="text-muted-foreground ml-1">у порівнянні з минулим періодом</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Dashboard;
