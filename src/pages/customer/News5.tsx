import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { newsMockData } from "@/lib/mockData";

const NewsDetail5 = () => {
  const news = newsMockData.find((n) => n.path === `/news/news-5`);

  return (
    <div className="min-h-screen bg-background pt-16 sm:mt-[80px]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-primary mb-6">
          ĐẠI HỘI LẦN THỨ V NHIỆM KỲ 2025-2030 <br />
          ĐẢNG BỘ CÔNG TY CỔ PHẦN HOA TIÊU HÀNG HẢI - TKV THÀNH CÔNG TỐT ĐẸP
        </h1>

        <article className="prose prose-lg max-w-none text-justify leading-relaxed">
          <p>
            Ngày 10/04/2025, Đại hội đảng viên lần thứ V, nhiệm kỳ 2025 - 2030 Đảng bộ Công ty cổ phần Hoa tiêu
            Hàng hải – TKV đã tổ chức thành công tốt đẹp. Dự đại hội có đồng chí Lã Tuấn Quỳnh, Ủy viên Ban
            Thường vụ, Chủ nhiệm Ủy ban Kiểm tra Đảng ủy Than Quảng Ninh; lãnh đạo Ban Tuyên giáo Đảng ủy Than
            Quảng Ninh; các đồng chí: Nguyễn Văn Tứ, Chủ tịch HĐQT; Vũ Thị Dung, Trưởng ban kiểm soát Công ty và
            52 đảng viên của Đảng bộ.
          </p>

          <div className="text-center mt-6 mb-8">
            <img src={news.image} alt="Các đại biểu dự Đại hội thực hiện nghi thức chào cờ" className="w-full h-auto rounded-lg mb-2" />
            <i>Các đại biểu dự Đại hội thực hiện nghi thức chào cờ</i>
          </div>

          <p>
            Nhiệm kỳ 2020 - 2025, bám sát sự chỉ đạo của Đảng ủy Than Quảng Ninh, Đảng ủy Công ty cổ phần Hoa tiêu Hàng hải-TKV đã lãnh đạo, chỉ đạo thực hiện thắng lợi các nhiệm vụ xây dựng Đảng và thực hiện nhiệm vụ chính trị,
            kế hoạch sản xuất, kinh doanh. Hàng năm, Đảng bộ Công ty đều được cấp trên đánh giá xếp loại hoàn thành tốt nhiệm vụ trở lên; 100% các chi bộ đều hoàn thành và hoàn thành tốt nhiệm vụ; 98% đảng viên tốt nhiệm vụ; kết
            nạp đảng viên thực hiện vượt chỉ tiêu Nghị quyết Đại hội đề ra với tổng số 14 đảng viên mới kết nạp, bằng 6,5% (Nghị quyết đề ra 5%); xây dựng và biểu dương 80 cá nhân tiêu biểu hình ảnh “Người thợ mỏ - Người chiến sỹ”…,
            Về lãnh đạo thực hiện kế hoạch SXKD: Tổng doanh thu đạt 282,2 tỷ đồng, bằng 111% so với nghị quyết; Lợi nhuận: 28,3tỷ đồng, bằng 188% so với nghị quyết; năng suất lao động bằng 110% so với nghị quyết; thu nhập bình quân 27,2 triệu đồng/người/tháng, bằng bằng 112% so với nghị quyết ….
          </p>

          <p>
            Những kết quả đó đã tạo khí thế phấn khởi cho cán bộ, đảng viên và người lao động Công ty tự tin bước
            vào nhiệm kỳ 2025 - 2030 với mục tiêu “An toàn - Đoàn kết - Dân chủ - Đổi mới - Phát triển”, xây dựng
            Đảng bộ và hệ thống chính trị trong sạch, vững mạnh; Công ty phát triển bền vững.Phấn đấu Đến năm 2030, "Chi bộ bốn tốt" và xếp loại
            "Hoàn thành tốt nhiệm vụ" đạt từ 90 % trở lên; Hằng năm, có từ 90% đảng viên được đánh giá, xếp loại đạt mức hoàn thành tốt nhiệm vụ trở lên. Đảng bộ Công ty và các tổ chức đoàn thể hoàn thành tốt nhiệm vụ trở lên;
            Phấn đấu tổng doanh thu đạt 257,8 tỷ đồng; Lợi nhuận: 15 tỷ đồng; Tăng thu nhập bình quân từ 5-7%/năm so với kế hoạch TKV giao
          </p>

          <div className="text-center mt-6 mb-8">
            <img src={news.image3} alt="Đ/c Trần Đạo, Bí thư Đảng uỷ, trình bày báo cáo kiểm điểm" className="w-full h-auto rounded-lg mb-2" />
            <i>Đ/c Trần Đạo, Bí thư Đảng uỷ, trình bày báo cáo kiểm điểm Ban chấp hành khoá IV</i>
          </div>

          <div className="text-center mb-8">
            <img src={news.image4} alt="Đ/c Lã Tuấn Quỳnh phát biểu chỉ đạo Đại hội" className="w-full h-auto rounded-lg mb-2" />
            <i>Đ/c Lã Tuấn Quỳnh, UVBTV, Chủ nhiệm UBKT Đảng ủy Than Quảng Ninh phát biểu chỉ đạo Đại hội</i>
          </div>

          <p>
            Phát biểu chỉ đạo tại Đại hội, đồng chí Lã Tuấn Quỳnh, UVBTV, chủ nhiệm UBKT Đảng ủy Than Quảng Ninhbiểu dương và đánh giá cao những kết quả, thành tích mà Đảng bộ Công ty cổ phần Hoa tiêu Hàng hải - TKV đạt được trong nhiệm kỳ 2020 - 2025
            . Nhiệm kỳ 2025 - 2030, đồng chí yêu cầu Đảng bộ Công ty cần tiếp tục triển khai có hiệu quả các chủ trương của Đảng uỷ Than Quảng Ninh, Tập đoàn TKV; đẩy mạnh việc học và làm theo tư tưởng, đạo đức, phong cách Chủ tịch Hồ Chí Minh;
            tiếp tục áp dụng tin học hóa, chuyển đổi số vào quản lý; Tăng cường kiểm tra, giám sát, thực hiện tốt công tác chăm lo đời sống, việc làm cho người lao động. Phấn đấu hoàn thành các chỉ tiêu kế hoạch SXKD hàng năm và cả nhiệm kỳ,
            xây dựng Đảng bộ và hệ thống chính trị trong sạch vững mạnh.
          </p>

          <div className="text-center mt-6 mb-8">
            <img src={news.image5} alt="Đảng ủy Than Quảng Ninh chúc mừng Đại hội" className="w-full h-auto rounded-lg mb-2" />
            <i>Đảng ủy Than Quảng Ninh chúc mừng Đại hội Đảng bộ Công ty cổ phần Hoa tiêu Hàng hải - TKV lần thứ V nhiệm kỳ 2025-2030</i>
          </div>

          <div className="text-center mb-8">
            <img src={news.image6} alt="Các đại biểu tiến hành bầu cử" className="w-full h-auto rounded-lg mb-2" />
            <i>Các đại biểu tiến hành bầu cử Ban chấp hành khóa V, nhiệm kỳ 2025-2030</i>
          </div>

          <div className="text-center mb-8">
            <img src={news.image7} alt="Chúc mừng Ban chấp hành mới" className="w-full h-auto rounded-lg mb-2" />
            <i>Đảng ủy Than Quảng Ninh và lãnh đạo công ty chúc mừng Ban chấp hành Đảng bộ Công ty khóa V nhiệm kỳ 2025-2030</i>
          </div>

          <div className="text-center mb-8">
            <img src={news.image8} alt="Đại hội biểu quyết thông qua nghị quyết" className="w-full h-auto rounded-lg mb-2" />
            <i>Đại hội biểu quyết thông qua nghị quyết Đại hội Đảng bộ Công ty lần thứ V, nhiệm kỳ 2025-2030</i>
          </div>

          <p>
            Đại hội đã thống nhất số lượng Ban chấp hành khóa V, nhiệm kỳ 2025 - 2030 gồm 7 đồng chí và tiến hành bầu cử Ban chấp hành; 
            bầu đoàn đại biểu dự Đại hội Đảng bộ Than Quảng Ninh lần thứ VI, nhiệm kỳ 2025 - 2030. Kết quả đồng chí Trần Đạo, 
            Bí thư Đảng ủy Công ty khóa IV, tái đắc cử chức vụ Bí thư Đảng ủy Công ty khóa V nhiệm kỳ 2025-2030.
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default NewsDetail5;
