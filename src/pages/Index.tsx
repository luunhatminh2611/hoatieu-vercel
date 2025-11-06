import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Anchor, Ship, Users, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-maritime.jpg";
import Footer from "@/components/Footer";
const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden pt-16 sm:mt-[152px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-navy/70" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Dịch Vụ Hoa Tiêu Chuyên Nghiệp
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Đảm bảo an toàn và hiệu quả cho mọi chuyến hành trình trên biển
          </p>
          <Link to="/customer/book-service">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-lg px-8 py-6">
              Đặt Dịch Vụ Ngay
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-ocean-light">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary">
            Dịch Vụ Của Chúng Tôi
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Ship className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-primary">Dẫn Tàu An Toàn</h3>
                <p className="text-muted-foreground">
                  Dịch vụ dẫn tàu chuyên nghiệp với đội ngũ hoa tiêu giàu kinh nghiệm,
                  đảm bảo an toàn tuyệt đối cho mọi loại tàu.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-primary">Tư Vấn Chuyên Nghiệp</h3>
                <p className="text-muted-foreground">
                  Cung cấp tư vấn về tuyến đường, thời tiết, và các quy định hàng hải
                  để tối ưu hóa hành trình.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-primary">Hỗ Trợ 24/7</h3>
                <p className="text-muted-foreground">
                  Đội ngũ hỗ trợ sẵn sàng phục vụ 24/7, đảm bảo mọi yêu cầu được
                  xử lý nhanh chóng và hiệu quả.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-ocean text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-lg">Chuyến tàu/tháng</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50+</div>
              <div className="text-lg">Hoa tiêu chuyên nghiệp</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">15+</div>
              <div className="text-lg">Năm kinh nghiệm</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100%</div>
              <div className="text-lg">Cam kết an toàn</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary">
            Tại Sao Chọn Chúng Tôi
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-primary">Kinh Nghiệm Lâu Năm</h3>
                    <p className="text-muted-foreground">
                      Hơn 15 năm hoạt động trong lĩnh vực hoa tiêu, phục vụ hàng nghìn chuyến tàu thành công.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold">
                      2
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-primary">Đội Ngũ Chuyên Nghiệp</h3>
                    <p className="text-muted-foreground">
                      Hoa tiêu được đào tạo bài bản, có chứng chỉ quốc tế và kinh nghiệm thực tế phong phú.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center text-white font-bold">
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-primary">Công Nghệ Hiện Đại</h3>
                    <p className="text-muted-foreground">
                      Ứng dụng công nghệ tiên tiến trong quản lý và điều phối, tối ưu hóa quy trình làm việc.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-ocean-light p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-primary">Đặt Dịch Vụ Ngay</h3>
              <p className="text-muted-foreground mb-6">
                Đăng ký tài khoản để bắt đầu sử dụng dịch vụ hoa tiêu chuyên nghiệp của chúng tôi.
              </p>
              <Link to="/auth?mode=signup">
                <Button size="lg" className="w-full bg-primary hover:bg-primary-light">
                  Đăng ký ngay
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
