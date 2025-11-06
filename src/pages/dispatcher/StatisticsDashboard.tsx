import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Anchor, ArrowLeft, Calendar, BarChart3 } from "lucide-react";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { mockMonthlyRevenue, mockMonthlyOrders } from "@/lib/mockData";

const StatisticsDashboard = () => {
  const handleLogout = () => {
    window.location.href = "/";
  };
  
  return (
    <div className="min-h-screen bg-gradient-ocean-light">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Anchor className="w-8 h-8" />
              <span className="text-xl font-bold">Dịch vụ Hoa Tiêu - Điều phối</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/dispatcher/schedule">
                <Button variant="outline" size="sm" className="bg-transparent border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <Calendar className="w-4 h-4 mr-2" />
                  Kế hoạch
                </Button>
              </Link>
              <Link to="/dispatcher/statistics">
                <Button variant="outline" size="sm" className="bg-transparent border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Thống kê
                </Button>
              </Link>
              <span className="text-sm">Chào, Điều phối viên</span>
              <Button onClick={handleLogout} variant="outline" size="sm" className="bg-transparent border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Link to="/dispatcher/dashboard">
          <Button variant="outline" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Thống Kê</h1>
          <p className="text-muted-foreground">Xem báo cáo doanh thu và số lượng dịch vụ</p>
        </div>

        <div className="space-y-6">
          {/* Doanh thu */}
          <Card>
            <CardHeader>
              <CardTitle>Doanh Thu Theo Tháng</CardTitle>
              <CardDescription>6 tháng gần nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={mockMonthlyRevenue}>
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

          {/* Số lượng dịch vụ */}
          <Card>
            <CardHeader>
              <CardTitle>Số Lượng Dịch Vụ Theo Tháng</CardTitle>
              <CardDescription>6 tháng gần nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={mockMonthlyOrders}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Tổng quan */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">29,000,000 VND</div>
                <div className="text-sm text-muted-foreground">Doanh thu tháng này</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-accent">5</div>
                <div className="text-sm text-muted-foreground">Dịch vụ tháng này</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-success">5,800,000 VND</div>
                <div className="text-sm text-muted-foreground">Trung bình/dịch vụ</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsDashboard;
