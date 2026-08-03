import React, { Key, useState } from "react";
import styles from "./LinkChange.module.scss";
import { Input } from "../../../Input";
import { Button } from "../../../Button";
import { useChangePassword } from "@nhost/nextjs";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { LoadingAtom } from "../../../../atom";

const LinkChange = () => {
  const [inforChangePW, setInforChangePW] = useState({ newPW: "" });
  const { changePassword } = useChangePassword();
  const setLoadingAtom = useSetRecoilState(LoadingAtom)
  const router = useRouter();

  const handleFormSubmit = async () => {
    setLoadingAtom(true)
    if (inforChangePW.newPW.length < 9) {
      alert("Mật khẩu mới nhập cần ít nhất 9 kí tự");
    } else {
      await changePassword(inforChangePW.newPW).then((e) => {
        if (e.isError) {
          alert(e.error?.message)
        } else {
          alert("Đổi mật khẩu thành công!!!")
        }
      });
      setLoadingAtom(false)
      window.location.href = "/"
    }
  };

  return (
    <div className={[, styles.childrenAuthen].join(" ")}>
      <div className={["row", styles.headerCreateAcc].join(" ")}>
        Nhập mật khẩu mới.
      </div>
      <div className={[styles.form].join(" ")}>
        <div className={["row", styles.row1].join(" ")}>
          <div className={["col-12", styles.Input1].join(" ")}>
            <Input
              placeholder={"Mật khẩu mới"}
              type={"password"}
              shape={"standard"}
              onChange={(e: any) => {
                setInforChangePW({ ...inforChangePW, newPW: e });
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
export default LinkChange;
