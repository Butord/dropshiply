
import { Link } from "react-router-dom";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem = ({ href, icon, label, active, onClick }: NavItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Link
      to={href}
      className={`flex items-center h-10 rounded-md px-3 text-sm font-medium ${
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted transition-colors'
      }`}
      onClick={handleClick}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </Link>
  );
};

export default NavItem;
