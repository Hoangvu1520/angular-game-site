import { CSSProperties } from "react";
import styles from "./Divider.module.scss";

export type DividerProps = {
  className?: string;
  style?: CSSProperties;
  onClick?: () => {};
};
export const Divider = (DividerProps: DividerProps) => {
  return (
    <div
      {...DividerProps}
      className={[styles.Divider, DividerProps.className].join(" ")}
    ></div>
  );
};
