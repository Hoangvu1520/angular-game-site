import React, { useEffect, useState } from "react";
import { Icon, ImageCard } from "../../../index";
type TableCellProps = {
  children: any;
  type?: string;
};
const TableCell = (TableCellProps: TableCellProps) => {
  //Define constant
  const [props, setProps] = useState(TableCellProps);

  //Function to render

  //Function hooks
  useEffect(() => {
    setProps(TableCellProps);
  }, [TableCellProps]);

  //Main render
  const renderChildren = (type?: string) => {
    switch (type) {
      case "image":
        return <ImageCard imageFile={props.children} />;
      case "icon":
        return <Icon component={props.children} />;
      case "text":
      default:
        return props.children;
    }
  };
  return <>{renderChildren(props.type)}</>;
};
export { TableCell };
export type { TableCellProps };
