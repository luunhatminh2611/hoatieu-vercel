import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Download, Pencil, Trash2, Plus, Search, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { servicePriceService } from "@/services/api/service";
import ServicePriceModal from "@/components/CreateFolder";

const TenderInfo = () => {
    const { toast } = useToast();
    const { user } = useAuth();

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [editData, setEditData] = useState(null);

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [search, setSearch] = useState("");

    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchServices();
    }, [page, search]);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const params = {
                page: page - 1,
                limit,
                search,
                status: "OFFER",
                sort: "desc",
            };

            const data = await servicePriceService.getAllServicePrices(params);
            setServices(data?.content || []);
            setTotalPages(data?.totalPages || 1);
        } catch (error) {
            toast({
                title: "Lỗi tải dữ liệu",
                description: "Không thể tải danh sách bảng giá dịch vụ.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setEditData(item);
        setOpenModal(true);
    };

    const handleDelete = (id) => {
        toast({ title: "Đã xóa", description: `Xóa hồ sơ ID: ${id}` });
    };

    const handleDownload = (fileName) => {
        toast({
            title: "Đang tải xuống",
            description: `Đang tải file: ${fileName}`,
        });
    };

    const handleAddNew = () => {
        setEditData(null);
        setOpenModal(true);
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-16 sm:mt-[80px] pb-16">
                <section className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-16">
                    <div className="max-w-7xl mx-auto px-8 text-center">
                        <h1 className="text-5xl font-bold mb-4">Thông Tin Chào Hàng</h1>
                        <p className="text-xl max-w-2xl mx-auto">
                            Danh sách các dịch vụ chào hàng đang được công khai.
                        </p>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-8 py-16 space-y-6">
                    <div className="flex justify-center items-center">
                        <Input
                            placeholder="Tìm kiếm theo tên hồ sơ..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="bg-white w-1/3"
                        />
                    </div>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-2xl text-primary flex items-center gap-2">
                                <FileText className="w-6 h-6" />
                                Danh sách chào hàng
                            </CardTitle>
                            {user?.role === "ADMIN" && (
                                <Button onClick={handleAddNew} className="flex items-center gap-2">
                                    <Plus className="w-4 h-4" /> Thêm Hồ Sơ
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            <Table className="border border-gray-200 rounded-md">
                                <TableHeader className="bg-gray-100">
                                    <TableRow>
                                        <TableHead className="border border-gray-200 w-[80px]">STT</TableHead>
                                        <TableHead className="border border-gray-200">Tên Dịch Vụ</TableHead>
                                        <TableHead className="border border-gray-200 w-[150px]">Ngày Áp Dụng</TableHead>
                                        <TableHead className="border border-gray-200 w-[120px] text-center">Tải Về</TableHead>
                                        {user?.role === "ADMIN" && (
                                            <TableHead className="border border-gray-200 text-center">Hành Động</TableHead>
                                        )}
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={user?.role === "ADMIN" ? 5 : 4} className="text-center py-6">
                                                Đang tải dữ liệu...
                                            </TableCell>
                                        </TableRow>
                                    ) : services.length > 0 ? (
                                        services.map((item, index) => (
                                            <TableRow key={item.id} className="border border-gray-200">
                                                <TableCell className="text-center border border-gray-200 font-medium">{(page - 1) * limit + index + 1}</TableCell>
                                                <TableCell className="border border-gray-200">{item.title}</TableCell>
                                                <TableCell className="border border-gray-200">{item.effectiveDate || "-"}</TableCell>
                                                <TableCell className="border border-gray-200 text-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            if (item.fileUrl) {
                                                                window.open(item.fileUrl, "_blank");
                                                            } else {
                                                                toast({
                                                                    title: "Không có tệp đính kèm",
                                                                    description: "Hồ sơ này chưa có file để xem.",
                                                                    variant: "destructive",
                                                                });
                                                            }
                                                        }}
                                                        className="text-accent hover:text-accent"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </Button>
                                                </TableCell>
                                                {user?.role === "ADMIN" && (
                                                    <TableCell className="border border-gray-200 flex justify-center gap-2">
                                                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item.id)}>
                                                            <Pencil className="w-4 h-4 text-primary" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                                                            <Trash2 className="w-4 h-4 text-destructive" />
                                                        </Button>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-gray-500 py-6">
                                                Không có dữ liệu
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            <div className="flex justify-end items-center mt-6 gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    Trước
                                </Button>
                                <span className="text-sm text-gray-700">
                                    Trang {page} / {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                >
                                    Sau
                                </Button>
                            </div>
                        </CardContent>
                        <ServicePriceModal
                            open={openModal}
                            onClose={() => setOpenModal(false)}
                            status="OFFER"
                            onSuccess={fetchServices}
                            editData={editData}
                        />
                    </Card>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default TenderInfo;
