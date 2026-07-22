import ReactDOMServer from "react-dom/server";
interface PdfTemplateProps {
  name: string;
  phone: string;
  LiquidationFee?: string;
  TransportationCosts?: string;
  userExt?: any;
  index?: number;
}

const formatDate = (dateString: string | Date): string => {
  // Nếu dateString là một chuỗi, chuyển đổi nó thành đối tượng Date
  const date =
    typeof dateString === "string"
      ? new Date(dateString)
      : dateString;

  // Lấy thông tin về giờ, phút và giây
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  // Lấy thông tin về ngày, tháng và năm
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
  const year = date.getFullYear();

  // Tạo chuỗi định dạng và trả về
  return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
};
const PdfTemplate = (PdfTemplateProps: PdfTemplateProps) => {
  //Defind constant
  //function to render

  const renderTemplate = () => {
    return (
      <>
        <div>
          <div style={{ paddingTop: "25px" }}>
            <p>
              <br />
            </p>
          </div>
          <table
            cellSpacing={0}
            cellPadding={0}
            style={{
              marginRight: "calc(1%)",
              width: "100%",
              fontWeight: "600",
            }}
          >
            <tbody>
              <tr>
                <td>
                  <p style={{ textAlign: "center" }}>
                    <span style={{ fontWeight: "600" }}>
                      CÔNG TY TNHH
                    </span>
                  </p>
                  <p style={{ textAlign: "center" }}>
                    <span style={{ fontWeight: "600" }}>
                      VÀNG BẠC ĐÁ QUÝ VIỆT Á
                    </span>
                  </p>
                  <p style={{ textAlign: "center" }}>
                    <span style={{ fontWeight: "600" }}>
                      ----------------------
                    </span>
                  </p>
                </td>
                <td>
                  <p style={{ textAlign: "center" }}>
                    <span style={{ fontWeight: "600" }}>
                      CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                    </span>
                  </p>
                  <p style={{ textAlign: "center" }}>
                    <span style={{ fontWeight: "600" }}>
                      Độc lập – Tự do – Hạnh phúc
                    </span>
                  </p>
                  <p style={{ textAlign: "center" }}>
                    <span style={{ fontWeight: "600" }}>
                      ------------------------------------
                    </span>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            <span style={{ fontWeight: "600", padding: "5px 0" }}>
              &nbsp;
            </span>
          </p>
          <p
            style={{
              textAlign: "center",
              fontWeight: "600",
              paddingTop: "15px",
              paddingBottom: "7px",
            }}
          >
            <span style={{ fontWeight: "600", fontSize: "large" }}>
              HỢP ĐỒNG KINH TẾ
            </span>
          </p>
          <p
            style={{
              textAlign: "center",
              fontWeight: "600",
              paddingBottom: "10px",
            }}
          >
            <span style={{ fontWeight: "600" }}>
              Số:{" "}
              {PdfTemplateProps.index ? PdfTemplateProps.index : ""}
            </span>
            <span style={{ fontWeight: "600" }}>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            <span style={{ fontWeight: "600" }}>/HĐKT/VAG-KH</span>
          </p>
          <p>
            <span style={{ fontWeight: "600" }}>&nbsp;</span>
          </p>
          <div style={{ width: "100%" }}>
            <div
              style={{ padding: "20px 10%", lineHeight: "1.7rem" }}
            >
              <p>
                <em>
                  - Căn cứ Bộ luật Dân sự số 91/2015/QH13 ngày 24
                  tháng 11 năm 2015;
                </em>
              </p>
              <p>
                <em>
                  - Căn cứ theo Luật Thương mại nước CHXHCN Việt Nam
                  số 36/2005/QH11 ngày 14/06/2005 về Hợp đồng Thương
                  mại;
                </em>
              </p>
              <p>
                <em>- Căn cứ vào nhu cầu và khả năng của hai Bên.</em>
              </p>
              <p style={{ paddingBottom: "15px" }}>
                Hôm nay, ngày&nbsp;&nbsp;&nbsp;&nbsp;
                tháng&nbsp;&nbsp; năm 2024, tại trụ sở CÔNG TY TNHH
                VÀNG BẠC ĐÁ QUÝ VIỆT Á, chúng tôi gồm:
              </p>
              <p style={{ fontWeight: "600" }}>
                <span style={{ fontWeight: "600" }}>
                  Bên Bán (Bên A)
                </span>
                <span style={{ fontWeight: "600" }}>
                  <span>&nbsp;</span>
                </span>
                <span style={{ fontWeight: "600" }}>
                  : CÔNG TY TNHH VÀNG BẠC ĐÁ QUÝ VIỆT Á&nbsp;
                </span>
              </p>
              <p>
                <span style={{ fontWeight: "600" }}>
                  &nbsp;&nbsp;
                </span>
                <span style={{ fontWeight: "600" }}>(VIETAGOLD)</span>
              </p>
              <p>
                Địa chỉ <span>&nbsp;</span>
                <span>&nbsp;</span>: Tầng 01, tòa CT1 khu đô thị Mỹ
                Đình-Mễ Trì, Phường Mỹ Đình
              </p>
              <p>&nbsp;1, quận Nam Từ Liêm, TP Hà Nội</p>
              <p>
                Điện thoại <span>&nbsp;</span>
                <span>&nbsp;</span>: 024.3399.9922
              </p>
              <p>
                Giấy CNĐKKD <span>&nbsp;</span>: 0109416126 do Sở KHĐT
                TP Hà Nội cấp
              </p>
              <p>
                Tài khoản số<span>&nbsp;</span>
                <span>&nbsp;</span>: 88626868 Tại Ngân hàng TMCP Việt
                Á – CN Thăng Long
              </p>
              <p style={{ fontWeight: "600" }}>
                Người đại diện<span>&nbsp;</span>:{" "}
                <span style={{ fontWeight: "600" }}>
                  Ông Hoàng Minh Sang
                </span>
              </p>
              <p>
                Chức vụ<span>&nbsp;</span>
                <span>&nbsp;</span>: Tổng Giám Đốc
              </p>
              <p style={{ fontWeight: "600" }}>
                <span style={{ fontWeight: "600" }}>
                  Bên Mua (Bên B)
                </span>
                <span style={{ fontWeight: "600" }}>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                <span style={{ fontWeight: "600" }}>
                  : {PdfTemplateProps.name}
                </span>
              </p>
              <p>
                Địa chỉ<span>&nbsp;</span>:{" "}
                {PdfTemplateProps.userExt.address}
              </p>
              <p>
                Điện thoại<span>&nbsp;</span>:{" "}
                {PdfTemplateProps.phone}
              </p>
              <p>
                Mã số thuế<span>&nbsp;</span>:{" "}
                {PdfTemplateProps.userExt.taxCode}
              </p>
              <p>
                Đại diện<span>&nbsp;</span>: {PdfTemplateProps.name}
              </p>
              <p>
                Chức vụ &nbsp;: {PdfTemplateProps.userExt.position}
              </p>
              <p>
                <span style={{ fontWeight: "600" }}>
                  Đã thoả thuận ký kết Hợp đồng kinh tế với các điều
                  khoản sau:
                </span>
              </p>
              <p>
                <span style={{ fontWeight: "600" }}>
                  ĐIỀU 1. SẢN PHẨM, GIÁ CẢ VÀ PHƯƠNG THỨC THỰC HIỆN
                  HỢP ĐỒNG
                </span>
              </p>
              <ol type={"1"}>
                <li>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>1.1, Bên A đồng
                  ý bán và gia công sản phẩm vàng trang sức mỹ nghệ
                  999.9 cho bên B thông qua từng đơn hàng cụ thể được
                  hai Bên xác nhận.
                </li>
                <li>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  1.2, Các thông tin cơ bản về sản phẩm: Sản phẩm Kim
                  Phát lộc Trống đồng 50 chỉ, số lượng sản phẩm và đơn
                  giá được nêu chi tiết trong các Đơn đặt hàng.
                </li>
              </ol>
              <p>&nbsp;</p>
              <ol start={3} type={"1"}>
                <li>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>1.3, Phương
                  thức thực hiện hợp đồng
                </li>
              </ol>
              <p>
                <span>-</span>
                <span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                Ngay sau khi hai bên ký kết hợp đồng này, Bên B sẽ đặt
                cọc cho Bên A số tiền: 30.000.000VNĐ (Ba mươi triệu
                đồng.). Số tiền này nhằm đảm bảo việc thực hiện các
                giao dịch sau này giữa Bên A và Bên B. Số tiền này sẽ
                được Bên A hoàn trả lại cho Bên B trong vòng 03 ngày
                kể từ ngày hai bên Thỏa thuận chấm dứt hợp đồng.
              </p>
              <p>
                <span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                - Tại website hỗ trợ giao dịch của Bên A, Bên A sẽ
                cung cấp mã số đăng nhập cho Bên B.
              </p>
              <p>
                <span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                <span>
                  - Trong thời gian hiệu lực của Hợp đồng này, mỗi lần
                  có nhu cầu mua sản phẩm của bên A, Bên B sẽ thực
                  hiện việc đặt hàng thông qua website hỗ trợ giao
                  dịch của Bên A.
                </span>
                <span>&nbsp;&nbsp;</span>
                <span>
                  Giá mua bán sản phẩm sẽ được xác định theo từng thời
                  điểm và được niêm yết trên website hỗ trợ giao dịch
                  của Bên A.
                </span>
              </p>
              <p>
                <span>
                  Giá mua bán sản phẩm sẽ được xác định theo từng thời
                  điểm và được niêm yết trên website hỗ trợ giao dịch
                  của Bên A.
                </span>
              </p>
              <p>
                <span>
                  Ngay sau khi Bên B xác nhận đặt hàng, thông tin Đơn
                  đặt hàng sẽ được gửi vào email của cả hai bên, để
                  thuận tiện cho việc lưu trữ thông tin.
                </span>
              </p>
              <p>
                <span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                - Thanh lý Đơn đặt hàng: Trong thời gian hiệu lực của
                hợp đồng, trường hợp Bên B có nhu cầu thanh lý sản
                phẩm đã đặt hàng, hai bên sẽ xác nhận thông qua
                website hỗ trợ giao dịch của Bên A, giá sẽ được xác
                nhận tại thời điểm Bên B xác nhận thanh lý.
              </p>
              <p>
                <span>
                  Ngay sau khi Bên B xác nhận thanh lý đơn hàng, thông
                  tin thanh lý đơn hàng sẽ được gửi vào email của cả
                  hai bên, để thuận tiện cho việc lưu trữ thông tin.
                </span>
              </p>
              <p>
                Bên B có thể thanh lý toàn bộ hoặc 1 phần của Đơn đặt
                hàng.
              </p>
              <p>
                Khi thực hiện thanh lý Đơn đặt hàng, Bên B sẽ phải
                chịu phí thanh lý hợp đồng, cụ thể:
              </p>
              <table
                cellSpacing={0}
                cellPadding={0}
                style={{
                  marginRight: "calc(0%)",
                  width: "100%",
                  padding: "10px 0",
                }}
              >
                <tbody>
                  <tr
                    style={{
                      border: "1px solid black",
                      padding: "7px",
                    }}
                  >
                    <td style={{ border: "1px solid black" }}>
                      <p style={{ textAlign: "center" }}>
                        <span style={{ fontWeight: "600" }}>TT</span>
                      </p>
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      <p style={{ textAlign: "center" }}>
                        <span style={{ fontWeight: "600" }}>
                          Hạng mục
                        </span>
                      </p>
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      <p style={{ textAlign: "center" }}>
                        <span style={{ fontWeight: "600" }}>
                          Đơn giá/sản phẩm
                        </span>
                      </p>
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid black",
                      padding: "7px",
                    }}
                  >
                    <td style={{ border: "1px solid black" }}>
                      <p style={{ textAlign: "center" }}>1</p>
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      <p style={{ textAlign: "center" }}>
                        Phí thanh lý
                      </p>
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      <p style={{ textAlign: "center" }}>
                        {PdfTemplateProps.LiquidationFee}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p>
                <span style={{ fontWeight: "600" }}>
                  ĐIỀU 2. THỜI GIAN, ĐỊA ĐIỂM VÀ PHƯƠNG THỨC GIAO DỊCH
                </span>
              </p>
              <p>
                <span style={{ fontWeight: "600" }}>2.1</span>
                <span style={{ fontWeight: "600" }}>
                  &nbsp;&nbsp;
                </span>
                <span style={{ fontWeight: "600" }}>
                  <span>&nbsp;</span>
                </span>
                <span style={{ fontWeight: "600" }}>
                  Thời gian giao dịch:&nbsp;
                </span>
              </p>
              <p>
                Từ thứ 2 đến thứ 6 (Trừ những ngày lễ và ngày nghỉ
                theo quy định):
              </p>
              <p>
                <span>&nbsp;</span>- Sáng: Từ 8h đến 12h
              </p>
              <p>
                <span>&nbsp;</span>- Chiều: Từ 13h đến 17h
              </p>
              <p>
                Trường hợp khách hàng có nhu cầu giao dịch ngoài khung
                thời gian trên thì Đơn đặt hàng sẽ được ghi nhận trên
                website hỗ trợ giao dịch của Bên A. Đơn đặt hàng của
                Bên B sẽ được Bên A xử lý vào giờ hành chính của buổi
                làm việc kế tiếp.
              </p>
              <p>
                <span style={{ fontWeight: "600" }}>2.2</span>
                <span style={{ fontWeight: "600" }}>
                  <span>&nbsp;</span>
                </span>
                <span style={{ fontWeight: "600" }}>
                  Thời gian giao hàng:
                </span>{" "}
                Trong vòng 30 ngày kể từ thời điểm 02 bên ký xác nhận
                mua bán theo Đơn đặt hàng. Khi có kế hoạch nhận hàng,
                Bên B sẽ thông báo cho Bên A thông qua website hỗ trợ
                giao dịch của Bên A.
              </p>
              <p>
                Khi nhận hàng, Bên B sẽ có trách nhiệm thanh toán phí
                vận chuyển, cụ thể như sau: &nbsp;
              </p>
              <table
                cellSpacing={0}
                cellPadding={0}
                style={{
                  marginRight: "calc(0%)",
                  width: "100%",
                  padding: "10px 0",
                }}
                border={1}
              >
                <tbody>
                  <tr
                    style={{
                      border: "1px solid black",
                      padding: "7px",
                    }}
                  >
                    <td style={{ border: "1px solid black" }}>
                      <p style={{ textAlign: "center" }}>
                        <span style={{ fontWeight: "600" }}>TT</span>
                      </p>
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      <p style={{ textAlign: "center" }}>
                        <span style={{ fontWeight: "600" }}>
                          Hạng mục
                        </span>
                      </p>
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      <p style={{ textAlign: "center" }}>
                        <span style={{ fontWeight: "600" }}>
                          Đơn giá/sản phẩm
                        </span>
                      </p>
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid black",
                      padding: "7px",
                    }}
                  >
                    <td style={{ border: "1px solid black" }}>
                      <p style={{ textAlign: "center" }}>1</p>
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      <p style={{ textAlign: "center" }}>
                        Phí vận chuyển hàng
                      </p>
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      <p style={{ textAlign: "center" }}>
                        {PdfTemplateProps.TransportationCosts}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p>
                <em>
                  Thời gian bàn giao có thể thay đổi tùy thuộc vào
                  thỏa thuận tại Phụ lục đặt hàng.
                </em>
              </p>
              <p>
                <span style={{ fontWeight: "600" }}>
                  2.3 Địa điểm giao hàng:
                </span>{" "}
                Trừ trường hợp Đơn đặt hàng có quy định khác, việc bàn
                giao sản phẩm sẽ được thực hiện tại các Điểm giao dịch
                của Bên A trên toàn quốc. Danh sách các Điểm giao dịch
                sẽ được Bên A thông báo trên website của Bên A.
              </p>
              <p>
                <em>
                  Địa điểm giao hàng khác ngoài Hà Nội, bên B chịu phí
                  vận chuyển, giao hàng.
                </em>
              </p>
              <p>
                <span style={{ fontWeight: "600" }}>2.4</span>{" "}
                <span style={{ fontWeight: "600" }}>
                  Bàn giao sản phẩm:
                </span>
              </p>
              <p>
                Khi nhận hàng, bên B có trách nhiệm kiểm nhận số
                lượng, chủng loại, mẫu mã, quy cách hàng hóa tại chỗ.
                Nếu phát hiện hàng thiếu hoặc không đúng tiêu chuẩn
                chất lượng v.v… thì lập biên bản tại chỗ để làm cơ sở
                giao hàng bổ sung, đổi, trả hàng theo quy định.
              </p>
              <p>Khi đến nhận hàng, người nhận phải có đủ:</p>
              <div>
                <p>
                  <span>-</span>
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                  Giấy giới thiệu của cơ quan bên mua (doanh nghiệp).
                </p>
              </div>
              <div>
                <p>
                  <span>-</span>
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                  Giấy chứng minh nhân dân/CCCD.
                </p>
              </div>
              <p>
                <span style={{ fontWeight: "600" }}>
                  ĐIỀU 3. THANH TOÁN
                </span>
              </p>
              <ul>
                <li>
                  <span>Thời hạn thanh toán:&nbsp;</span>
                </li>
              </ul>
              <div>
                <p>
                  <span>-</span>
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                  Ngay khi xác nhận đặt hàng thông tin website hỗ trợ
                  đặt hàng của Bên A, Bên B sẽ thanh toán 100% giá trị
                  theo Đơn đặt hàng. Phí vận chuyển hàng sẽ được Bên B
                  thanh toán cho Bên A ngay tại thời điểm Bên B nhận
                  hàng.
                </p>
              </div>
              <div>
                <p>
                  <span>-</span>
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                  Trường hợp Bên B thanh lý đơn hàng trong khung giờ
                  hành chính đã nêu tại mục 2.1 điều 2, Bên A sẽ thanh
                  toán số tiền mua lại cho Bên B vào tài khoản của Bên
                  B, trong vòng 05 phút kể từ thời điểm Bên B xác nhận
                  thanh lý.
                </p>
              </div>
              <div>
                <p>
                  <span>-</span>
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                  Trường hợp Bên B thanh lý Đơn hàng ngoài khung thời
                  gian trên, Bên A sẽ thanh toán số tiền mua lại cho
                  Bên B vào tài khoản của Bên B, vào giờ hành chính
                  của ngày làm việc tiếp theo kể từ thời điểm Bên B
                  xác nhận thanh lý.
                </p>
              </div>
              <ul>
                <li>
                  <span>
                    Phương thức thanh toán: Chuyển khoản ngân hàng,
                    thông tin tài khoản nhận thanh toán như sau:
                  </span>
                </li>
              </ul>
              <p>
                <span>•</span>
                <span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                <span style={{ fontWeight: "600" }}>
                  <em>
                    <span>Tài khoản Bên A:</span>
                  </em>
                </span>
              </p>
              <p>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                <em>
                  Chủ tài khoản: Công ty TNHH Vàng Bạc Đá Quý Việt Á
                </em>
              </p>
              <p>
                <em>Số Tài khoản: 88626868</em>
              </p>
              <p>
                <em>
                  Ngân hàng thanh toán: Ngân hàng TMCP Việt Á - CN
                  Thăng Long
                </em>
              </p>
              <p>
                <em>Nội dung chuyển khoản: TT</em>
                <em>&nbsp;&nbsp;</em>
                <em>theo ĐH số&nbsp;</em>…..1/2024 /HĐKT/VAG-KH
              </p>
              <p>
                <span>•</span>
                <span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                <span style={{ fontWeight: "600" }}>
                  <em>Tài khoản Bên B:</em>
                </span>
              </p>
              <p>
                <em>
                  Chủ tài khoản:{" "}
                  {PdfTemplateProps.userExt.accountBankName}
                </em>
              </p>
              <p>
                <em>
                  Số Tài khoản:{" "}
                  {PdfTemplateProps.userExt.accountBankNo}
                </em>
              </p>
              <p>
                <em>
                  Ngân hàng thanh toán: Ngân hàng Thương mại Cổ phần
                  Việt Á &nbsp;
                </em>
              </p>
              <p>
                <em>Nội dung chuyển khoản:&nbsp; </em>
              </p>
              <p>
                <span style={{ fontWeight: "600" }}>
                  ĐIỀU 4: QUYỀN VÀ NGHĨA VỤ CỦA CÁC BÊN
                </span>
              </p>
              <h1>
                <em>1.</em>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <em>Quyền và nghĩa vụ Bên A</em>
              </h1>
              <div>
                <p>
                  <span>-</span>
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                  Được bên B thanh toán đầy đủ, đúng hạn theo quy định
                  tại Hợp đồng này và các các Phụ lục đặt hàng được ký
                  kết giữa Các Bên;
                </p>
              </div>
              <div>
                <p>
                  <span>-</span>
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                  Giao hàng đúng mẫu mã, số lượng, chất lượng, thời
                  gian, địa điểm như đã thoả thuận trong hợp đồng.
                </p>
              </div>
              <div>
                <p>
                  <span>-</span>
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                  Cung cấp cho Bên B đầy đủ chứng từ, hóa đơn GTGT,
                  phiếu xuất kho theo quy định hiện hành;
                </p>
              </div>
              <div>
                <p>
                  <span>-</span>
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                  Chịu trách nhiệm về nguồn gốc và chất lượng sản phẩm
                  nguyên liệu khi mua/bán hoặc trao đổi với bên B;
                </p>
              </div>
              <div>
                <p>
                  <span>-</span>
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                  Bên A không chịu trách nhiệm về bất kỳ khiếm khuyết
                  nào của hàng hoá nếu vào thời điểm giao kết hợp đồng
                  bên B đã biết hoặc phải biết về những khiếm khuyết
                  đó;
                </p>
              </div>
              <div>
                <p>
                  <span>-</span>
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                  Trừ trường hợp quy định tại khoản 1 Điều này, trong
                  thời hạn khiếu nại theo quy định của Luật thương mại
                  năm 2005, bên A không phải chịu trách nhiệm về bất
                  kỳ khiếm khuyết nào của hàng hoá đã có trước thời
                  điểm chuyển rủi ro cho bên B, kể cả trường hợp khiếm
                  khuyết đó được phát hiện sau thời điểm chuyển rủi
                  ro;
                </p>
              </div>
              <h1>
                <em>2.</em>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <em>Quyền và nghĩa vụ Bên B</em>
              </h1>
              <p>
                <span>-</span>
                <span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                <span>
                  Được yêu cầu Bên A thực hiện nghiêm túc, đúng và đầy
                  đủ các nghĩa vụ nêu tại Hợp đồng này, các Phụ lục
                  đặt hàng và các văn bản thỏa thuận khác có liên quan
                  được ký kết giữa các Bên;
                </span>
              </p>
              <p>
                <span>-</span>
                <span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                Yêu cầu Bên A phải bồi thường thiệt hại, chịu phạt vi
                phạm theo quy định tại Hợp đồng này nếu việc cung cấp
                Sản phẩm của Bên A vi phạm thoả thuận tại Hợp đồng này
                và gây thiệt hại cho Bên B;
              </p>
              <p>
                <span>-</span>
                <span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                Thanh toán toán đầy đủ, đúng thời hạn giá trị đơn hàng
                như đã thỏa thuận tại Hợp đồng, các Phụ lục đặt hàng
                và các văn bản thỏa thuận khác có liên quan nếu Bên A
                đã thực hiện nghiêm túc, đúng và đầy đủ các nghĩa vụ
                được quy định;
              </p>
              <p>
                <span style={{ fontWeight: "600" }}>
                  ĐIỀU 5: CHẤM DỨT HỢP ĐỒNG
                </span>
              </p>
              <p>Hợp đồng này chấm dứt trong các trường hợp sau:</p>
              <ol type={"1"}>
                <li>
                  1, Hai Bên thỏa thuận chấm dứt Hợp đồng và giải
                  quyết các quyền và nghĩa vụ đã phát sinh đến thời
                  điểm chấm dứt Hợp đồng bằng Thỏa thuận chấm dứt Hợp
                  đồng.
                </li>
                <li>
                  2, Xảy ra sự kiện Bất khả kháng kéo dài khiến cho
                  Hợp đồng không thể thực hiện được. Trong trường hợp
                  này, mỗi Bên đều có quyền yêu cầu chấm dứt Hợp đồng
                  và các Bên sẽ thỏa thuận về việc giải quyết các
                  quyền và nghĩa vụ đã phát sinh đến thời điểm chấm
                  dứt Hợp đồng bằng Thỏa thuận chấm dứt Hợp đồng.
                </li>
                <li>
                  3, Hợp đồng hết hạn và các Bên không tiếp tục gia
                  hạn Hợp đồng.
                </li>
                <li>
                  4, Một trong hai Bên chấm dứt sự tồn tại, trong
                  trường hợp này Hợp đồng sẽ chấm dứt theo các quy
                  định có liên quan của pháp luật áp dụng.
                </li>
                <li>
                  5, Một Bên đơn phương chấm dứt Hợp đồng do một bên
                  vi phạm thỏa thuận tại Hợp đồng. Bên đơn phương chấm
                  dứt Hợp đồng phải báo cho bên còn lại ít nhất 5 ngày
                  làm việc trước thời hạn muốn chấm dứt Hợp đồng và
                  các Bên sẽ thoả thuận về việc giải quyết các quyền
                  và nghĩa vụ phát sinh đến thời điểm chấm dứt Hợp
                  đồng.
                </li>
                <li>
                  6, Trong trường hợp chấm dứt Hợp đồng trước hạn vì
                  bất cứ lý do gì, hai Bên có nghĩa vụ tiến hành trao
                  đổi phương án giải quyết, xử lý nhằm bảo đảm quyền
                  lợi cho hai bên
                </li>
              </ol>
              <p>
                <span style={{ fontWeight: "600" }}>
                  ĐIỀU 6. PHẠT VI PHẠM HỢP ĐỒNG VÀ BỒI THƯỜNG THIỆT
                  HẠI
                </span>
              </p>
              <p>
                <span style={{ fontWeight: "600" }}>
                  1.1 Phạt vi phạm hợp đồng
                </span>
              </p>
              <ol type="a">
                <li>
                  <span>
                    a. Phạt chậm giao hàng: Nếu Bên A không giao hàng
                    đầy đủ và đúng thời hạn theo thỏa thuận của hai
                    Bên thì Bên B có quyền yêu cầu Bên A chịu phạt
                    0.05% giá trị Hợp đồng bị vi phạm cho mỗi ngày
                    giao hàng chậm. Nhưng tổng giá trị phạt chậm giao
                    hàng không vượt quá 8% tổng giá trị phần nghĩa vụ
                    hợp đồng bị vi phạm.
                  </span>
                </li>
                <li>
                  <span>
                    b. Phạt chậm thanh toán: Nếu hai bên không thanh
                    toán đúng thời hạn theo thỏa thuận của hai Bên thì
                    bên còn lại có quyền yêu cầu bên kia chịu phạt
                    0.05% số tiền chậm thanh toán cho mỗi ngày chậm
                    thanh toán. Nhưng tổng giá trị phạt thanh toán
                    chậm không vượt quá 8% tổng giá trị phần nghĩa vụ
                    hợp đồng bị vi phạm. &nbsp;
                  </span>
                </li>
                <li>
                  <span>
                    c. Phạt vi phạm trong các trường hợp vi phạm hợp
                    đồng khác: Bên vi phạm nghĩa vụ Hợp đồng thì phải
                    chịu phạt vi phạm một khoản tương đương 8% tổng
                    giá trị Hợp đồng bị vi phạm.
                  </span>
                </li>
              </ol>
              <p>
                <span style={{ fontWeight: "600" }}>
                  1.2 Bồi thường thiệt hại
                </span>
              </p>
              <ol type={"1"}>
                <li>
                  1. Hai bên cam kết thực hiện nghiêm túc các điều
                  khoản đã thỏa thuận trên, không được đơn phương thay
                  đổi hoặc hủy bỏ hợp đồng:
                </li>
              </ol>
              <ul>
                <li>
                  <span>
                    Trường hợp đơn phương chấm dứt hợp đồng mà không
                    có lý do chính đáng:
                  </span>
                </li>
              </ul>
              <div>
                <p>
                  <span>-</span>
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                  Bên B không thực hiện hoặc đơn phương đình chỉ thực
                  hiện hợp đồng mà không có lý do chính đáng thì sẽ bị
                  phạt toàn bộ số tiền mà bên B đã đặt cọc cho bên A.
                </p>
              </div>
              <div>
                <p>
                  <span>-</span>
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                  Bên A không thực hiện hoặc đơn phương đình chỉ thực
                  hiện hợp đồng mà không có lý do chính đáng thì sẽ bị
                  phạt 8% giá trị phần nghĩa vụ hợp đồng bị vi phạm.
                </p>
              </div>
              <ul>
                <li>
                  <span>
                    Trường hợp đơn phương chấm dứt hợp đồng do Bên còn
                    lại vi phạm hợp đồng:
                  </span>
                </li>
              </ul>
              <div>
                <p>
                  <span>-</span>
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                  Bên đơn phương chấm dứt hợp đồng không phải bồi
                  thường, chi trả bất cứ tổn thất nào cho Bên còn lại;
                </p>
              </div>
              <div>
                <p>
                  <span>-</span>
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                  Bên vi phạm hợp đồng có nghĩa vụ chi trả các tổn
                  thất theo thực tế cho Bên bị vi phạm.
                </p>
              </div>
              <ol start={2} type={"1"}>
                <li>
                  2. Bồi thường thiệt hại do đơn phương chấm dứt hợp
                  đồng vì sự kiện bất khả kháng: Hai bên sẽ không phải
                  đền bù cho Bên còn lại bất kỳ chi phí phát sinh nào
                  trong quá trình thực hiện.
                </li>
                <li>
                  3. Các khoản phạt và bồi thường thiệt hại và nghĩa
                  vụ thanh toán của bất kỳ Bên nào đối với Bên còn lại
                  phải được thực hiện trong vòng 15 ngày kể từ ngày
                  chấm dứt Hợp đồng.
                </li>
              </ol>
              <p>
                <span style={{ fontWeight: "600" }}>
                  ĐIỀU 7: BẤT KHẢ KHÁNG VÀ GIẢI QUYẾT TRANH CHẤP
                </span>
              </p>
              <ol type={"1"}>
                <li>
                  1. Bất khả kháng nghĩa là các sự kiện xảy ra một
                  cách khách quan, không thể lường trước được và không
                  thể khắc phục được mặc dù đã áp dụng mọi biện pháp
                  cần thiết trong khả năng cho phép, một trong các Bên
                  vẫn không có khả năng thực hiện được nghĩa vụ của
                  mình theo Hợp đồng này; gồm nhưng không giới hạn ở:
                  thiên tai, hỏa hoạn, lũ lụt, chiến tranh, can thiệp
                  của chính quyền bằng vũ trang, cản trở giao thông
                  vận tải và các sự kiện khác tương tự.
                </li>
                <li>
                  2. Khi xảy ra sự kiện bất khả kháng, bên gặp phải
                  bất khả kháng không được chậm trễ, phải thông báo
                  cho bên kia tình trạng thực tế, đề xuất phương án xử
                  lý và nỗ lực giảm thiểu tổn thất, thiệt hại đến mức
                  thấp nhất có thể.
                </li>
                <li>
                  3. Trừ trường hợp bất khả kháng, hai bên phải thực
                  hiện đầy đủ và đúng thời hạn các nội dung của hợp
                  đồng này. Trong quá trình thực hiện hợp đồng, nếu có
                  vướng mắc từ bất kỳ bên nào, hai bên sẽ cùng nhau
                  giải quyết trên tinh thần hợp tác. Trong trường hợp
                  không tự giải quyết được, hai bên thống nhất đưa ra
                  giải quyết tại Tòa án kinh tế của Việt Nam có thẩm
                  quyền. Phán quyết của tòa án là quyết định cuối
                  cùng, có giá trị ràng buộc các bên. Bên thua phải
                  chịu toàn bộ các chi phí giải quyết tranh chấp.
                </li>
              </ol>
              <p>
                <span style={{ fontWeight: "600" }}>
                  ĐIỀU 8: ĐIỀU KHOẢN CHUNG
                </span>
              </p>
              <ol type={"1"}>
                <li>
                  1. Hợp đồng này có hiệu lực từ ngày ký và có giá trị
                  trong 06 tháng.
                </li>
              </ol>
              <p>
                Trường hợp không có thông báo chấm dứt hợp đồng, hợp
                đồng này sẽ tự động gia hạn thêm 06 tháng.
              </p>
              <ol start={2} type={"1"}>
                <li>
                  2. Hợp đồng này có giá trị thay thế mọi giao dịch,
                  thỏa thuận trước đây của hai bên. Mọi sự bổ sung,
                  sửa đổi hợp đồng này đều phải có sự đồng ý bằng văn
                  bản của hai bên.
                </li>
                <li>
                  3. Trừ các trường hợp được quy định ở trên, Hợp đồng
                  này không thể bị hủy bỏ nếu không có thỏa thuận bằng
                  văn bản của các bên. Trong trường hợp hủy hợp đồng,
                  trách nhiệm liên quan tới phạt vi phạm và bồi thường
                  thiệt hại được bảo lưu.
                </li>
                <li>
                  4. Hợp đồng này được làm thành 04 (bốn) bản, có giá
                  trị như nhau, Mỗi bên giữ 02 (hai) bản và có giá trị
                  pháp lý như nhau.
                </li>
              </ol>
              <p>
                <span style={{ fontWeight: "600" }}>&nbsp;</span>
              </p>
            </div>
            <p>
              <br />
            </p>
            <div>
              <p style={{ textAlign: "center" }}>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span style={{ fontWeight: "600" }}>
                  ĐẠI DIỆN BÊN A&nbsp;
                </span>
                <span style={{ fontWeight: "600" }}>
                  <span>&nbsp;</span>
                </span>
                <span>&nbsp;</span>
                <span>
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                </span>
                <span>&nbsp;</span>
                <span>&nbsp;</span>
                <span style={{ fontWeight: "600" }}>
                  ĐẠI DIỆN BÊN B
                </span>
                <span>&nbsp;&nbsp;&nbsp;</span>
              </p>
              <p>&nbsp;</p>
              <p>&nbsp;</p>
              <p>&nbsp;</p>
              <p>&nbsp;</p>
              <p>&nbsp;</p>
            </div>
          </div>
        </div>
      </>
    );
  };
  const handlePrint = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    const printElement = ReactDOMServer.renderToString(
      renderTemplate()
    );
    html2pdf().from(printElement).save();
  };
  return handlePrint();
};

export { PdfTemplate };
