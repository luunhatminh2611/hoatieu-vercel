import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { newsMockData } from "@/lib/mockData";

const NewsDetail3 = () => {
    const news = newsMockData.find(
        (n) => n.path === `/news/news-3`
    );

    return (
        <div className="min-h-screen bg-background pt-16 sm:mt-[80px]">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold text-primary mb-6 text-center">
                    THÔNG BÁO <br />
                    VỀ VIỆC THAY ĐỔI ĐỊA CHỈ TRỤ SỞ
                    <br />CÔNG TY CỔ PHẦN HOA TIÊU HÀNG HẢI - TKV
                </h1>

                <article className="prose prose-lg max-w-none text-justify leading-relaxed">
                    <p>
                        Công ty cổ phần Hoa tiêu Hàng hải - TKV thông báo về việc thay đổi địa chỉ
                        trụ sở Công ty từ ngày <b>01/7/2025</b> như sau:
                    </p>

                    <p>
                        <b>Địa chỉ cũ:</b> Phố Hàng Than, Phường Hồng Gai, Hạ Long, Quảng Ninh, Thành phố Hạ Long.
                    </p>

                    <p>
                        <b>Địa chỉ mới:</b> Tầng 10, Trung tâm điều hành sản xuất tại Quảng Ninh - Tập đoàn Công nghiệp Than Khoáng Sản Việt Nam
                        (95A, Lê Thánh Tông, Phường Hồng Gai, Tỉnh Quảng Ninh).
                    </p>

                    <p>
                        Công ty cổ phần Hoa tiêu Hàng hải - TKV thông báo đến các cơ quan, đơn vị có mối liên hệ với Công ty được biết./.
                    </p>
                </article>
            </main>

            <Footer />
        </div>
    );
};

export default NewsDetail3;
