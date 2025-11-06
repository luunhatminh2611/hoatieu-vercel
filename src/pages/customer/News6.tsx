import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { newsMockData } from "@/lib/mockData";

const NewsDetail6 = () => {
  const news = newsMockData.find((n) => n.path === `/news/news-6`);

  return (
    <div className="min-h-screen bg-background pt-16 sm:mt-[80px]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center leading-snug">
          HỘI NGHỊ TỔNG KẾT HOẠT ĐỘNG SXKD NĂM 2024 <br />
          VÀ HỘI NGHỊ NGƯỜI LAO ĐỘNG NĂM 2025
        </h1>

        <article className="prose prose-lg max-w-none text-justify leading-relaxed">
          <p>
            Chiều 3/1/2025, Công ty CP Hoa tiêu Hàng hải - TKV đã tổ chức thành công Hội nghị tổng kết hoạt động sản xuất, kinh doanh năm 2024
            và Hội nghị người lao động năm 2025. Dự hội nghị đại diện lãnh đạo Ban kiểm soát Nhà nước tại TKV, Công đoàn TKV, Đảng ủy TQN; các Ban
            Sản xuất Than, Kế toán tài chính Tập đoàn, lãnh đạo và gần 70 đại biểu người lao động Công ty…
          </p>

          <p>
            Thực hiện kế hoạch sản xuất, kinh doanh năm 2024 trong điều kiện nhiều khó khăn, thách thức, song Công ty CP Hoa tiêu Hàng hải - TKV đã
            bám sát chỉ đạo của Tập đoàn và kế hoạch sản xuất, kinh doanh, chủ động, nỗ lực triển khai kịp thời các giải pháp, khắc phục khó khăn,
            hoàn thành vượt mức các chỉ tiêu kế hoạch SXKD năm 2024. Công ty đã thực hiện 3.000 lượt dẫn tàu đảm bảo an toàn, kịp thời, hiệu quả, bằng
            103,4% kế hoạch năm; tổng doanh thu đạt trên 55,1 tỷ đồng, vượt 14% so với kế hoạch năm; lợi nhuận đạt trên 4 tỷ đồng, vượt 50% so với kế hoạch;
            thu nhập bình quân của người lao động đạt trên 26,8 triệu đồng/ng/thg, vượt 10,8% so với kế hoạch. Công tác đưa, đón tàu kịp thời, an toàn,
            không để xảy ra ách tắc, góp phần cho dây chuyền tiêu thụ than của Tập đoàn cũng như hàng hóa khác qua cảng Cẩm Phả diễn ra thuận lợi, an toàn.
          </p>

          <p>
            Trước những ảnh hưởng của bão số 3, Công ty đã nhanh chóng triển khai công tác khắc phục hậu quả, sửa chữa và đưa vào vận hành trở lại kịp thời
            5 phương tiện thủy, các hạng mục công trình bị ảnh hưởng; tập trung dọn dẹp vệ sinh; hỗ trợ và thăm hỏi gia đình công nhân, lao động bị ảnh hưởng của bão.
          </p>

          <p>
            Năm 2025, đơn vị đặt mục tiêu hoàn thành trên 3.000 lượt dẫn tàu; tổng doanh thu 50,6 tỷ đồng, lợi nhuận 2,8 tỷ đồng, ổn định việc làm,
            các chế độ phúc lợi và tiền lương cho người lao động với mức thu nhập bình quân trên 25,1 triệu đồng/ng/thg.
          </p>

          <p>
            Phát biểu tại hội nghị, đồng chí Nguyễn Quang Tê, Uỷ viên Ban Thường vụ, Trưởng Ban Tuyên giáo - Nữ công Công đoàn TKV chúc mừng và đánh giá cao
            những nỗ lực cố gắng và kết quả đạt được năm 2024 của đơn vị. Đồng thời, đề nghị Công đoàn Công ty tiếp tục phối hợp với chuyên môn đẩy mạnh phong trào
            thi đua chào mừng các ngày lễ lớn và Đại hội Đảng các cấp, phấn đấu hoàn thành vượt mức các chỉ tiêu kế hoạch, nhiệm vụ năm 2025; vận động người lao động
            thi đua LĐSX, hoàn thành tốt nhiệm vụ được giao, tích cực tham gia phát huy sáng kiến, đề tài khoa học; phát huy dân chủ cơ sở, công tác kiểm tra giám sát;
            tiếp tục chăm lo các chế độ phúc lợi, đời sống cho người lao động, tổ chức cho người lao động đón Tết nguyên đán Ất Tỵ 2025 đủ đầy, vui tươi, đầm ấm.
          </p>

          <p>
            Chủ tịch HĐQT Công ty Nguyễn Văn Tứ cũng đánh giá cao công tác chỉ đạo, điều hành, kết quả SXKD đạt được và đề nghị Công ty tiếp tục nghiên cứu đẩy mạnh mở rộng
            thị trường, triển khai các giải pháp đảm bảo hoàn thành kế hoạch 2025, không để ách tắc lưu thông hàng hóa, đảm bảo an toàn vùng biển, vùng cảng, an ninh hàng hải;
            chủ động thực hiện tốt công tác phòng chống mưa bão; đào tạo, bồi dưỡng hạng hoa tiêu đáp ứng lực lượng lao động cho sản xuất; đẩy mạnh ứng dụng KHCN, công nghệ thông tin,
            chuyển đổi số để nâng cao hiệu quả sản xuất, đảm bảo cung ứng dịch vụ hoa tiêu chất lượng, an toàn.
          </p>

          <div className="text-center mt-6 mb-8">
            <img src={news.image2} alt="Quang cảnh hội nghị tổng kết SXKD năm 2024, Hội nghị người lao động năm 2025" className="w-full h-auto rounded-lg mb-2" />
            <i>Quang cảnh hội nghị Tổng kết SXKD năm 2024, Hội nghị người lao động năm 2025</i>
          </div>

          <div className="text-center mb-8">
            <img src={news.image3} alt="Đ/c Trần Đạo báo cáo kết quả hoạt động SXKD năm 2024" className="w-full h-auto rounded-lg mb-2" />
            <i>Đ/c Trần Đạo – Giám đốc Công ty báo cáo kết quả hoạt động SXKD năm 2024 và phương hướng, nhiệm vụ năm 2025</i>
          </div>

          <div className="text-center mb-8">
            <img src={news.image4} alt="Đ/c Nguyễn Quang Tê phát biểu chỉ đạo hội nghị" className="w-full h-auto rounded-lg mb-2" />
            <i>Đ/c Nguyễn Quang Tê – UVBTV, Trưởng Ban Tuyên giáo - Nữ công Công đoàn TKV phát biểu chỉ đạo hội nghị</i>
          </div>

          <div className="text-center mb-8">
            <img src={news.image5} alt="Đ/c Nguyễn Văn Tứ phát biểu kết luận hội nghị" className="w-full h-auto rounded-lg mb-2" />
            <i>Đ/c Nguyễn Văn Tứ – Chủ tịch HĐQT Công ty phát biểu kết luận hội nghị</i>
          </div>

          <div className="text-center mb-8">
            <img src={news.image6} alt="Hội nghị lấy phiếu tín nhiệm và bầu đại biểu" className="w-full h-auto rounded-lg mb-2" />
            <i>Hội nghị lấy phiếu tín nhiệm cán bộ quản lý, bầu Ban thanh tra nhân dân và đại biểu dự Hội nghị NLĐ cấp Tập đoàn năm 2025</i>
          </div>

          <div className="text-center mb-8">
            <img src={news.image7} alt="Khen thưởng các tập thể đạt thành tích xuất sắc" className="w-full h-auto rounded-lg mb-2" />
            <i>Khen thưởng các tập thể đạt thành tích xuất sắc trong sản xuất, kinh doanh năm 2024</i>
          </div>

          <div className="text-center mb-8">
            <img src={news.image8} alt="Lãnh đạo Công đoàn TKV trao giấy chứng nhận Thợ mỏ sáng tạo" className="w-full h-auto rounded-lg mb-2" />
            <i>Lãnh đạo Công đoàn TKV trao giấy chứng nhận “Thợ mỏ sáng tạo năm 2023” cho Đ/c Trần Đạo – Giám đốc Công ty</i>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default NewsDetail6;
