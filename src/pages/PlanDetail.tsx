import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { pilotPlanService } from "@/services/api/dailyPilot";
import { useToast } from "@/hooks/use-toast";

function formatVietnameseDate(isoDate) {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-");
  if (!y || !m || !d) return isoDate;
  const monthNumber = parseInt(m, 10);
  const monthNames = [
    "tháng 1", "tháng 2", "tháng 3", "tháng 4", "tháng 5", "tháng 6",
    "tháng 7", "tháng 8", "tháng 9", "tháng 10", "tháng 11", "tháng 12",
  ];
  return `Ngày ${parseInt(d, 10)} ${monthNames[monthNumber - 1]} năm ${y}`;
}

const PlanDetail = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [planData, setPlanData] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(false);

  // Fetch thông tin kế hoạch
  const fetchPlanData = async () => {
    if (!planId) return;

    setLoading(true);
    try {
      const data = await pilotPlanService.getPlanById(planId);
      setPlanData(data.data.content);
    } catch (error) {
      console.error(error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin kế hoạch",
        variant: "destructive",
      });
      navigate("/news");
    } finally {
      setLoading(false);
    }
  };

  // Fetch danh sách phân công
  const fetchAssignments = async () => {
    if (!planId) return;

    setLoadingAssignments(true);
    try {
      const res = await pilotPlanService.getPlanById(planId);
      setAssignments(res.data.dataTable || []);
    } catch {
      toast({
        title: "Lỗi tải phân công",
        description: "Không thể tải danh sách phân công",
        variant: "destructive",
      });
      setAssignments([]);
    } finally {
      setLoadingAssignments(false);
    }
  };

  useEffect(() => {
    fetchPlanData();
    fetchAssignments();
  }, [planId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 sm:mt-[80px] flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Đang tải thông tin kế hoạch...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16 sm:mt-[120px] pb-16">
        <div className="mx-auto px-4 sm:px-8 max-w-7xl">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/news")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>

          <h1 className="text-xl sm:text-3xl font-bold text-primary mb-4 sm:mb-6">
            Chi tiết kế hoạch điều động
          </h1>

          {/* PREVIEW TABLE */}
          <div className="border-[2px] sm:border-[4px] border-white overflow-hidden" style={{ boxShadow: "0 0 0 1px #003399 inset" }}>
            <div className="bg-[#003399] text-white">
              <div className="border-b-[2px] sm:border-b-[3px] border-white px-3 sm:px-4 py-2 sm:py-3 text-center">
                <p className="font-bold uppercase text-xs sm:text-sm">
                  KẾ HOẠCH CUNG ỨNG DỊCH VỤ HOA TIÊU HÀNG HẢI HÀNG NGÀY
                </p>
              </div>

              <div className="border-b-[2px] sm:border-b-[3px] border-white px-3 sm:px-4 py-3 sm:py-4 text-center text-xs">
                <p className="text-base sm:text-lg">{formatVietnameseDate(planData?.planDate)}</p>
              </div>

              <div className="border-b-[2px] sm:border-b-[3px] border-white px-3 sm:px-4 py-3 sm:py-4 text-center text-sm sm:text-base font-medium">
                TRỰC BAN: {planData?.dutyPhone || ""}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 border-b-[2px] sm:border-b-[3px] border-white/80">
                <div className="px-4 sm:px-6 py-2 sm:py-3 border-b-[2px] sm:border-b-0 sm:border-r-[3px] border-white/80 flex flex-row items-center justify-center gap-2">
                  <span className="font-extrabold text-sm sm:text-lg">TRỰC BAN ĐHSX:</span>
                  <span className="font-extrabold text-sm sm:text-lg">{planData?.operationsOfficer || ""}</span>
                </div>
                <div className="px-4 sm:px-6 py-2 sm:py-3 flex flex-row items-center justify-center gap-2">
                  <span className="font-extrabold text-sm sm:text-lg">TRỰC BAN HOA TIÊU:</span>
                  <span className="font-extrabold text-sm sm:text-lg">{planData?.pilotOfficer || ""}</span>
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="bg-[#003399] text-white p-1 sm:p-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[9px] sm:text-sm" style={{ borderSpacing: 0 }}>
                  <thead>
                    <tr>
                      {[
                        "TT", "POB", "Hoa tiêu", "Tập sự", "Tên tàu",
                        "Mớn", "LOA", "GT", "Từ-Đến", "Tàu lai",
                        "PT", "Đại lý",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-center text-white px-0.5 sm:px-3 py-1 sm:py-2 border-[1px] sm:border-[3px] border-white"
                          style={{ background: "#003399" }}
                        >
                          <span className="font-semibold">{h}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {loadingAssignments ? (
                      <tr>
                        <td colSpan={12} className="text-center py-4 sm:py-6 border-[1px] sm:border-[3px] border-white text-white/80">
                          Đang tải...
                        </td>
                      </tr>
                    ) : assignments.length > 0 ? (
                      assignments.map((a, i) => (
                        <tr key={a.id}>
                          <td className="text-center border-[1px] sm:border-[3px] border-white px-0.5 sm:px-2 py-0.5 sm:py-2">{i + 1}</td>
                          <td className="text-center border-[1px] sm:border-[3px] border-white px-0.5 sm:px-2 py-0.5 sm:py-2">{a.pob || "-"}</td>
                          <td className="text-center border-[1px] sm:border-[3px] border-white px-0.5 sm:px-2 py-0.5 sm:py-2">{a.pilotName || "-"}</td>
                          <td className="text-center border-[1px] sm:border-[3px] border-white px-0.5 sm:px-2 py-0.5 sm:py-2">{a.traineeName || "-"}</td>
                          <td className="text-center border-[1px] sm:border-[3px] border-white px-0.5 sm:px-2 py-0.5 sm:py-2">{a.shipName || "-"}</td>
                          <td className="text-center border-[1px] sm:border-[3px] border-white px-0.5 sm:px-2 py-0.5 sm:py-2">{a.draft || "-"}</td>
                          <td className="text-center border-[1px] sm:border-[3px] border-white px-0.5 sm:px-2 py-0.5 sm:py-2">{a.loa || "-"}</td>
                          <td className="text-center border-[1px] sm:border-[3px] border-white px-0.5 sm:px-2 py-0.5 sm:py-2">{a.gt || "-"}</td>
                          <td className="text-center border-[1px] sm:border-[3px] border-white px-0.5 sm:px-2 py-0.5 sm:py-2">{a.fromTo || "-"}</td>
                          <td className="text-center border-[1px] sm:border-[3px] border-white px-0.5 sm:px-2 py-0.5 sm:py-2">{a.tugBoat || "-"}</td>
                          <td className="text-center border-[1px] sm:border-[3px] border-white px-0.5 sm:px-2 py-0.5 sm:py-2">{a.transportMethod || "-"}</td>
                          <td className="text-center border-[1px] sm:border-[3px] border-white px-0.5 sm:px-2 py-0.5 sm:py-2">{a.agentName || "-"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={12} className="text-center py-6 sm:py-8 border-[1px] sm:border-[3px] border-white text-white/80">
                          Chưa có phân công nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TRANSPORTATION INFO */}
            <div className="bg-[#003399] text-white border-t-[2px] sm:border-t-[3px] border-white/80 px-4 sm:px-6 py-2 sm:py-3 text-left">
              <p className="font-semibold text-xs sm:text-base">Thông tin phương tiện:</p>
              <p className="mt-1 text-xs sm:text-base">{planData?.transportationInfo || "Không có thông tin"}</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PlanDetail;