import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { newsMockData } from "@/lib/mockData";

const NewsDetail4 = () => {
    const news = newsMockData.find((n) => n.path === `/news/news-4`);

    return (
        <div className="min-h-screen bg-background pt-16 sm:mt-[80px]">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold text-primary mb-6">
                    ĐẠI HỘI ĐỒNG CỔ ĐÔNG THƯỜNG NIÊN NĂM 2025 <br />
                    CÔNG TY CỔ PHẦN HOA TIÊU HÀNG HẢI - TKV THÀNH CÔNG TỐT ĐẸP
                </h1>

                <article className="prose prose-lg max-w-none text-justify leading-relaxed">
                    <p>
                        Ngày 28/04/2025, Công ty Cổ phần Hoa tiêu Hàng hải - TKV tổ chức thành công Đại hội đồng
                        Cổ đông thường niên năm 2025. Có 15 cổ đông sở hữu và đại diện sở hữu cho 1.615.500 cổ phần
                        có quyền biểu quyết, chiếm 79,9% tổng số cổ phần có quyền biểu quyết dự. Ông Nguyễn Văn Tứ,
                        Chủ tịch Hội đồng quản trị Công ty chủ tọa đại hội.
                    </p>

                    <p>
                        Đại hội đồng cổ đông thường niên năm 2025 Công ty cổ phần Hoa tiêu hàng hải - TKV đã tập trung
                        thảo luận và tiến hành biểu quyết với tỷ lệ nhất trí cao thông qua các nội dung, gồm: Báo cáo
                        hoạt động của Hội đồng quản trị năm 2024 và phương hướng, nhiệm vụ năm 2025; Báo cáo kết quả
                        SXKD năm 2024, nhiệm vụ năm 2025; Báo cáo kế hoạch đầu tư năm 2025; Báo cáo tài chính năm 2024
                        đã được kiểm toán; Báo cáo chi trả tiền lương, thù lao của Hội đồng quản trị, Ban kiểm soát năm
                        2024 và đề xuất năm 2025; Tờ trình phương án phân phối lợi nhuận năm 2024; Báo cáo hoạt động
                        của Ban kiểm soát; Báo cáo thẩm định tài chính năm 2024; Tờ trình lựa chọn công ty kiểm toán
                        năm 2025.
                    </p>

                    <p>
                        Đại hội đã thông qua việc chấp thuận đơn từ nhiệm của ông Nguyễn Văn Tứ, Chủ tịch HĐQT và bầu
                        ông Bùi Văn Tuấn, Cán bộ quản lý vốn của Tập đoàn CN Than - Khoáng sản Việt Nam, làm ủy viên
                        HĐQT nhiệm kỳ 2021-2026. HĐQT công ty họp phiên thứ nhất bầu ông Bùi Văn Tuấn giữ chức Chủ tịch
                        HĐQT nhiệm kỳ 2021-2026.
                    </p>

                    <h3 className="mt-4 mb-4 font-semibold">Một số hình ảnh tại Đại hội:</h3>

                    <div className="text-center mb-8">
                        <img src={news.image} alt="Quang cảnh đại hội cổ đông" className="w-full h-auto rounded-lg mb-2" />
                        <i>Quang cảnh Đại hội cổ đông thường niên năm 2025</i>
                    </div>

                    <div className="text-center mb-8">
                        <img src={news.image3} alt="Các cổ đông biểu quyết" className="w-full h-auto rounded-lg mb-2" />
                        <i>Các cổ đông biểu quyết các nội dung tại Đại hội</i>
                    </div>

                    <p>
                        Các cổ đông ghi nhận kết quả công ty đã đạt được trong năm 2024, mặc dù tình hình thế giới và
                        trong nước có nhiều biến động ảnh hưởng đến hoạt động SXKD; Song Hội đồng quản trị và Ban lãnh
                        đạo công ty với quyết tâm cao đã quản lý, điều hành công ty vượt nghị quyết Đại hội cổ đông
                        năm 2024 giao: Doanh thu đạt 114% kế hoạch; Lợi nhuận đạt 151% kế hoạch; Thu nhập bình quân
                        đạt 121% KH; Tỷ lệ trả cổ tức 8%.
                    </p>

                    <div className="text-center mb-8">
                        <img src={news.image4} alt="Ông Nguyễn Văn Tứ phát biểu" className="w-full h-auto rounded-lg mb-2" />
                        <i>Ông Nguyễn Văn Tứ, Chủ tọa phát biểu điều hành Đại hội</i>
                    </div>

                    <div className="text-center mb-8">
                        <img src={news.image5} alt="Giám đốc công ty báo cáo" className="w-full h-auto rounded-lg mb-2" />
                        <i>Đ/c Trần Đạo, Bí thư, TV HĐQT, Giám đốc Công ty báo cáo</i>
                    </div>

                    <div className="text-center mb-8">
                        <img src={news.image6} alt="Ông Bùi Văn Tuấn phát biểu" className="w-full h-auto rounded-lg mb-2" />
                        <i>Ông Bùi Văn Tuấn, Chủ tịch HĐQT công ty phát biểu</i>
                    </div>

                    <div className="text-center mb-8">
                        <img src={news.image7} alt="Các thành viên HĐQT chụp ảnh lưu niệm" className="w-full h-auto rounded-lg mb-2" />
                        <i>
                            Các thành viên HĐQT, BKS và cổ đông chụp ảnh kỷ niệm cùng ông Nguyễn Văn Tứ và ông Bùi Văn Tuấn, Chủ tịch HĐQT nhiệm kỳ 2021-2026.
                        </i>
                    </div>

                    <p>
                        Đại hội đồng cổ đông thường niên năm 2025 Công ty cổ phần Hoa tiêu Hàng hải - TKV đã thành công
                        tốt đẹp. Các cổ đông nhất trí 100% thông qua các nội dung được trình bày tại Đại hội với mục tiêu
                        xây dựng Công ty cổ phần Hoa tiêu Hàng hải - TKV trở thành đơn vị cung cấp dịch vụ hoa tiêu hàng
                        hải uy tín, đảm bảo an toàn, chất lượng và phát triển bền vững.
                    </p>
                </article>
            </main>

            <Footer />
        </div>
    );
};

export default NewsDetail4;
