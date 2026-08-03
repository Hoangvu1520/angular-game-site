import React, { Key, useState } from "react";
import styles from "./SignUp.module.scss";
import { Button } from "../../../Button";
import { Input } from "../../../Input";
import {
  useSignUpEmailPassword,
  useSendVerificationEmail,
} from "@nhost/nextjs";
import { useAuthContext } from "../../../Provider/Provider";
import { useRouter } from "next/router";

const SignUp = () => {
  const { handleOffModal }: any = useAuthContext();
  const [checkForm, setCheckForm] = useState<any>(false);
  const router = useRouter();

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  const [inforSignUp, setInforSignUp] = useState({
    tenHo: "",
    tenDem: "",
    email: "",
    matkhau: "",
    sdt: "",
    ngaysinh: "",
    zipcode: "",
  });
  const { signUpEmailPassword } = useSignUpEmailPassword();

  const { sendEmail, isLoading, isSent, isError, error } =
    useSendVerificationEmail();

  const handleSendVerifica = async (e: any) => {
    await sendEmail("joe@example.com");
  };

  const handleOnSubmit = async () => {
    if (
      inforSignUp.email != "" &&
      inforSignUp.matkhau != "" &&
      inforSignUp.tenHo != "" &&
      inforSignUp.tenDem != "" &&
      inforSignUp.sdt != ""
    ) {
      if (!emailRegex.test(inforSignUp.email)) {
        alert("Email nhập không hợp lệ !!!");
      } else if (inforSignUp.matkhau.length < 9) {
        alert("Mật khẩu cần ít nhất 9 kí tự !!!");
      } else {
        signUpEmailPassword(inforSignUp.email, inforSignUp.matkhau, {
          displayName: inforSignUp.tenHo + " " + inforSignUp.tenDem,
          metadata: {
            fristName: inforSignUp.tenHo,
            lastName: inforSignUp.tenDem,
            insiderPoint: 0,
            phone: inforSignUp.sdt,
            Birthday: inforSignUp.ngaysinh,
            Email: inforSignUp.email,
          },
        }).then((e) => {
          if (e.isError == true) {
            alert(e.error?.message);
          } else {
            alert(
              "Tạo tài khoản mới thành công !!!. Chào mừng bạn đến với SkinbeutyVn."
            );
            handleOffModal();
            router.reload();
          }
        });
      }
    } else {
      alert("Hãy nhập đầy đủ thông tin!!!");
      setCheckForm(true);
    }
  };

  return (
    <div className={[, styles.childrenAuthen].join(" ")}>
      <div className={["row justify-center", styles.headerCreateAcc].join(" ")}>
        Tạo tài khoản
      </div>
      <img
        className={["row justify-center", styles.img].join(" ")}
        src="https://www.sephora.com/img/ufe/bi/logo-beauty-insider.svg"
      />
      <div className={["row", styles.contentCreateAcc].join(" ")}>
        Tham gia chương trình khách hàng thân thiết của Beauty Insider. Kiếm
        điểm, nhận giao hàng tiêu chuẩn MIỄN PHÍ, đổi phần thưởng và nhiều dịch
        vụ khác.
      </div>
      <form className={[styles.form].join(" ")}>
        <div className={["row justify-between", styles.Input1].join(" ")}>
          <div className={["justify-start", styles.Inputmini1].join(" ")}>
            <Input
              placeholder={"Tên họ *"}
              shape={"standard"}
              onChange={(e: any) => {
                setInforSignUp({ ...inforSignUp, tenHo: e });
              }}
              style={
                checkForm && inforSignUp.tenHo == ""
                  ? { border: "1px solid red", boxShadow: "0 0 4px red" }
                  : { border: "1px solid black" }
              }
            />
          </div>
          <div className={["justify-end", styles.Inputmini1].join(" ")}>
            <Input
              placeholder={"Tên đệm *"}
              shape={"standard"}
              onChange={(e: any) => {
                setInforSignUp({ ...inforSignUp, tenDem: e });
              }}
              style={
                checkForm && inforSignUp.tenDem == ""
                  ? { border: "1px solid red", boxShadow: "0 0 4px red" }
                  : { border: "1px solid black" }
              }
            />
          </div>
        </div>
        <div className={["row", styles.Input2].join(" ")}>
          <div className={[styles.Inputmini2].join(" ")}>
            <Input
              placeholder={"Email *"}
              type={"email"}
              shape={"standard"}
              onChange={(e: any) => {
                setInforSignUp({ ...inforSignUp, email: e });
              }}
              style={
                checkForm && inforSignUp.email == ""
                  ? { border: "1px solid red", boxShadow: "0 0 4px red" }
                  : { border: "1px solid black" }
              }
            />
          </div>
        </div>
        <div className={["row", styles.Input2].join(" ")}>
          <div className={[styles.Inputmini2].join(" ")}>
            <Input
              placeholder={"Mật khẩu *"}
              type={"password"}
              shape={"standard"}
              onChange={(e: any) => {
                setInforSignUp({ ...inforSignUp, matkhau: e });
              }}
              style={
                checkForm && inforSignUp.matkhau == ""
                  ? { border: "1px solid red", boxShadow: "0 0 4px red" }
                  : { border: "1px solid black" }
              }
            />
          </div>
        </div>
        <div className={["row", styles.Input2].join(" ")}>
          <div className={[styles.Inputmini2].join(" ")}>
            <Input
              placeholder={"Số điện thoại *"}
              type={"number"}
              shape={"standard"}
              onChange={(e: any) => {
                setInforSignUp({ ...inforSignUp, sdt: e });
              }}
              style={
                checkForm && inforSignUp.sdt == ""
                  ? { border: "1px solid red", boxShadow: "0 0 4px red" }
                  : { border: "1px solid black" }
              }
            />
          </div>
        </div>
        <div className={["row", styles.contentCreateAcc].join(" ")}>
          Nhập ngày sinh của bạn để nhận một món quà miễn phí hàng năm.
        </div>

        <div className={["row", styles.Input2].join(" ")}>
          <div className={[styles.Inputmini2].join(" ")}>
            <Input
              placeholder={"Ngày sinh"}
              type={"date"}
              shape={"standard"}
              onChange={(e: any) => {
                setInforSignUp({ ...inforSignUp, ngaysinh: e });
              }}
            />
          </div>
        </div>
        <div className={["row", styles.Input2].join(" ")}>
          <div className={[styles.Inputmini2].join(" ")}>
            <Input
              placeholder={"Zip code"}
              type={"number"}
              shape={"standard"}
              onChange={(e: any) => {
                setInforSignUp({ ...inforSignUp, zipcode: e });
              }}
            />
          </div>
        </div>
      </form>

      <div className={["row"].join(" ")}>
        <div className={["row col-12"].join(" ")}>
          <input type={"checkbox"} />
          <div className={[styles.contentCreateAcc].join(" ")}>
            {" "}
            Tôi đã đọc Điều Khoản dịch vụ{" "}
          </div>
        </div>
      </div>
      <div className={["row", styles.content1].join(" ")}>
        Bằng cách nhấp vào “Tạo tài khoản”, bạn xác nhận rằng bạn (1) đã đọc
        Chính sách quyền riêng tư và Thông báo khuyến khích tài chính của
        SkinbeutyVn, (2), đồng ý với ĐIỀU KHOẢN SỬ DỤNG, ĐIỀU KHOẢN NỘI BỘ CỦA
        BEAUTY, và để tự động nhận các ưu đãi và thông báo của Beauty Insider
        qua email.
      </div>
      <Button
        className={[, styles.buttonResign].join(" ")}
        border={true}
        children={"Tạo tài khoản"}
        borderRadius={"round"}
        type={"button"}
        color={"fill"}
        onClick={handleOnSubmit}
      />
      <div className={["row", styles.content1].join(" ")}>
        SkinbeutyVN sử dụng Google ReCaptcha và bằng cách đăng ký, người dùng phải
        tuân theo chính sách và điều khoản về quyền riêng tư của Google.
      </div>
    </div>
  );
};
export default SignUp;
