import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Anchor, Eye, EyeOff } from "lucide-react";
import authService from "@/services/api/auth";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/authSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { requestForToken } from "@/firebase"; // THÊM IMPORT

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [sendingToken, setSendingToken] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { user, token } = await authService.login(email, password);
      dispatch(setUser(user));

      localStorage.setItem("clinic_auth_token", token);
      localStorage.setItem("clinic_user_data", JSON.stringify(user));

      try {
        const firebaseToken = await requestForToken();
        
        if (firebaseToken) {
          await authService.registerNotification(firebaseToken);
          localStorage.setItem("firebase_token", firebaseToken);
          console.log("Đăng ký notification thành công");
        }
      } catch (notifError) {
        console.error("Lỗi đăng ký notification:", notifError);
      }

      if (user?.role === "ADMIN") navigate("/admin/accounts");
      else if (user?.role === "PILOT") navigate("/pilot/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Sai email hoặc mật khẩu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetToken = async () => {
    if (!forgotEmail) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập email của bạn.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSendingToken(true);
      await authService.forgotPassword(forgotEmail);
      
      toast({
        title: "Đã gửi mã xác nhận",
        description: "Vui lòng kiểm tra email để nhận token đặt lại mật khẩu.",
      });
      setForgotStep(2);
    } catch (error) {
      console.error("Forgot password error:", error);
      toast({
        title: "Lỗi",
        description: error?.response?.data?.message || "Không thể gửi mã đặt lại mật khẩu. Vui lòng kiểm tra email.",
        variant: "destructive",
      });
    } finally {
      setSendingToken(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetToken || !newPassword) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ mã xác nhận và mật khẩu mới.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Mật khẩu quá ngắn",
        description: "Mật khẩu mới phải có ít nhất 6 ký tự.",
        variant: "destructive",
      });
      return;
    }

    try {
      setResettingPassword(true);
      await authService.resetPassword({
        email: forgotEmail,
        token: resetToken,
        password: newPassword,
      });
      
      toast({
        title: "Thành công",
        description: "Mật khẩu đã được thay đổi. Vui lòng đăng nhập lại.",
      });
      
      setShowForgotModal(false);
      setForgotStep(1);
      setForgotEmail("");
      setResetToken("");
      setNewPassword("");
    } catch (error) {
      console.error("Reset password error:", error);
      toast({
        title: "Lỗi đặt lại mật khẩu",
        description: error?.response?.data?.message || "Token không hợp lệ hoặc đã hết hạn.",
        variant: "destructive",
      });
    } finally {
      setResettingPassword(false);
    }
  };

  const handleCloseModal = () => {
    setShowForgotModal(false);
    setForgotStep(1);
    setForgotEmail("");
    setResetToken("");
    setNewPassword("");
  };

  return (
    <div className="min-h-screen bg-gradient-ocean-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary mb-4">
            <Anchor className="w-10 h-10" />
            <span className="text-2xl font-bold">Dịch vụ Hoa Tiêu</span>
          </Link>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Chào mừng</CardTitle>
            <CardDescription className="text-center">
              Vui lòng đăng nhập để tiếp tục
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="login-password">Mật khẩu</Label>
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-sm text-primary hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-light"
                disabled={loading}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center mt-4 text-sm text-muted-foreground">
          <Link to="/" className="text-primary hover:underline">
            Quay lại trang chủ
          </Link>
        </p>
      </div>

      {/* Modal Quên mật khẩu */}
      <Dialog open={showForgotModal} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Quên mật khẩu</DialogTitle>
          </DialogHeader>

          {forgotStep === 1 ? (
            <div className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleSendResetToken}
                disabled={sendingToken}
              >
                {sendingToken ? "Đang gửi..." : "Gửi mã xác nhận"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>Mã xác nhận (token)</Label>
                <Input
                  placeholder="Nhập mã xác nhận từ email"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                />
              </div>
              <div>
                <Label>Mật khẩu mới</Label>
                <Input
                  type="password"
                  placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => setForgotStep(1)}
                >
                  Quay lại
                </Button>
                <Button 
                  className="w-full" 
                  onClick={handleResetPassword}
                  disabled={resettingPassword}
                >
                  {resettingPassword ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;