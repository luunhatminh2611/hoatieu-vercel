import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Ship, User, Clock, MapPin, CreditCard, CheckCircle2, DollarSign, Edit, Download, QrCode } from "lucide-react";
import { mockOrders } from "@/lib/mockData";
import Navbar from "@/components/Navbar";
import QR from "@/assets/QR.jpg";

const pilotInfo = {
  name: "Nguyễn Văn A",
  license: "HT-001-2020",
  experience: "15 năm",
  phone: "0903456789",
  email: "pilot.a@maritime.com",
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-300">Chờ xác nhận</Badge>;
    case "pending-payment":
      return <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-300">Chờ thanh toán</Badge>;
    case "paid":
      return <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-300">Đã thanh toán</Badge>;
    case "assigned":
      return <Badge variant="outline" className="bg-purple-500/10 text-purple-700 border-purple-300">Đã phân công</Badge>;
    case "completed":
      return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-300">Hoàn thành</Badge>;
    case "cancelled":
      return <Badge variant="destructive">Đã hủy</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [showPilotDialog, setShowPilotDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const order = mockOrders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-ocean-light">
        <Navbar />
        <div className="container mx-auto px-4 pt-16 sm:mt-[152px] pb-6 md:pt-28 md:pb-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Không tìm thấy đơn hàng</p>
              <div className="flex justify-center mt-4">
                <Link to="/customer/dashboard">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Mock data for display based on order
  const serviceData = {
    // Thông tin đại lý/chủ tàu
    companyName: order.customerName,
    companyAddress: "123 Đường Nguyễn Văn Linh, Quận Hải Châu, TP. Đà Nẵng",
    phone: "0901234567",
    fax: "0236.3821234",
    email: "contact@company.com",
    taxCode: "0401234567",

    // Thông số kỹ thuật tàu
    shipName: order.shipName,
    nationality: "Panama",
    callSign: "3EQW5",
    loa: order.length.replace('m', ''),
    beam: "32",
    draftF: order.draft.replace('m', ''),
    draftA: order.draft.replace('m', ''),
    shipType: order.shipType,
    gt: "25000",
    nt: "15000",
    route: "Tuyến Châu Á - Châu Âu",
    dwt: order.tonnage.replace(' tấn', ''),
    cargo: "Container",
    cargoType: "Hàng công nghiệp",
    needTugboat: "yes",

    // Tàu lai hỗ trợ
    supportShip: "TB-DN-001",

    // Lịch trình VÀO
    entryFrom: "Khu neo đậu",
    entryTo: "Cầu cảng số 3",
    entryTime: order.time,
    entryDate: order.date,

    // Lịch trình RỜI
    departFrom: "Cầu cảng số 3",
    departTo: "Khu neo đậu",
    departTime: "16:00",
    departDate: order.date,

    // Thông tin cảng
    portOfDeparture: "Singapore",
    portOfArrival: order.location,
    nextPort: "Busan, Hàn Quốc",
  };

  // Status history
  const statusHistory = [
    { status: "Tạo đơn", date: order.date, time: "08:00", completed: true },
    { status: "Điều phối viên báo giá", date: order.date, time: "10:30", completed: order.price ? true : false },
    { status: "Khách hàng thanh toán", date: order.paymentDate || "", time: order.paymentDate ? "14:20" : "", completed: order.status !== "pending" && order.status !== "pending-payment" ? true : false },
    { status: "Phân công hoa tiêu", date: order.assignedPilot ? order.date : "", time: order.assignedPilot ? "15:00" : "", completed: order.assignedPilot ? true : false },
    { status: "Hoa tiêu thực hiện", date: order.status === "completed" ? order.completedDate || "" : "", time: order.status === "completed" ? "16:30" : "", completed: order.status === "completed" },
    { status: "Hoàn thành", date: order.completedDate || "", time: order.completedDate ? "17:00" : "", completed: order.status === "completed" },
  ];

  return (
    <div className="min-h-screen bg-gradient-ocean-light">
      <Navbar />

      <div className="container mx-auto px-4 pt-16 sm:mt-[152px] pb-6 md:pt-28 md:pb-8">
        <Link to="/customer/dashboard">
          <Button variant="outline" size="sm" className="mb-4 md:mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </Link>

        {/* Two column layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column - Service Details (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                      <Ship className="w-6 h-6" />
                      {order.shipName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Mã đơn: {order.id}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Agent/Owner Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin đại lý/chủ tàu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tên đại lý/chủ tàu</p>
                    <p className="font-medium">{serviceData.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mã số thuế</p>
                    <p className="font-medium">{serviceData.taxCode}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Địa chỉ</p>
                    <p className="font-medium">{serviceData.companyAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Số điện thoại</p>
                    <p className="font-medium">{serviceData.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fax</p>
                    <p className="font-medium">{serviceData.fax}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{serviceData.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ship Specifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông số kỹ thuật của tàu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tàu</p>
                    <p className="font-medium">{serviceData.shipName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quốc tịch</p>
                    <p className="font-medium">{serviceData.nationality}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Hô hiệu</p>
                    <p className="font-medium">{serviceData.callSign}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Loại tàu</p>
                    <p className="font-medium">{serviceData.shipType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">LOA (m)</p>
                    <p className="font-medium">{serviceData.loa}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Beam (m)</p>
                    <p className="font-medium">{serviceData.beam}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Draft F (m)</p>
                    <p className="font-medium">{serviceData.draftF}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Draft A (m)</p>
                    <p className="font-medium">{serviceData.draftA}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">GT</p>
                    <p className="font-medium">{serviceData.gt}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">NT</p>
                    <p className="font-medium">{serviceData.nt}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">HĐKĐ tuyến</p>
                    <p className="font-medium">{serviceData.route}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">DWT</p>
                    <p className="font-medium">{serviceData.dwt}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Hàng hóa</p>
                    <p className="font-medium">{serviceData.cargo}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Loại hàng hóa</p>
                    <p className="font-medium">{serviceData.cargoType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ca nô đẹp luồng</p>
                    <p className="font-medium">{serviceData.needTugboat === "yes" ? "Có" : "Không"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Tugboat */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tàu lai hỗ trợ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{serviceData.supportShip || "Không có"}</p>
              </CardContent>
            </Card>

            {/* Entry Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Lịch trình VÀO
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Từ</p>
                    <p className="font-medium">{serviceData.entryFrom}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Đến</p>
                    <p className="font-medium">{serviceData.entryTo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lúc</p>
                    <p className="font-medium">{serviceData.entryTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ngày</p>
                    <p className="font-medium">{new Date(serviceData.entryDate).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Departure Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Lịch trình RỜI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Từ</p>
                    <p className="font-medium">{serviceData.departFrom}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Đến</p>
                    <p className="font-medium">{serviceData.departTo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lúc</p>
                    <p className="font-medium">{serviceData.departTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ngày</p>
                    <p className="font-medium">{new Date(serviceData.departDate).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Port Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin cảng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Cảng khởi hành</p>
                    <p className="font-medium">{serviceData.portOfDeparture}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cảng đến</p>
                    <p className="font-medium">{serviceData.portOfArrival}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cảng tiếp theo</p>
                    <p className="font-medium">{serviceData.nextPort}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assigned Pilot */}
            {order.assignedPilot && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Hoa tiêu được phân công
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-lg">{order.assignedPilot}</p>
                        <p className="text-sm text-muted-foreground">Hoa tiêu chính</p>
                      </div>
                      <Button variant="outline" onClick={() => setShowPilotDialog(true)}>
                        Xem chi tiết
                      </Button>
                    </div>
                    {order.traineePilot && (
                      <div className="pt-3 border-t">
                        <p className="font-medium">{order.traineePilot}</p>
                        <p className="text-sm text-muted-foreground">Hoa tiêu tập sự</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right column - Status & Actions (1/3 width) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Status History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Lịch sử trạng thái
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statusHistory.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.completed ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          }`}>
                          {item.completed ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                        </div>
                        {index < statusHistory.length - 1 && (
                          <div className={`w-0.5 h-full min-h-[40px] ${item.completed ? 'bg-primary' : 'bg-muted'
                            }`} />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className={`font-medium ${item.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {item.status}
                        </p>
                        {item.date && (
                          <p className="text-sm text-muted-foreground">
                            {new Date(item.date).toLocaleDateString('vi-VN')} {item.time}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hành động</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.status === "pending" && (
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => navigate(`/customer/book-service?edit=${order.id}`)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Chỉnh sửa đơn
                  </Button>
                )}

                {order.quotationUrl && (
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => window.open(order.quotationUrl, "_blank")}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Tải file báo giá
                  </Button>
                )}

                {(order.status === "pending-payment" || order.status === "completed") && (
                  <Button
                    className="w-full"
                    onClick={() => setShowPaymentDialog(true)}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {order.status === "completed" ? "Thanh toán thêm" : "Thanh toán"}
                  </Button>
                )}

                {order.status === "completed" && order.invoiceUrl && (
                  <Button className="w-full" variant="outline" onClick={() => window.open(order.invoiceUrl, "_blank")}>
                    <Download className="w-4 h-4 mr-2" />
                    Tải hóa đơn
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Payment Info */}
            {order.price && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Thông tin thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Giá dịch vụ</p>
                    <p className="text-2xl font-bold text-primary">{order.price}</p>
                  </div>
                  {order.paymentDate && (
                    <div>
                      <p className="text-sm text-muted-foreground">Ngày thanh toán</p>
                      <p className="font-medium">{new Date(order.paymentDate).toLocaleDateString('vi-VN')}</p>
                    </div>
                  )}
                  {order.additionalFees && (
                    <div>
                      <p className="text-sm text-muted-foreground">Phí phát sinh</p>
                      <p className="font-medium text-destructive">{order.additionalFees}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Pilot Details Dialog */}
      <Dialog open={showPilotDialog} onOpenChange={setShowPilotDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thông tin hoa tiêu</DialogTitle>
            <DialogDescription>Chi tiết về hoa tiêu được phân công</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Họ tên</p>
              <p className="font-medium">{pilotInfo.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Số giấy phép</p>
              <p className="font-medium">{pilotInfo.license}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Kinh nghiệm</p>
              <p className="font-medium">{pilotInfo.experience}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Số điện thoại</p>
              <p className="font-medium">{pilotInfo.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{pilotInfo.email}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog with QR Code */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              Thanh toán dịch vụ
            </DialogTitle>
            <DialogDescription>
              Quét mã QR để thanh toán qua VietQR
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center p-6 bg-white rounded-lg">
              <img
                src={QR}
                alt="QR Code"
                className="w-64 h-64 object-contain"
              />
            </div>
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Số tiền:</span>
                <span className="font-bold text-primary">{order.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Mã đơn:</span>
                <span className="font-medium">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ngân hàng:</span>
                <span className="font-medium">BIDV</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Số TK:</span>
                <span className="font-medium">1234567890</span>
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Vui lòng thanh toán đúng số tiền và ghi rõ mã đơn hàng trong nội dung chuyển khoản
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderDetail;