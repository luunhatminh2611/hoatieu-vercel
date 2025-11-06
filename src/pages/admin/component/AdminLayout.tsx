import AdminHeader from "@/pages/admin/component/AdminHeader";
import AdminSidebar from "@/pages/admin/component/AdminSidebar";

const AdminLayout = ({ children, title }) => {
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar cố định bên trái */}
        <AdminSidebar />

      {/* Khu vực chính (Header + nội dung) */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
              <AdminHeader title={title} />



        {/* Nội dung chính */}
        <main className="flex-1 overflow-y-auto mt-[100px] px-2 bg-gradient-ocean-light">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
