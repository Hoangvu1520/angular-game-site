import { Divider as DividerANTD } from "antd";
import type { DividerProps } from "antd";
import React from "react";
const Divider: React.FC<DividerProps> = (DividerProps: DividerProps) => {
  return <DividerANTD {...DividerProps} />;
};
export { Divider };
export type { DividerProps };
