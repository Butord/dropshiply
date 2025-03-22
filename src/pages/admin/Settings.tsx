
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings as SettingsIcon, 
  Globe, 
  CreditCard, 
  Bell, 
  Shield, 
  Save,
  FileText,
  Database,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import AnimatedSection from '@/components/ui/AnimatedSection';

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been successfully updated.",
    });
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
          <NavItem href="/admin" icon={<SettingsIcon className="h-4 w-4" />} label="Dashboard" />
          <NavItem href="/admin/products" icon={<SettingsIcon className="h-4 w-4" />} label="Products" />
          <NavItem href="/admin/xml-import" icon={<SettingsIcon className="h-4 w-4" />} label="XML Import" />
          <NavItem href="/admin/orders" icon={<SettingsIcon className="h-4 w-4" />} label="Orders" />
          <NavItem href="/admin/customers" icon={<SettingsIcon className="h-4 w-4" />} label="Customers" />
          <NavItem href="/admin/settings" icon={<SettingsIcon className="h-4 w-4" />} label="Settings" active />
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
          <h1 className="text-xl font-semibold">Settings</h1>
          <div className="ml-auto">
            <Button onClick={handleSaveSettings}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-6">
              <AnimatedSection animation="fade-up">
                <Card>
                  <CardHeader>
                    <CardTitle>Store Information</CardTitle>
                    <CardDescription>
                      Basic information about your store
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="store-name">Store Name</Label>
                        <Input id="store-name" defaultValue="Dropshiply Store" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="store-url">Store URL</Label>
                        <Input id="store-url" defaultValue="https://dropshiply.example.com" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="store-description">Store Description</Label>
                      <Textarea 
                        id="store-description" 
                        defaultValue="We sell high-quality products at affordable prices." 
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="support-email">Support Email</Label>
                        <Input id="support-email" defaultValue="support@dropshiply.example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="support-phone">Support Phone</Label>
                        <Input id="support-phone" defaultValue="+1 (555) 123-4567" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
              
              <AnimatedSection animation="fade-up" delay={100}>
                <Card>
                  <CardHeader>
                    <CardTitle>Regional Settings</CardTitle>
                    <CardDescription>
                      Configure regional settings for your store
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select defaultValue="utc-8">
                          <SelectTrigger id="timezone">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="utc-12">UTC-12:00</SelectItem>
                            <SelectItem value="utc-11">UTC-11:00</SelectItem>
                            <SelectItem value="utc-10">UTC-10:00</SelectItem>
                            <SelectItem value="utc-9">UTC-09:00</SelectItem>
                            <SelectItem value="utc-8">UTC-08:00 (PST)</SelectItem>
                            <SelectItem value="utc-7">UTC-07:00 (MST)</SelectItem>
                            <SelectItem value="utc-6">UTC-06:00 (CST)</SelectItem>
                            <SelectItem value="utc-5">UTC-05:00 (EST)</SelectItem>
                            <SelectItem value="utc-4">UTC-04:00</SelectItem>
                            <SelectItem value="utc-3">UTC-03:00</SelectItem>
                            <SelectItem value="utc-2">UTC-02:00</SelectItem>
                            <SelectItem value="utc-1">UTC-01:00</SelectItem>
                            <SelectItem value="utc-0">UTC±00:00</SelectItem>
                            <SelectItem value="utc+1">UTC+01:00</SelectItem>
                            <SelectItem value="utc+2">UTC+02:00</SelectItem>
                            <SelectItem value="utc+3">UTC+03:00</SelectItem>
                            <SelectItem value="utc+4">UTC+04:00</SelectItem>
                            <SelectItem value="utc+5">UTC+05:00</SelectItem>
                            <SelectItem value="utc+5:30">UTC+05:30</SelectItem>
                            <SelectItem value="utc+6">UTC+06:00</SelectItem>
                            <SelectItem value="utc+7">UTC+07:00</SelectItem>
                            <SelectItem value="utc+8">UTC+08:00</SelectItem>
                            <SelectItem value="utc+9">UTC+09:00</SelectItem>
                            <SelectItem value="utc+10">UTC+10:00</SelectItem>
                            <SelectItem value="utc+11">UTC+11:00</SelectItem>
                            <SelectItem value="utc+12">UTC+12:00</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select defaultValue="usd">
                          <SelectTrigger id="currency">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usd">USD ($)</SelectItem>
                            <SelectItem value="eur">EUR (€)</SelectItem>
                            <SelectItem value="gbp">GBP (£)</SelectItem>
                            <SelectItem value="jpy">JPY (¥)</SelectItem>
                            <SelectItem value="cad">CAD (C$)</SelectItem>
                            <SelectItem value="aud">AUD (A$)</SelectItem>
                            <SelectItem value="cny">CNY (¥)</SelectItem>
                            <SelectItem value="inr">INR (₹)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select defaultValue="en">
                          <SelectTrigger id="language">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="it">Italian</SelectItem>
                            <SelectItem value="pt">Portuguese</SelectItem>
                            <SelectItem value="ru">Russian</SelectItem>
                            <SelectItem value="zh">Chinese</SelectItem>
                            <SelectItem value="ja">Japanese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date-format">Date Format</Label>
                        <Select defaultValue="mm-dd-yyyy">
                          <SelectTrigger id="date-format">
                            <SelectValue placeholder="Select date format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                            <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                            <SelectItem value="yyyy-mm-dd">YYYY/MM/DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="weight-unit">Weight Unit</Label>
                        <Select defaultValue="lb">
                          <SelectTrigger id="weight-unit">
                            <SelectValue placeholder="Select weight unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lb">Pounds (lb)</SelectItem>
                            <SelectItem value="oz">Ounces (oz)</SelectItem>
                            <SelectItem value="kg">Kilograms (kg)</SelectItem>
                            <SelectItem value="g">Grams (g)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </TabsContent>
            
            <TabsContent value="payment" className="space-y-6">
              <AnimatedSection animation="fade-up">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>
                      Configure payment methods for your store
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Credit Card</p>
                          <p className="text-sm text-muted-foreground">Accept Visa, Mastercard, Amex</p>
                        </div>
                      </div>
                      <Switch defaultChecked id="credit-card" />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">PayPal</p>
                          <p className="text-sm text-muted-foreground">Accept payments via PayPal</p>
                        </div>
                      </div>
                      <Switch defaultChecked id="paypal" />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Apple Pay</p>
                          <p className="text-sm text-muted-foreground">Accept payments via Apple Pay</p>
                        </div>
                      </div>
                      <Switch id="apple-pay" />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Google Pay</p>
                          <p className="text-sm text-muted-foreground">Accept payments via Google Pay</p>
                        </div>
                      </div>
                      <Switch id="google-pay" />
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
              
              <AnimatedSection animation="fade-up" delay={100}>
                <Card>
                  <CardHeader>
                    <CardTitle>Currency Settings</CardTitle>
                    <CardDescription>
                      Configure how currencies are displayed
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currency-format">Currency Format</Label>
                        <Select defaultValue="symbol-before">
                          <SelectTrigger id="currency-format">
                            <SelectValue placeholder="Select currency format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="symbol-before">$100.00</SelectItem>
                            <SelectItem value="symbol-after">100.00$</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="decimal-separator">Decimal Separator</Label>
                        <Select defaultValue="dot">
                          <SelectTrigger id="decimal-separator">
                            <SelectValue placeholder="Select decimal separator" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dot">Dot (100.00)</SelectItem>
                            <SelectItem value="comma">Comma (100,00)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="thousand-separator">Thousand Separator</Label>
                        <Select defaultValue="comma">
                          <SelectTrigger id="thousand-separator">
                            <SelectValue placeholder="Select thousand separator" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="comma">Comma (1,000.00)</SelectItem>
                            <SelectItem value="dot">Dot (1.000,00)</SelectItem>
                            <SelectItem value="space">Space (1 000.00)</SelectItem>
                            <SelectItem value="none">None (1000.00)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="decimal-places">Decimal Places</Label>
                        <Select defaultValue="2">
                          <SelectTrigger id="decimal-places">
                            <SelectValue placeholder="Select decimal places" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">0 (100)</SelectItem>
                            <SelectItem value="1">1 (100.0)</SelectItem>
                            <SelectItem value="2">2 (100.00)</SelectItem>
                            <SelectItem value="3">3 (100.000)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6">
              <AnimatedSection animation="fade-up">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Notifications</CardTitle>
                    <CardDescription>
                      Configure email notifications for various events
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium">New Order</p>
                        <p className="text-sm text-muted-foreground">Receive email when a new order is placed</p>
                      </div>
                      <Switch defaultChecked id="new-order-email" />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium">Order Status Change</p>
                        <p className="text-sm text-muted-foreground">Receive email when an order status changes</p>
                      </div>
                      <Switch defaultChecked id="order-status-email" />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium">Inventory Alerts</p>
                        <p className="text-sm text-muted-foreground">Receive email when inventory is low</p>
                      </div>
                      <Switch defaultChecked id="inventory-email" />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium">Customer Registration</p>
                        <p className="text-sm text-muted-foreground">Receive email when a new customer registers</p>
                      </div>
                      <Switch id="customer-email" />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium">XML Import Completion</p>
                        <p className="text-sm text-muted-foreground">Receive email when XML import completes</p>
                      </div>
                      <Switch defaultChecked id="xml-import-email" />
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
              
              <AnimatedSection animation="fade-up" delay={100}>
                <Card>
                  <CardHeader>
                    <CardTitle>SMTP Settings</CardTitle>
                    <CardDescription>
                      Configure your SMTP server for sending emails
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtp-host">SMTP Host</Label>
                        <Input id="smtp-host" placeholder="smtp.example.com" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="smtp-port">SMTP Port</Label>
                        <Input id="smtp-port" placeholder="587" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtp-username">SMTP Username</Label>
                        <Input id="smtp-username" placeholder="username@example.com" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="smtp-password">SMTP Password</Label>
                        <Input id="smtp-password" type="password" placeholder="••••••••" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sender-email">Sender Email</Label>
                        <Input id="sender-email" placeholder="noreply@yourdomain.com" />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="smtp-ssl" />
                      <Label htmlFor="smtp-ssl">Use SSL/TLS</Label>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => toast({
                        title: "Test Email Sent",
                        description: "A test email has been sent to your inbox."
                      })}
                    >
                      Send Test Email
                    </Button>
                  </CardFooter>
                </Card>
              </AnimatedSection>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-6">
              <AnimatedSection animation="fade-up">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Configure security settings for your store
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Require two-factor authentication for admin login</p>
                      </div>
                      <Switch id="two-factor" />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium">SSL Enforcement</p>
                        <p className="text-sm text-muted-foreground">Enforce SSL for all pages</p>
                      </div>
                      <Switch defaultChecked id="ssl" />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium">Login Attempt Limits</p>
                        <p className="text-sm text-muted-foreground">Lock account after 5 failed login attempts</p>
                      </div>
                      <Switch defaultChecked id="login-limits" />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="password-policy">Password Policy</Label>
                      <Select defaultValue="strong">
                        <SelectTrigger id="password-policy">
                          <SelectValue placeholder="Select password policy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                          <SelectItem value="medium">Medium (8+ chars, letters and numbers)</SelectItem>
                          <SelectItem value="strong">Strong (8+ chars, letters, numbers, special chars)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                      <Select defaultValue="30">
                        <SelectTrigger id="session-timeout">
                          <SelectValue placeholder="Select session timeout" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="120">120 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </TabsContent>
            
            <TabsContent value="api" className="space-y-6">
              <AnimatedSection animation="fade-up">
                <Card>
                  <CardHeader>
                    <CardTitle>API Settings</CardTitle>
                    <CardDescription>
                      Manage API keys and access
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium">API Key</h4>
                          <p className="text-sm text-muted-foreground mt-1">Your private API key for accessing the API</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => toast({
                          title: "API Key Regenerated",
                          description: "Your API key has been regenerated successfully."
                        })}>
                          Regenerate
                        </Button>
                      </div>
                      <div className="mt-4 relative">
                        <Input 
                          readOnly 
                          value="sk_••••••••••••••••••••••••••••••" 
                          className="pr-24 font-mono text-sm"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="absolute right-0 top-0 h-full"
                          onClick={() => toast({
                            title: "API Key Copied",
                            description: "API key has been copied to your clipboard."
                          })}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>API Access Controls</Label>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Switch id="product-api" defaultChecked />
                          <Label htmlFor="product-api">Products API</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="order-api" defaultChecked />
                          <Label htmlFor="order-api">Orders API</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="customer-api" defaultChecked />
                          <Label htmlFor="customer-api">Customers API</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="inventory-api" defaultChecked />
                          <Label htmlFor="inventory-api">Inventory API</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="webhook-url">Webhook URL</Label>
                      <Input id="webhook-url" placeholder="https://your-domain.com/webhook" />
                      <p className="text-sm text-muted-foreground mt-1">
                        Webhook notifications will be sent to this URL
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
              
              <AnimatedSection animation="fade-up" delay={100}>
                <Card>
                  <CardHeader>
                    <CardTitle>API Documentation</CardTitle>
                    <CardDescription>
                      Links to API documentation and resources
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">API Documentation</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Comprehensive documentation for all API endpoints
                          </p>
                          <Button variant="link" className="h-auto p-0 mt-2">
                            View Documentation
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                          <Database className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Data Models</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Documentation for all data models and schemas
                          </p>
                          <Button variant="link" className="h-auto p-0 mt-2">
                            View Data Models
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                          <Globe className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">API Changelog</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            History of API changes and version updates
                          </p>
                          <Button variant="link" className="h-auto p-0 mt-2">
                            View Changelog
                          </Button>
                        </div>
                      </div>
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

export default Settings;
