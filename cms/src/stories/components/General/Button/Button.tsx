import { Button as ButtonANTD, ButtonProps as ButtonANTDProps } from "antd";
import React, { useEffect, useState } from "react";
import { Icon } from "../Icon";
import styles from "./Button.module.scss";

export type ButtonProps = {
  href?: any;
  [props: string]: any;
};
const Button = (ButtonProp: ButtonProps) => {
  //Define constant
  const [prop, setProp] = useState(ButtonProp);
  const [icon, setIcon] = useState<any>();

  //Function to render
  useEffect(() => {
    setIcon(prop.icon);
  }, []);
  useEffect(() => {
    setProp(ButtonProp);
  }, [ButtonProp]);

  return (
    <ButtonANTD
      {...prop}
      className={[
        // prop.typeColor && styles[prop.typeColor],
        prop.className,
      ].join(" ")}
      icon={typeof icon == "string" ? <Icon component={icon} /> : icon}
    />
  );
};

export { Button };
