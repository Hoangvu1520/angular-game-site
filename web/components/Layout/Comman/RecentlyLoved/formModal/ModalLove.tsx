import React, { Key } from "react";
import { Authen } from "../../../../Layout/Authen";
import { Icon } from "../../../../Icon";
import styles from "./ModalLove.module.scss";
import { useAuthenticationStatus } from "@nhost/nextjs";

const ModalLove = () => {
  const { isLoading, isAuthenticated } = useAuthenticationStatus();

  return (
    <div className={[styles.ModalLove].join(" ")}>
      <div className={[, styles.header].join(" ")}>Sản phẩm yêu thích</div>
      <div className={["row justify-center", styles.box1].join(" ")}>
        Sử dụng danh sách yêu thích của bạn để theo dõi các sản phẩm yêu thích
        của bạn.
      </div>
      {isAuthenticated == false && (
        <Authen className={["row", styles.box2].join(" ")} />
      )}
    </div>
  );
};
export default ModalLove;
