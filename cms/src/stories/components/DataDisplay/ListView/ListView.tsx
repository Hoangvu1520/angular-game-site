import styles from "./ListView.module.scss";
import { Table } from "antd";
import { Row, TableCell, TooltipButton } from "../../index";
import React, { Key, ReactNode, useEffect, useState } from "react";
import classNames from "classnames";
import { ButtonActions, TableActions } from "../Table/TableAction";

const cx = classNames.bind(styles);
interface TableDisplay {
  columns: any[];
  rowActions: any[];
}

type ListViewProps = {
  data: any;
  tableDisplay: TableDisplay;
  tableActions?: TableActions[];
  className?: string;
  renderSelect?: (value?: ReactNode) => ReactNode;
  [ListViewProps: string]: any;
};
const ListView = (ListViewProps: ListViewProps) => {
  const [data, setData] = useState<any>();
  const [columns, setColumns] = useState(
    ListViewProps.tableDisplay.columns
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectedRow, setSelectedRow] = useState<any>();

  const onSelectChange = (
    newSelectedRowKeys: Key[],
    selectedRows: any[]
  ) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRow(selectedRows);
  };
  const configTable: any = {
    scroll: {
      y: 400,
      x: 1200,
      scrollToFirstRowOnChange: true,
    },
    ...ListViewProps,
    columns: columns,
    pagination: ListViewProps.pagination,
    rowSelection:
      ListViewProps.tableActions &&
      ListViewProps.tableActions.length > 0
        ? {
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }
        : undefined,
    dataSource: data,
    className: cx(styles.Table, ListViewProps.className),
  };

  const convertColumns = () => {
    var col = ListViewProps.tableDisplay.columns;
    col &&
      col.length > 0 &&
      col.map((keys: any) => {
        if (keys.type && !keys.render) {
          return Object.assign(keys, {
            render: (item: any) => (
              <TableCell children={item} type={keys.type} />
            ),
          });
        }
      });
    col =
      ListViewProps.tableDisplay.rowActions &&
      ListViewProps.tableDisplay.rowActions.length > 0 &&
      !col.find((item: any) => item?.dataIndex == "action")
        ? [
            ...col,
            {
              title: "",
              dataIndex: "action",
              width: 60,
            },
          ]
        : col;
    col != columns && setColumns(col);
  };

  const convertData = (items: []) => {
    const newData: any = [];
    convertColumns();
    items.map((item: any, key) => {
      const action = ListViewProps.tableDisplay.rowActions &&
        ListViewProps.tableDisplay.rowActions.length > 0 && {
          action: (
            <TooltipButton
              description={
                <ButtonActions
                  trigger={[item]}
                  tableActions={ListViewProps.tableDisplay.rowActions}
                  typeName={ListViewProps.typeName}
                />
              }
              placement="left"
            />
          ),
        };

      newData.push({ ...item, key: key, ...action });
    });
    return newData;
  };

  useEffect(() => {
    setSelectedRowKeys([]);
    ListViewProps.data && setData(convertData(ListViewProps.data));
  }, [ListViewProps.data, ListViewProps.tableDisplay.columns]);

  useEffect(() => {
    convertColumns();
  }, [ListViewProps.tableDisplay]);
  return (
    data && (
      <div className={cx(styles.ListView)}>
        <Row
          className={cx(styles.WarpButtonDelete)}
          align="middle"
          justify="end"
        >
          <>
            {selectedRowKeys.length > 0 ? (
              <div style={{ marginRight: "30px" }}>
                {ListViewProps.renderSelect
                  ? ListViewProps.renderSelect(selectedRow.length)
                  : `Select ${selectedRow.length} items`}
              </div>
            ) : (
              ""
            )}
            {selectedRowKeys.length > 0 &&
              ListViewProps.tableActions && (
                <ButtonActions
                  trigger={selectedRow}
                  tableActions={ListViewProps.tableActions}
                  typeName={ListViewProps.typeName}
                />
              )}
          </>
        </Row>
        <Table {...configTable} />
      </div>
    )
  );
};

ListView.defaultProps = {
  pagination: false,
};
export { ListView };
export type { ListViewProps };
