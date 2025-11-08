import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import pilotImage from "@/assets/pilot-1.jpg";
import Footer from "@/components/Footer";
import userService from "@/services/api/pilot";
import { Button } from "@/components/ui/button";

const Pilots = () => {
  const [pilots, setPilots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [size] = useState(9); // số phần tử mỗi trang

  // 🔹 Gọi API từ BE (có tìm kiếm + phân trang)
  const fetchPilots = async () => {
    setLoading(true);
    try {
      const res = await userService.getAllUsers({
        page,
        limit: size,
        keyword: searchTerm || "",
        status: true,
        role: "",
        sort: "DESC",
        sortBy: "rank"
      });

      setPilots(res.content || []);
      setTotalPages(res.totalPages || 1);
    } catch (error) {
      console.error("❌ Error loading pilots:", error);
      setPilots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPilots();
  }, [page, searchTerm]);

  // 🔍 Gọi BE khi user ngừng gõ 0.5s
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(0);
      fetchPilots();
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16 sm:mt-[80px] pb-16">
        {/* Header */}
        <section className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-16">
          <div className="max-w-7xl mx-auto px-8 text-center">
            <h1 className="text-5xl font-bold mb-4">Đội Ngũ Hoa Tiêu</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Đội ngũ hoa tiêu chuyên nghiệp, giàu kinh nghiệm với chứng chỉ quốc tế
            </p>
          </div>
        </section>

        {/* Search */}
        <section className="max-w-7xl mx-auto px-8 py-8">
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc cấp bậc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </section>

        {/* Pilots Grid */}
        <section className="max-w-7xl mx-auto px-8 pb-16">
          {loading ? (
            <div className="text-center py-16 text-muted-foreground">
              Đang tải danh sách hoa tiêu...
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pilots.map((pilot) => (
                  <Card
                    key={pilot.id}
                    className="hover:shadow-lg transition-shadow text-center"
                  >
                    <CardHeader>
                      <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary">
                        <img
                          src={userService.getFileUrl(pilot.keyAvatar) || pilotImage }
                          alt={pilot.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = pilotImage; // Fallback nếu ảnh lỗi
                          }}
                        />
                      </div>
                      <CardTitle className="text-2xl text-primary">
                        {pilot.name}
                      </CardTitle>
                      {pilot.rank && (
                        <div className="mt-2">
                          <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                            {pilot.rank}
                          </span>
                        </div>
                      )}
                    </CardHeader>
                  </Card>
                ))}
              </div>

              {pilots.length === 0 && !loading && (
                <div className="text-center py-16 text-muted-foreground">
                  {searchTerm
                    ? `Không tìm thấy hoa tiêu phù hợp với "${searchTerm}"`
                    : "Chưa có hoa tiêu nào trong hệ thống"}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-10">
                  <Button
                    variant="outline"
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Trước
                  </Button>
                  <span>
                    Trang {page + 1}/{totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Sau
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Pilots;
