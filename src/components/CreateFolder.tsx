// src/components/modals/ServicePriceModal.jsx
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import servicePriceService from "@/services/api/service";
import { Eye, FileText } from "lucide-react";
import userService from "@/services/api/pilot";

const ServicePriceModal = ({ open, onClose, status, onSuccess, editData }) => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        title: "",
        effectiveDate: "",
        file: null,
        existingFileKey: null,
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
                file: null,
                existingFileKey: editData.key, // ← Lấy từ key
            });
        } else {
            setFormData({ title: "", effectiveDate: "", file: null, existingFileKey: null });
        }
    }, [editData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ Validation
        if (!formData.title || !formData.effectiveDate) {
            toast({
                title: "Thiếu thông tin",
                description: "Vui lòng nhập tiêu đề và ngày áp dụng.",
                variant: "destructive",
            });
            return;
        }

        // ✅ Chỉ bắt buộc file khi tạo mới
        if (!editData && !formData.file) {
            toast({
                title: "Thiếu file",
                description: "Vui lòng chọn file đính kèm.",
                variant: "destructive",
            });
            return;
        }

        try {
            setLoading(true);

            const payload = new FormData();
            payload.append("title", formData.title);
            payload.append("effectiveDate", formData.effectiveDate);
            payload.append("status", status);

            // ✅ Chỉ gửi file nếu user chọn file mới
            if (formData.file) {
                payload.append("file", formData.file);
            }

            if (editData?.id) {
                payload.append("id", editData.id);
            }

            // Debug log
            console.log("=== Payload Debug ===");
            console.log("Mode:", editData ? "UPDATE" : "CREATE");
            console.log("Has new file:", !!formData.file);
            for (let pair of payload.entries()) {
                console.log(pair[0], typeof pair[1] === 'object' ? pair[1].name : pair[1]);
            }

            await servicePriceService.createServicePrice(payload);

            toast({
                title: editData ? "Cập nhật thành công" : "Tạo mới thành công",
                description: editData ? "Hồ sơ đã được cập nhật" : "Hồ sơ mới đã được thêm",
            });

            setFormData({ title: "", effectiveDate: "", file: null, existingFileKey: null });
            onClose();
            onSuccess?.();
        } catch (error) {
            console.error("❌ Lỗi API:", error);
            console.error("Response:", error.response?.data);
            toast({
                title: "Lỗi",
                description: error?.response?.data?.message || "Không thể lưu hồ sơ.",
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
                        <Label>Tập tin đính kèm</Label>

                        {/* ✅ Hiển thị file cũ */}
                        {formData.existingFileKey && !formData.file && (
                            <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm">File hiện tại: <strong>{formData.existingFileKey.split('/').pop()}</strong></span>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => window.open(userService.getFileUrl(formData.existingFileKey), "_blank")}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <Eye className="w-4 h-4 mr-1" />
                                    Xem
                                </Button>
                            </div>
                        )}

                        {/* ✅ Input chọn file mới */}
                        <Input
                            name="file"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleChange}
                        />

                        <p className="text-xs text-muted-foreground mt-1">
                            {editData
                                ? "Để trống nếu không muốn thay đổi file"
                                : "File là bắt buộc (PDF, JPG, PNG - tối đa 10MB)"}
                        </p>
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
