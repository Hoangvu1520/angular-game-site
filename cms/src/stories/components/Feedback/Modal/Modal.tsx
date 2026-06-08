import { Modal as ModalANTD } from "antd";
import type { ModalProps } from "antd";
import styles from "./Modal.module.scss";
import React from "react";

export type { ModalProps };
const Modal = (ModalProps: ModalProps) => {
  return (
    <ModalANTD
      {...ModalProps}
      className={[styles.Modal, ModalProps.className].join(" ")}
    />
  );
};
export { Modal };
