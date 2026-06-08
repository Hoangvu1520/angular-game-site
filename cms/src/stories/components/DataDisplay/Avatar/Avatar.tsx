import { Avatar as AvatarANTD, AvatarProps } from "antd";
import React from "react";
const Avatar: React.FC<AvatarProps> = (props: AvatarProps) => {
  return <AvatarANTD {...props} />;
};
export { Avatar };
export type { AvatarProps };
