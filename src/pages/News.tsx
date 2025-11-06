import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, ArrowLeft, ArrowRight, ArrowRightCircle } from "lucide-react";
import news1Image from "@/assets/news-1.jpg";
import news2Image from "@/assets/news-2.jpg";
import { pilotPlanService } from "@/services/api/dailyPilot";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { newsMockData } from "../lib/mockData";

const News = () => {
  const { toast } = useToast();
  const [plans, setPlans] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const limit = 5;
  const newsImages = [news1Image, news2Image];

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const params = {
        page: page - 1,
        limit,
        keyword,
        sort: "desc",
      };
      const res = await pilotPlanService.getAllPlans(params);

      if (!res?.content) throw new Error("Dữ liệu không hợp lệ");

      setPlans(res.content);
      setTotalPages(res.totalPages || 1);
    } catch (error) {
      console.error("Lỗi khi tải kế hoạch:", error);
      toast({
        title: "Lỗi tải dữ liệu",
        description: "Không thể tải danh sách kế hoạch điều động.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [page, keyword]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16 sm:mt-[100px] pb-16">
        {/* Search */}
        <section className="max-w-7xl mx-auto px-8 py-8">
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Tìm kiếm kế hoạch..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="pl-10"
            />
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-8 pb-16 grid grid-cols-1 lg:grid-cols-6 gap-8">
          {/* Left: Plan List */}
          <div className="lg:col-span-4 space-y-10">
            {loading ? (
              <div className="text-center py-20 text-muted-foreground">
                Đang tải kế hoạch...
              </div>
            ) : plans.length > 0 ? (
              plans.map((plan, index) => (
                <Card
                  key={plan.id || index}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="grid md:grid-cols-2 gap-0 h-auto">
                    <div className="h-full">
                      <img
                        src={newsImages[index % newsImages.length]}
                        alt={plan.planDate}
                        className="w-[500px] h-64 object-cover"
                      />
                    </div>
                    <CardContent className="p-8 flex flex-col justify-center">
                      <Badge className="w-fit mb-3">Kế hoạch điều động</Badge>
                      <CardTitle className="text-2xl text-primary mb-3 font-bold">
                        Kế hoạch điều động ngày {plan.planDate}
                      </CardTitle>
                      <div className="text-muted-foreground mb-4 space-y-2">
                        <p><strong>Trực ban ĐHSX:</strong> {plan.operationsOfficer || "N/A"}</p>
                        <p><strong>Trực ban hoa tiêu ban:</strong> {plan.pilotOfficer || "N/A"}</p>
                      </div>
                      <Button variant="outline" className="w-fit" onClick={() => navigate(`/plan-detail/${plan.id}`)}>
                        Xem chi tiết
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                {keyword ? "Không tìm thấy kế hoạch phù hợp." : "Chưa có kế hoạch nào."}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Trước
                </Button>
                <div className="flex items-center text-sm text-muted-foreground">
                  Trang {page} / {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Sau <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>

          {/* Right: News Sidebar */}
          <aside className="space-y-6 col-span-2">
            <h2 className="text-xl font-bold border-b pb-2 text-primary">Tin tức mới nhất</h2>
            <div className="space-y-4">
              {newsMockData.slice(0, 6).map((news, index) => (
                <div
                  key={news.id || index}
                  onClick={() => navigate(news.path)}
                  className="flex items-start gap-3 cursor-pointer group"
                >
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-20 h-16 object-cover rounded-md border"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold group-hover:text-primary transition">
                      {news.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {news.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="text-primary hover:underline text-sm"
              onClick={() => navigate("/news")}
            >
              Xem tất cả tin tức
              <ArrowRightCircle className="w-4 h-4 ml-2" />
            </Button>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default News;
