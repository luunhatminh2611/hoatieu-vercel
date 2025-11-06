import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Navbar from "@/components/Navbar";
import { orderService } from "@/services/api/order";
import { Loader2, Search, Filter, Ship, Eye, Calendar, Plus } from "lucide-react";
import AdminLayout from "./component/AdminLayout";

const OrderList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  // Filter states
  const [filters, setFilters] = useState({
    searchTerm: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  });

  // Fetch all orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrders();
      setAllOrders(response.content || []);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể tải danh sách đơn hàng",
        variant: "destructive",
      });
      setAllOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders
  const filteredOrders = useMemo(() => {
    let result = [...allOrders];

    // Search term (tìm trong nhiều trường)
    if (filters.searchTerm.trim()) {
      const term = filters.searchTerm.toLowerCase().trim();
      result = result.filter(
        (order) =>
          order.shipName?.toLowerCase().includes(term) ||
          order.agentName?.toLowerCase().includes(term) ||
          order.agentPhone?.toLowerCase().includes(term) ||
          order.orderId?.toString().includes(term)
      );
    }

    // Filter by status
    if (filters.status.trim()) {
      result = result.filter((order) => order.status === filters.status);
    }

    // Filter by date range
    if (filters.dateFrom) {
      result = result.filter(
        (order) => new Date(order.arrivalDate) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      result = result.filter(
        (order) => new Date(order.arrivalDate) <= new Date(filters.dateTo)
      );
    }

    return result;
  }, [allOrders, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / size);
  const paginatedOrders = useMemo(() => {
    const start = page * size;
    const end = start + size;
    return filteredOrders.slice(start, end);
  }, [filteredOrders, page, size]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      status: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
      COMFIRMED: { label: "Hoàn thành", color: "bg-green-100 text-green-800 border-green-300" },
      REJECTED: { label: "Đã hủy", color: "bg-red-100 text-red-800 border-red-300" },
    };

    const config = statusConfig[status] || { label: status, color: "bg-gray-100 text-gray-800 border-gray-300" };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
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

  const handleViewDetail = (orderId) => {
    navigate(`/admin/order/${orderId}`);
  };

  if (loading) {
    return (
      <AdminLayout title={"Danh sách đơn hàng"}>
        <div className="min-h-screen bg-gradient-ocean-light">
          <div className="container mx-auto px-4 pt-24 flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-lg">Đang tải danh sách đơn hàng...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={"Danh sách đơn hàng"}>
      <div className="min-h-screen bg-gradient-ocean-light">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-primary mb-2">
              Quản Lý Đơn Hàng
            </h1>
            <p className="text-muted-foreground">
              Danh sách các đơn hàng dịch vụ hoa tiêu
            </p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Ship className="w-6 h-6" />
                    Danh Sách Đơn Hàng Hoa Tiêu
                  </CardTitle>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Filters Section */}
              <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <Filter className="w-5 h-5" />
                  <span>Bộ lọc</span>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  {/* Search All */}
                  <div className="space-y-2 md:col-span-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="searchTerm"
                        placeholder="Tìm theo tên tàu, đại lý, số điện thoại, mã đơn..."
                        value={filters.searchTerm}
                        onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                        className="pl-10 bg-white"
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="status">Trạng thái</Label>
                    <select
                      id="status"
                      className="w-full px-3 py-2 border rounded-md bg-white"
                      value={filters.status}
                      onChange={(e) => handleFilterChange("status", e.target.value)}
                    >
                      <option value="">Tất cả trạng thái</option>
                      <option value="PENDING">Chờ xử lý</option>
                      <option value="CONFIRMED">Đã xác nhận</option>
                      <option value="REJECTED">Đã hủy</option>
                    </select>
                  </div>

                  {/* Date From */}
                  <div className="space-y-2">
                    <Label htmlFor="dateFrom">Từ ngày</Label>
                    <Input
                      id="dateFrom"
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                      className="bg-white"
                    />
                  </div>

                  {/* Date To */}
                  <div className="space-y-2">
                    <Label htmlFor="dateTo">Đến ngày</Label>
                    <Input
                      id="dateTo"
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Xóa bộ lọc
                  </Button>
                </div>
              </div>

              {/* Orders Table */}
              <div className="rounded-md border divide-y divide-gray-200">
                <Table className="border-collapse">
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="border">STT</TableHead>
                      <TableHead className="border">Mã đơn</TableHead>
                      <TableHead className="border">Tên tàu</TableHead>
                      <TableHead className="border">Đại lý</TableHead>
                      <TableHead className="border">Số điện thoại</TableHead>
                      <TableHead className="border">Lịch trình VÀO</TableHead>
                      <TableHead className="border">Lịch trình RỜI</TableHead>
                      <TableHead className="border">Trạng thái</TableHead>
                      <TableHead className="border text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-6">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : paginatedOrders.length > 0 ? (
                      paginatedOrders.map((order, i) => (
                        <TableRow key={order.orderId || order.id} className="hover:bg-gray-50">
                          <TableCell className="border">
                            {page * size + i + 1}
                          </TableCell>
                          <TableCell className="border font-medium">
                            #{order.orderId || order.id}
                          </TableCell>
                          <TableCell className="border">
                            <div className="font-medium">{order.shipName || "N/A"}</div>
                            <div className="text-xs text-gray-500">{order.shipType || ""}</div>
                          </TableCell>
                          <TableCell className="border">
                            {order.agentName || "N/A"}
                          </TableCell>
                          <TableCell className="border">
                            {order.agentPhone || "N/A"}
                          </TableCell>
                          <TableCell className="border">
                            <div className="flex items-start gap-1">
                              <Calendar className="w-3 h-3 mt-0.5 text-gray-400" />
                              <div>
                                <div className="text-xs font-medium">{formatDateTime(order.arrivalDate)}</div>
                                <div className="text-xs text-gray-500">
                                  {order.arrivalFrom} → {order.arrivalTo}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="border">
                            <div className="flex items-start gap-1">
                              <Calendar className="w-3 h-3 mt-0.5 text-gray-400" />
                              <div>
                                <div className="text-xs font-medium">{formatDateTime(order.departureDate)}</div>
                                <div className="text-xs text-gray-500">
                                  {order.portDeparture} → {order.portArrival}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="border">
                            {getStatusBadge(order.status)}
                          </TableCell>
                          <TableCell className="border text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDetail(order.id)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Xem
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-6">
                          <Ship className="w-16 h-16 mx-auto mb-4 opacity-50 text-gray-400" />
                          <p className="text-lg font-medium text-gray-500">
                            {filters.searchTerm || filters.status || filters.dateFrom || filters.dateTo
                              ? "Không tìm thấy đơn hàng nào"
                              : "Chưa có đơn hàng nào"}
                          </p>
                          <p className="text-sm mt-2 text-gray-400">
                            Thử thay đổi bộ lọc hoặc tạo đơn hàng mới
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {paginatedOrders.length > 0 && (
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-muted-foreground">
                    Hiển thị {page * size + 1} - {Math.min((page + 1) * size, filteredOrders.length)} của {filteredOrders.length}
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      disabled={page === 0}
                      onClick={() => setPage(page - 1)}
                    >
                      Trước
                    </Button>
                    <span className="text-sm">
                      Trang {page + 1} / {totalPages || 1}
                    </span>
                    <Button
                      variant="outline"
                      disabled={page + 1 >= totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderList;