
import { Link } from "react-router-dom";
import { 
  Settings, 
  Package, 
  FileText, 
  ShoppingCart,
  Users,
  LogOut,
  LayoutDashboard,
  Upload
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import NavItem from "./NavItem";

interface AdminSidebarProps {
  activePage: string;
}

const AdminSidebar = ({ activePage }: AdminSidebarProps) => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Вихід із системи",
      description: "Ви успішно вийшли з системи адміністрування.",
    });
    logout();
  };

  return (
    <div className="w-64 border-r border-border flex flex-col h-screen">
      <div className="p-4 border-b border-border">
        <Link to="/" className="text-xl font-semibold tracking-tight">
          dropshiply
        </Link>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <NavItem href="/admin" icon={<LayoutDashboard className="h-4 w-4" />} label="Головна панель" active={activePage === 'dashboard'} />
        <NavItem href="/admin/products" icon={<Package className="h-4 w-4" />} label="Товари" active={activePage === 'products'} />
        <NavItem href="/admin/xml-import" icon={<Upload className="h-4 w-4" />} label="XML Імпорт" active={activePage === 'xml-import'} />
        <NavItem href="/admin/orders" icon={<ShoppingCart className="h-4 w-4" />} label="Замовлення" active={activePage === 'orders'} />
        <NavItem href="/admin/customers" icon={<Users className="h-4 w-4" />} label="Клієнти" active={activePage === 'customers'} />
        <NavItem href="/admin/settings" icon={<Settings className="h-4 w-4" />} label="Налаштування" active={activePage === 'settings'} />
        
        <Separator className="my-3" />
        
        <NavItem 
          href="#" 
          icon={<LogOut className="h-4 w-4" />} 
          label="Вийти" 
          onClick={handleLogout}
        />
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarFallback>{user?.name?.charAt(0) || 'А'}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium">{user?.name || 'Адміністратор'}</div>
            <div className="text-xs text-muted-foreground">{user?.email || 'admin@example.com'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
