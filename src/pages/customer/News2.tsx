import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { newsMockData } from "@/lib/mockData";

const NewsDetail2 = () => {

  const news = newsMockData.find(
    (n) => n.path === `/news/news-2`
  );

  return (
    <div className="min-h-screen bg-background pt-16 sm:mt-[80px]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-primary mb-6">
          CÔNG BỐ QUYẾT ĐỊNH CHUẨN Y KẾT QUẢ BẦU CỬ BÍ THƯ ĐẢNG ỦY
          VÀ QUYẾT ĐỊNH BỔ NHIỆM GIÁM ĐỐC CÔNG TY CỔ PHẦN HOA TIÊU HÀNG HẢI - TKV
        </h1>

        <article className="prose prose-lg max-w-none text-justify leading-relaxed">
          <p>
            Ngày 06/10/2025, tại trụ sở Công ty cổ phần Hoa tiêu Hàng hải - TKV,
            đã diễn ra Hội nghị công bố, trao quyết định về công tác cán bộ của Công ty.
          </p>
          <p>
            Tham dự chỉ đạo hội nghị có đồng chí Nguyễn Huy Nam, Ủy viên Ban chấp hành Đảng bộ tỉnh,
            Bí thư Đảng ủy Than Quảng Ninh, Phó Tổng Giám đốc Tập đoàn TKV; đồng chí Bùi Xuân Vững,
            UV BTV, Trưởng Ban Tổ chức Đảng ủy Than Quảng Ninh, đồng chí Bùi Văn Tuấn, Thành viên
            Ban Quản lý vốn TKV, Chủ tịch HĐQT Công ty Cổ phần Hoa tiêu Hàng hải - TKV,
            cùng các đồng chí lãnh đạo và cán bộ chủ chốt của Công ty.
          </p>

          <h3 className="mt-6 mb-4 font-semibold">Một số hình ảnh tại hội nghị:</h3>

          <div className="text-center mb-6">
            <img
              src={news.image2}
              alt="Quang cảnh hội nghị"
              className="w-full h-auto rounded-lg mb-2"
            />
            <i className="px-6">Quang cảnh hội nghị công bố quyết định chuẩn y Bí thư Đảng ủy và quyết định bổ nhiệm Giám đốc
              Công ty cổ phần Hoa tiêu hàng hải - TKV</i>
          </div>

          <div className="text-center my-6">
            <img
              src={news.image3}
              alt="Trao quyết định chuẩn y"
              className="w-full h-auto rounded-lg mb-2"
            />
            <i>Đồng chí Bùi Xuân Vững, UV BTV, Trưởng Ban Tổ chức Đảng ủy Than Quảng Ninh công bố
              các quyết định chuẩn y Bí thư Đảng ủy và quyết  định bổ nhiệm Giám đốc Công ty cổ phần Hoa tiêu hàng hải - TKV</i>
          </div>

          <div className="text-center my-6">
            <img
              src={news.image4}
              alt="Trao quyết định chuẩn y"
              className="w-full h-auto rounded-lg mb-2"
            />
            <i>Đồng chí Nguyễn Huy Nam, UVBCH Đảng bộ tỉnh, Bí thư Đảng ủy Than Quảng Ninh, Phó Tổng Giám đốc Tập đoàn TKV phát biểu chỉ đạo</i>
          </div>

          <p>
            Tại hội nghị, Ban Tổ chức Đảng ủy Than Quảng Ninh đã công bố quyết định của Ban Thường vụ
            Đảng ủy Than Quảng Ninh chuẩn y kết quả bầu cử đồng chí <b>Phạm Tuấn Phong</b>,
            Phó bí thư Đảng ủy, Giám đốc Công ty cổ phần Hoa tiêu hàng hải - TKV giữ chức vụ
            <b> Bí thư Đảng ủy Công ty khóa V, nhiệm kỳ 2025-2030</b> và quyết định của HĐQT Công ty
            về việc bổ nhiệm đồng chí giữ chức vụ <b>Giám đốc Công ty cổ phần Hoa tiêu Hàng hải - TKV</b>.
          </p>

          <p>
            Phát biểu giao nhiệm vụ, đồng chí Nguyễn Huy Nam chúc mừng và bày tỏ sự tin tưởng sâu sắc đối với
            đồng chí Phạm Tuấn Phong, một cán bộ trưởng thành từ thực tiễn sản xuất với hơn 19 năm gắn bó
            và cống hiến tại Công ty. Đồng chí nhấn mạnh: “Tôi tin tưởng rằng trong thời gian tới,
            đồng chí Phạm Tuấn Phong trên cương vị Bí thư Đảng ủy, Giám đốc Công ty sẽ tiếp tục nỗ lực
            phấn đấu để hoàn thành tốt nhiệm vụ được giao”.
          </p>

          <p>
            Đồng chí cũng đề nghị tân Bí thư Đảng ủy, Giám đốc công ty sẽ cùng tập thể lãnh đạo,
            chỉ đạo đơn vị vượt qua thách thức, nắm bắt cơ hội từ xu hướng chuyển đổi số,
            nghiên cứu mở rộng sản xuất và lĩnh vực ngành nghề mới, tạo điều kiện công ty
            phát triển ổn định, bền vững.
          </p>

          <div className="text-center my-6">
            <img
              src={news.image5}
              alt="Trao quyết định bổ nhiệm Giám đốc"
              className="w-full h-auto rounded-lg mb-2"
            />
            <i> Đồng chí Nguyễn Huy Nam, UVBCH Đảng bộ tỉnh, Bí thư Đảng ủy Than Quảng Ninh, Phó Tổng Giám đốc Tập đoàn TKV
              trao Quyết định chuẩn y Bí thư Đảng ủy công ty cho đồng chí Phạm Tuấn Phong</i>
          </div>

          <div className="text-center mt-6">
            <img
              src={news.image6}
              alt="Phát biểu nhận chức"
              className="w-full h-auto rounded-lg mb-2"
            />
            <i>Đồng chí Bùi Văn Tuấn, TVBQL vốn TKV, chủ tịch HĐQT công ty trao quyết định
              bổ  nhiệm Giám đốc Công ty cổ phần Hoa tiêu Hàng hải - TKV</i>
          </div>

          <div className="text-center mt-6">
            <img
              src={news.image7}
              alt="Phát biểu nhận chức"
              className="w-full h-auto rounded-lg mb-2"
            />
            <i>Đồng chí Phạm Tuấn Phong phát biểu nhận chức tại Hội nghị</i>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default NewsDetail2;
