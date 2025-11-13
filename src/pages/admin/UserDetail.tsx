import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import userService from "@/services/api/pilot";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import AdminLayout from "./component/AdminLayout";
import { User, Mail, Phone, Shield, Calendar, Key, Edit, Award, Camera, CircleFadingArrowUp  } from "lucide-react";
import { authService } from "@/services/api";

const UserProfile = () => {
  const { toast } = useToast();
  const [usersDetail, setUsersDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    avatarFile: null,
  });

  const [avatarPreview, setAvatarPreview] = useState(null);

  // Fetch user detail
  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const data = await userService.getUserDetail();
      setUsersDetail(data?.data);
      setEditForm({
        name: data?.data?.name || "",
        email: data?.data?.email || "",
        phone: data?.data?.phone || "",
        avatarFile: null,
      });
    } catch (error) {
      toast({
        title: "Lỗi tải thông tin",
        description: "Không thể tải thông tin người dùng.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  useEffect(() => {
    fetchUserDetail();
  }, []);

  const defaultAvatar = "https://ui-avatars.com/api/?name=" + encodeURIComponent(usersDetail?.name || "User") + "&background=0D8ABC&color=fff&size=200";

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-ocean-light">
        <main className="py-8">
          <section className="max-w-4xl mx-auto px-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-primary mb-2">
                Thông tin cá nhân
              </h1>

              <div className="flex gap-2">
                <Button onClick={() => setIsChangePasswordOpen(true)}>
                  <Key className="w-4 h-4 mr-2" />
                  Đổi mật khẩu
                </Button>
              </div>
            </div>

            {loading ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">
                    Đang tải thông tin...
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Card Avatar và thông tin chính */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                      <div className="relative">
                        <img
                          src={usersDetail?.avatarUrl || defaultAvatar}
                          alt="Avatar"
                          className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                        />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-primary mb-2">
                          {usersDetail?.name || "Người dùng"}
                        </h2>
                        <p className="text-muted-foreground mb-3">
                          @{usersDetail?.username || "N/A"}
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            usersDetail?.role === "ADMIN"
                              ? "bg-blue-100 text-blue-600"
                              : usersDetail?.role === "PILOT"
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            {usersDetail?.role || "N/A"}
                          </span>
                          {usersDetail?.rank && (
                            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-600">
                              Hạng: {usersDetail.rank}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Card thông tin cơ bản */}
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin liên hệ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <Mail className="w-5 h-5 text-primary" />
                        <div>
                          <Label className="text-sm text-gray-500">Email</Label>
                          <p className="font-semibold">{usersDetail?.email || "Chưa cập nhật"}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <Phone className="w-5 h-5 text-primary" />
                        <div>
                          <Label className="text-sm text-gray-500">Số điện thoại</Label>
                          <p className="font-semibold">{usersDetail?.phone || "Chưa cập nhật"}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Card thông tin tài khoản */}
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin tài khoản</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <CircleFadingArrowUp className="w-5 h-5 text-primary" />
                        <div>
                          <Label className="text-sm text-gray-500">Bậc hiện tại</Label>
                          <p className="font-semibold">{usersDetail?.rank || "N/A"}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-primary" />
                        <div>
                          <Label className="text-sm text-gray-500">Ngày tạo</Label>
                          <p className="font-semibold">
                            {usersDetail?.createdAt
                              ? new Date(usersDetail.createdAt).toLocaleDateString("vi-VN")
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Modal đổi mật khẩu */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đổi mật khẩu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Mật khẩu hiện tại</Label>
              <Input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>
            <div>
              <Label>Mật khẩu mới</Label>
              <Input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
              />
            </div>
            <div>
              <Label>Xác nhận mật khẩu mới</Label>
              <Input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>
          </div>
          <DialogFooter>
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
            >
              Hủy
            </Button>
            <Button onClick={handleChangePassword} disabled={changingPassword}>
              {changingPassword ? "Đang xử lý..." : "Đổi mật khẩu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default UserProfile;