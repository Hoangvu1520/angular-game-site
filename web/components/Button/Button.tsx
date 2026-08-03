import { ReactNode, useEffect, useState } from "react";
import styles from "./Button.module.scss";

export type ButtonProps = {
  border?: boolean;
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
  style?: any;
  link?: string;
  color?: "fill" | "outline";
  colorText?: string;
  borderRadius?: "none" | "round" | "standard";
  type?: "submit" | "reset" | "button" | undefined;
};

export const Button = (ButtonProps: ButtonProps) => {
  //Define constant
  const [props, setProps] = useState(ButtonProps);

  //Function hook
  useEffect(() => {
    setProps(ButtonProps);
  }, [ButtonProps]);

  //Function to render
  const handelOnclick = () => {
    props.onClick && props.onClick();
  };

  //Main render
  return (
    <a
      className={[
        "row align-center justify-center",
        styles.OutButton,
      ].join(" ")}
      href={props.link}
    >
      <button
        className={[
          "row align-center justify-center",
          styles.Button,
          props.color && styles[props.color],
          props.borderRadius && styles[props.borderRadius],
          props.className,
        ].join(" ")}
        style={props.style}
        onClick={() => {
          handelOnclick();
        }}
        type={props.type}
      >
        {props.children}
      </button>
    </a>
  );
};
Button.deafultProps = {
  borderRadius: "round",
  type: "button",
  color: "outline",
};
