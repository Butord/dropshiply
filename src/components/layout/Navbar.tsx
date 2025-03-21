
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Menu, Search, ShoppingCart, User, X } from 'lucide-react';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-semibold tracking-tight mr-8">
              dropshiply
            </Link>
            <div className="hidden md:flex space-x-6">
              <NavLink to="/" label="Home" />
              <NavLink to="/products" label="Products" />
              <NavLink to="/categories" label="Categories" />
              <NavLink to="/about" label="About" />
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search products..."
                className="pl-9 pr-4 py-2 rounded-full bg-transparent border border-gray-200 dark:border-gray-800 focus-visible:ring-gray-300 w-full"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium flex items-center justify-center text-primary-foreground">
                  3
                </span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 animate-fade-in">
          <div className="container mx-auto py-4 px-6 space-y-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search products..."
                className="pl-9 pr-4 py-2 bg-transparent border border-gray-200 dark:border-gray-800 focus-visible:ring-gray-300 w-full"
              />
            </div>
            <div className="flex flex-col space-y-3">
              <MobileNavLink to="/" label="Home" />
              <MobileNavLink to="/products" label="Products" />
              <MobileNavLink to="/categories" label="Categories" />
              <MobileNavLink to="/about" label="About" />
              <MobileNavLink to="/cart" label="Cart" />
              <MobileNavLink to="/account" label="Account" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
}

const NavLink = ({ to, label }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${
        isActive ? 'text-primary' : 'text-foreground/70'
      }`}
    >
      {label}
    </Link>
  );
};

const MobileNavLink = ({ to, label }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`text-lg font-medium py-2 transition-colors duration-200 hover:text-primary ${
        isActive ? 'text-primary' : 'text-foreground/70'
      }`}
    >
      {label}
    </Link>
  );
};

export default Navbar;
