import React, { Key, useState, useEffect } from "react";
import styles from "./SignIn.module.scss";
import { Input } from "../../../Input";
import { Button } from "../../../Button";
import {
  useSignInEmailPassword,
  useAuthenticationStatus,
  useUserData,
} from "@nhost/nextjs";
import { useAuthContext } from "../../../Provider/Provider";
import { useRouter } from "next/router";
import { LoadingAtom } from "../../../../atom";
import { useSetRecoilState } from "recoil";

export type SignInProps = {
  onClickForgetPW?: () => void;
};

const SignIn = (SignInProps: SignInProps) => {
  const [props, setProps] = useState(SignInProps);

  const setLoadingState = useSetRecoilState(LoadingAtom);

  const [inforSignIn, setInforSignIn] = useState({
    email: "",
    matkhau: "",
  });
  const router = useRouter();

  const { handleOpenModal, changeTypeModal, handleOffModal }: any =
    useAuthContext();

  const { signInEmailPassword } = useSignInEmailPassword();

  const Authenticated = useAuthenticationStatus();

  const UserData = useUserData();

  //validate
  const handleOnSubmit = async () => {
    if (inforSignIn.email != "" && inforSignIn.matkhau != "") {
      signInEmailPassword(
        inforSignIn.email,
        inforSignIn.matkhau
      ).then((e) => {
        if (e.isError == true) {
          if (e.error?.status == 10) {
            alert("Email định dạng không chính xác!!!");
          }
          if (e.error?.status == 401) {
            alert("Sai Email hoạc mật khẩu đăng nhập!!!");
          }
        } else {
          handleOffModal();
          alert("Đăng nhập thành công!!!");
          router.reload();
        }
      });
    } else {
      alert("Hãy nhập đầy đủ thông tin đăng nhập!!");
    }
  };
  // handleOffModal()

  const setOpenModal = (type: string) => {
    handleOpenModal(true);
    changeTypeModal(type);
  };

  const handleForgetPW = () => {
    setOpenModal("changePW");
    props.onClickForgetPW && props.onClickForgetPW();
  };

  //Function hook
  useEffect(() => {
    setProps(SignInProps);
  }, [SignInProps]);

  return (
    <div className={[, styles.childrenAuthen].join(" ")}>
      <div className={["row", styles.headerCreateAcc].join(" ")}>
        Đăng nhập
      </div>
      <div className={["row", styles.contentCreateAcc].join(" ")}>
        Đăng nhập hoặc tạo tài khoản để tận hưởng giao hàng tiêu chuẩn
        MIỄN PHÍ trên tất cả đơn hàng
      </div>
      <div className={[styles.form].join(" ")}>
        <div className={["row", styles.row1].join(" ")}>
          <div className={["col-12", styles.Input1].join(" ")}>
            <Input
              placeholder={"Email"}
              type={"email"}
              shape={"standard"}
              onChange={(e: any) => {
                setInforSignIn({ ...inforSignIn, email: e });
              }}
              onPressEnter={handleOnSubmit}
            />
          </div>
        </div>
        <div className={["row", styles.row1].join(" ")}>
          <div className={["col-12", styles.Input1].join(" ")}>
            <Input
              placeholder={"Mật khẩu"}
              type={"password"}
              shape={"standard"}
              onChange={(e: any) => {
                setInforSignIn({ ...inforSignIn, matkhau: e });
              }}
              onPressEnter={handleOnSubmit}
            />
          </div>
        </div>
      </div>
      <div className={[styles.forgetPW, "row"].join(" ")}>
        <div className={["col-6 row"].join(" ")}>
          <input type={"checkbox"} />
          <div> Lưu lại mật khẩu</div>
        </div>
        <div
          className={[styles.pw, "col-6 row justify-end"].join(" ")}
        >
          <div
            onClick={() => {
              handleForgetPW();
            }}
          >
            Quên mật khẩu?
          </div>
        </div>
      </div>

      <div className={["row", styles.content1].join(" ")}>
        Bằng cách nhấp vào “Đăng nhập”, bạn (1) đồng ý với ĐIỀU KHOẢN
        SỬ DỤNG của chúng tôi và (2) đã đọc Chính sách quyền riêng tư
        của Skinbeuty
      </div>

      <Button
        className={[, styles.buttonResign].join(" ")}
        border={true}
        children={"Đăng nhập"}
        borderRadius={"round"}
        type={"button"}
        color={"fill"}
        onClick={handleOnSubmit}
      />
    </div>
  );
};
export default SignIn;
