import AdminHeader from "@/pages/admin/component/AdminHeader";
import AdminSidebar from "@/pages/admin/component/AdminSidebar";
import { useState, useEffect } from "react";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-white">
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <div className="flex-1 flex flex-col lg:ml-64">
        <AdminHeader 
          onMenuClick={toggleSidebar}
          isSidebarOpen={sidebarOpen}
        />

        <main className="flex-1 overflow-y-auto mt-[100px] px-2 bg-gradient-ocean-light">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;