import React, { useState } from "react";
import styles from "./ChangePW.module.scss";
import { Input } from "../../../Input";
import { Button } from "../../../Button";
import { useResetPassword } from "@nhost/nextjs";
import { useAuthContext } from "../../../Provider/Provider";
import constant from "../../../constant";
import { LoadingAtom } from "../../../../atom";
import { useSetRecoilState } from "recoil";

const ChangePW = () => {
  const [inforChangePW, setInforChangePW] = useState({ email: "" });
  const { resetPassword } = useResetPassword();
  const { handleOffModal }: any = useAuthContext();
  const setLoadingAtom = useSetRecoilState(LoadingAtom)

  const handleFormSubmit = async () => {
    setLoadingAtom(true)
    await resetPassword(inforChangePW.email, {
      redirectTo: constant.RETURN_URL + "/reset-password",
    }).then((e) => {
      if (e.isError == true) {
        alert(e.error?.message);
      } else {
        handleOffModal();
        alert("Đã gửi đường dẫn đến Email của bạn !!");
      }
      setLoadingAtom(false)
    });
  };

  return (
    <div className={[, styles.childrenAuthen].join(" ")}>
      <div className={["row", styles.headerCreateAcc].join(" ")}>
        Nhập Email đã đăng ký
      </div>
      <div className={["row", styles.contentCreateAcc].join(" ")}>
        Chúng tôi sẽ gửi 1 đường dẫn đến email của bạn, trỏ vào đường dẫn để đổi
        mật khẩu.
      </div>
      <div className={[styles.form].join(" ")}>
        <div className={["row", styles.row1].join(" ")}>
          <div className={["col-12", styles.Input1].join(" ")}>
            <Input
              placeholder={"Email"}
              type={"email"}
              shape={"standard"}
              onChange={(e: any) => {
                setInforChangePW({ ...inforChangePW, email: e });
              }}
            />
          </div>
        </div>
      </div>

      <Button
        className={[, styles.buttonResign].join(" ")}
        border={true}
        children={"Xác nhận"}
        borderRadius={"round"}
        type={"button"}
        color={"fill"}
        onClick={handleFormSubmit}
      />
    </div>
  );
};
export default ChangePW;
