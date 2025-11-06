import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut, Phone, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import userService from "@/services/api/pilot";
import logoHeader from "@/assets/logo-header.png";

const AdminHeader = ({ title }) => {
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      // Ẩn phần logo khi scroll xuống hơn 50px
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-primary/95 backdrop-blur-sm shadow-md z-50">
      {/* --- Phần Logo + Tên công ty (ẩn khi scroll) --- */}
      <div 
        className={`flex items-center justify-center border-b border-white/30 px-8 transition-all duration-300 overflow-hidden ${
          isScrolled ? "h-0 opacity-0" : "h-24 opacity-100"
        }`}
      >
        <button 
          onClick={handleGoHome}
          className="flex items-center gap-3 text-primary-foreground hover:opacity-80 transition-opacity cursor-pointer"
        >
          <img src={logoHeader} alt="Logo" className="w-16 h-16" />
          <span className="flex flex-col gap-1">
            <div className="text-xl font-bold">DỊCH VỤ HOA TIÊU HÀNG HẢI</div>
            <div className="text-sm font-semibold">Công Ty Cổ Phần Hoa Tiêu Hàng Hải - TKV</div>
            <div className="flex items-center gap-4 text-xs font-medium">
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

      {/* --- Phần thông tin người dùng (luôn hiển thị) --- */}
      
    </header>
  );
};

export default AdminHeader;