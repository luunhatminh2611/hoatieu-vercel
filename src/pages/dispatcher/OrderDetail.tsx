import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Anchor, ArrowLeft, DollarSign, UserCheck, Calendar, BarChart3 } from "lucide-react";
import { mockOrders, mockUsers } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const DispatcherOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const order = mockOrders.find((o) => o.id === orderId);
  const pilots = mockUsers.filter((u) => u.role === "pilot");
  const [quoteFile, setQuoteFile] = useState(null);
  const [price, setPrice] = useState("");
  const [selectedPilot, setSelectedPilot] = useState("");
  const [selectedTraineePilot, setSelectedTraineePilot] = useState("");
  const [showPriceDialog, setShowPriceDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [editingPilotType, setEditingPilotType] = useState<"main" | "trainee" | null>(null);

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-ocean-light flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Không tìm thấy đơn hàng</p>
            <Link to="/dispatcher/dashboard">
              <Button>Quay lại danh sách</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleLogout = () => {
    window.location.href = "/";
  };

  const handleSubmitPrice = () => {
    if (!price) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập giá dịch vụ",
        variant: "destructive",
      });
      return;
    }

    if (!quoteFile) {
      toast({
        title: "Lỗi",
        description: "Vui lòng tải lên file báo giá hoặc hợp đồng",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Thành công",
      description: "Đã gửi báo giá cho khách hàng",
    });
    setShowPriceDialog(false);
    setTimeout(() => navigate("/dispatcher/dashboard"), 1000);
  };

  const handleAssignPilot = () => {
    if (editingPilotType === "main") {
      if (!selectedPilot) {
        toast({
          title: "Lỗi",
          description: "Vui lòng chọn hoa tiêu chính",
          variant: "destructive",
        });
        return;
      }
    } else if (editingPilotType === "trainee") {
      if (!selectedTraineePilot) {
        toast({
          title: "Lỗi",
          description: "Vui lòng chọn hoa tiêu tập sự",
          variant: "destructive",
        });
        return;
      }
    } else {
      if (!selectedPilot) {
        toast({
          title: "Lỗi",
          description: "Vui lòng chọn hoa tiêu chính",
          variant: "destructive",
        });
        return;
      }
    }

    toast({
      title: "Thành công",
      description: "Đã phân công hoa tiêu thành công",
    });
    setShowAssignDialog(false);
    setEditingPilotType(null);
    setTimeout(() => navigate("/dispatcher/dashboard"), 1000);
  };

  const handleDeletePilot = (type: "main" | "trainee") => {
    toast({
      title: "Thành công",
      description: `Đã xóa ${type === "main" ? "hoa tiêu chính" : "hoa tiêu tập sự"}`,
    });
    setTimeout(() => navigate("/dispatcher/dashboard"), 1000);
  };

  const openAssignDialog = (type: "main" | "trainee" | null = null) => {
    setEditingPilotType(type);
    setSelectedPilot("");
    setSelectedTraineePilot("");
    setShowAssignDialog(true);
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/dispatcher/dashboard">
          <Button variant="outline" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{order.shipName}</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Mã: {order.id}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {order.status === "pending" && (
                  <Dialog open={showPriceDialog} onOpenChange={setShowPriceDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-accent hover:bg-accent/90">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Báo giá
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Báo giá dịch vụ</DialogTitle>
                        <DialogDescription>
                          Nhập giá dịch vụ và tải lên file báo giá (PDF, DOCX, v.v.)
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4 py-4">
                        {/* Nhập giá */}
                        <div className="space-y-2">
                          <Label htmlFor="price">Giá dịch vụ (VND)</Label>
                          <Input
                            id="price"
                            type="number"
                            placeholder="Nhập số tiền"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                          />
                        </div>

                        {/* Upload file báo giá */}
                        <div className="space-y-2">
                          <Label htmlFor="quoteFile">File báo giá / hợp đồng</Label>
                          <Input
                            id="quoteFile"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setQuoteFile(e.target.files[0])}
                          />
                          {quoteFile && (
                            <p className="text-sm text-muted-foreground">
                              📄 Đã chọn: <span className="font-medium">{quoteFile.name}</span>
                            </p>
                          )}
                        </div>

                        <Button onClick={handleSubmitPrice} className="w-full">
                          Gửi báo giá
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {["paid", "assigned", "pending-payment"].includes(order.status) &&
                  !order.assignedPilot && !order.traineePilot && (
                    <Button
                      className="bg-success hover:bg-success/90"
                      onClick={() => openAssignDialog(null)}
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Phân công hoa tiêu
                    </Button>
                  )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Thông tin khách hàng */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Thông tin khách hàng</h3>
              <div className="text-sm">
                <p className="font-medium">{order.customerName}</p>
              </div>
            </div>

            <Separator />

            {/* Thông tin tàu */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Thông tin tàu</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Tên tàu:</span>
                  <p className="font-medium">{order.shipName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Loại tàu:</span>
                  <p className="font-medium">{order.shipType}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Trọng tải:</span>
                  <p className="font-medium">{order.tonnage}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Chiều dài:</span>
                  <p className="font-medium">{order.length}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Mớn nước:</span>
                  <p className="font-medium">{order.draft}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Thông tin dịch vụ */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Thông tin dịch vụ</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Ngày:</span>
                  <p className="font-medium">{order.date}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Giờ:</span>
                  <p className="font-medium">{order.time}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Địa điểm:</span>
                  <p className="font-medium">{order.location}</p>
                </div>
                {order.assignedPilot && (
                  <div>
                    <span className="text-muted-foreground">Hoa tiêu:</span>
                    <p className="font-medium">{order.assignedPilot}</p>
                  </div>
                )}
              </div>
              {order.details && (
                <div className="mt-4">
                  <span className="text-muted-foreground">Chi tiết:</span>
                  <p className="font-medium mt-1">{order.details}</p>
                </div>
              )}
            </div>

            {(order.assignedPilot || order.traineePilot) && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold text-lg mb-3">Thông tin phân công</h3>
                  <div className="space-y-4">
                    {order.assignedPilot && (
                      <div className="flex items-center justify-between text-sm p-4 border rounded-lg">
                        <div>
                          <span className="text-muted-foreground block">Hoa tiêu chính:</span>
                          <p className="font-medium text-lg">{order.assignedPilot}</p>
                        </div>
                        {order.status !== "completed" && (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openAssignDialog("main")}
                            >
                              Sửa
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeletePilot("main")}
                            >
                              Xóa
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                    {!order.assignedPilot && order.status !== "completed" && (
                      <div className="p-4 border border-dashed rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">Chưa có hoa tiêu chính</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openAssignDialog("main")}
                        >
                          <UserCheck className="w-4 h-4 mr-2" />
                          Phân công hoa tiêu chính
                        </Button>
                      </div>
                    )}
                    {order.traineePilot && (
                      <div className="flex items-center justify-between text-sm p-4 border rounded-lg bg-muted/30">
                        <div>
                          <span className="text-muted-foreground block">Hoa tiêu tập sự:</span>
                          <p className="font-medium text-lg">{order.traineePilot}</p>
                        </div>
                        {order.status !== "completed" && (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openAssignDialog("trainee")}
                            >
                              Sửa
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeletePilot("trainee")}
                            >
                              Xóa
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                    {!order.traineePilot && order.status !== "completed" && (
                      <div className="p-4 border border-dashed rounded-lg bg-muted/10">
                        <p className="text-sm text-muted-foreground mb-2">Chưa có hoa tiêu tập sự</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openAssignDialog("trainee")}
                        >
                          <UserCheck className="w-4 h-4 mr-2" />
                          Phân công hoa tiêu tập sự
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {order.price && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold text-lg mb-3">Thông tin thanh toán</h3>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Giá dịch vụ:</span>
                    <p className="font-bold text-primary text-lg">{order.price}</p>
                  </div>
                  {order.status === "pending-payment" && (
                    <Badge variant="warning" className="mt-2">
                      Chờ thanh toán
                    </Badge>
                  )}
                  {order.status === "paid" && (
                    <Badge className="bg-primary mt-2">Đã thanh toán</Badge>
                  )}
                </div>
              </>
            )}
          </CardContent>
          {/* Dialog dùng chung cho cả phân công, sửa, xóa hoa tiêu */}
          <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingPilotType === "main"
                    ? "Chỉnh sửa hoa tiêu chính"
                    : editingPilotType === "trainee"
                      ? "Chỉnh sửa hoa tiêu tập sự"
                      : "Phân công hoa tiêu"}
                </DialogTitle>
                <DialogDescription>
                  {editingPilotType
                    ? `Chọn hoa tiêu mới cho đơn hàng ${order.id}`
                    : `Chọn hoa tiêu cho đơn hàng ${order.id}`}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {(!editingPilotType || editingPilotType === "main") && (
                  <div className="space-y-2">
                    <Label htmlFor="pilot">Hoa tiêu chính *</Label>
                    <select
                      id="pilot"
                      value={selectedPilot}
                      onChange={(e) => setSelectedPilot(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-background"
                    >
                      <option value="">Chọn hoa tiêu chính</option>
                      {pilots.map((pilot) => (
                        <option key={pilot.id} value={pilot.id}>
                          {pilot.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {(!editingPilotType || editingPilotType === "trainee") && (
                  <div className="space-y-2">
                    <Label htmlFor="trainee-pilot">Hoa tiêu tập sự (Tùy chọn)</Label>
                    <select
                      id="trainee-pilot"
                      value={selectedTraineePilot}
                      onChange={(e) => setSelectedTraineePilot(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-background"
                    >
                      <option value="">Không có hoa tiêu tập sự</option>
                      {pilots.map((pilot) => (
                        <option key={pilot.id} value={pilot.id}>
                          {pilot.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <Button onClick={handleAssignPilot} className="w-full">
                  Xác nhận
                </Button>
              </div>
            </DialogContent>
          </Dialog>

        </Card>
      </div>
    </div>
  );
};

export default DispatcherOrderDetail;
