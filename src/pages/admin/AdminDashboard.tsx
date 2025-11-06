import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Anchor, Users, FileText, Shield, TrendingUp, DollarSign, Ship, Activity } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./component/AdminLayout";

// Mock data for charts
const revenueData = [
  { month: "T1", revenue: 45000000 },
  { month: "T2", revenue: 52000000 },
  { month: "T3", revenue: 48000000 },
  { month: "T4", revenue: 61000000 },
  { month: "T5", revenue: 55000000 },
  { month: "T6", revenue: 67000000 },
];

const ordersData = [
  { month: "T1", orders: 45 },
  { month: "T2", orders: 52 },
  { month: "T3", orders: 48 },
  { month: "T4", orders: 61 },
  { month: "T5", orders: 55 },
  { month: "T6", orders: 67 },
];
const handleLogout = () => {
  window.location.href = "/";
}

const AdminDashboard = () => {
  return (
    <AdminLayout title="Tổng quan">
      <div className="min-h-screen bg-gradient-ocean-light">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Bảng Điều Khiển Quản Trị</h1>
            <p className="text-muted-foreground">Tổng quan hệ thống và thống kê</p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-primary">150</div>
                    <div className="text-sm text-muted-foreground">Khách hàng</div>
                  </div>
                  <Users className="w-10 h-10 text-primary/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-accent">50</div>
                    <div className="text-sm text-muted-foreground">Hoa tiêu</div>
                  </div>
                  <Shield className="w-10 h-10 text-accent/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-success">328</div>
                    <div className="text-sm text-muted-foreground">Dịch vụ/tháng</div>
                  </div>
                  <Ship className="w-10 h-10 text-success/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-warning">67M</div>
                    <div className="text-sm text-muted-foreground">Doanh thu/tháng</div>
                  </div>
                  <DollarSign className="w-10 h-10 text-warning/20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Doanh Thu Theo Tháng</CardTitle>
                <CardDescription>6 tháng gần nhất (VND)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) =>
                        new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(value)
                      }
                    />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Orders Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Số Lượng Đặt Dịch Vụ</CardTitle>
                <CardDescription>6 tháng gần nhất</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={ordersData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="hsl(var(--accent))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--accent))", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Quản Lý Tài Khoản
                </CardTitle>
                <CardDescription>Tạo và quản lý tài khoản người dùng</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/admin/accounts">
                  <Button className="w-full">Xem tài khoản</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent" />
                  Quản Lý Hóa Đơn
                </CardTitle>
                <CardDescription>Xem và quản lý hóa đơn</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/admin/invoices">
                  <Button className="w-full bg-accent hover:bg-accent/90">Xem hóa đơn</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-warning" />
                  Công Nợ
                </CardTitle>
                <CardDescription>Theo dõi công nợ khách hàng</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/admin/debts">
                  <Button className="w-full bg-warning hover:bg-warning/90">Xem công nợ</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
