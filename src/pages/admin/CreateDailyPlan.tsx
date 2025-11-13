import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Search, Edit, Save, X, Plus, Trash2 } from "lucide-react";
import { pilotPlanService } from "@/services/api/dailyPilot";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "./component/AdminLayout";
import userService from "@/services/api/pilot";
import ChangePilotModal from "./component/ChangePilotModal";
// import AssignmentModal from "./component/CreateAssign";

const formSchema = z.object({
    planDate: z.string().min(1, "Vui lòng chọn ngày kế hoạch"),
    operationsOfficer: z.string().min(1, "Vui lòng nhập người điều hành"),
    pilotOfficer: z.string().min(1, "Vui lòng nhập trực ban hoa tiêu"),
    dutyPhone: z.string().min(1, "Vui lòng nhập số điện thoại trực"),
    transportationInfo: z.string().min(1, "Vui lòng nhập thông tin phương tiện"),
    honNetPositionPlan: z.string().optional(),
});

function formatVietnameseDate(isoDate?: string) {
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

const CreatePilotPlan = () => {
    const [loading, setLoading] = useState(false);
    const [createdPlanId, setCreatedPlanId] = useState<string | null>(null);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loadingAssignments, setLoadingAssignments] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [isEditing, setIsEditing] = useState(false);
    const [users, setUsers] = useState([]);
    const [editingRowId, setEditingRowId] = useState(null);
    const [editingRowData, setEditingRowData] = useState(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newRowData, setNewRowData] = useState({
        pilotId: "",
        traineeId: "",
        pob: "",
        shipName: "",
        draft: "",
        loa: "",
        gt: "",
        fromTo: "",
        tugBoat: "",
        transportMethod: "",
        agentName: "",
    });
    const [isChangePilotModalOpen, setIsChangePilotModalOpen] = useState(false);
    const [changingPilotData, setChangingPilotData] = useState(null);

    const navigate = useNavigate();
    const { toast } = useToast();

    const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            planDate: "",
            operationsOfficer: "",
            pilotOfficer: "",
            dutyPhone: "",
            transportationInfo: "",
            honNetPositionPlan: "",
        },
    });

    const fetchAssignments = async (planId: string) => {
        setLoadingAssignments(true);
        try {
            const res = await pilotPlanService.getPilotAssignments({
                dailyPilotPlanId: planId,
                page: 0,
                limit: 1000,
            });
            setAssignments(res.content || []);
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
        const fetchUsers = async () => {
            try {
                const res = await userService.getAllUsers({
                    status: true,
                    role: "PILOT",
                    limit: 50
                });
                setUsers(res?.content || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (createdPlanId) {
            fetchAssignments(createdPlanId);
        }
    }, [createdPlanId]);

    const filteredAssignments = useMemo(() => {
        let result = [...assignments];
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            result = result.filter(
                (a) =>
                    a.pilotName?.toLowerCase().includes(q) ||
                    a.vesselName?.toLowerCase().includes(q) ||
                    (a.pob || "").toLowerCase().includes(q)
            );
        }
        return result;
    }, [assignments, searchQuery]);

    const totalPages = Math.ceil(filteredAssignments.length / size);
    const paginatedAssignments = useMemo(() => {
        const start = page * size;
        const end = start + size;
        return filteredAssignments.slice(start, end);
    }, [filteredAssignments, page, size]);

    useEffect(() => {
        setPage(0);
    }, [searchQuery]);

    const onSubmit = async (planData: z.infer<typeof formSchema>) => {
        setLoading(true);
        try {
            const res = await pilotPlanService.createPlan(planData);
            console.log("API createPlan response:", res);
            toast({
                title: "Thành công",
                description: "Đã tạo kế hoạch mới"
            });
            setCreatedPlanId(res.data);
        } catch (error) {
            console.error(error);
            toast({
                title: "Lỗi",
                description: "Không thể tạo kế hoạch",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        // Reset form về giá trị ban đầu
        form.reset({
            planDate: form.getValues("planDate"),
            operationsOfficer: form.getValues("operationsOfficer"),
            pilotOfficer: form.getValues("pilotOfficer"),
            dutyPhone: form.getValues("dutyPhone"),
            transportationInfo: form.getValues("transportationInfo"),
            honNetPositionPlan: form.getValues("honNetPositionPlan"),
        });
    };

    const handleUpdatePlan = async () => {
        if (!createdPlanId) return;

        const isValid = await form.trigger();
        if (!isValid) {
            toast({
                title: "Lỗi",
                description: "Vui lòng kiểm tra lại các trường thông tin",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            const planData = {
                id: createdPlanId,
                ...form.getValues(),
            };

            const res = await pilotPlanService.createPlan(planData);
            console.log("API updatePlan response:", res);

            toast({
                title: "Thành công",
                description: "Đã cập nhật kế hoạch",
            });
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            toast({
                title: "Lỗi",
                description: "Không thể cập nhật kế hoạch",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddNewRow = () => {
        setIsAddingNew(true);
        setNewRowData({
            pilotId: "",
            traineeId: "",
            pob: "",
            shipName: "",
            draft: "",
            loa: "",
            gt: "",
            fromTo: "",
            tugBoat: "",
            transportMethod: "",
            agentName: "",
        });
    };

    const handleCancelNewRow = () => {
        setIsAddingNew(false);
    };

    const handleSaveNewRow = async () => {
        if (!createdPlanId) return;

        setLoading(true);
        try {
            await pilotPlanService.createPilotAssignment({
                ...newRowData,
                draft: Number(newRowData.draft) || 0,
                loa: Number(newRowData.loa) || 0,
                gt: Number(newRowData.gt) || 0,
                dailyPilotPlanId: createdPlanId,
            });

            toast({
                title: "Thành công",
                description: "Đã thêm phân công mới",
            });
            setIsAddingNew(false);
            await fetchAssignments(createdPlanId);
        } catch (error) {
            console.error(error);
            toast({
                title: "Lỗi",
                description: "Không thể thêm phân công",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const findUserIdByName = (name) => {
        if (!name) return "";
        const user = users.find(u => u.name === name);
        return user ? user.id : "";
    };
    // Sửa
    const handleEditRow = (assignment) => {
        setEditingRowId(assignment.id);
        setEditingRowData({
            arrivalTime: assignment.arrivalTime || "",
            pob: assignment.pob || "",
            shipName: assignment.shipName || "",
            draft: assignment.draft || "",
            loa: assignment.loa || "",
            gt: assignment.gt || "",
            fromTo: assignment.fromTo || "",
            tugBoat: assignment.tugBoat || "",
            transportMethod: assignment.transportMethod || "",
            agentName: assignment.agentName || "",
            pilotRoute: assignment.pilotRoute || "",
        });
    };

    const handleCancelEditRow = () => {
        setEditingRowId(null);
        setEditingRowData(null);
    };

    const handleSaveEditRow = async () => {
        if (!editingRowId || !createdPlanId) return;

        setLoading(true);
        try {
            await pilotPlanService.createPilotAssignment({
                id: editingRowId,
                arrivalTime: editingRowData.arrivalTime,
                pob: editingRowData.pob,
                shipName: editingRowData.shipName,
                draft: Number(editingRowData.draft) || 0,
                loa: Number(editingRowData.loa) || 0,
                gt: Number(editingRowData.gt) || 0,
                fromTo: editingRowData.fromTo,
                tugBoat: editingRowData.tugBoat,
                transportMethod: editingRowData.transportMethod,
                agentName: editingRowData.agentName,
                pilotRoute: editingRowData.pilotRoute,
                dailyPilotPlanId: createdPlanId,
            });

            toast({
                title: "Thành công",
                description: "Đã cập nhật phân công",
            });

            setEditingRowId(null);
            setEditingRowData(null);
            await fetchAssignments(createdPlanId);
        } catch (error) {
            console.error(error);
            toast({
                title: "Lỗi",
                description: "Không thể cập nhật phân công",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Xóa
    const handleDeleteRow = async (assignmentId) => {
        if (!confirm("Bạn có chắc muốn xóa phân công này?")) return;

        setLoading(true);
        try {
            await pilotPlanService.deletePilotAssignment(assignmentId);

            toast({
                title: "Thành công",
                description: "Đã xóa phân công",
            });

            await fetchAssignments(createdPlanId);
        } catch (error) {
            console.error(error);
            toast({
                title: "Lỗi",
                description: "Không thể xóa phân công",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Render cell có thể chỉnh sửa
    const renderEditableCell = (value, field, type = "text", isNew = false) => {
        const data = isNew ? newRowData : editingRowData;
        const setData = isNew ? setNewRowData : setEditingRowData;

        // CHỈ cho phép select hoa tiêu khi THÊM MỚI (isNew = true)
        if ((field === "pilotId" || field === "traineeId") && isNew) {
            return (
                <select
                    className="w-full border rounded px-2 py-1 bg-[#003399] text-white"
                    value={data[field]}
                    onChange={(e) => setData({ ...data, [field]: e.target.value })}
                >
                    <option value="">-- Chọn hoa tiêu --</option>
                    {users.map((u) => (
                        <option key={u.id} value={u.id}>
                            {u.name}
                        </option>
                    ))}
                </select>
            );
        }

        return (
            <Input
                type={type}
                value={data[field]}
                onChange={(e) => setData({ ...data, [field]: e.target.value })}
                className="w-full border rounded px-2 py-1 bg-[#003399] text-white border-white"
            />
        );
    };

    const handleChangePilotClick = (assignment, type) => {
        setChangingPilotData({
            assignmentId: assignment.id,
            type: type,
            currentUserId: type === 'PILOT' ? assignment.pilotId : assignment.traineeId,
            currentUserName: type === 'PILOT' ? assignment.pilotName : assignment.traineeName
        });
        setIsChangePilotModalOpen(true);
    };

    const handleSaveChangePilot = async (newUserId) => {
        if (!changingPilotData || !newUserId) return;

        setLoading(true);
        try {
            await pilotPlanService.updateAssignmentStatus({
                id: changingPilotData.assignmentId,
                userId: newUserId,
                status: "PENDING",
                type: changingPilotData.type
            });

            toast({
                title: "Thành công",
                description: `Đã thay đổi ${changingPilotData.type === 'PILOT' ? 'hoa tiêu' : 'tập sự'}`,
            });

            setIsChangePilotModalOpen(false);
            setChangingPilotData(null);
            await fetchAssignments(createdPlanId);
        } catch (error) {
            console.error(error);
            toast({
                title: "Lỗi",
                description: "Không thể thay đổi",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const planDate = form.watch("planDate");
    const operationsOfficer = form.watch("operationsOfficer");
    const pilotOfficer = form.watch("pilotOfficer");
    const dutyPhone = form.watch("dutyPhone");
    const transportationInfo = form.watch("transportationInfo");

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gradient-ocean-light">
                <div className="container mx-auto px-4 py-8">
                    <Button
                        variant="ghost"
                        className="mb-4"
                        onClick={() => navigate("/admin/schedule")}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Quay lại
                    </Button>

                    {/* FORM */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">
                                {createdPlanId ? "Thông tin kế hoạch điều động" : "Tạo kế hoạch điều động mới"}
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="planDate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Ngày kế hoạch</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="date"
                                                            {...field}
                                                            disabled={!!createdPlanId && !isEditing}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="operationsOfficer"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Người điều hành</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            disabled={!!createdPlanId && !isEditing}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="pilotOfficer"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Trực ban hoa tiêu</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            disabled={!!createdPlanId && !isEditing}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="dutyPhone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Điện thoại trực</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            disabled={!!createdPlanId && !isEditing}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="transportationInfo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Thông tin phương tiện</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        rows={3}
                                                        {...field}
                                                        disabled={!!createdPlanId && !isEditing}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex justify-end gap-3 pt-2">
                                        {!createdPlanId ? (
                                            <>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => navigate("/admin/schedule")}
                                                    disabled={loading}
                                                >
                                                    Hủy
                                                </Button>
                                                <Button type="submit" disabled={loading}>
                                                    {loading ? "Đang tạo..." : "Tạo kế hoạch"}
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                {!isEditing ? (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={handleEditClick}
                                                    >
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Chỉnh sửa kế hoạch
                                                    </Button>
                                                ) : (
                                                    <>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={handleCancelEdit}
                                                            disabled={loading}
                                                        >
                                                            <X className="w-4 h-4 mr-2" />
                                                            Hủy
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            onClick={handleUpdatePlan}
                                                            disabled={loading}
                                                        >
                                                            <Save className="w-4 h-4 mr-2" />
                                                            {loading ? "Đang lưu..." : "Lưu thay đổi"}
                                                        </Button>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    {/* PREVIEW */}
                    <div className="mt-8 border-[4px] border-white overflow-hidden" style={{ boxShadow: "0 0 0 1px #003399 inset" }}>
                        <div className="bg-[#003399] text-white">
                            <div className="border-b-[3px] border-white px-4 py-3 text-center">
                                <p className="font-bold uppercase text-sm">
                                    KẾ HOẠCH CUNG ỨNG DỊCH VỤ HOA TIÊU HÀNG HẢI HÀNG NGÀY
                                </p>
                            </div>

                            <div className="border-b-[3px] border-white px-4 py-4 text-center text-xs">
                                {createdPlanId ? (
                                    <p className="text-lg">{formatVietnameseDate(planDate)}</p>
                                ) : (
                                    <p className="text-lg text-white/50">&nbsp;</p>
                                )}
                            </div>

                            <div className="border-b-[3px] border-white px-4 py-4 text-center text-base font-medium">
                                TRỰC BAN: {createdPlanId ? (dutyPhone || "") : ""}
                            </div>

                            <div className="grid grid-cols-2 border-b-[3px] border-white/80">
                                <div className="px-6 py-3 border-r-[3px] border-white/80 flex flex-row items-center justify-center gap-2">
                                    <span className="font-extrabold text-lg">TRỰC BAN ĐHSX:</span>
                                    <span className="font-extrabold text-lg">{createdPlanId ? (operationsOfficer || "") : ""}</span>
                                </div>
                                <div className="px-6 py-3 flex flex-row items-center justify-center gap-2">
                                    <span className="font-extrabold text-lg">TRỰC BAN HOA TIÊU:</span>
                                    <span className="font-extrabold text-lg">{createdPlanId ? (pilotOfficer || "") : ""}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#003399] text-white p-4">
                            <div className="flex justify-between items-center gap-4 mb-3">

                                <div className="flex items-center gap-2">
                                    {/* <div className="relative">
                                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
                                        <Input
                                            placeholder="Tìm kiếm hoa tiêu, tàu..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-8 bg-[#003399] text-white border-white"
                                        />
                                    </div> */}

                                    {createdPlanId && (
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={handleAddNewRow}
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Thêm phân công
                                        </Button>
                                    )}
                                    {createdPlanId && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => fetchAssignments(createdPlanId)}
                                            disabled={loadingAssignments}
                                            className="bg-white/10 text-white border-white hover:bg-white/20"
                                        >
                                            {loadingAssignments ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Đang tải...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                    Tải lại
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full border-collapse" style={{ borderSpacing: 0 }}>
                                    <thead>
                                        <tr>
                                            {[
                                                "TT", "POB", "Hoa tiêu", "Tập sự", "Tên tàu",
                                                "Mớn", "LOA", "GT", "Từ - Đến", "Tàu lai",
                                                "Phương tiện đưa đón", "Đại lý", "Thao tác"
                                            ].map((h) => (
                                                <th
                                                    key={h}
                                                    className="text-center text-white px-3 py-2 border-[3px] border-white text-sm"
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
                                                <td colSpan={15} className="text-center py-6 border-[3px] border-white text-white/80">
                                                    Đang tải...
                                                </td>
                                            </tr>
                                        ) : paginatedAssignments.length > 0 || isAddingNew ? (
                                            <>
                                                {paginatedAssignments.map((a, i) => {
                                                    const isEditingThis = editingRowId === a.id;
                                                    return (
                                                        <tr key={a.id}>
                                                            <td className="text-center border-[3px] border-white px-2 py-2">
                                                                {page * size + i + 1}
                                                            </td>
                                                            <td className="text-center border-[3px] border-white px-2 py-2">
                                                                {isEditingThis ? renderEditableCell(a.pob, "pob") : (a.pob || "-")}
                                                            </td>
                                                            <td className="text-center border-[3px] border-white px-2 py-2">
                                                                <div className="flex flex-col items-center gap-1">
                                                                    <span>{a.pilotName || "-"}</span>
                                                                    {a.statusPilot && (
                                                                        <span className={`text-xs ${a.statusPilot === "CONFIRMED" ? "text-green-400" :
                                                                            a.statusPilot === "REJECTED" ? "text-red-400" : "text-yellow-300"
                                                                            }`}>
                                                                            {a.statusPilot === "CONFIRMED" ? "(Chấp nhận)" :
                                                                                a.statusPilot === "REJECTED" ? "(Từ chối)" : "(Đã giao)"}
                                                                        </span>
                                                                    )}
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => handleChangePilotClick(a, 'PILOT')}
                                                                        className="h-6 px-2 text-xs text-white bg-white/20"
                                                                    >
                                                                        Đổi người
                                                                    </Button>
                                                                </div>
                                                            </td>

                                                            {/* Cột Tập sự */}
                                                            <td className="text-center border-[3px] border-white px-2 py-2">
                                                                <div className="flex flex-col items-center gap-1">
                                                                    <span>{a.traineeName || "-"}</span>
                                                                    {a.statusTrainee && (
                                                                        <span className={`text-xs ${a.statusTrainee === "CONFIRMED" ? "text-green-400" :
                                                                            a.statusTrainee === "REJECTED" ? "text-red-400" : "text-yellow-300"
                                                                            }`}>
                                                                            {a.statusTrainee === "CONFIRMED" ? "(Chấp nhận)" :
                                                                                a.statusTrainee === "REJECTED" ? "(Từ chối)" : "(Đã giao)"}
                                                                        </span>
                                                                    )}
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={() => handleChangePilotClick(a, 'TRAINEE')}
                                                                        className="h-6 px-2 text-xs text-white hover:bg-white/20"
                                                                    >
                                                                        Đổi người
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                            <td className="text-center border-[3px] border-white px-2 py-2">
                                                                {isEditingThis ? renderEditableCell(a.shipName, "shipName") : (a.shipName || "-")}
                                                            </td>
                                                            <td className="text-center border-[3px] border-white px-2 py-2">
                                                                {isEditingThis ? renderEditableCell(a.draft, "draft", "number") : (a.draft || "-")}
                                                            </td>
                                                            <td className="text-center border-[3px] border-white px-2 py-2">
                                                                {isEditingThis ? renderEditableCell(a.loa, "loa", "number") : (a.loa || "-")}
                                                            </td>
                                                            <td className="text-center border-[3px] border-white px-2 py-2">
                                                                {isEditingThis ? renderEditableCell(a.gt, "gt", "number") : (a.gt || "-")}
                                                            </td>
                                                            <td className="text-center border-[3px] border-white px-2 py-2">
                                                                {isEditingThis ? renderEditableCell(a.fromTo, "fromTo") : (a.fromTo || "-")}
                                                            </td>
                                                            <td className="text-center border-[3px] border-white px-2 py-2">
                                                                {isEditingThis ? renderEditableCell(a.tugBoat, "tugBoat") : (a.tugBoat || "-")}
                                                            </td>
                                                            <td className="text-center border-[3px] border-white px-2 py-2">
                                                                {isEditingThis ? renderEditableCell(a.agentName, "agentName") : (a.agentName || "-")}
                                                            </td>
                                                            <td className="text-center border-[3px] border-white px-2 py-2">
                                                                {isEditingThis ? renderEditableCell(a.pilotRoute, "pilotRoute") : (a.pilotRoute || "-")}
                                                            </td>
                                                            <td className="text-center border-[3px] border-white px-2 py-2">
                                                                {isEditingThis ? (
                                                                    <div className="flex gap-1 justify-center">
                                                                        <Button
                                                                            size="sm"
                                                                            onClick={handleSaveEditRow}
                                                                            disabled={loading}
                                                                            className="h-7 px-2"
                                                                        >
                                                                            <Save className="w-3 h-3" />
                                                                        </Button>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            onClick={handleCancelEditRow}
                                                                            disabled={loading}
                                                                            className="h-7 px-2"
                                                                        >
                                                                            <X className="w-3 h-3" />
                                                                        </Button>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex gap-1 justify-center">
                                                                        <Button
                                                                            size="sm"
                                                                            variant="secondary"
                                                                            onClick={() => handleEditRow(a)}
                                                                            className="h-7 px-2"
                                                                        >
                                                                            <Edit className="w-3 h-3" />
                                                                        </Button>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="destructive"
                                                                            onClick={() => handleDeleteRow(a.id)}
                                                                            className="h-7 px-2"
                                                                        >
                                                                            <Trash2 className="w-3 h-3" />
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}

                                                {/* Hàng thêm mới */}
                                                {isAddingNew && (
                                                    <tr className="bg-[#003399]">
                                                        <td className="text-center border-[3px] border-white px-2 py-2">
                                                            *
                                                        </td>
                                                        <td className="border-[3px] border-white px-2 py-2">
                                                            {renderEditableCell("", "pob", "text", true)}
                                                        </td>
                                                        <td className="border-[3px] border-white px-2 py-2">
                                                            {renderEditableCell("", "pilotId", "text", true)}
                                                        </td>
                                                        <td className="border-[3px] border-white px-2 py-2">
                                                            {renderEditableCell("", "traineeId", "text", true)}
                                                        </td>
                                                        <td className="border-[3px] border-white px-2 py-2">
                                                            {renderEditableCell("", "shipName", "text", true)}
                                                        </td>
                                                        <td className="border-[3px] border-white px-2 py-2">
                                                            {renderEditableCell("", "draft", "number", true)}
                                                        </td>
                                                        <td className="border-[3px] border-white px-2 py-2">
                                                            {renderEditableCell("", "loa", "number", true)}
                                                        </td>
                                                        <td className="border-[3px] border-white px-2 py-2">
                                                            {renderEditableCell("", "gt", "number", true)}
                                                        </td>
                                                        <td className="border-[3px] border-white px-2 py-2">
                                                            {renderEditableCell("", "fromTo", "text", true)}
                                                        </td>
                                                        <td className="border-[3px] border-white px-2 py-2">
                                                            {renderEditableCell("", "tugBoat", "text", true)}
                                                        </td>
                                                        <td className="border-[3px] border-white px-2 py-2">
                                                            {renderEditableCell("", "transportMethod", "text", true)}
                                                        </td>
                                                        <td className="border-[3px] border-white px-2 py-2">
                                                            {renderEditableCell("", "agentName", "text", true)}
                                                        </td>
                                                        <td className="text-center border-[3px] border-white px-2 py-2">
                                                            <div className="flex gap-1 justify-center">
                                                                <Button
                                                                    size="sm"
                                                                    onClick={handleSaveNewRow}
                                                                    disabled={loading}
                                                                    className="h-7 px-2"
                                                                >
                                                                    <Save className="w-3 h-3" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="secondary"
                                                                    onClick={handleCancelNewRow}
                                                                    disabled={loading}
                                                                    className="h-7 px-2"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </>
                                        ) : (
                                            <tr>
                                                <td colSpan={15} className="text-center py-8 border-[3px] border-white">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <p className="text-white/80">Chưa có phân công nào</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-[#003399] text-white border-t-[3px] border-white/80 px-6 py-3 text-left">
                            <p className="font-semibold">Thông tin phương tiện:</p>
                            <pre className="mt-1 font-sans whitespace-pre-wrap break-words">
                                {createdPlanId ? (transportationInfo || "") : ""}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
            <ChangePilotModal
                open={isChangePilotModalOpen}
                onClose={() => {
                    setIsChangePilotModalOpen(false);
                    setChangingPilotData(null);
                }}
                data={changingPilotData}
                users={users}
                onSave={handleSaveChangePilot}
                loading={loading}
            />
        </AdminLayout>
    );
};

export default CreatePilotPlan;