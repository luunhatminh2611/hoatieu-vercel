// src/components/modals/ServicePriceModal.jsx
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import servicePriceService from "@/services/api/service";

const ServicePriceModal = ({ open, onClose, status, onSuccess, editData }) => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        title: "",
        effectiveDate: "",
        file: null,
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    useEffect(() => {
        if (editData) {
            setFormData({
                title: editData.title || "",
                effectiveDate: editData.effectiveDate || "",
                file: null, // file chỉ chọn lại nếu muốn thay
            });
        } else {
            setFormData({ title: "", effectiveDate: "", file: null });
        }
    }, [editData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.effectiveDate || !formData.file) {
            toast({
                title: "Thiếu thông tin",
                description: "Vui lòng nhập đầy đủ các trường bắt buộc.",
                variant: "destructive",
            });
            return;
        }

        try {
            setLoading(true);

            // ✅ Tạo FormData
            const payload = new FormData();
            payload.append("title", formData.title);
            payload.append("effectiveDate", formData.effectiveDate);
            payload.append("status", status);
            if (formData.file) payload.append("file", formData.file);

            if (editData?.id) {
                payload.append("id", editData.id);
            }

            await servicePriceService.createServicePrice(payload);

            toast({
                title: editData ? "Cập nhật thành công" : "Tạo mới thành công",
                description: editData ? "Hồ sơ đã được cập nhật" : "Hồ sơ mới đã được thêm",
            });
            setFormData({ title: "", effectiveDate: "", file: null });
            onClose();
            onSuccess?.();
        } catch (error) {
            console.error("Lỗi API:", error);
            toast({
                title: "Lỗi",
                description: error?.response?.data?.message || "Không thể thêm hồ sơ.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    {editData ? "Chỉnh sửa Hồ Sơ Văn Bản" : "Thêm Hồ Sơ Văn Bản"}
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Tên văn bản</Label>
                        <Input
                            name="title"
                            placeholder="Nhập tên văn bản"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label>Ngày áp dụng</Label>
                        <Input
                            name="effectiveDate"
                            type="date"
                            value={formData.effectiveDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label>Tập tin đính kèm (nếu có)</Label>
                        <Input name="file" type="file" onChange={handleChange} />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Đang lưu..." : "Lưu"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ServicePriceModal;
