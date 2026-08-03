import React, { Key } from "react";
import { Authen } from "../../../Authen";
import { Icon } from "../../../../Icon";
import styles from "./ModalChat.module.scss";
import { useAuthenticationStatus, useUserData} from "@nhost/nextjs";

const ModalChat = () => {
  const information:any = {...useUserData()?.metadata, userId: useUserData()?.id};
  const { isLoading, isAuthenticated } = useAuthenticationStatus();

  return (
    <div className={[styles.children4].join(" ")}>
      <div className={[, styles.header].join(" ")}>Tư vấn và trò chuyện</div>
      {information && isAuthenticated ? (
        <>
          <div className={["row justify-center", styles.box1].join(" ")}>
            Xin chào, {information && information?.userName}
          </div>
        </>
      ) : (
        <div className={["row justify-center", styles.box1].join(" ")}>
          Đăng nhập để trò chuyện
        </div>
      )}
      <Authen className={["row", styles.box2].join(" ")} />
    </div>
  );
};
export default ModalChat;
