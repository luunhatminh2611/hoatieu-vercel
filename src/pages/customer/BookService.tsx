import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { orderService } from "@/services/api/order"; // ✅ import API

const BookService = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    companyAddress: "",
    phone: "",
    fax: "",
    email: "",
    taxCode: "",

    shipName: "",
    nationality: "",
    callSign: "",
    loa: "",
    beam: "",
    draftF: "",
    draftA: "",
    shipType: "",
    gt: "",
    nt: "",
    route: "",
    dwt: "",
    cargo: "",
    cargoType: "",
    needTugboat: "no",
    supportShip: "",

    entryFrom: "",
    entryTo: "",
    entryDateTime: "", // ✅ gộp ngày & giờ
    departFrom: "",
    departTo: "",
    departDateTime: "", // ✅ gộp ngày & giờ

    portOfDeparture: "",
    portOfArrival: "",
    nextPort: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.companyName || !formData.shipName || !formData.entryDateTime) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        agentName: formData.companyName,
        agentAddress: formData.companyAddress,
        agentPhone: formData.phone,
        agentFax: formData.fax,
        agentEmail: formData.email,
        taxCode: formData.taxCode,
        customerCompany: formData.companyName,
        customerAddress: formData.companyAddress,

        shipName: formData.shipName,
        shipNationality: formData.nationality,
        callSign: formData.callSign,
        shipType: formData.shipType,
        shipLOA: Number(formData.loa) || 0,
        shipBeam: Number(formData.beam) || 0,
        draftF: Number(formData.draftF) || 0,
        draftA: Number(formData.draftA) || 0,
        shipGT: Number(formData.gt) || 0,
        netTonnage: Number(formData.nt) || 0,
        shipDWT: Number(formData.dwt) || 0,
        businessRoute: formData.route,
        cargo: formData.cargo,
        cargoType: formData.cargoType,
        hasPilotBoat: formData.needTugboat === "yes",
        channelBoat: formData.needTugboat === "yes",
        arrivalFrom: formData.entryFrom,
        arrivalTo: formData.entryTo,
        arrivalTime: new Date(formData.entryDateTime).toISOString(),
        arrivalDate: formData.entryDateTime.split("T")[0],
        departureFrom: formData.departFrom,
        departureTo: formData.departTo,
        departureTime: new Date(formData.departDateTime).toISOString(),
        departureDate: formData.departDateTime.split("T")[0],
        portDeparture: formData.portOfDeparture,
        portArrival: formData.portOfArrival,
        nextPortArrival: formData.nextPort,
        paymentMethod: "Chuyển khoản",
      };

      await orderService.createOrder(payload);

      toast({
        title: "Thành công",
        description: "Đã gửi yêu cầu hoa tiêu thành công!",
      });

      navigate("/");
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể gửi yêu cầu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-ocean-light">
      <Navbar />

      <div className="container mx-auto px-4 pt-16 sm:mt-[90px] pb-6 md:pt-28 md:pb-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Đặt Dịch Vụ Hoa Tiêu</CardTitle>
            <CardDescription className="text-sm md:text-base">
              Vui lòng điền đầy đủ thông tin về đại lý, tàu và lịch trình
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Đại lý */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Thông tin đại lý/chủ tàu</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="companyName">
                      Tên đại lý/chủ tàu <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="companyName"
                      placeholder="Nhập tên đại lý/chủ tàu"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="companyAddress">Địa chỉ đại lý</Label>
                    <Input
                      id="companyAddress"
                      placeholder="Nhập địa chỉ"
                      value={formData.companyAddress}
                      onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      placeholder="Nhập số điện thoại"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fax">Fax</Label>
                    <Input
                      id="fax"
                      placeholder="Nhập số fax"
                      value={formData.fax}
                      onChange={(e) => setFormData({ ...formData, fax: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Nhập email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxCode">Mã số thuế</Label>
                    <Input
                      id="taxCode"
                      placeholder="Nhập mã số thuế"
                      value={formData.taxCode}
                      onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Thông số kỹ thuật tàu */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Thông số kỹ thuật của tàu</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shipName">
                      Tàu <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="shipName"
                      placeholder="Tên tàu"
                      value={formData.shipName}
                      onChange={(e) => setFormData({ ...formData, shipName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nationality">Quốc tịch</Label>
                    <Input
                      id="nationality"
                      placeholder="Quốc tịch"
                      value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="callSign">Hô hiệu</Label>
                    <Input
                      id="callSign"
                      placeholder="Hô hiệu"
                      value={formData.callSign}
                      onChange={(e) => setFormData({ ...formData, callSign: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shipType">Loại tàu</Label>
                    <Input
                      id="shipType"
                      placeholder="Nhập loại tàu (VD: Cargo, Container...)"
                      value={formData.shipType}
                      onChange={(e) => setFormData({ ...formData, shipType: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="loa">LOA (m)</Label>
                    <Input
                      id="loa"
                      placeholder="Chiều dài"
                      value={formData.loa}
                      onChange={(e) => setFormData({ ...formData, loa: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="beam">Beam (m)</Label>
                    <Input
                      id="beam"
                      placeholder="Chiều rộng"
                      value={formData.beam}
                      onChange={(e) => setFormData({ ...formData, beam: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="draftF">Draft F (m)</Label>
                    <Input
                      id="draftF"
                      placeholder="Mớn nước mũi"
                      value={formData.draftF}
                      onChange={(e) => setFormData({ ...formData, draftF: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="draftA">Draft A (m)</Label>
                    <Input
                      id="draftA"
                      placeholder="Mớn nước lái"
                      value={formData.draftA}
                      onChange={(e) => setFormData({ ...formData, draftA: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gt">GT</Label>
                    <Input
                      id="gt"
                      placeholder="Tổng dung tích"
                      value={formData.gt}
                      onChange={(e) => setFormData({ ...formData, gt: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nt">NT</Label>
                    <Input
                      id="nt"
                      placeholder="Dung tích ròng"
                      value={formData.nt}
                      onChange={(e) => setFormData({ ...formData, nt: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="route">HĐKĐ tuyến</Label>
                    <Input
                      id="route"
                      placeholder="Tuyến hoạt động"
                      value={formData.route}
                      onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dwt">DWT</Label>
                    <Input
                      id="dwt"
                      placeholder="Trọng tải"
                      value={formData.dwt}
                      onChange={(e) => setFormData({ ...formData, dwt: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cargo">Hàng hóa</Label>
                    <Input
                      id="cargo"
                      placeholder="Hàng hóa"
                      value={formData.cargo}
                      onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="cargoType">Loại hàng hóa</Label>
                    <Input
                      id="cargoType"
                      placeholder="Loại hàng hóa"
                      value={formData.cargoType}
                      onChange={(e) => setFormData({ ...formData, cargoType: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Ca nô đẹp luồng</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="needTugboat"
                        value="yes"
                        checked={formData.needTugboat === "yes"}
                        onChange={(e) => setFormData({ ...formData, needTugboat: e.target.value })}
                        className="w-4 h-4"
                      />
                      <span>Có</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="needTugboat"
                        value="no"
                        checked={formData.needTugboat === "no"}
                        onChange={(e) => setFormData({ ...formData, needTugboat: e.target.value })}
                        className="w-4 h-4"
                      />
                      <span>Không</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Tàu lai hỗ trợ */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Tàu lai hỗ trợ (nếu có)</h3>
                <div className="space-y-2">
                  <Input
                    id="supportShip"
                    placeholder="Nhập tên tàu lai hỗ trợ"
                    value={formData.supportShip}
                    onChange={(e) => setFormData({ ...formData, supportShip: e.target.value })}
                  />
                </div>
              </div>

              {/* Lịch trình VÀO */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Lịch trình VÀO</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="entryFrom">Từ</Label>
                    <Input
                      id="entryFrom"
                      value={formData.entryFrom}
                      onChange={(e) => setFormData({ ...formData, entryFrom: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="entryTo">Đến</Label>
                    <Input
                      id="entryTo"
                      value={formData.entryTo}
                      onChange={(e) => setFormData({ ...formData, entryTo: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <Label htmlFor="entryDateTime">Thời gian</Label>
                    <Input
                      id="entryDateTime"
                      type="datetime-local"
                      value={formData.entryDateTime}
                      onChange={(e) =>
                        setFormData({ ...formData, entryDateTime: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Lịch trình RỜI */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Lịch trình RỜI</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="departFrom">Từ</Label>
                    <Input
                      id="departFrom"
                      value={formData.departFrom}
                      onChange={(e) => setFormData({ ...formData, departFrom: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departTo">Đến</Label>
                    <Input
                      id="departTo"
                      value={formData.departTo}
                      onChange={(e) => setFormData({ ...formData, departTo: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <Label htmlFor="departDateTime">Thời gian</Label>
                    <Input
                      id="departDateTime"
                      type="datetime-local"
                      value={formData.departDateTime}
                      onChange={(e) =>
                        setFormData({ ...formData, departDateTime: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Thông tin cảng</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="portOfDeparture">Cảng rời</Label>
                    <Input
                      id="portOfDeparture"
                      placeholder="Cảng rời"
                      value={formData.portOfDeparture}
                      onChange={(e) => setFormData({ ...formData, portOfDeparture: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portOfArrival">Cảng đến</Label>
                    <Input
                      id="portOfArrival"
                      placeholder="Cảng đến"
                      value={formData.portOfArrival}
                      onChange={(e) => setFormData({ ...formData, portOfArrival: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nextPort">Cảng đến tiếp theo</Label>
                    <Input
                      id="nextPort"
                      placeholder="Cảng đến tiếp theo"
                      value={formData.nextPort}
                      onChange={(e) => setFormData({ ...formData, nextPort: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Đang gửi..." : "Gửi yêu cầu"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                >
                  Hủy
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookService;
