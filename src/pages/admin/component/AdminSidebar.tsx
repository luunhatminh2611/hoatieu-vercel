import { Calendar, Settings, Users, LogOut, Home, SquareUserRound, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import userService from "@/services/api/pilot";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { icon: Home, label: "Trang chủ", path: "/" },
  { icon: Users, label: "Quản lý người dùng", path: "/admin/accounts" },
  { icon: Calendar, label: "Kế hoạch", path: "/admin/schedule" },
  { icon: Settings, label: "Cài đặt", path: "/admin/config" },
  { icon: SquareUserRound, label: "Hồ sơ của bạn", path: "/user-detail" },
];

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [usersDetail, setUsersDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const result = await logout();
    window.location.href = "/";
  };

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const data = await userService.getUserDetail();
      setUsersDetail(data?.data);
    } catch (error) {
      toast({
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

  return (
    <>
      {/* Overlay cho mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        "fixed top-0 md:top-28 left-0 bottom-0 w-64 bg-white border-r border-gray-200 flex flex-col overflow-y-auto z-40 transition-transform duration-300",
        "md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Nút đóng - chỉ hiện trên mobile */}
        <div className="md:hidden flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-primary text-primary-foreground">
          <div className="text-lg font-bold">Menu</div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Đóng menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Phần thông tin người dùng */}
        <div className="px-4 py-6 border-b border-gray-200 bg-white text-center">
          <div className="text-xl font-bold text-primary truncate">
            Xin chào, {usersDetail?.name || user?.username || "User"}
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-2">
          {menuItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              onClick={onClose}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all",
                location.pathname === path
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-700 hover:bg-primary/10 hover:text-primary"
              )}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Nút đăng xuất */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="outline"
            size="default"
            onClick={handleLogout}
            className="w-full bg-white border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Đăng xuất
          </Button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;