import React, { useEffect, useState } from "react";
import { Pagination } from "../../../index";
import { type } from "os";
type TablePagingProps = {
  [props: string]: any;
};
const TablePaging = (TablePagingProps: TablePagingProps) => {
  const renderTablePaging = (type?: string) => {
    switch (type) {
      case "PAGING":
        return <Pagination {...TablePagingProps} />;
      default:
        return <Pagination {...TablePagingProps} />;
    }
  };

  return (
    <>
      {renderTablePaging(
        TablePagingProps.pagingType &&
          TablePagingProps.pagingType.toUpperCase()
      )}
    </>
  );
};
TablePaging.defaultProps = {
  pagingType: "paging",
};

export { TablePaging };
export type { TablePagingProps };
