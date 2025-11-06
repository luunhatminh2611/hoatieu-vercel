import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import AdminLayout from "./component/AdminLayout";
import { orderService } from "@/services/api/order";
import {
    Loader2,
    ArrowLeft,
    Ship,
    User,
    Phone,
    Mail,
    MapPin,
    Calendar,
    Package,
    Anchor,
    FileText,
    CheckCircle,
    XCircle,
    Clock
} from "lucide-react";

const OrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetail();
        }
    }, [orderId]);

    const fetchOrderDetail = async () => {
        try {
            setLoading(true);
            const response = await orderService.getOrderById(orderId);
            console.log(response)
            // API trả về {status, message, data}
            setOrder(response.data);
        } catch (error) {
            toast({
                title: "Lỗi",
                description: error.response?.data?.message || "Không thể tải thông tin đơn hàng",
                variant: "destructive",
            });
            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusUpper = status?.toUpperCase();
        const statusConfig = {
            PENDING: { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800 border-yellow-300", icon: Clock },
            CONFIRMED: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800 border-blue-300", icon: CheckCircle },
            IN_PROGRESS: { label: "Đang thực hiện", color: "bg-purple-100 text-purple-800 border-purple-300", icon: Ship },
            COMPLETED: { label: "Hoàn thành", color: "bg-green-100 text-green-800 border-green-300", icon: CheckCircle },
            CANCELLED: { label: "Đã hủy", color: "bg-red-100 text-red-800 border-red-300", icon: XCircle },
        };

        const config = statusConfig[statusUpper] || {
            label: status,
            color: "bg-gray-100 text-gray-800 border-gray-300",
            icon: FileText
        };

        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border ${config.color}`}>
                <Icon className="w-4 h-4" />
                {config.label}
            </span>
        );
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <AdminLayout title={"Danh sách đơn hàng"}>
                <div className="min-h-screen bg-gradient-ocean-light">
                    <div className="container mx-auto px-4 py-8 flex justify-center items-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="ml-3 text-lg">Đang tải thông tin đơn hàng...</span>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (!order) {
        return (
            <AdminLayout title={"Danh sách đơn hàng"}>
                <div className="min-h-screen bg-gradient-ocean-light">
                    <div className="container mx-auto px-4 py-8">
                        <Card>
                            <CardContent className="py-12 text-center">
                                <p className="text-lg text-gray-500">Không tìm thấy đơn hàng</p>
                                <Button className="mt-4" onClick={() => navigate(-1)}>
                                    Quay lại
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Chi tiết đơn hàng">
            <div className="min-h-screen bg-gradient-ocean-light">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(-1)}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Quay lại
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold text-primary">
                                    Chi Tiết Đơn Hàng
                                </h1>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Mã đơn: #{order.id}
                                </p>
                            </div>
                        </div>
                        <div>
                            {getStatusBadge(order.status)}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Thông tin đại lý/chủ tàu */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Thông tin đại lý/chủ tàu
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-sm font-medium text-gray-500">Tên đại lý:</span>
                                    <span className="col-span-2 text-sm font-semibold">{order.agentName || "N/A"}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-sm font-medium text-gray-500">Địa chỉ:</span>
                                    <span className="col-span-2 text-sm">{order.agentAddress || "N/A"}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                                        <Phone className="w-3 h-3" /> Số điện thoại:
                                    </span>
                                    <span className="col-span-2 text-sm">{order.agentPhone || "N/A"}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-sm font-medium text-gray-500">Fax:</span>
                                    <span className="col-span-2 text-sm">{order.agentFax || "N/A"}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                                        <Mail className="w-3 h-3" /> Email:
                                    </span>
                                    <span className="col-span-2 text-sm">{order.agentEmail || "N/A"}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-sm font-medium text-gray-500">Mã số thuế:</span>
                                    <span className="col-span-2 text-sm">{order.taxCode || "N/A"}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Thông số kỹ thuật tàu */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Ship className="w-5 h-5" />
                                    Thông số kỹ thuật tàu
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-sm font-medium text-gray-500">Tên tàu:</span>
                                    <span className="col-span-2 text-sm font-semibold">{order.shipName || "N/A"}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-sm font-medium text-gray-500">Loại tàu:</span>
                                    <span className="col-span-2 text-sm">{order.shipType || "N/A"}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-sm font-medium text-gray-500">Quốc tịch:</span>
                                    <span className="col-span-2 text-sm">{order.shipNationality || "N/A"}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-sm font-medium text-gray-500">Hô hiệu:</span>
                                    <span className="col-span-2 text-sm">{order.callSign || "N/A"}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-sm font-medium text-gray-500">LOA:</span>
                                    <span className="col-span-2 text-sm">{order.shipLOA ? `${order.shipLOA} m` : "N/A"}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-sm font-medium text-gray-500">Beam:</span>
                                    <span className="col-span-2 text-sm">{order.shipBeam ? `${order.shipBeam} m` : "N/A"}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-sm font-medium text-gray-500">Draft F/A:</span>
                                    <span className="col-span-2 text-sm">
                                        {order.draftF || "N/A"} / {order.draftA || "N/A"} m
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-sm font-medium text-gray-500">GT / NT:</span>
                                    <span className="col-span-2 text-sm">
                                        {order.shipGT || "N/A"} / {order.netTonnage || "N/A"}
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-sm font-medium text-gray-500">DWT:</span>
                                    <span className="col-span-2 text-sm">{order.shipDWT || "N/A"}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Thông tin hàng hóa */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    Thông tin hàng hóa
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-sm font-medium text-gray-500">Hàng hóa:</span>
                                    <span className="col-span-2 text-sm">{order.cargo || "N/A"}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-sm font-medium text-gray-500">Loại hàng:</span>
                                    <span className="col-span-2 text-sm">{order.cargoType || "N/A"}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-sm font-medium text-gray-500">Tuyến HĐKĐ:</span>
                                    <span className="col-span-2 text-sm">{order.businessRoute || "N/A"}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-sm font-medium text-gray-500">Ca nô đẹp luồng:</span>
                                    <span className="col-span-2 text-sm">
                                        {order.hasPilotBoat ? (
                                            <span className="text-green-600 font-medium">Có</span>
                                        ) : (
                                            <span className="text-gray-500">Không</span>
                                        )}
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-sm font-medium text-gray-500">Tàu kênh:</span>
                                    <span className="col-span-2 text-sm">
                                        {order.channelBoat ? (
                                            <span className="text-green-600 font-medium">Có</span>
                                        ) : (
                                            <span className="text-gray-500">Không</span>
                                        )}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Anchor className="w-5 h-5" />
                                Lịch trình và cảng
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Schedule Grid - Responsive */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {/* Arrival Schedule */}
                                <div className="p-4 bg-arrival-bg rounded-xl bg-blue-50 border border-arrival-border hover:border-arrival transition-colors duration-300">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="p-2 bg-blue-100 dark:bg-gray-800 rounded-lg">
                                            <Calendar className="w-4 h-4 text-arrival" />
                                        </div>
                                        <h3 className="text-sm font-bold text-arrival uppercase tracking-wide text-blue-700">
                                            Lịch trình vào
                                        </h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                            <span className="text-xs font-semibold text-muted-foreground min-w-[100px]">
                                                Tuyến đường:
                                            </span>
                                            <span className="text-sm font-medium">
                                                {order.arrivalFrom || "N/A"} → {order.arrivalTo || "N/A"}
                                            </span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                            <span className="text-xs font-semibold text-muted-foreground min-w-[100px]">
                                                Thời gian đến:
                                            </span>
                                            <span className="text-sm font-bold text-arrival">
                                                {formatDateTime(order.arrivalTime)}
                                            </span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                            <span className="text-xs font-semibold text-muted-foreground min-w-[100px]">
                                                Ngày đến:
                                            </span>
                                            <span className="text-sm">{order.arrivalDate || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Departure Schedule */}
                                <div className="p-4 bg-departure-bg rounded-xl bg-orange-50 border border-departure-border hover:border-departure transition-colors duration-300">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="p-2 bg-orange-100 dark:bg-gray-800 rounded-lg">
                                            <Calendar className="w-4 h-4 text-departure" />
                                        </div>
                                        <h3 className="text-sm font-bold text-departure uppercase tracking-wide text-orange-700">
                                            Lịch trình rời
                                        </h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                            <span className="text-xs font-semibold text-muted-foreground min-w-[100px]">
                                                Tuyến đường:
                                            </span>
                                            <span className="text-sm font-medium">
                                                {order.departureFrom || "N/A"} → {order.departureTo || "N/A"}
                                            </span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                            <span className="text-xs font-semibold text-muted-foreground min-w-[100px]">
                                                Thời gian rời:
                                            </span>
                                            <span className="text-sm font-bold text-departure">
                                                {formatDateTime(order.departureTime)}
                                            </span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                            <span className="text-xs font-semibold text-muted-foreground min-w-[100px]">
                                                Ngày rời:
                                            </span>
                                            <span className="text-sm">{order.departureDate || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Port Information */}
                            <div className="pt-4 border-t">
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <h3 className="text-sm font-bold uppercase tracking-wide">Thông tin cảng</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200">
                                        <span className="text-xs font-semibold text-muted-foreground block mb-1">
                                            Cảng rời
                                        </span>
                                        <span className="text-sm font-medium block">
                                            {order.portDeparture || "N/A"}
                                        </span>
                                    </div>
                                    <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200">
                                        <span className="text-xs font-semibold text-muted-foreground block mb-1">
                                            Cảng đến
                                        </span>
                                        <span className="text-sm font-medium block">
                                            {order.portArrival || "N/A"}
                                        </span>
                                    </div>
                                    <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200">
                                        <span className="text-xs font-semibold text-muted-foreground block mb-1">
                                            Cảng tiếp theo
                                        </span>
                                        <span className="text-sm font-medium block">
                                            {order.nextPortArrival || "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
};

export default OrderDetail;