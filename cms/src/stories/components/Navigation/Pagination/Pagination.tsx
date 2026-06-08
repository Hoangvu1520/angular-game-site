import { Pagination as PaginationAntd } from "antd";
import type { PaginationProps } from "antd";
import styles from "./Pagination.module.scss";
import React, { ReactNode, useEffect, useState } from "react";
type Props = PaginationProps;
const Pagination = (PaginationProps: Props) => {
  const [prop, setProp] = useState(PaginationProps);

  const itemRender = (
    page: number,
    type: string,
    originalElement: ReactNode
  ) => {
    switch (type) {
      case "page":
        return <div>{page}</div>;
      default:
        return originalElement;
    }
  };

  useEffect(() => {
    setProp(PaginationProps);
  }, [PaginationProps]);
  return (
    <PaginationAntd
      className={styles.Pagination}
      itemRender={itemRender}
      {...prop}
    />
  );
};
export { Pagination };
export type { PaginationProps };
