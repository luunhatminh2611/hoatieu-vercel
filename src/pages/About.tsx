import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import companyBuilding from "@/assets/company-building.jpg";
import teamMeeting from "@/assets/team-meeting.jpg";
import { Anchor, Target, Users, Award } from "lucide-react";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16 sm:pt-[152px] pb-16">
        {/* Hero Section */}
        <section className="relative sm:h-[650px] overflow-hidden">
          <img
            src={companyBuilding}
            alt="Trụ sở công ty"
            className="w-full h-full object-cover"
          />
        </section>

        {/* Company Overview */}
        <section className="max-w-7xl mx-auto px-8 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Về Chúng Tôi</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Công ty Cổ phần Hoa Tiêu Hàng Hải-TKV được thành lập. ngày 4 tháng 4 năm 2006. Năm 2008, Công ty chuyển sang hoạt động mô
                 hình TNHH 1TV 100% vốn Nhà nước, hoạt động dịch vụ hoa tiêu hàng hải là dịch vụ công ích và kinh doanh có điều kiện theo 
                 quy định tại Nghị định số 173/2007/NĐ-CP ngày 28/11/2007 của Chính phủ, nay là Nghị định số 70/2016/NĐ-CP ngày 01/07/2016 của Chính phủ về điều kiện cung cấp dịch vụ đảm bảo an toàn hàng hải.
              </p>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Theo Giấy chứng nhận đăng ký doanh nghiệp công ty trách nhiệm hữu hạn một thành viên số 5700587583 do Sở Kế hoạch và Đầu tư tỉnh Quảng Ninh cấp thay đổi lần thứ bảy ngày 22 tháng 08 năm 2017, 
                Công ty có vốn điều lệ là 16.578.306.696 đồng, trong đó TKV sở hữu 100% vốn điều lệ.
              </p>
              <Link to="/customer/book-service">
                <Button className="mt-4">
                  Đặt dịch vụ ngay
                </Button>
              </Link>
            </div>
            <div>
              <img
                src={teamMeeting}
                alt="Đội ngũ công ty"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-secondary py-16">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                  <div className="text-4xl font-bold text-primary mb-2">25+</div>
                  <p className="text-muted-foreground">Năm kinh nghiệm</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <Anchor className="w-12 h-12 text-primary mx-auto mb-4" />
                  <div className="text-4xl font-bold text-primary mb-2">50+</div>
                  <p className="text-muted-foreground">Hoa tiêu chuyên nghiệp</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                  <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
                  <p className="text-muted-foreground">Chuyến tàu thành công</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                  <div className="text-4xl font-bold text-primary mb-2">100%</div>
                  <p className="text-muted-foreground">An toàn tuyệt đối</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="max-w-7xl mx-auto px-8 py-16">
          <div className="grid md:grid-cols-2 gap-12">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold text-primary mb-4">Mục tiêu</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Kinh doanh có lãi, bảo toàn và phát triển vốn cổ đông đầu tư tại Công ty; hoàn thành các nhiệm vụ do Đại hội cổ đông giao.
                  Tối đa hóa lợi nhuận và hiệu quả sản xuất kinh doanh của Công ty theo kế hoạch; tập trung vốn, phân công chuyên môn hóa và hợp tác sản xuất, nâng cao chất lượng quản lý, chất lượng dịch vụ, hiệu quả đầu tư và kinh doanh, 
                  uy tín và khả năng cạnh tranh; thực hiện nhiệm vụ phát triển sản xuất kinh doanh theo định hướng của ngành
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold text-primary mb-4">Tầm Nhìn</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Hoạt động sản xuất kinh doanh đa ngành nghề, trong đó ngành nghề chính là cung cấp dịch vụ dẫn dắt tàu biển ra, vào trong vùng hoa tiêu hàng hải bắt buộc hoặc tuyến dẫn tàu được giao.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Core Values */}
        <section className="bg-secondary py-16">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="text-3xl font-bold text-primary mb-12 text-center">Giá Trị Cốt Lõi</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <h4 className="text-xl font-bold text-primary mb-3">An Toàn</h4>
                  <p className="text-muted-foreground">
                    An toàn là ưu tiên số một trong mọi hoạt động của chúng tôi.
                    Chúng tôi tuân thủ nghiêm ngặt các quy định và tiêu chuẩn an toàn quốc tế.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h4 className="text-xl font-bold text-primary mb-3">Chuyên Nghiệp</h4>
                  <p className="text-muted-foreground">
                    Đội ngũ hoa tiêu được đào tạo bài bản, có trình độ chuyên môn cao
                    và không ngừng học hỏi, cập nhật kiến thức mới.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h4 className="text-xl font-bold text-primary mb-3">Hiệu Quả</h4>
                  <p className="text-muted-foreground">
                    Chúng tôi tối ưu hóa quy trình làm việc, ứng dụng công nghệ hiện đại
                    để mang lại dịch vụ nhanh chóng và hiệu quả cao nhất.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
