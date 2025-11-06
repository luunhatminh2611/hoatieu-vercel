import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { newsMockData } from "@/lib/mockData";

const NewsDetail = () => {

    const news = newsMockData.find(
        (n) => n.path === `/news/news-1`
    );

    return (
        <div className="min-h-screen bg-background pt-16 sm:mt-[80px]">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold text-primary mb-6">{news.title}</h1>

                <article className="prose prose-lg max-w-none text-justify leading-relaxed">
                    <p>
                        Từ ngày 21/10-31/10/2025, Công ty cổ phần Hoa tiêu Hàng hải - TKV có kế hoạch
                        cử 21 hoa tiêu viên chia làm 02 đoàn tham gia khóa học nâng cao nghiệp vụ Hoa tiêu
                        dẫn tàu tại phòng học Công ty TNHH phát triển nguồn nhân lực Tân Cảng – STC, phường
                        Cát Lái, Tp Hồ Chí Minh. Đoàn 01 đã kết thúc khóa học vào ngày 24/10/2025.
                    </p>
                    <p>
                        Khóa học được tổ chức với mục tiêu bổ sung, cập nhật kiến thức chuyên môn, kỹ thuật
                        điều động tàu trong các điều kiện phức tạp như: thời tiết xấu, vùng nước hẹp, cảng mới,
                        tàu có trọng tải lớn hoặc tàu đặc chủng...
                    </p>
                    <p>
                        Giảng viên tham gia giảng dạy là chuyên gia có nhiều năm kinh nghiệm trong ngành hàng hải,
                        học viên được học lý thuyết kết hợp thực hành mô phỏng trên buồng lái hiện đại, qua đó nâng cao
                        khả năng phản ứng và xử lý tình huống thực tế.
                    </p>
                    <p>
                        Kết thúc khóa học, các học viên đã được kiểm tra, đánh giá và cấp chứng nhận hoàn thành khóa đào tạo.
                        Khóa học là một trong những hoạt động thiết thực của công ty trong việc xây dựng đội ngũ hoa tiêu
                        chuyên nghiệp, có trình độ cao, đáp ứng yêu cầu phát triển của ngành hàng hải trong thời kỳ hội nhập quốc tế.
                    </p>

                    <h3 className="mt-6 mb-4 font-semibold">Một số hình ảnh tại khóa học:</h3>
                    <div className="text-center">
                        <img
                            src={news.image}
                            alt={news.title}
                            className="w-full h-auto rounded-lg mb-2"
                        />
                        <i>Các hoa tiêu viên học tại phòng học</i>
                    </div>
                    <div className="text-center mt-6">
                        <img
                            src={news.image2}
                            alt="Các hoa tiêu viên đi thực tế trên tàu vào cảng"
                            className="w-full h-auto rounded-lg mb-2"
                        />
                        <i>Các hoa tiêu viên đi thực tế trên tàu vào cảng</i>
                    </div>
                    <div className="text-center mt-6">
                        <img
                            src={news.image3}
                            alt="Các hoa tiêu viên nhận chứng nhận hoàn thành khóa học"
                            className="w-full h-auto rounded-lg mb-2"
                        />
                        <i>Các hoa tiêu viên nhận chứng nhận hoàn thành khóa học</i>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
};

export default NewsDetail;
