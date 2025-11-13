import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut, Phone, Mail, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import userService from "@/services/api/pilot";
import logoHeader from "@/assets/logo-header.png";

const AdminHeader = ({ onMenuClick, isSidebarOpen }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const { toast } = useToast();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-primary/95 backdrop-blur-sm shadow-md z-50">
      {/* --- Phần Logo + Tên công ty --- */}
      <div 
        className={`flex items-center justify-center border-b border-white/30 px-4 md:px-8 transition-all duration-300 overflow-hidden relative ${
          isScrolled ? "h-0 opacity-0" : "h-16 md:h-24 opacity-100"
        }`}
      >
        {/* Nút menu mobile */}
        <button 
          onClick={onMenuClick}
          className="md:hidden absolute left-4 p-2 text-primary-foreground hover:bg-white/10 rounded-lg transition-colors"
          aria-label={isSidebarOpen ? "Đóng menu" : "Mở menu"}
        >
          <Menu className="w-6 h-6" />
        </button>

        <button 
          onClick={handleGoHome}
          className="flex items-center gap-2 md:gap-3 text-primary-foreground hover:opacity-80 transition-opacity cursor-pointer"
        >
          <img src={logoHeader} alt="Logo" className="w-12 h-12 md:w-16 md:h-16" />
          <span className="flex flex-col gap-0.5 md:gap-1">
            <div className="text-sm md:text-xl font-bold">DỊCH VỤ HOA TIÊU HÀNG HẢI</div>
            <div className="hidden sm:block text-xs md:text-sm font-semibold">Công Ty Cổ Phần Hoa Tiêu Hàng Hải - TKV</div>
            <div className="hidden md:flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3 text-accent" />
                <span>Hotline: 0203 3659 855</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3 text-accent" />
                <span>Email: tkv.tcldhc@gmail.com</span>
              </div>
            </div>
          </span>
        </button>
      </div>

      {/* --- Thanh compact khi scroll (chỉ có nút menu) --- */}
      {isScrolled && (
        <div className="md:hidden flex items-center px-4 py-2">
          <button 
            onClick={onMenuClick}
            className="p-2 text-primary-foreground hover:bg-white/10 rounded-lg transition-colors"
            aria-label={isSidebarOpen ? "Đóng menu" : "Mở menu"}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;