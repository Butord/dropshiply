
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Linkedin, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-secondary py-16 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold tracking-tight">dropshiply</h3>
            <p className="text-muted-foreground max-w-xs">
              Premium dropshipping platform with carefully selected products and suppliers.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" icon={<Instagram size={18} />} label="Instagram" />
              <SocialLink href="#" icon={<Twitter size={18} />} label="Twitter" />
              <SocialLink href="#" icon={<Facebook size={18} />} label="Facebook" />
              <SocialLink href="#" icon={<Linkedin size={18} />} label="LinkedIn" />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Shop</h4>
            <nav className="flex flex-col space-y-2">
              <FooterLink href="/products" label="All Products" />
              <FooterLink href="/categories" label="Categories" />
              <FooterLink href="/new-arrivals" label="New Arrivals" />
              <FooterLink href="/best-sellers" label="Best Sellers" />
              <FooterLink href="/sale" label="Sale" />
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Company</h4>
            <nav className="flex flex-col space-y-2">
              <FooterLink href="/about" label="About Us" />
              <FooterLink href="/contact" label="Contact" />
              <FooterLink href="/careers" label="Careers" />
              <FooterLink href="/blog" label="Blog" />
              <FooterLink href="/affiliate" label="Affiliate Program" />
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Customer Service</h4>
            <nav className="flex flex-col space-y-2">
              <FooterLink href="/help" label="Help Center" />
              <FooterLink href="/shipping" label="Shipping & Delivery" />
              <FooterLink href="/returns" label="Returns & Exchanges" />
              <FooterLink href="/terms" label="Terms & Conditions" />
              <FooterLink href="/privacy" label="Privacy Policy" />
            </nav>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-muted-foreground">
          <p>© 2023 dropshiply. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const SocialLink = ({ href, icon, label }: SocialLinkProps) => (
  <a
    href={href}
    aria-label={label}
    className="h-8 w-8 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors duration-200"
  >
    {icon}
  </a>
);

interface FooterLinkProps {
  href: string;
  label: string;
}

const FooterLink = ({ href, label }: FooterLinkProps) => (
  <Link to={href} className="text-muted-foreground hover:text-primary transition-colors duration-200">
    {label}
  </Link>
);

export default Footer;
