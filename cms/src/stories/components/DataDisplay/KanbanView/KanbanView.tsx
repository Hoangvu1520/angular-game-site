import {
  Col,
  Row,
  Icon,
  Typography,
  TooltipButton,
  ImageCard,
} from "../../index";
import styles from "./KanbanView.module.scss";
import React, { Key, useEffect, useState } from "react";
import classNames from "classnames";
import { ButtonActions } from "../Table/TableAction";

const { Title, Paragraph } = Typography;
interface TableDisplay {
  columns: any[];
  rowActions: any[];
}
type KanbanViewProps = {
  tableDisplay: TableDisplay;
  data: any;
  typeRender?: "default" | "image";
  typeName?: "snake" | "camel";
};
const cx = classNames.bind(styles);

const getKeyFomatter = (columns: any) => {
  var keyConvert = {
    icon: { key: "icon", render: undefined },
    title: { key: "title", render: undefined },
    content: { key: "content", render: undefined },
  };
  columns &&
    columns.length > 0 &&
    columns.map((item: any) => {
      keyConvert = item.dataFomatter
        ? {
            ...keyConvert,
            [item.dataFomatter]: {
              key: item.dataIndex,
              render: item.render,
            },
          }
        : keyConvert;
    });
  return keyConvert;
};

const KanbanView = (KanbanViewProps: KanbanViewProps) => {
  const [prop, setProp] = useState(KanbanViewProps);
  const [keyConvertRender, setKeyConvertRender] = useState<any>(
    getKeyFomatter(prop.tableDisplay.columns)
  );

  useEffect(() => {
    setProp(KanbanViewProps);
  }, [KanbanViewProps]);

  const renderTableContent = (item: any) => {
    return (
      item && (
        <Row align="middle" style={{ marginLeft: "-20px" }} wrap={false}>
          <Col className={cx(styles.WarpIcon)}>
            {keyConvertRender.icon.render ? (
              keyConvertRender.icon.render(keyConvertRender.icon.key, item)
            ) : (
              <Icon
                component={
                  item[keyConvertRender.icon.key]
                    ? item[keyConvertRender.icon.key]
                    : "Folder"
                }
              />
            )}
          </Col>
          <Col className={cx(styles.WarpContent)}>
            {keyConvertRender.title.render ? (
              keyConvertRender.title.render(
                item[keyConvertRender.title.key],
                item
              )
            ) : (
              <Title level={5} className={cx(styles.Title)}>
                {item[keyConvertRender.title.key]
                  ? item[keyConvertRender.title.key]
                  : "Folder name"}
              </Title>
            )}
            {keyConvertRender.content.render ? (
              keyConvertRender.content.render(
                item[keyConvertRender.content.key],
                item
              )
            ) : (
              <Paragraph className={cx(styles.Content)}>
                {item[keyConvertRender.content.key]}
              </Paragraph>
            )}
          </Col>
        </Row>
      )
    );
  };
  const renderTableCallToAction = (trigger: any, tableAction: any) => {
    return (
      <Col>
        <TooltipButton
          description={
            <ButtonActions
              trigger={trigger}
              tableActions={tableAction}
              typeName={prop.typeName}
            />
          }
          placement="left"
        />
      </Col>
    );
  };

  const renderDefaultType = (item: any) => {
    return (
      <Row
        className={cx(styles.Item)}
        justify="space-between"
        align="middle"
        wrap={false}
      >
        {renderTableContent(item)}
        {renderTableCallToAction([item], prop.tableDisplay.rowActions)}
      </Row>
    );
  };

  const renderImageType = (item: any) => {
    return keyConvertRender.title.render ? (
      keyConvertRender.title.render(item[keyConvertRender.title.key], item)
    ) : (
      <ImageCard
        imageFile={
          item[keyConvertRender.title.key] && item[keyConvertRender.title.key]
        }
      />
    );
  };
  //Main render
  const renderType = (item: any, type?: string) => {
    switch (type) {
      case "image":
        return renderImageType(item);
      default:
        return renderDefaultType(item);
    }
  };
  return (
    <Row align="middle" className={cx(styles.KanbanView)}>
      {prop.data.map((item: any, key: Key) => {
        return (
          <Col
            key={key}
            xs={{ span: "24" }}
            md={{ span: "12" }}
            lg={{ span: "8" }}
            className={cx(styles.WarpItem)}
          >
            {renderType(item, prop.typeRender)}
          </Col>
        );
      })}
    </Row>
  );
};

KanbanView.defaultProps = {
  typeRender: "default",
};
export { KanbanView };
export type { KanbanViewProps };
