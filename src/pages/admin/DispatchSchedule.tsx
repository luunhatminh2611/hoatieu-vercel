import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, RefreshCw, Search, Edit, Trash2, Calendar } from "lucide-react";
import { pilotPlanService } from "@/services/api/dailyPilot";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "./component/AdminLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PilotPlan {
  id: string;
  planDate: string;
  operationsOfficer: string;
  pilotOfficer: string;
  dutyPhone: string;
  transportationInfo: string;
  honNetPositionPlan: string;
  status: string;
}

const PilotPlans = () => {
  const [allPlans, setAllPlans] = useState<PilotPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<PilotPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchPlans = async () => {
    setLoading(true);
    const params = {
        page: 0,
        limit: 10,
        sort: "desc",
      };
    try {
      const data = await pilotPlanService.getAllPlans(params);
      setAllPlans(data.content || []);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách kế hoạch",
        variant: "destructive",
      });
      setAllPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // 🔎 Lọc theo keyword + ngày
  const filteredPlans = useMemo(() => {
    let result = [...allPlans];

    // Lọc theo keyword
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (plan) =>
          plan.operationsOfficer?.toLowerCase().includes(query) ||
          plan.pilotOfficer?.toLowerCase().includes(query) ||
          plan.transportationInfo?.toLowerCase().includes(query) ||
          plan.dutyPhone?.toLowerCase().includes(query)
      );
    }

    // Lọc theo ngày (YYYY-MM-DD)
    if (selectedDate) {
      result = result.filter((plan) => plan.planDate?.startsWith(selectedDate));
    }

    return result;
  }, [allPlans, searchQuery, selectedDate]);

  const totalPages = Math.ceil(filteredPlans.length / size);
  const paginatedPlans = useMemo(() => {
    const start = page * size;
    return filteredPlans.slice(start, start + size);
  }, [filteredPlans, page, size]);

  useEffect(() => {
    setPage(0);
  }, [searchQuery, selectedDate]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
    > = {
      PENDING: { label: "Chờ duyệt", variant: "outline" },
      UP: { label: "Đã duyệt", variant: "default" },
    };
    const s = statusMap[status] || { label: status, variant: "outline" };
    return <Badge variant={s.variant}>{s.label}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-ocean-light">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">
              Quản Lý Kế Hoạch Điều Động
            </h1>
            <p className="text-muted-foreground">
              Danh sách các kế hoạch điều động hoa tiêu
            </p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <CardTitle className="text-xl">Danh Sách Kế Hoạch</CardTitle>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchPlans}
                    disabled={loading}
                    className="flex-1 sm:flex-none"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    <span className="ml-2 sm:hidden">Làm mới</span>
                  </Button>
                  <Button 
                    onClick={() => navigate("/admin/pilot-plans/create")}
                    className="flex-1 sm:flex-none"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Tạo kế hoạch</span>
                    <span className="sm:hidden">Tạo</span>
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Bộ lọc tìm kiếm & ngày */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                {/* Ô tìm kiếm */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Ô chọn ngày */}
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="pl-10 w-full sm:w-[200px]"
                  />
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block rounded-md border divide-y divide-gray-200">
                <Table className="border-collapse">
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="border">STT</TableHead>
                      <TableHead className="border">Ngày kế hoạch</TableHead>
                      <TableHead className="border">Trực ban ĐHSX</TableHead>
                      <TableHead className="border">Trực ban hoa tiêu</TableHead>
                      <TableHead className="border">Điện thoại trực</TableHead>
                      <TableHead className="border">Thông tin phương tiện</TableHead>
                      <TableHead className="border text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          Đang tải...
                        </TableCell>
                      </TableRow>
                    ) : paginatedPlans.length > 0 ? (
                      paginatedPlans.map((plan, i) => (
                        <TableRow key={plan.id} className="hover:bg-gray-50">
                          <TableCell className="border">{page * size + i + 1}</TableCell>
                          <TableCell className="border font-medium">{plan.planDate}</TableCell>
                          <TableCell className="border">{plan.operationsOfficer}</TableCell>
                          <TableCell className="border">{plan.pilotOfficer}</TableCell>
                          <TableCell className="border">{plan.dutyPhone}</TableCell>
                          <TableCell className="border max-w-xs truncate">
                            {plan.transportationInfo}
                          </TableCell>
                          <TableCell className="border text-right space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/admin/pilot-plans/${plan.id}`)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive border-destructive"
                              onClick={() => setSelectedPlan(plan)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          {searchQuery || selectedDate
                            ? `Không tìm thấy kết quả phù hợp`
                            : "Không có kế hoạch nào"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-3">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Đang tải...
                  </div>
                ) : paginatedPlans.length > 0 ? (
                  paginatedPlans.map((plan, i) => (
                    <Card key={plan.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="space-y-1">
                            <div className="text-sm font-semibold text-primary">
                              #{page * size + i + 1}
                            </div>
                            <div className="text-sm font-medium">
                              {plan.planDate}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm mb-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Trực ban ĐHSX:</span>
                            <span className="font-medium">{plan.operationsOfficer}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Trực ban hoa tiêu:</span>
                            <span className="font-medium">{plan.pilotOfficer}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Điện thoại:</span>
                            <span className="font-medium">{plan.dutyPhone}</span>
                          </div>
                          <div className="pt-2 border-t">
                            <div className="text-muted-foreground text-xs mb-1">Phương tiện:</div>
                            <div className="text-xs line-clamp-2">{plan.transportationInfo}</div>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-3 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => navigate(`/admin/pilot-plans/${plan.id}`)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Sửa
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-destructive border-destructive"
                            onClick={() => setSelectedPlan(plan)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Xóa
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchQuery || selectedDate
                      ? `Không tìm thấy kết quả phù hợp`
                      : "Không có kế hoạch nào"}
                  </div>
                )}
              </div>

              {/* Phân trang */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
                <div className="text-sm text-muted-foreground order-2 sm:order-1">
                  Hiển thị {page * size + 1} -{" "}
                  {Math.min((page + 1) * size, filteredPlans.length)} của{" "}
                  {filteredPlans.length}
                </div>
                <div className="flex items-center gap-2 sm:gap-4 order-1 sm:order-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                  >
                    Trước
                  </Button>
                  <span className="text-sm whitespace-nowrap">
                    Trang {page + 1} / {totalPages || 1}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <AlertDialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
            <AlertDialogContent className="max-w-[95vw] sm:max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận xóa kế hoạch</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn xóa kế hoạch ngày{" "}
                  <strong>{selectedPlan?.planDate}</strong> không?
                  Hành động này không thể hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                <AlertDialogCancel onClick={() => setSelectedPlan(null)} className="w-full sm:w-auto">
                  Hủy
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/90 w-full sm:w-auto"
                  onClick={async () => {
                    if (!selectedPlan) return;
                    try {
                      await pilotPlanService.deletePlan(selectedPlan.id);
                      toast({
                        title: "Thành công",
                        description: "Đã xóa kế hoạch",
                      });
                      fetchPlans();
                    } catch {
                      toast({
                        title: "Lỗi",
                        description: "Không thể xóa kế hoạch",
                        variant: "destructive",
                      });
                    } finally {
                      setSelectedPlan(null);
                    }
                  }}
                >
                  Xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PilotPlans;
