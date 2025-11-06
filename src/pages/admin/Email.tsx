import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { emailService } from "@/services/api/email";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import AdminLayout from "./component/AdminLayout";

const EmailConfig = () => {
  const { toast } = useToast();
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isWarningOpen, setIsWarningOpen] = useState(false);

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [formEmail, setFormEmail] = useState({ name: "", email: "" });

  // Fetch email list
  const fetchEmailConfig = async () => {
    try {
      setLoading(true);
      const data = await emailService.getEmail();
      setEmails(data?.data || []);
    } catch (error) {
      toast({
        title: "Lỗi tải danh sách email",
        description: "Không thể tải cấu hình email hiện tại.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle create new
  const handleCreate = async () => {
    try {
      if (!formEmail.email || !formEmail.name) {
        toast({
          title: "Thiếu thông tin",
          description: "Vui lòng nhập đầy đủ tên và email.",
          variant: "destructive",
        });
        return;
      }

      setCreating(true);
      await emailService.updateEmail({
        ...formEmail,
        type: "TO",
      });

      toast({
        title: "Thành công",
        description: "Đã thêm email nhận thông tin đơn hàng.",
      });

      setFormEmail({ name: "", email: "" });
      setIsCreateOpen(false);
      fetchEmailConfig();
    } catch (error) {
      toast({
        title: "Thêm thất bại",
        description: "Vui lòng kiểm tra lại thông tin.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  // Handle edit email
  const handleEdit = async () => {
    try {
      if (!formEmail.email || !formEmail.name) {
        toast({
          title: "Thiếu thông tin",
          description: "Vui lòng nhập đầy đủ tên và email.",
          variant: "destructive",
        });
        return;
      }

      setEditing(true);
      await emailService.updateEmail({
        id: selectedEmail.id,
        ...formEmail,
        type: selectedEmail.type,
      });

      toast({
        title: "Cập nhật thành công",
        description: "Email đã được chỉnh sửa.",
      });

      setIsEditOpen(false);
      fetchEmailConfig();
    } catch (error) {
      toast({
        title: "Cập nhật thất bại",
        description: "Không thể cập nhật email này.",
        variant: "destructive",
      });
    } finally {
      setEditing(false);
    }
  };

  // Handle delete email
  const handleDelete = async (item) => {
    if (item.type === "SEND") {
      setIsWarningOpen(true);
      return;
    }

    if (!confirm(`Bạn có chắc muốn xóa email "${item.email}"?`)) return;

    try {
      await emailService.deleteEmail(item.id);
      toast({
        title: "Xóa thành công",
        description: `Đã xóa email ${item.email}.`,
      });
      fetchEmailConfig();
    } catch (error) {
      toast({
        title: "Xóa thất bại",
        description: "Không thể xóa email này.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchEmailConfig();
  }, []);

  return (
    <AdminLayout title={"Cài đặt Email"}>
      <div className="min-h-screen bg-gradient-ocean-light">
        <main className="py-8">
          <section className="max-w-4xl mx-auto px-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-primary mb-2">
                Danh sách Email cấu hình
              </h1>

              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button>Thêm email nhận đơn hàng</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Thêm Email mới</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div>
                      <Label>Tên</Label>
                      <Input
                        value={formEmail.name}
                        onChange={(e) =>
                          setFormEmail({ ...formEmail, name: e.target.value })
                        }
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        value={formEmail.email}
                        onChange={(e) =>
                          setFormEmail({ ...formEmail, email: e.target.value })
                        }
                        placeholder="example@gmail.com"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreate} disabled={creating}>
                      {creating ? "Đang tạo..." : "Tạo mới"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Cấu hình Email</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center text-muted-foreground">
                    Đang tải danh sách...
                  </p>
                ) : (
                  <table className="w-full border border-gray-200 rounded-md">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-3 py-2 text-left">Tên</th>
                        <th className="border px-3 py-2 text-left">Email</th>
                        <th className="border px-3 py-2 text-center">
                          Trạng thái
                        </th>
                        <th className="border px-3 py-2 text-center">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emails.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="border px-3 py-2">{item.name}</td>
                          <td className="border px-3 py-2">{item.email}</td>
                          <td className="border px-3 py-2 text-center">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                item.type === "SEND"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-green-100 text-green-600"
                              }`}
                            >
                              {item.type}
                            </span>
                          </td>
                          <td className="border px-3 py-2 text-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                if (item.type === "SEND") {
                                  setIsWarningOpen(true);
                                  return;
                                }
                                setSelectedEmail(item);
                                setFormEmail({
                                  name: item.name,
                                  email: item.email,
                                });
                                setIsEditOpen(true);
                              }}
                            >
                              Sửa
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(item)}
                            >
                              Xóa
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          </section>
        </main>
      </div>

      {/* Modal chỉnh sửa */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Tên</Label>
              <Input
                value={formEmail.name}
                onChange={(e) =>
                  setFormEmail({ ...formEmail, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                value={formEmail.email}
                onChange={(e) =>
                  setFormEmail({ ...formEmail, email: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEdit} disabled={editing}>
              {editing ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal cảnh báo không cho sửa/xóa mail SEND */}
      <Dialog open={isWarningOpen} onOpenChange={setIsWarningOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Không thể thao tác</DialogTitle>
          </DialogHeader>
          <p>
            Đây là mail đăng ký dịch vụ gửi mail, vui lòng không xóa hoặc sửa.
          </p>
          <DialogFooter>
            <Button onClick={() => setIsWarningOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default EmailConfig;
