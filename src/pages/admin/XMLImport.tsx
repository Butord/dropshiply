import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  AlertCircle, 
  ArrowRight, 
  Calendar, 
  Check, 
  Clock, 
  Cog, 
  FileText, 
  LineChart, 
  Loader2, 
  Package, 
  Plus, 
  Repeat, 
  Settings, 
  ShoppingCart, 
  Trash2, 
  Upload, 
  Users 
} from 'lucide-react';
import { mockXMLSources } from '@/lib/mockData';
import XMLMappingForm from '@/components/admin/XMLMappingForm';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { toast } from '@/components/ui/use-toast';
import { XMLSourceModel } from '@/lib/db/models/xmlSourceModel';
import { XMLSource } from '@/lib/types';

const XMLImport = () => {
  const [sources, setSources] = useState<XMLSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('sources');
  const [addSourceOpen, setAddSourceOpen] = useState(false);
  const [mappingDialogOpen, setMappingDialogOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [importLoading, setImportLoading] = useState<string | null>(null);
  
  // Завантаження джерел при відкритті сторінки
  useEffect(() => {
    const loadSources = async () => {
      try {
        setIsLoading(true);
        // В браузері використовуємо мок-дані
        if (typeof window !== 'undefined') {
          setSources(mockXMLSources);
        } else {
          const sourcesData = await XMLSourceModel.getAll();
          setSources(sourcesData);
        }
      } catch (error) {
        console.error('Помилка завантаження джерел XML:', error);
        toast({
          title: "Помилка",
          description: "Не вдалося завантажити джерела XML",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSources();
  }, []);
  
  const handleCreateSource = async () => {
    if (!newSourceName || !newSourceUrl) {
      toast({
        title: "Помилка валідації",
        description: "Будь ласка, вкажіть назву та URL для джерела XML",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const newSource = {
        name: newSourceName,
        url: newSourceUrl,
        mappingSchema: {
          rootElement: 'yml_catalog',
          productElement: 'offer',
          fieldMappings: {
            name: 'name',
            price: 'price',
            description: 'description',
            images: 'picture',
            categoryIdToName: 'categoryId',
            sku: 'vendorCode',
          },
        },
      };
      
      // В браузері імітуємо створення
      let createdSource;
      if (typeof window !== 'undefined') {
        createdSource = {
          id: Date.now().toString(),
          ...newSource,
        };
        setSources([...sources, createdSource]);
      } else {
        createdSource = await XMLSourceModel.create(newSource);
        setSources([...sources, createdSource]);
      }
      
      setSelectedSource(createdSource.id);
      setAddSourceOpen(false);
      setMappingDialogOpen(true);
      setNewSourceName('');
      setNewSourceUrl('');
      
      toast({
        title: "Джерело створено",
        description: "XML джерело було успішно додано. Налаштуйте схему мапінгу.",
      });
    } catch (error) {
      console.error('Помилка створення джерела XML:', error);
      toast({
        title: "Помилка",
        description: "Не вдалося створити джерело XML",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemoveSource = async (id: string) => {
    try {
      // В браузері просто фільтруємо список
      if (typeof window !== 'undefined') {
        setSources(sources.filter(source => source.id !== id));
      } else {
        const success = await XMLSourceModel.delete(id);
        if (success) {
          setSources(sources.filter(source => source.id !== id));
        } else {
          throw new Error("Не вдалося видалити джерело");
        }
      }
      
      toast({
        title: "Джерело видалено",
        description: "XML джерело було успішно видалено.",
      });
    } catch (error) {
      console.error('Помилка видалення джерела XML:', error);
      toast({
        title: "Помилка",
        description: "Не вдалося видалити джерело XML",
        variant: "destructive",
      });
    }
  };
  
  const handleImportNow = async (id: string) => {
    const source = sources.find(s => s.id === id);
    
    if (!source) return;
    
    setImportLoading(id);
    
    toast({
      title: "Імпорт розпочато",
      description: `Починаємо імпорт з ${source.name}...`,
    });
    
    try {
      // В браузері імітуємо імпорт з затримкою
      if (typeof window !== 'undefined') {
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        toast({
          title: "Імпорт завершено",
          description: `Успішно імпортовано товари з ${source.name}.`,
        });
        
        // Оновлюємо дату останнього імпорту
        const updatedSources = sources.map(s => 
          s.id === id 
            ? { ...s, lastImport: new Date().toISOString() }
            : s
        );
        setSources(updatedSources);
      } else {
        // Реальний імпорт через модель
        const result = await XMLSourceModel.importProductsFromXml(id);
        
        if (result.success) {
          toast({
            title: "Імпорт завершено",
            description: `Успішно імпортовано ${result.importedCount} товарів з ${source.name}.`,
          });
          
          // Оновлюємо список джерел, щоб відобразити нову дату імпорту
          const updatedSources = await XMLSourceModel.getAll();
          setSources(updatedSources);
        } else {
          throw new Error(result.errorMessage || "Помилка під час імпорту");
        }
      }
    } catch (error) {
      console.error('Помилка імпорту товарів:', error);
      toast({
        title: "Помилка імпорту",
        description: error instanceof Error ? error.message : "Не вдалося імпортувати товари",
        variant: "destructive",
      });
    } finally {
      setImportLoading(null);
    }
  };
  
  const handleSaveMapping = async (mapping: any) => {
    if (!selectedSource) return;
    
    try {
      // В браузері просто оновлюємо стан
      if (typeof window !== 'undefined') {
        setSources(
          sources.map(source => 
            source.id === selectedSource 
              ? { ...source, mappingSchema: mapping }
              : source
          )
        );
      } else {
        // Реальне оновлення через модель
        const success = await XMLSourceModel.update(selectedSource, { mappingSchema: mapping });
        if (success) {
          // Оновлюємо список джерел
          const updatedSources = await XMLSourceModel.getAll();
          setSources(updatedSources);
        } else {
          throw new Error("Не вдалося оновити схему мапінгу");
        }
      }
      
      setMappingDialogOpen(false);
      toast({
        title: "Схему збережено",
        description: "Конфігурацію XML мапінгу було успішно збережено.",
      });
    } catch (error) {
      console.error('Помилка збереження схеми мапінгу:', error);
      toast({
        title: "Помилка",
        description: "Не вдалося зберегти схему мапінгу",
        variant: "destructive",
      });
    }
  };
  
  const handleEditMapping = (id: string) => {
    setSelectedSource(id);
    setMappingDialogOpen(true);
  };
  
  const selectedMapping = selectedSource 
    ? sources.find(s => s.id === selectedSource)?.mappingSchema 
    : undefined;

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
          <NavItem href="/admin/products" icon={<Package className="h-4 w-4" />} label="Products" />
          <NavItem href="/admin/xml-import" icon={<FileText className="h-4 w-4" />} label="XML Import" active />
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
          <h1 className="text-xl font-semibold">XML Import Management</h1>
          <div className="ml-auto flex items-center space-x-4">
            <Dialog open={addSourceOpen} onOpenChange={setAddSourceOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add XML Source
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add XML Source</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="source-name">Source Name</Label>
                    <Input
                      id="source-name"
                      placeholder="e.g. Supplier Feed"
                      value={newSourceName}
                      onChange={(e) => setNewSourceName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="source-url">XML URL</Label>
                    <Input
                      id="source-url"
                      placeholder="https://example.com/feed.xml"
                      value={newSourceUrl}
                      onChange={(e) => setNewSourceUrl(e.target.value)}
                    />
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button onClick={handleCreateSource} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Source
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="sources">XML Sources</TabsTrigger>
              <TabsTrigger value="schedules">Update Schedules</TabsTrigger>
              <TabsTrigger value="logs">Import Logs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sources" className="space-y-6">
              <AnimatedSection animation="fade-up">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>XML Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative min-h-[200px]">
                      {sources.length === 0 ? (
                        <div className="text-center py-12">
                          <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                          <h3 className="font-medium text-lg mb-2">No XML Sources</h3>
                          <p className="text-muted-foreground mb-4">
                            Add your first XML source to start importing products
                          </p>
                          <Button onClick={() => setAddSourceOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add XML Source
                          </Button>
                        </div>
                      ) : (
                        <div className="rounded-md border">
                          <div className="bg-muted/50 px-4 py-2.5 text-xs font-medium">
                            <div className="grid grid-cols-12">
                              <div className="col-span-3">Name</div>
                              <div className="col-span-4">URL</div>
                              <div className="col-span-2">Last Import</div>
                              <div className="col-span-3">Actions</div>
                            </div>
                          </div>
                          <div className="divide-y">
                            {sources.map((source) => (
                              <div key={source.id} className="px-4 py-3 text-sm">
                                <div className="grid grid-cols-12 items-center">
                                  <div className="col-span-3 font-medium">{source.name}</div>
                                  <div className="col-span-4 truncate text-muted-foreground">
                                    {source.url}
                                  </div>
                                  <div className="col-span-2 text-muted-foreground">
                                    {source.lastImport 
                                      ? new Date(source.lastImport).toLocaleDateString() 
                                      : 'Never'}
                                  </div>
                                  <div className="col-span-3 flex space-x-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleImportNow(source.id)}
                                      disabled={importLoading === source.id}
                                    >
                                      {importLoading === source.id ? (
                                        <>
                                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                          Importing...
                                        </>
                                      ) : (
                                        <>
                                          <Upload className="h-4 w-4 mr-1" />
                                          Import
                                        </>
                                      )}
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleEditMapping(source.id)}
                                    >
                                      <Cog className="h-4 w-4 mr-1" />
                                      Map
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleRemoveSource(source.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
              
              <AnimatedSection animation="fade-up" delay={100}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Import Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">Next Scheduled Imports</h3>
                          <Button variant="outline" size="sm">
                            <Calendar className="h-4 w-4 mr-1" />
                            View Calendar
                          </Button>
                        </div>
                        <div className="space-y-3">
                          <div className="bg-background rounded-md p-3 border flex items-center justify-between">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                              <span>Electronics Supplier</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Today, 15:30
                            </div>
                          </div>
                          <div className="bg-background rounded-md p-3 border flex items-center justify-between">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                              <span>Fashion Products</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Tomorrow, 00:00
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">Recent Activity</h3>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            View Logs
                          </Button>
                        </div>
                        <div className="space-y-3">
                          <div className="bg-background rounded-md p-3 border flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="h-6 w-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center mr-2">
                                <Check className="h-3 w-3" />
                              </div>
                              <div>
                                <div className="font-medium">Electronics Supplier</div>
                                <div className="text-xs text-muted-foreground">124 products imported</div>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Today, 09:15
                            </div>
                          </div>
                          <div className="bg-background rounded-md p-3 border flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="h-6 w-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mr-2">
                                <AlertCircle className="h-3 w-3" />
                              </div>
                              <div>
                                <div className="font-medium">Fashion Products</div>
                                <div className="text-xs text-muted-foreground">Warning: 5 invalid products</div>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Yesterday, 14:22
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </TabsContent>
            
            <TabsContent value="schedules">
              <AnimatedSection animation="fade-up">
                <Card>
                  <CardHeader>
                    <CardTitle>Update Schedules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-muted/50 px-4 py-3 text-sm font-medium">
                          <div className="grid grid-cols-12">
                            <div className="col-span-3">Source</div>
                            <div className="col-span-3">Schedule</div>
                            <div className="col-span-3">Next Run</div>
                            <div className="col-span-3">Actions</div>
                          </div>
                        </div>
                        
                        <div className="divide-y">
                          {sources.map((source) => (
                            <div key={source.id} className="px-4 py-4 text-sm">
                              <div className="grid grid-cols-12 items-center">
                                <div className="col-span-3 font-medium">{source.name}</div>
                                <div className="col-span-3">
                                  {source.updateSchedule 
                                    ? formatCron(source.updateSchedule)
                                    : 'Not scheduled'}
                                </div>
                                <div className="col-span-3 text-muted-foreground">
                                  {source.updateSchedule
                                    ? getNextRunTime(source.updateSchedule)
                                    : '-'}
                                </div>
                                <div className="col-span-3">
                                  <Button variant="outline" size="sm">
                                    <Settings className="h-4 w-4 mr-1" />
                                    Configure
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 flex items-start text-sm">
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium mb-1">Schedule Configuration</p>
                          <p>
                            Scheduling options allow you to automate product imports at regular intervals.
                            Make sure your server has the necessary permissions to run scheduled tasks.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </TabsContent>
            
            <TabsContent value="logs">
              <AnimatedSection animation="fade-up">
                <Card>
                  <CardHeader>
                    <CardTitle>Import Logs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <h3 className="font-medium text-lg mb-2">Logs Coming Soon</h3>
                      <p className="text-muted-foreground mb-4">
                        Detailed import logs and error reporting will be available in the next update.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      {/* Mapping Dialog */}
      <Dialog open={mappingDialogOpen} onOpenChange={setMappingDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>XML Mapping Configuration</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <XMLMappingForm
              initialMapping={selectedMapping}
              onSave={handleSaveMapping}
              onCancel={() => setMappingDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
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

// Helper function to format cron expression into human-readable text
const formatCron = (cronExpression: string): string => {
  // Very basic cron formatting
  const parts = cronExpression.split(' ');
  if (parts.length !== 5) return cronExpression;
  
  if (parts[0] === '0' && parts[1] === '0' && parts[2] === '*') {
    return 'Daily at midnight';
  }
  
  if (parts[0] === '0' && parts[1] === '0' && parts[2] === '*/2') {
    return 'Every 2 days at midnight';
  }
  
  return cronExpression;
};

// Helper function to get next run time based on cron
const getNextRunTime = (cronExpression: string): string => {
  // This is just a placeholder - in a real app you'd calculate this based on the cron expression
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  return tomorrow.toLocaleString();
};

export default XMLImport;
