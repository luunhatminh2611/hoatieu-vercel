import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { pilotPlanService } from "@/services/api/dailyPilot";
import { userService } from "@/services/api/pilot";

export default function AssignmentModal({ open, onClose, planId, onSuccess }) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({
        pilotId: "",
        traineeId: "",
        arrivalTime: "",
        pob: "",
        shipName: "",
        draft: "",
        loa: "",
        gt: "",
        fromTo: "",
        tugBoat: "",
        transportMethod: "",
        agentName: "",
        pilotRoute: "",
    });

    useEffect(() => {
        if (!open) return;

        const fetchUsers = async () => {
            try {
                const res = await userService.getAllUsers();
                setUsers(res?.content || []);
            } catch (err) {
                console.error(err);
                toast({
                    title: "Lỗi",
                    description: "Không thể tải danh sách hoa tiêu",
                    variant: "destructive",
                });
            }
        };

        fetchUsers();
    }, [open]);

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!planId) return;
        try {
            setLoading(true);
            await pilotPlanService.createPilotAssignment({
                ...form,
                draft: Number(form.draft) || 0,
                loa: Number(form.loa) || 0,
                gt: Number(form.gt) || 0,
                dailyPilotPlanId: planId,
            });
            toast({
                title: "Thành công",
                description: "Đã thêm phân công hoa tiêu mới",
            });
            setForm({
                pilotId: "",
                traineeId: "",
                arrivalTime: "",
                pob: "",
                shipName: "",
                draft: "",
                loa: "",
                gt: "",
                fromTo: "",
                tugBoat: "",
                transportMethod: "",
                agentName: "",
                pilotRoute: "",
            });
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error(err);
            toast({
                title: "Lỗi",
                description: "Không thể thêm phân công",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Thêm phân công hoa tiêu</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-3 gap-3 mt-3">
                    {/* Hoa tiêu chính */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Hoa tiêu chính
                        </label>
                        <select
                            className="w-full border rounded-md p-2 mt-1"
                            value={form.pilotId}
                            onChange={(e) => handleChange("pilotId", e.target.value)}
                        >
                            <option value="">-- Chọn hoa tiêu --</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id} className="text-black">
                                    {u.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Hoa tiêu tập sự */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Hoa tiêu tập sự
                        </label>
                        <select
                            className="w-full border rounded-md p-2 mt-1"
                            value={form.traineeId}
                            onChange={(e) => handleChange("traineeId", e.target.value)}
                        >
                            <option value="">-- Chọn hoa tiêu tập sự --</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Giờ đến */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Giờ đến</label>
                        <Input
                            type="time"
                            value={form.arrivalTime}
                            onChange={(e) => handleChange("arrivalTime", e.target.value)}
                        />
                    </div>

                    {/* POB */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">POB</label>
                        <Input
                            value={form.pob}
                            onChange={(e) => handleChange("pob", e.target.value)}
                        />
                    </div>

                    {/* Tên tàu */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Tên tàu</label>
                        <Input
                            value={form.shipName}
                            onChange={(e) => handleChange("shipName", e.target.value)}
                        />
                    </div>

                    {/* Mớn (draft) */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Mớn (draft)</label>
                        <Input
                            type="number"
                            value={form.draft}
                            onChange={(e) => handleChange("draft", e.target.value)}
                        />
                    </div>

                    {/* LOA */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">LOA</label>
                        <Input
                            type="number"
                            value={form.loa}
                            onChange={(e) => handleChange("loa", e.target.value)}
                        />
                    </div>

                    {/* GT */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">GT</label>
                        <Input
                            type="number"
                            value={form.gt}
                            onChange={(e) => handleChange("gt", e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Tàu lai</label>
                        <Input
                            value={form.tugBoat}
                            onChange={(e) => handleChange("tugBoat", e.target.value)}
                        />
                    </div>

                    {/* Từ - Đến (chiếm cả hàng) */}
                    <div className="col-span-3">
                        <label className="text-sm font-medium text-gray-700">
                            Từ - Đến
                        </label>
                        <Input
                            value={form.fromTo}
                            onChange={(e) => handleChange("fromTo", e.target.value)}
                        />
                    </div>

                    {/* Phương tiện đưa đón */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Phương tiện đưa đón
                        </label>
                        <Input
                            value={form.transportMethod}
                            onChange={(e) => handleChange("transportMethod", e.target.value)}
                        />
                    </div>

                    {/* Đại lý */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Đại lý</label>
                        <Input
                            value={form.agentName}
                            onChange={(e) => handleChange("agentName", e.target.value)}
                        />
                    </div>

                    {/* Tuyến dẫn tàu */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Tuyến dẫn tàu
                        </label>
                        <Input
                            value={form.pilotRoute}
                            onChange={(e) => handleChange("pilotRoute", e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter className="mt-5">
                    <Button variant="outline" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Đang lưu..." : "Lưu phân công"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
