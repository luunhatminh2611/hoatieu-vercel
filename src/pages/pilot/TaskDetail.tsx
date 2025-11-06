import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import pilotPlanService from "@/services/api/dailyPilot";

const TaskDetail = () => {
  const { taskId } = useParams();
  const { toast } = useToast();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // --- Lấy chi tiết nhiệm vụ ---
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await pilotPlanService.getAssignmentDetail(taskId);
        setTask(res?.data || null);
      } catch (error) {
        console.error("Lỗi khi tải nhiệm vụ:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin nhiệm vụ",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId, toast]);

  // --- Xử lý xác nhận / từ chối ---
  const handleConfirm = async (action) => {
    if (!task?.history) {
      toast({
        title: "Thiếu thông tin",
        description: "Không xác định được loại nhiệm vụ (PILOT hoặc TRAINEE)",
        variant: "destructive",
      });
      return;
    }

    const type = task.history; // "PILOT" hoặc "TRAINEE"
    const status = action === "accept" ? "CONFIRMED" : "REJECTED";

    try {
      setProcessing(true);
      await pilotPlanService.assignTask({
        id: task.id,
        status,
        type,
      });

      toast({
        title: "Thành công",
        description:
          action === "accept"
            ? "Bạn đã xác nhận nhận nhiệm vụ"
            : "Bạn đã từ chối nhiệm vụ",
      });

      // ✅ Cập nhật lại ngay UI mà không cần fetch lại
      if (type === "PILOT") {
        setTask((prev) => ({ ...prev, statusPilot: status }));
      } else {
        setTask((prev) => ({ ...prev, statusTrainee: status }));
      }
    } catch (error) {
      console.error("Lỗi khi xử lý nhiệm vụ:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xử lý yêu cầu",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  // --- Loading / Not found ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-ocean-light flex items-center justify-center">
        <Navbar />
        <p className="text-muted-foreground">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-ocean-light flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Không tìm thấy nhiệm vụ</p>
            <Link to="/pilot/dashboard">
              <Button>Quay lại danh sách</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- Map màu trạng thái ---
  const statusColor = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  // --- Xác định trạng thái hiển thị theo vai trò ---
  const currentRole = task.history; // PILOT hoặc TRAINEE
  const currentStatus =
    currentRole === "PILOT" ? task.statusPilot : task.statusTrainee;

  return (
    <div className="min-h-screen bg-gradient-ocean-light">
      <Navbar />

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl pt-24 sm:mt-[152px]">
        <Link to="/pilot/dashboard">
          <Button variant="outline" size="sm" className="mb-4 md:mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </Link>

        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-xl md:text-2xl mb-2">
                {task.shipName || "Chưa có tên tàu"}
              </CardTitle>
              {currentStatus !== "PENDING" && (
                <Badge
                  className={`${statusColor[currentStatus] || "bg-gray-100 text-gray-800"
                    } text-xs`}
                >
                  {currentStatus || "Không xác định"}
                </Badge>
              )}
            </div>

            {/* ✅ Hiển thị nút hoặc badge tùy trạng thái */}
            {currentStatus === "PENDING" ? (
              <div className="flex gap-2 mt-3 md:mt-0">
                <Button
                  onClick={() => handleConfirm("accept")}
                  disabled={processing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {processing ? "Đang xử lý..." : "Xác nhận"}
                </Button>
                <Button
                  onClick={() => handleConfirm("reject")}
                  disabled={processing}
                  variant="destructive"
                >
                  {processing ? "Đang xử lý..." : "Từ chối"}
                </Button>
              </div>
            ) : null}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Thông tin tàu */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Thông tin tàu</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Tên tàu:</span>
                  <p className="font-medium">{task.shipName || "--"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Chiều dài (LOA):</span>
                  <p className="font-medium">{task.loa || "--"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Mớn nước (Draft):</span>
                  <p className="font-medium">{task.draft || "--"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Trọng tải (GT):</span>
                  <p className="font-medium">{task.gt || "--"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">P.O.B:</span>
                  <p className="font-medium">{task.pob || "--"}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Thông tin điều động */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Thông tin điều động</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Ngày:</span>
                  <p className="font-medium">{task.date || "--"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tuyến:</span>
                  <p className="font-medium">{task.fromTo || "--"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Hoa tiêu:</span>
                  <p className="font-medium">{task.pilotName || "--"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Học viên:</span>
                  <p className="font-medium">{task.traineeName || "--"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tàu lai dắt:</span>
                  <p className="font-medium">{task.tugBoat || "--"}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Thông tin dịch vụ */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Thông tin dịch vụ</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Đại lý:</span>
                  <p className="font-medium">{task.agentName || "--"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Phương thức vận chuyển:</span>
                  <p className="font-medium">{task.transportMethod || "--"}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-muted-foreground">Ghi chú:</span>
                  <p className="font-medium">{task.note || "--"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskDetail;
