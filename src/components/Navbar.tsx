import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronDown, Phone, Mail } from "lucide-react";
import logoHeader from "@/assets/logo-header.png";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import userService from "@/services/api/pilot";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usersDetail, setUsersDetail] = useState(null);
  const { toast } = useToast()


  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const data = await userService.getUserDetail();

      setUsersDetail(data?.data);
      console.log("aaaa", data?.data.name)

    } catch (error) {
      ({
        title: "Lỗi tải người dùng",
        description: "Không thể tải người dùng.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, []);

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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const goToDashboard = () => {
    switch (user?.role) {
      case "ADMIN":
        navigate("/admin/accounts");
        break;
      case "PILOT":
        navigate("/pilot/dashboard");
        break;
      default:
        navigate("/dashboard");
    }
  };

  const menuItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Giới thiệu", path: "/about" },
    { label: "Danh sách hoa tiêu", path: "/pilots" },
    { label: "Đặt dịch vụ", path: "/customer/book-service" },
    { label: "Kế hoạch điều động", path: "/news" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm shadow-md">
      {/* --- Desktop: Logo + Tên công ty đầy đủ (ẩn khi scroll) --- */}
      <div
        className={`hidden md:flex w-full items-center justify-center border-b border-white/30 px-4 sm:px-8 transition-all duration-300 overflow-hidden ${isScrolled ? "h-0 opacity-0" : "h-24 opacity-100"
          }`}
      >
        <Link to="/" className="flex items-center gap-3 text-primary-foreground">
          <img src={logoHeader} alt="Logo" className="w-14 h-14 sm:w-20 sm:h-20" />
          <span className="flex flex-col gap-1">
            <div className="text-base sm:text-2xl font-bold text-center">CÔNG TY CỔ PHẦN HOA TIÊU HÀNG HẢI - TKV</div>
            <div className="text-base sm:text-xs font-bold text-center">Tầng 10, Trung tâm điều hành sản xuất tại Quảng Ninh -Tập đoàn Công nghiệp Than Khoáng Sản Việt Nam ( 95A, Lê Thánh Tông,Phường Hồng Gai,Tỉnh Quảng Ninh)</div>
            <div className="flex flex-col sm:flex-row items-center sm:items-end sm:justify-center gap-2 sm:gap-4 text-primary-foreground text-sm sm:text-xs sm:text-center font-medium">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent" />
                <span>Hotline: 0203 3659 855</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent" />
                <span>Email: tkv.tcldhc@gmail.com</span>
              </div>
            </div>
          </span>
        </Link>
      </div>

      {/* --- Mobile: Logo + Tên công ty gọn + Menu Icon --- */}
      <div className="md:hidden w-full px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary-foreground">
          <img src={logoHeader} alt="Logo" className="w-10 h-10" />
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-tight">Công Ty Cổ Phần</span>
            <span className="text-sm font-bold leading-tight">Hoa Tiêu Hàng Hải - TKV</span>
          </div>
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-primary text-primary-foreground">
            <div className="flex flex-col space-y-4 mt-6">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-lg font-medium hover:text-accent transition-colors"
                >
                  {item.label}
                </Link>
              ))}

              {/* Dropdown mobile */}
              <div className="space-y-2">
                <p className="text-lg font-medium">Công khai thông tin</p>
                <div className="pl-4 flex flex-col space-y-2">
                  <Link to="/price" className="hover:text-accent">Bảng giá dịch vụ</Link>
                  <Link to="/offer" className="hover:text-accent">Thông tin chào hàng</Link>
                  <Link to="/shareholders" className="hover:text-accent">Quan hệ cổ đông</Link>
                </div>
              </div>

              <div className="border-t border-primary-foreground/30 pt-4 mt-4">
                {!user ? (
                  <Link to="/auth">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                    >
                      Đăng nhập
                    </Button>
                  </Link>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Button
                      variant="outline"
                      onClick={goToDashboard}
                      className="w-full bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                    >
                      {user?.role === "ADMIN" ? "Điều hành" : "Nhiệm vụ"}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                    >
                      Đăng xuất
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* --- Menu Desktop (hàng dưới) --- */}
      <div className="hidden md:block w-full px-4 sm:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Menu Items (Desktop) */}
          <div className="flex items-center gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-primary-foreground hover:text-accent transition-colors"
              >
                {item.label}
              </Link>
            ))}

            {/* Dropdown "Công khai thông tin" */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-primary-foreground hover:text-accent transition-colors">
                Công khai thông tin
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white text-primary rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link to="/price" className="block px-4 py-2 hover:bg-accent hover:text-white">
                  Bảng giá dịch vụ
                </Link>
                <Link to="/offer" className="block px-4 py-2 hover:bg-accent hover:text-white">
                  Thông tin chào hàng
                </Link>
                <Link to="/shareholders" className="block px-4 py-2 hover:bg-accent hover:text-white">
                  Quan hệ cổ đông
                </Link>
              </div>
            </div>
          </div>

          {/* Right buttons */}
          <div className="flex items-center gap-3">
            {!user ? (
              <Link to="/auth">
                <Button
                  variant="outline"
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  Đăng nhập
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-primary-foreground font-medium truncate">
                  Xin chào, {usersDetail?.name || user?.username || "User"}
                </span>

                <Button
                  variant="outline"
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  onClick={goToDashboard}
                >
                  {user?.role === "ADMIN" ? "Điều hành" : "Nhiệm vụ"}
                </Button>

                <Button
                  variant="outline"
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;