import Icon from "@ant-design/icons";
import { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";
import React, { useEffect, useRef, useState } from "react";
type IconProps = {
  component?:
    | React.ComponentType<
        CustomIconComponentProps | React.SVGProps<SVGSVGElement>
      >
    | React.ForwardRefExoticComponent<CustomIconComponentProps>
    | string;
  className?: string;
  [propIcon: string]: any;
};
const CustomeIcon = (Props: IconProps) => {
  const [props, setProps] = useState(Props);

  const getIcon = (component: any) => {
    if (typeof component != "string") {
      return component;
    }
    return require("react-bootstrap-icons")[component];
  };
  useEffect(() => {
    setProps(Props);
  }, [Props]);
  return <Icon {...props} component={getIcon(props.component)} />;
};
export { CustomeIcon as Icon };
export type { IconProps };
