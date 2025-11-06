import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, Clock, DollarSign, FileText, Ship, UserCheck } from "lucide-react";
import Navbar from "@/components/Navbar";

const serviceSteps = [
  {
    id: 1,
    title: "Đặt dịch vụ",
    description: "Khách hàng gửi yêu cầu đặt dịch vụ hoa tiêu với đầy đủ thông tin tàu và lịch trình",
    icon: Ship,
    status: "Chờ xác nhận",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    id: 2,
    title: "Điều phối viên báo giá",
    description: "Điều phối viên xem xét yêu cầu và gửi báo giá dịch vụ cho khách hàng",
    icon: FileText,
    status: "Chờ báo giá",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: 3,
    title: "Khách hàng thanh toán",
    description: "Khách hàng xác nhận báo giá và thực hiện thanh toán theo hướng dẫn",
    icon: DollarSign,
    status: "Cần thanh toán",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    id: 4,
    title: "Phân công hoa tiêu",
    description: "Sau khi thanh toán, điều phối viên sẽ phân công hoa tiêu phù hợp cho dịch vụ",
    icon: UserCheck,
    status: "Đang phân công",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    id: 5,
    title: "Hoa tiêu thực hiện",
    description: "Hoa tiêu được phân công sẽ thực hiện dịch vụ dẫn tàu theo lịch trình",
    icon: Ship,
    status: "Đang thực hiện",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    id: 6,
    title: "Hoàn thành dịch vụ",
    description: "Dịch vụ hoàn tất. Nếu phát sinh chi phí thêm, khách hàng sẽ được thông báo để thanh toán",
    icon: CheckCircle2,
    status: "Hoàn thành",
    color: "text-success",
    bgColor: "bg-success/10",
  },
];

const ServiceGuide = () => {
  return (
    <div className="min-h-screen bg-gradient-ocean-light">
      <Navbar />

      <div className="container mx-auto px-4 pt-16 sm:mt-[152px] pb-8">
        <Link to="/customer/dashboard">
          <Button variant="outline" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Hướng Dẫn Sử Dụng Dịch Vụ</h1>
          <p className="text-muted-foreground">
            Quy trình đặt và sử dụng dịch vụ hoa tiêu từ A đến Z
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Quy Trình Dịch Vụ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {serviceSteps.map((step, index) => (
                <div key={step.id} className="relative">
                  {/* Connecting line */}
                  {index < serviceSteps.length - 1 && (
                    <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-border" />
                  )}

                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full ${step.bgColor} flex items-center justify-center relative z-10`}>
                      <step.icon className={`w-6 h-6 ${step.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg">
                          Bước {step.id}: {step.title}
                        </h3>
                        <Badge variant="outline" className={step.color}>
                          {step.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lưu Ý Quan Trọng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p>Vui lòng cung cấp đầy đủ thông tin tàu để nhận báo giá chính xác</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p>Thanh toán trong vòng 7 ngày sau khi nhận báo giá</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p>Thông báo trước ít nhất 24 giờ nếu cần thay đổi lịch trình</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p>Liên hệ hotline 1900-xxxx nếu cần hỗ trợ khẩn cấp</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hình Thức Thanh Toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-2">
                <DollarSign className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Chuyển khoản ngân hàng</p>
                  <p className="text-muted-foreground">Thông tin sẽ được gửi trong email báo giá</p>
                </div>
              </div>
              <div className="flex gap-2">
                <DollarSign className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Thanh toán trực tiếp</p>
                  <p className="text-muted-foreground">Tại văn phòng công ty (giờ hành chính)</p>
                </div>
              </div>
              <div className="flex gap-2">
                <DollarSign className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Thanh toán sau (Khách hàng thường xuyên)</p>
                  <p className="text-muted-foreground">Thanh toán cuối tháng theo hợp đồng</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-bold text-lg mb-2">Cần Hỗ Trợ?</h3>
              <p className="text-muted-foreground mb-4">
                Liên hệ với chúng tôi qua hotline hoặc email để được tư vấn
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline">
                  Hotline: 1900-xxxx
                </Button>
                <Button variant="outline">
                  Email: support@maritime.com
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceGuide;
