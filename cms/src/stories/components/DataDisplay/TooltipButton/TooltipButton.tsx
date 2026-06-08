import React, { Key, ReactNode, useEffect, useState } from "react";
import { Tooltip } from "antd";
import { Button, Col, Row } from "../../index";
import styles from "./TooltipButton.module.scss";

type TooltipButtonProps = {
  title?: ReactNode;
  description?: any;
  icon?: string;
  triggerData?: any;
  onActionTrigger?: (data?: any) => void;
  onActionDefault?: (data?: any) => void;
  className?: string;
  buttonProps?: any;
  [TooltipProps: string]: any;
};
const TooltipButton = (TooltipButtonProps: TooltipButtonProps) => {
  const [prop, setProp] = useState(TooltipButtonProps);

  const handleOnClickTooltipParentFirst = () => {
    prop.onActionDefault && prop.onActionDefault(prop.triggerData);
    prop.onActionTrigger && prop.onActionTrigger(prop.triggerData);
  };
  const handleOnClickTooltipChildren = (item: any) => {
    item.onActionDefault && item.onActionDefault(prop.triggerData);
    item.onActionTrigger && item.onActionTrigger(prop.triggerData);
  };
  useEffect(() => {
    setProp(TooltipButtonProps);
  }, [TooltipButtonProps]);

  const renderButtonInside = (description: any) => {
    return description &&
      description.length > 0 &&
      typeof description != "string"
      ? description.map((item: TooltipButtonProps, key: Key) => {
        return (
          <Col key={key}>
            <Tooltip
              placement="bottom"
              color="#ffffff"
              overlayInnerStyle={{ color: "#000" }}
              {...item}
              title={renderButtonInside(item.description)}
            >
              <Button
                {...item.buttonProps}
                onClick={() => {
                  handleOnClickTooltipChildren(item);
                }}
                icon={item.icon && item.icon}
              >
                {item.title && item.title}
              </Button>
            </Tooltip>
          </Col>
        );
      })
      : description;
  };
  return (
    <Tooltip
      placement="bottom"
      color="#ffffff"
      overlayInnerStyle={{ color: "#000" }}
      overlayStyle={{ padding: "0" }}
      {...prop}
      title={renderButtonInside(prop.description)}
    >
      <Button
        shape="circle"
        {...prop.buttonProps}
        onClick={handleOnClickTooltipParentFirst}
        icon={prop.icon ? prop.icon : "ThreeDots"}
        className={["ButtonOutLine", prop.className].join(" ")}
      >
        {prop.title && prop.title}
      </Button>
    </Tooltip>
  );
};
export { TooltipButton };
export type { TooltipButtonProps };
