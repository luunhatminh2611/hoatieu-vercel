import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Ship, Calendar, ArrowLeft, ArrowRight, User, Mail, Phone, TrendingUp, Key } from "lucide-react";
import Navbar from "@/components/Navbar";
import pilotService from "@/services/api/dailyPilot";
import userService from "@/services/api/pilot";
import { authService } from "@/services/api";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const PilotDashboard = () => {
  const [activeTab, setActiveTab] = useState("assigned");
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // State cho date range
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [keyword, setKeyword] = useState("");

  // State cho thông tin người dùng
  const [usersDetail, setUsersDetail] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user detail
  const fetchUserDetail = async () => {
    try {
      setLoadingProfile(true);
      const data = await userService.getUserDetail();
      setUsersDetail(data?.data);
    } catch (error) {
      toast({
        title: "Lỗi tải thông tin",
        description: "Không thể tải thông tin người dùng.",
        variant: "destructive",
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  // Handle change password
  const handleChangePassword = async () => {
    try {
      if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
        toast({
          title: "Thiếu thông tin",
          description: "Vui lòng nhập đầy đủ các trường mật khẩu.",
          variant: "destructive",
        });
        return;
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        toast({
          title: "Mật khẩu không khớp",
          description: "Mật khẩu mới và xác nhận mật khẩu không giống nhau.",
          variant: "destructive",
        });
        return;
      }

      if (passwordForm.newPassword.length < 6) {
        toast({
          title: "Mật khẩu quá ngắn",
          description: "Mật khẩu mới phải có ít nhất 6 ký tự.",
          variant: "destructive",
        });
        return;
      }

      setChangingPassword(true);

      await authService.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );

      toast({
        title: "Đổi mật khẩu thành công",
        description: "Mật khẩu của bạn đã được cập nhật.",
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangePasswordOpen(false);
    } catch (error) {
      toast({
        title: "Đổi mật khẩu thất bại",
        description: error?.response?.data?.message || "Vui lòng kiểm tra lại mật khẩu hiện tại.",
        variant: "destructive",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  // Gọi API theo tab
  const fetchData = async (currentPage = page, search = keyword, start = startDate, end = endDate) => {
    setLoading(true);
    try {
      let params = {
        page: currentPage,
        limit: 10,
        keyword: search,
      };

      let params2 = {
        page: currentPage,
        limit: 10,
        keyword: search,
        startDate,
        endDate
      };

      // Nếu là tab history, thêm startDate và endDate
      if (activeTab === "history") {
        params = {
          ...params2,
        };
      }

      const res = await pilotService.getPilotHistory(params);
      setTasks(res.content || []);
      setTotalPages(res.totalPages || 1);
      setPage(currentPage);
    } catch (error) {
      console.error("❌ Lỗi tải dữ liệu:", error);
      toast({
        title: "Không thể tải nhiệm vụ",
        description: "Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    setKeyword("");
    setSearchTerm("");

    if (activeTab === "profile") {
      fetchUserDetail();
    } else {
      fetchData(0, "", startDate, endDate);
    }
  }, [activeTab]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setKeyword(value);
    setPage(0);
    fetchData(0, value, startDate, endDate);
  };

  const handleDateChange = () => {
    setPage(0);
    fetchData(0, keyword, startDate, endDate);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchData(newPage, keyword, startDate, endDate);
    }
  };

  const defaultAvatar = "https://ui-avatars.com/api/?name=" + encodeURIComponent(usersDetail?.name || "User") + "&background=0D8ABC&color=fff&size=200";

  return (
    <div className="min-h-screen bg-gradient-ocean-light">
      <Navbar />
      <div className="container mx-auto px-4 py-6 pt-24 sm:mt-[152px] md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
            Nhiệm vụ hoa tiêu
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Quản lý nhiệm vụ được giao và xem kế hoạch theo ngày
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="assigned" className="text-xs sm:text-sm">
              <Ship className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Nhiệm vụ được giao</span>
              <span className="sm:hidden">Nhiệm vụ</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs sm:text-sm">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Kế hoạch theo ngày</span>
              <span className="sm:hidden">Kế hoạch</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="text-xs sm:text-sm">
              <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Thông tin tài khoản</span>
              <span className="sm:hidden">Tài khoản</span>
            </TabsTrigger>
          </TabsList>

          {/* Thanh tìm kiếm - chỉ hiển thị khi không ở tab profile */}
          {activeTab !== "profile" && (
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-4">
              <Input
                placeholder="Tìm kiếm theo tên tàu hoặc đại lý..."
                value={searchTerm}
                onChange={handleSearch}
                className="max-w-sm"
              />

              {activeTab === "history" && (
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      const value = e.target.value;
                      setStartDate(value);
                      setEndDate(value);
                    }}
                    className="w-40"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDateChange}
                  >
                    Lọc
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Assigned tab */}
          <TabsContent value="assigned">
            <Card>
              <CardHeader className="flex items-center justify-between">
                {/* Tiêu đề + mô tả bên trái */}
                <div>
                  <CardTitle>Nhiệm vụ được giao</CardTitle>
                  <CardDescription>Danh sách các nhiệm vụ hiện tại</CardDescription>
                </div>

                {/* Nút tải lại bên phải */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPage(0);
                    fetchData(0, keyword, startDate, endDate);
                  }}
                >
                  Tải lại
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-6 text-muted-foreground">
                    Đang tải danh sách...
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    Không có nhiệm vụ nào được giao.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <Card key={task.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-4 md:pt-6">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-semibold text-base md:text-lg">
                                  {task.shipName}
                                </h3>
                                <Badge variant="warning" className="text-xs">
                                  {task.statusPilot || "Đang chờ"}
                                </Badge>
                              </div>
                              <div className="text-xs md:text-sm text-muted-foreground space-y-1">
                                <div>Đại lý: {task.agentName || "—"}</div>
                                <div>Tuyến: {task.fromTo || "—"}</div>
                                <div>Hoa tiêu: {task.pilotName || "—"}</div>
                              </div>
                            </div>
                            <Link to={`/pilot/task/${task.id}`} className="mt-3 md:mt-0">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full md:w-auto"
                              >
                                Xem chi tiết
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 sm:gap-3 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 0}
                      onClick={() => handlePageChange(page - 1)}
                    >
                      <ArrowLeft className="w-4 h-4 sm:mr-1" />
                      <span className="hidden sm:inline">Trước</span>
                    </Button>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {page + 1} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages - 1}
                      onClick={() => handlePageChange(page + 1)}
                    >
                      <span className="hidden sm:inline">Sau</span>
                      <ArrowRight className="w-4 h-4 sm:ml-1" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* History tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Kế hoạch theo ngày</CardTitle>
                <CardDescription>
                  Xem kế hoạch điều động hoa tiêu theo khoảng thời gian
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-6 text-muted-foreground">
                    Đang tải dữ liệu...
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    Không có kế hoạch nào trong khoảng thời gian này.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <Card key={task.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-4 md:pt-6">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-semibold text-base md:text-lg">
                                  {task.shipName}
                                </h3>
                                <Badge variant="default" className="text-xs">
                                  {task.statusPilot || "Đã lên kế hoạch"}
                                </Badge>
                              </div>
                              <div className="text-xs md:text-sm text-muted-foreground space-y-1">
                                <div>Đại lý: {task.agentName || "—"}</div>
                                <div>Tuyến: {task.fromTo || "—"}</div>
                                <div>Hoa tiêu: {task.pilotName || "—"}</div>
                                {task.arrivalTime && (
                                  <div>Giờ đến: {task.arrivalTime}</div>
                                )}
                              </div>
                            </div>
                            <Link to={`/pilot/task/${task.id}`} className="mt-3 md:mt-0">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full md:w-auto"
                              >
                                Chi tiết
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 sm:gap-3 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 0}
                      onClick={() => handlePageChange(page - 1)}
                    >
                      <ArrowLeft className="w-4 h-4 sm:mr-1" />
                      <span className="hidden sm:inline">Trước</span>
                    </Button>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {page + 1} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages - 1}
                      onClick={() => handlePageChange(page + 1)}
                    >
                      <span className="hidden sm:inline">Sau</span>
                      <ArrowRight className="w-4 h-4 sm:ml-1" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile tab */}
          <TabsContent value="profile">
            <div className="space-y-4 md:space-y-6">
              <div className="flex justify-end">
                <Button onClick={() => setIsChangePasswordOpen(true)} size="sm">
                  <Key className="w-4 h-4 mr-2" />
                  Đổi mật khẩu
                </Button>
              </div>

              {loadingProfile ? (
                <Card>
                  <CardContent className="py-8">
                    <p className="text-center text-muted-foreground">
                      Đang tải thông tin...
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Card Avatar và thông tin chính */}
                  <Card>
                    <CardContent className="pt-4 md:pt-6">
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
                        <div className="relative">
                          <img
                            src={usersDetail?.avatarUrl || defaultAvatar}
                            alt="Avatar"
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-primary/20"
                          />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                          <h2 className="text-xl md:text-2xl font-bold text-primary mb-2">
                            {usersDetail?.name || "Người dùng"}
                          </h2>
                          <p className="text-sm md:text-base text-muted-foreground mb-3">
                            @{usersDetail?.username || "N/A"}
                          </p>
                          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${usersDetail?.role === "ADMIN"
                                ? "bg-blue-100 text-blue-600"
                                : usersDetail?.role === "PILOT"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-gray-100 text-gray-600"
                              }`}>
                              {usersDetail?.role || "N/A"}
                            </span>
                            {usersDetail?.rank && (
                              <span className="px-3 py-1 rounded-full text-xs md:text-sm font-semibold bg-amber-100 text-amber-600">
                                Hạng: {usersDetail.rank}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card thông tin liên hệ */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg md:text-xl">Thông tin liên hệ</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 md:space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <div className="flex items-center space-x-3 p-3 md:p-4 bg-gray-50 rounded-lg">
                          <Mail className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                          <div className="min-w-0">
                            <Label className="text-xs md:text-sm text-gray-500">Email</Label>
                            <p className="font-semibold text-sm md:text-base truncate">
                              {usersDetail?.email || "Chưa cập nhật"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 md:p-4 bg-gray-50 rounded-lg">
                          <Phone className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                          <div className="min-w-0">
                            <Label className="text-xs md:text-sm text-gray-500">Số điện thoại</Label>
                            <p className="font-semibold text-sm md:text-base truncate">
                              {usersDetail?.phone || "Chưa cập nhật"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card thông tin tài khoản */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg md:text-xl">Thông tin tài khoản</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 md:space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <div className="flex items-center space-x-3 p-3 md:p-4 bg-gray-50 rounded-lg">
                          <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                          <div className="min-w-0">
                            <Label className="text-xs md:text-sm text-gray-500">Bậc hiện tại</Label>
                            <p className="font-semibold text-sm md:text-base">
                              {usersDetail?.rank || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 md:p-4 bg-gray-50 rounded-lg">
                          <Calendar className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                          <div className="min-w-0">
                            <Label className="text-xs md:text-sm text-gray-500">Ngày tạo</Label>
                            <p className="font-semibold text-sm md:text-base">
                              {usersDetail?.createdAt
                                ? new Date(usersDetail.createdAt).toLocaleDateString("vi-VN")
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal đổi mật khẩu */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">Đổi mật khẩu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm md:text-base">Mật khẩu hiện tại</Label>
              <Input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
                placeholder="Nhập mật khẩu hiện tại"
                className="text-sm md:text-base"
              />
            </div>
            <div>
              <Label className="text-sm md:text-base">Mật khẩu mới</Label>
              <Input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                className="text-sm md:text-base"
              />
            </div>
            <div>
              <Label className="text-sm md:text-base">Xác nhận mật khẩu mới</Label>
              <Input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                placeholder="Nhập lại mật khẩu mới"
                className="text-sm md:text-base"
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsChangePasswordOpen(false);
                setPasswordForm({
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
              }}
              className="w-full sm:w-auto"
            >
              Hủy
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={changingPassword}
              className="w-full sm:w-auto"
            >
              {changingPassword ? "Đang xử lý..." : "Đổi mật khẩu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PilotDashboard;