import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg font-bold">
                Cơ quan: CÔNG TY CỔ PHẨN HOA TIÊU HÀNG HẢI - TKV
              </span>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Ðịa chỉ: Tầng 10, Trung tâm điều hành sản xuất tại Quảng Ninh - Tập đoàn Công nghiệp Than Khoáng Sản Việt Nam (95A, Lê Thánh Tông, Phường Hồng Gai, Tỉnh Quảng Ninh)
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Liên Kết</h4>
            <div className="space-y-2 text-sm">
              <div><Link to="/" className="hover:text-accent">Trang chủ</Link></div>
              <div><Link to="/about" className="hover:text-accent">Giới thiệu</Link></div>
              <div><Link to="/price" className="hover:text-accent">Bảng giá Dịch vụ</Link></div>
              <div><Link to="/news" className="hover:text-accent">Tin tức</Link></div>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Liên Hệ</h4>
            <div className="space-y-2 text-sm text-primary-foreground/80">
              <div>Email: tkv.tcldhc@gmail.com</div>
              <div>Điện thoại: 0203 3659 855. Fax: 0203.3811919</div>
              <div>Trực ban hoa tiêu: 0203 365 9955. Fax: 0203.3659922</div>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Giờ Làm Việc</h4>
            <div className="space-y-2 text-sm text-primary-foreground/80">
              <div>Hỗ trợ 24/7</div>
              <div>Văn phòng: 8:00 - 17:00</div>
              <div>Thứ 2 - Chủ nhật</div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/80">
          © 2018 CÔNG TY CỔ PHẨN HOA TIÊU HÀNG HẢI - TKV
        </div>
      </div>
    </footer>
  );
};

export default Footer;
