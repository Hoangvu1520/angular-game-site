import styles from "./Action.module.scss";
import React, { Key, ReactNode, useEffect, useState } from "react";
import { TooltipButton } from "../../TooltipButton";
import { SoftDelete, Delete, Publish } from "../../../../services";
import { useRecoilState } from "recoil";
import { TableState } from "../../../../recoil";
import { Col } from "antd";

interface TableActions {
  title?: ReactNode;
  icon?: string;
  description?: any;
  actionType?: "DELETE" | "EDIT" | "PUBLISH" | "SOFT_DELETE";
  onActionTrigger?: (rows: any) => void;
  tableName?: string;
  disabled?: boolean
}
type ButtonActionProps = {
  tableActions?: TableActions[];
  trigger?: any;
  typeName?: "snake" | "camel";
};

const ActionEdit = async ({ ActionProps, Table }: any) => {
  console.log(ActionProps, Table);
};

const ActionDelete = async ({
  ActionDeleteProps,
  Table,
  TableName,
  TableState,
  type,
}: any) => {
  var idDelete: any[] = [];
  var newObj: any;
  if (ActionDeleteProps && ActionDeleteProps.length > 0) {
    ActionDeleteProps.map((item: any) => {
      idDelete = [...idDelete, item.id];
    });

    type == "DELETE" ? await Delete({
      table: TableName,
      object: idDelete,
    }).then((res) => {
      if (res > 0) {
        var total = Table[TableState].total;
        var newData =
          Table[TableState].data &&
          Table[TableState].data.length > 0 &&
          Table[TableState].data.filter(
            (item: any) => !idDelete.includes(item.id)
          );
        return (newObj = {
          total: total - res,
          data: newData,
        });
      }
    }) : await SoftDelete({
      table: TableName,
      object: idDelete,
    }).then((res) => {
      if (res > 0) {
        var total = Table[TableState].total;
        var newData =
          Table[TableState].data &&
          Table[TableState].data.length > 0 &&
          Table[TableState].data.filter(
            (item: any) => !idDelete.includes(item.id)
          );
        return (newObj = {
          total: total - res,
          data: newData,
        });
      }
    });
  }
  return newObj;
};

const ActionPublish = async ({
  ActionPublishProps,
  Table,
  TableName,
  TableState,
  typeName,
}: any) => {
  var newObj: any;
  await Publish({
    table: TableName ? TableName : TableState,
    id: ActionPublishProps[0].id,
    publish: ActionPublishProps[0].publish,
    type: typeName,
  }).then((res) => {
    if (res && !res?.error) {
      var total = Table[TableState].total;
      var newData =
        Table[TableState].data &&
        Table[TableState].data.length > 0 &&
        Table[TableState].data.map((item: any) => {
          if (
            res.result.length > 0 &&
            res.result.find((el: any) => el.id == item.id)
          ) {
            return { ...item, publish: !item.publish };
          }
          return item;
        });
      return (newObj = {
        total: total,
        data: newData,
      });
    }
  });
  return newObj;
};
const ButtonActions = (ButtonActionsProps: ButtonActionProps) => {
  const [prop, setProp] = useState(ButtonActionsProps);
  const [table, setTable] = useRecoilState(TableState);

  const ActionType = (
    table: any,
    tableState: string,
    data: any,
    tableName?: string,
    type?: string,
  ) => {
    switch (type) {
      case "EDIT":
        return ActionEdit({
          ActionDeleteProps: data,
          Table: table,
          TableState: tableState,
          TableName: tableName,
        });
      case "SOFT_DELETE":
      case "DELETE":
        return ActionDelete({
          ActionDeleteProps: data,
          Table: table,
          TableState: tableState,
          TableName: tableName,
          type: type
        });
      case "PUBLISH":
        return ActionPublish({
          ActionPublishProps: data,
          Table: table,
          TableState: tableState,
          TableName: tableName,
        });
    }
  };

  useEffect(() => {
    setProp(ButtonActionsProps);
  }, [ButtonActionsProps]);

  return (
    <>
      {prop.tableActions &&
        prop.tableActions.length > 0 &&
        prop.tableActions.map((item: TableActions, key: Key) => {
          return (
            <Col
              className={styles.ButtonTooltip}
              style={{ padding: "5px" }}
            >
              <TooltipButton
                placement="top"
                {...item}
                key={key}
                triggerData={prop.trigger}
                onActionDefault={(data) => {
                  ActionType(
                    table,
                    Object.keys(table)[0],
                    data,
                    item?.tableName,
                    item.actionType,
                  )?.then((res: any) => {
                    if (res) {
                      setTable((old) => ({
                        ...old,
                        [Object.keys(table)[0]]: res,
                      }));
                    }
                  });
                }}
                buttonProps={{
                  shape: "default",
                  disabled: item.disabled
                }}
              />
            </Col>
          );
        })}
    </>
  );
};
export { ActionDelete, ButtonActions, ActionEdit };
export type { TableActions };
