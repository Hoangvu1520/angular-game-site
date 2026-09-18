import React, { useState, useEffect, useRef } from "react";
import styles from "./Category.module.scss";

export type CategoryProps = {
  type?: "vertical" | "horizon";
  link?: string;
  className?: string;
  src?: string;
  title?: string;
};

export const Category = (CategoryProps: CategoryProps) => {
  //define constants
  const [props, setProps] = useState(CategoryProps);
  const link = props.link ;
  //function to hook

  useEffect(() => {
    setProps(CategoryProps);
  }, [CategoryProps]);
  //function to render

  //main render
  return (
    <div
      className={[
        styles.outCategory,
        props.type == "vertical" ? styles.Vertical : styles.Horizon,
      ].join(" ")}
    >
      <a
        href={link}
        className={[
          "row  justify-between",
          styles.Category,
          props.className,
        ].join(" ")}
      >
        <div className={["row col-9", styles.outText].join(" ")}>
          <div className={[styles.Text].join(" ")}>{props.title}</div>
        </div>
        <div className={["col-3", styles.outImage].join(" ")}>
          <img className={[styles.Image].join(" ")} src={props.src} alt="img" />
        </div>
      </a>
    </div>
  );
}; //
