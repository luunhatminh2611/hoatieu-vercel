import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Ban, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import AdminLayout from "./component/AdminLayout";
import userService from "@/services/api/pilot";

const AccountManagement = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    rank: "",
    role: "",
    avatarFile: null,
    avatarUrl: "",
    keyAvatar: "",
  });

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getAllUsers({
        page,
        limit: size,
        keyword: searchQuery,
        rank: "",
        status: statusFilter === "all" ? "" : statusFilter === "active" ? true : false,
        role: "",
      });

      setUsers(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (error) {
      toast({
        title: "Lỗi tải danh sách",
        description:
          error.response?.data?.message || "Không thể tải danh sách người dùng",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, [searchQuery, statusFilter, page]);

  const handleAvatarChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (isEdit) {
        setSelectedUser({ ...selectedUser, avatarFile: file, avatarUrl: url });
      } else {
        setNewUser({ ...newUser, avatarFile: file, avatarUrl: url });
      }
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.phone || !newUser.rank) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }

    if (!/^\d{10,}$/.test(newUser.phone)) {
      toast({
        title: "Số điện thoại không hợp lệ",
        description: "Số điện thoại phải có ít nhất 10 chữ số.",
        variant: "destructive",
      });
      return;
    }


    try {
      await userService.registerUser({ ...newUser });

      toast({
        title: "Thành công",
        description: `Đã tạo ${newUser.email}`,
      });

      setShowCreateDialog(false);
      setNewUser({
        name: "",
        email: "",
        phone: "",
        rank: "",
        role: "",
        avatarFile: null,
        avatarUrl: "",
        keyAvatar: "",
      });

      fetchAllUsers(); // Reload data
    } catch (error) {
      toast({
        title: "Lỗi tạo tài khoản",
        description: error.response?.data?.message || "Không thể tạo tài khoản",
        variant: "destructive",
      });
    }
  };

  // 🔹 Cập nhật user
  const handleSaveEdit = async () => {
    if (!selectedUser.name || !selectedUser.email) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }

    try {
      await userService.updateUser({
        ...selectedUser,
      });

      toast({
        title: "Thành công",
        description: `Đã cập nhật ${selectedUser.email}`,
      });

      setShowEditDialog(false);
      fetchAllUsers(); // Reload data
    } catch (error) {
      toast({
        title: "Lỗi cập nhật",
        description:
          error.response?.data?.message || "Không thể cập nhật tài khoản",
        variant: "destructive",
      });
    }
  };

  const handleBanUser = async (user) => {
    try {
      await userService.banUser({
        ids: [user.id],
        status: "false",
      });

      toast({
        title: "Đã vô hiệu hóa tài khoản",
        description: `${user.name} (${user.email}) đã bị khóa.`,
        variant: "destructive",
      });

      setShowConfirmDialog(false);
      setConfirmAction(null);
      fetchAllUsers();
    } catch (error) {
      toast({
        title: "Lỗi khóa tài khoản",
        description: "Không thể cập nhật trạng thái người dùng",
        variant: "destructive",
      });
    }
  };

  // 🔹 Kích hoạt lại user
  const handleActivateUser = async (user) => {
    try {
      await userService.banUser({
        ids: [user.id],
        status: "true",
      });

      toast({
        title: "Đã kích hoạt tài khoản",
        description: `${user.name} (${user.email}) đã được kích hoạt lại.`,
      });

      setShowConfirmDialog(false);
      setConfirmAction(null);
      fetchAllUsers();
    } catch (error) {
      toast({
        title: "Lỗi kích hoạt tài khoản",
        description: "Không thể cập nhật trạng thái người dùng",
        variant: "destructive",
      });
    }
  };

  const openConfirmDialog = (action, user) => {
    setConfirmAction({ action, user });
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    if (confirmAction) {
      if (confirmAction.action === "ban") {
        handleBanUser(confirmAction.user);
      } else if (confirmAction.action === "activate") {
        handleActivateUser(confirmAction.user);
      }
    }
  };

  return (
    <AdminLayout title="Quản Lý Hoa Tiêu">
      <div className="min-h-screen bg-gradient-ocean-light">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">
              Quản Lý Hoa Tiêu
            </h1>
            <p className="text-muted-foreground">
              Danh sách các tài khoản hoa tiêu trong hệ thống
            </p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Danh Sách Hoa Tiêu</CardTitle>
                  <CardDescription>
                    Tổng: {users.length}
                  </CardDescription>
                </div>
                <Dialog
                  open={showCreateDialog}
                  onOpenChange={setShowCreateDialog}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-accent hover:bg-accent/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Thêm hoa tiêu
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tạo tài khoản mới</DialogTitle>
                      <DialogDescription>
                        Nhập đầy đủ thông tin bên dưới
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-4">
                      <Input
                        placeholder="Tên"
                        value={newUser.name}
                        onChange={(e) =>
                          setNewUser({ ...newUser, name: e.target.value })
                        }
                      />
                      <Input
                        type="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) =>
                          setNewUser({ ...newUser, email: e.target.value })
                        }
                      />
                      <Input
                        placeholder="Số điện thoại"
                        value={newUser.phone}
                        onChange={(e) =>
                          setNewUser({ ...newUser, phone: e.target.value })
                        }
                      />
                      <Input
                        placeholder="Cấp bậc (rank)"
                        value={newUser.rank}
                        onChange={(e) =>
                          setNewUser({ ...newUser, rank: e.target.value })
                        }
                      />
                      <div className="space-y-2">
                        <Label htmlFor="role">Vai trò</Label>
                        <select
                          id="role"
                          name="role"
                          value={newUser.role}
                          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                          className="w-full border rounded-md px-3 py-2 bg-gray-100"
                        >
                          <option value="">-- Chọn vai trò --</option>
                          <option value="ADMIN">ADMIN</option>
                          <option value="PILOT">PILOT</option>
                        </select>
                      </div>
                      {(newUser.avatarUrl || newUser.keyAvatar) && (
                        <div className="flex flex-col items-center gap-2">
                          <img
                            src={newUser.avatarUrl || userService.getFileUrl(newUser.keyAvatar)}
                            alt="Preview"
                            className="w-24 h-24 rounded-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Label className="w-full">
                          <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2"
                            onClick={() =>
                              document.getElementById("new-avatar-input").click()
                            }
                          >
                            <ImageIcon className="w-4 h-4" /> Chọn ảnh mới
                          </Button>
                        </Label>
                        <input
                          id="new-avatar-input"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleAvatarChange(e)}
                        />
                      </div>
                      <Button className="w-full" onClick={handleCreateUser}>
                        Tạo tài khoản
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo tên, email hoặc SĐT..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-48 border rounded-md px-3 py-2"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Hiệu lực</option>
                  <option value="inactive">Vô hiệu hóa</option>
                </select>
              </div>

              <div className="rounded-md border divide-y divide-gray-200">
                <Table className="border-collapse">
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="border">STT</TableHead>
                      <TableHead className="border">Tên</TableHead>
                      <TableHead className="border">Email</TableHead>
                      <TableHead className="border">Số điện thoại</TableHead>
                      <TableHead className="border">Rank</TableHead>
                      <TableHead className="border">Vai trò</TableHead>
                      <TableHead className="border">Trạng thái</TableHead>
                      <TableHead className="border text-right">
                        Hành động
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6">
                          Đang tải...
                        </TableCell>
                      </TableRow>
                    ) : users.length > 0 ? (
                      users.map((u, i) => (
                        <TableRow key={u.id} className="hover:bg-gray-50">
                          <TableCell className="border">
                            {page * size + i + 1}
                          </TableCell>
                          <TableCell className="border">{u.name}</TableCell>
                          <TableCell className="border">{u.email}</TableCell>
                          <TableCell className="border">
                            {u.phone || "-"}
                          </TableCell>
                          <TableCell className="border">
                            {u.rank || "—"}
                          </TableCell>
                          <TableCell className="border">
                            {u.role || "—"}
                          </TableCell>
                          <TableCell className="border">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${u.status
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                                }`}
                            >
                              {u.status ? "Hiệu lực" : "Vô hiệu hóa"}
                            </span>
                          </TableCell>
                          <TableCell className="border text-right space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedUser({
                                  ...u,
                                  avatarUrl: "", // Reset avatarUrl để hiển thị ảnh từ keyAvatar
                                });
                                setShowEditDialog(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            {u.status ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive border-destructive"
                                onClick={() => openConfirmDialog("ban", u)}
                              >
                                Vô hiệu
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 border-green-600"
                                onClick={() => openConfirmDialog("activate", u)}
                              >
                                Kích hoạt
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6">
                          {searchQuery || statusFilter !== "all"
                            ? `Không tìm thấy kết quả`
                            : "Không có tài khoản nào"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    disabled={page <= 0}
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
            </CardContent>
          </Card>
        </div>

        {/* Modal chỉnh sửa */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa tài khoản</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin người dùng
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-3 py-4">
                <Input
                  value={selectedUser.name || ""}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, name: e.target.value })
                  }
                />
                <Input
                  type="email"
                  value={selectedUser.email || ""}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                />
                <Input
                  value={selectedUser.phone || ""}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, phone: e.target.value })
                  }
                />
                <Input
                  value={selectedUser.rank || ""}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, rank: e.target.value })
                  }
                />

                <div className="space-y-2">
                  <Label htmlFor="role">Vai trò</Label>
                  <select
                    id="role"
                    name="role"
                    value={selectedUser.role}
                    onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="">-- Chọn vai trò --</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="PILOT">PILOT</option>
                  </select>
                </div>

                {(selectedUser.avatarUrl || selectedUser.keyAvatar) && (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={selectedUser.avatarUrl || userService.getFileUrl(selectedUser.keyAvatar)}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Label className="w-full">
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() =>
                        document.getElementById("edit-avatar-input").click()
                      }
                    >
                      <ImageIcon className="w-4 h-4" /> Chọn ảnh mới
                    </Button>
                  </Label>
                  <input
                    id="edit-avatar-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleAvatarChange(e, true)}
                  />
                </div>

                <Button className="w-full" onClick={handleSaveEdit}>
                  Lưu thay đổi
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận hành động</DialogTitle>
              <DialogDescription>
                {confirmAction?.action === "ban"
                  ? "Bạn có chắc chắn muốn vô hiệu hóa tài khoản này?"
                  : "Bạn có chắc chắn muốn kích hoạt lại tài khoản này?"}
              </DialogDescription>
            </DialogHeader>
            {confirmAction && (
              <div className="space-y-4 py-4">
                <div className="bg-gray-100 p-4 rounded-md">
                  <p className="text-sm">
                    <strong>Tên:</strong> {confirmAction.user.name}
                  </p>
                  <p className="text-sm">
                    <strong>Email:</strong> {confirmAction.user.email}
                  </p>
                  <p className="text-sm">
                    <strong>Rank:</strong> {confirmAction.user.rank || "—"}
                  </p>
                </div>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowConfirmDialog(false);
                      setConfirmAction(null);
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    className={
                      confirmAction.action === "ban"
                        ? "bg-destructive hover:bg-destructive/90"
                        : "bg-green-600 hover:bg-green-700"
                    }
                    onClick={handleConfirm}
                  >
                    {confirmAction.action === "ban"
                      ? "Vô hiệu hóa"
                      : "Kích hoạt"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AccountManagement;