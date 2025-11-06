import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Anchor, DollarSign, UserCheck, BarChart3, Calendar } from "lucide-react";

// Mock data
const pendingOrders = [
  {
    id: "DV005",
    shipName: "Container Ship Epsilon",
    customerName: "Công ty TNHH ABC",
    date: "2025-01-26",
    details: "Tàu container, trọng tải 5000 tấn",
  },
];

const completedOrders = [
  {
    id: "DV001",
    shipName: "Container Ship Alpha",
    customerName: "Công ty TNHH ABC",
    date: "2025-01-15",
    price: "5,000,000 VND",
    assignedPilot: "Nguyễn Văn A",
    completedDate: "2025-01-15",
  },
  {
    id: "DV002",
    shipName: "Cargo Vessel Beta",
    customerName: "Công ty CP DEF",
    date: "2025-01-20",
    price: "7,500,000 VND",
    assignedPilot: "Trần Văn B",
    completedDate: "2025-01-20",
  },
];

const DispatcherDashboard = () => {
  const [activeTab, setActiveTab] = useState("pending");

  const handleLogout = () => {
    window.location.href = "/";
  }
  return (
    <div className="min-h-screen bg-gradient-ocean-light">
      {/* Header */}
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Bảng Điều Phối</h1>
          <p className="text-muted-foreground">Quản lý yêu cầu và phân công hoa tiêu</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-warning">{pendingOrders.length}</div>
              <div className="text-sm text-muted-foreground">Cần xử lý</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-accent">1</div>
              <div className="text-sm text-muted-foreground">Đã báo giá</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-success">1</div>
              <div className="text-sm text-muted-foreground">Đã phân công</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">3</div>
              <div className="text-sm text-muted-foreground">Tổng hôm nay</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content with Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Quản Lý Đơn Hàng</CardTitle>
            <CardDescription>Xử lý yêu cầu và phân công hoa tiêu</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="pending">
                  Cần xử lý ({pendingOrders.length})
                </TabsTrigger>
                <TabsTrigger value="processing">
                  Đang xử lý (2)
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Hoàn thành ({completedOrders.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                {pendingOrders.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg">{order.shipName}</h3>
                            <Badge variant="warning">Chờ báo giá</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div>Mã dịch vụ: {order.id}</div>
                            <div>Khách hàng: {order.customerName}</div>
                            <div>Ngày đặt: {order.date}</div>
                            <div className="mt-2 text-foreground">{order.details}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/dispatcher/order/${order.id}`} className="flex-1 md:flex-none">
                            <Button variant="outline" size="sm">
                              Xem chi tiết
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="processing" className="space-y-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg">Oil Tanker Gamma</h3>
                          <Badge variant="default">Đã phân công</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>Mã dịch vụ: DV003</div>
                          <div>Khách hàng: Tập đoàn Dầu khí</div>
                          <div>Ngày đặt: 2025-01-22</div>
                          <div>Hoa tiêu: Nguyễn Văn A</div>
                          <div className="font-semibold text-primary mt-2">10,000,000 VND</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link to="/dispatcher/order/DV003">
                          <Button variant="outline" size="sm">
                            Xem chi tiết
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg">Bulk Carrier Delta</h3>
                          <Badge variant="warning">Chờ thanh toán</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>Mã dịch vụ: DV004</div>
                          <div>Khách hàng: Công ty CP XYZ</div>
                          <div>Ngày đặt: 2025-01-25</div>
                          <div className="font-semibold text-primary mt-2">6,500,000 VND</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link to="/dispatcher/order/DV004">
                          <Button variant="outline" size="sm">
                            Xem chi tiết
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                {completedOrders.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg">{order.shipName}</h3>
                            <Badge variant="success">Hoàn thành</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div>Mã dịch vụ: {order.id}</div>
                            <div>Khách hàng: {order.customerName}</div>
                            <div>Ngày thực hiện: {order.date}</div>
                            <div>Ngày hoàn thành: {order.completedDate}</div>
                            <div>Hoa tiêu: {order.assignedPilot}</div>
                            <div className="font-semibold text-primary mt-2">{order.price}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/dispatcher/order/${order.id}`} className="flex-1 md:flex-none">
                            <Button variant="outline" size="sm">
                              Xem chi tiết
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DispatcherDashboard;
