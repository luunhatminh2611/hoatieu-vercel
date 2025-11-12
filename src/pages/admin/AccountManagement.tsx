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
import { Plus, Search, Edit, Trash2, ImageIcon } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  // Rank states
  const [ranks, setRanks] = useState([]);
  const [showCreateRankDialog, setShowCreateRankDialog] = useState(false);
  const [showDeleteRankDialog, setShowDeleteRankDialog] = useState(false);
  const [selectedRank, setSelectedRank] = useState(null);
  const [newRank, setNewRank] = useState({
    name: "",
    index: 0,
    status: true,
  });
  const [showEditRankDialog, setShowEditRankDialog] = useState(false);
  const [editingRank, setEditingRank] = useState(null);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    rankId: "",
    role: "",
    avatarFile: null,
    avatarUrl: "",
    keyAvatar: "",
  });

  // Fetch ranks
  const fetchRanks = async () => {
    try {
      const res = await userService.getAllRanks();

      const sortedRanks = (res || []).sort((a, b) => a.index - b.index);
      setRanks(sortedRanks);
    } catch (error) {
      toast({
        title: "Lỗi tải danh sách thứ hạng",
        variant: "destructive",
      });
    }
  };

  // Fetch users
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
    fetchRanks();
  }, [searchQuery, statusFilter, page]);

  // Handle avatar change
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

  // Create user
  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.phone || !newUser.rankId || !newUser.role) {
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

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      toast({
        title: "Email không hợp lệ",
        description: "Vui lòng nhập email đúng định dạng.",
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
        rankId: "",
        role: "",
        avatarFile: null,
        avatarUrl: "",
        keyAvatar: "",
      });

      fetchAllUsers();
    } catch (error) {
      toast({
        title: "Lỗi tạo tài khoản",
        description: error.response?.data?.message || "Không thể tạo tài khoản",
        variant: "destructive",
      });
    }
  };

  // Update user
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
      fetchAllUsers();
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

  // Rank CRUD
  const handleCreateRank = async () => {
    if (!newRank.name) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập tên thứ hạng",
        variant: "destructive",
      });
      return;
    }

    try {
      await userService.createRank(newRank);

      toast({
        title: "Thành công",
        description: `Đã tạo thứ hạng ${newRank.name}`,
      });

      setShowCreateRankDialog(false);
      setNewRank({ name: "", index: 0, status: true });
      fetchRanks();
    } catch (error) {
      toast({
        title: "Lỗi tạo thứ hạng",
        variant: "destructive",
      });
    }
  };

  const handleUpdateRank = async () => {
    if (!editingRank.name) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập tên thứ hạng",
        variant: "destructive",
      });
      return;
    }

    try {
      await userService.createRank({
        id: editingRank.id,
        name: editingRank.name,
        index: editingRank.index,
        status: editingRank.status
      });

      toast({
        title: "Thành công",
        description: `Đã cập nhật thứ hạng ${editingRank.name}`,
      });

      setShowEditRankDialog(false);
      setEditingRank(null);
      fetchRanks();
    } catch (error) {
      toast({
        title: "Lỗi cập nhật thứ hạng",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRank = async () => {
    if (!selectedRank) return;

    try {
      await userService.deleteRank(selectedRank.id);

      toast({
        title: "Thành công",
        description: `Đã xóa thứ hạng ${selectedRank.name}`,
      });

      setShowDeleteRankDialog(false);
      setSelectedRank(null);
      fetchRanks();
    } catch (error) {
      toast({
        title: "Lỗi xóa thứ hạng",
        description: error.response?.data?.message || "Không thể xóa thứ hạng",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout title="Quản Lý Người Dùng">
      <div className="min-h-screen bg-gradient-ocean-light">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">
              Quản Lý Người Dùng
            </h1>
            <p className="text-muted-foreground">
              Quản lý tài khoản người dùng và thứ hạng trong hệ thống
            </p>
          </div>

          <Tabs defaultValue="accounts" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="accounts">Danh Sách Tài Khoản</TabsTrigger>
              <TabsTrigger value="ranks">Danh Sách Thứ Hạng</TabsTrigger>
            </TabsList>

            {/* Tab Tài Khoản */}
            <TabsContent value="accounts">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Danh Sách Hoa Tiêu</CardTitle>
                      <CardDescription>Tổng: {users.length}</CardDescription>
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

                          <div className="space-y-2">
                            <Label htmlFor="rank">Thứ hạng</Label>
                            <select
                              id="rank"
                              name="rank"
                              value={newUser.rankId}
                              onChange={(e) =>
                                setNewUser({ ...newUser, rankId: e.target.value })
                              }
                              className="w-full border rounded-md px-3 py-2 bg-white"
                            >
                              <option value="">-- Chọn thứ hạng --</option>
                              {ranks.map((r) => (
                                <option key={r.id} value={r.id}>
                                  {r.name} (Vị trí: {r.index})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="role">Vai trò</Label>
                            <select
                              id="role"
                              name="role"
                              value={newUser.role}
                              onChange={(e) =>
                                setNewUser({ ...newUser, role: e.target.value })
                              }
                              className="w-full border rounded-md px-3 py-2 bg-white"
                            >
                              <option value="">-- Chọn vai trò --</option>
                              <option value="ADMIN">ADMIN</option>
                              <option value="PILOT">PILOT</option>
                            </select>
                          </div>

                          {(newUser.avatarUrl || newUser.keyAvatar) && (
                            <div className="flex flex-col items-center gap-2">
                              <img
                                src={
                                  newUser.avatarUrl ||
                                  userService.getFileUrl(newUser.keyAvatar)
                                }
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
                                  document
                                    .getElementById("new-avatar-input")
                                    .click()
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
                          <TableHead className="border">
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
                              <TableCell className="border text-left space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUser({
                                      ...u,
                                      avatarUrl: "",
                                      rankId: u.rankId || "",
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
                                    onClick={() =>
                                      openConfirmDialog("activate", u)
                                    }
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
            </TabsContent>

            {/* Tab Thứ Hạng */}
            <TabsContent value="ranks">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Danh Sách Thứ Hạng</CardTitle>
                      <CardDescription>
                        Tổng: {ranks.length} thứ hạng
                      </CardDescription>
                    </div>
                    <Dialog
                      open={showCreateRankDialog}
                      onOpenChange={setShowCreateRankDialog}
                    >
                      <DialogTrigger asChild>
                        <Button className="bg-accent hover:bg-accent/90">
                          <Plus className="w-4 h-4 mr-2" />
                          Thêm thứ hạng
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Tạo thứ hạng mới</DialogTitle>
                          <DialogDescription>
                            Nhập thông tin thứ hạng
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="rankName">Tên thứ hạng</Label>
                            <Input
                              id="rankName"
                              placeholder="VD: Hạng Vàng"
                              value={newRank.name}
                              onChange={(e) =>
                                setNewRank({ ...newRank, name: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="rankIndex">
                              Vị trí hiển thị (index)
                            </Label>
                            <Input
                              id="rankIndex"
                              type="number"
                              placeholder="0"
                              value={newRank.index}
                              onChange={(e) =>
                                setNewRank({
                                  ...newRank,
                                  index: parseInt(e.target.value) || 0,
                                })
                              }
                            />
                            <p className="text-xs text-muted-foreground">
                              Số càng nhỏ (0) sẽ hiển thị trước
                            </p>
                          </div>
                          <Button
                            className="w-full"
                            onClick={handleCreateRank}
                          >
                            Tạo thứ hạng
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-100">
                          <TableHead className="border">STT</TableHead>
                          <TableHead className="border">Tên thứ hạng</TableHead>
                          <TableHead className="border">Vị trí (Index)</TableHead>
                          <TableHead className="border">Trạng thái</TableHead>
                          <TableHead className="border">
                            Hành động
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ranks.length > 0 ? (
                          ranks.map((rank, index) => (
                            <TableRow key={rank.id} className="hover:bg-gray-50">
                              <TableCell className="border">
                                {index + 1}
                              </TableCell>
                              <TableCell className="border font-medium">
                                {rank.name}
                              </TableCell>
                              <TableCell className="border">
                                {rank.index}
                              </TableCell>
                              <TableCell className="border">
                                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                  Hiệu lực
                                </span>
                              </TableCell>
                              <TableCell className="border">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mr-2"
                                  onClick={() => {
                                    setEditingRank(rank);
                                    setShowEditRankDialog(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-destructive border-destructive"
                                  onClick={() => {
                                    setSelectedRank(rank);
                                    setShowDeleteRankDialog(true);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center py-6"
                            >
                              Chưa có thứ hạng nào
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Dialog chỉnh sửa user */}
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

                <div className="space-y-2">
                  <Label htmlFor="editRank">Thứ hạng</Label>
                  <select
                    id="editRank"
                    value={selectedUser.rankId || ""}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, rankId: e.target.value })
                    }
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="">-- Chọn thứ hạng --</option>
                    {ranks.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} (Vị trí: {r.index})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editRole">Vai trò</Label>
                  <select
                    id="editRole"
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
                      src={
                        userService.getFileUrl(selectedUser.keyAvatar)
                      }
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

        <Dialog open={showEditRankDialog} onOpenChange={setShowEditRankDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa thứ hạng</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin thứ hạng
              </DialogDescription>
            </DialogHeader>
            {editingRank && (
              <div className="space-y-3 py-4">
                <div className="space-y-2">
                  <Label htmlFor="editRankName">Tên thứ hạng</Label>
                  <Input
                    id="editRankName"
                    placeholder="VD: Hạng Vàng"
                    value={editingRank.name}
                    onChange={(e) =>
                      setEditingRank({ ...editingRank, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editRankIndex">
                    Vị trí hiển thị (index)
                  </Label>
                  <Input
                    id="editRankIndex"
                    type="number"
                    placeholder="0"
                    value={editingRank.index}
                    onChange={(e) =>
                      setEditingRank({
                        ...editingRank,
                        index: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Số càng nhỏ (0) sẽ hiển thị trước
                  </p>
                </div>
                <Button
                  className="w-full"
                  onClick={handleUpdateRank}
                >
                  Lưu thay đổi
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog xác nhận xóa rank */}
        <Dialog open={showDeleteRankDialog} onOpenChange={setShowDeleteRankDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa thứ hạng</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa thứ hạng này?
              </DialogDescription>
            </DialogHeader>
            {selectedRank && (
              <div className="space-y-4 py-4">
                <div className="bg-gray-100 p-4 rounded-md">
                  <p className="text-sm">
                    <strong>Tên:</strong> {selectedRank.name}
                  </p>
                  <p className="text-sm">
                    <strong>Vị trí (Index):</strong> {selectedRank.index}
                  </p>
                </div>
                <p className="text-sm text-destructive">
                  ⚠️ Lưu ý: Xóa thứ hạng có thể ảnh hưởng đến các tài khoản đang sử dụng thứ hạng này.
                </p>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeleteRankDialog(false);
                      setSelectedRank(null);
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={handleDeleteRank}
                  >
                    Xóa thứ hạng
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