import classNames from "classnames";
import styles from "./TableEmpty.module.scss";
import { ImageUploadfile } from "../../../../Assets/Images";
import { Col, Row, Button, Icon, Typography } from "../../../index";
import React, { Key, ReactNode, useState } from "react";
import Image from "next/image";

const { Title } = Typography;

type TableEmptyProps = {
  noData: ReactNode;
  callToActions: any[];
};
const cx = classNames.bind(styles);
const TableEmpty = (TableEmptyProps: TableEmptyProps) => {
  const [prop, setProp] = useState(TableEmptyProps);
  return (
    <Row justify="center" align="middle" className={cx(styles.TableEmpty)}>
      <Col className={cx(styles.Image)}>
        <Image src={ImageUploadfile} alt="" />
      </Col>
      <Col>
        <Title level={1} className={cx(styles.Title)}>
          {prop.noData}
        </Title>
      </Col>
      <Row className={cx(styles.WarpButton)} justify="space-between">
        {prop.callToActions &&
          prop.callToActions.length > 0 &&
          prop.callToActions.map((item: any, key: Key) => {
            return (
              <Col key={key}>
                <Button
                  shape="round"
                  size="large"
                  {...item}
                  className={cx(
                    "ButtonOutLine",
                    styles.ButtonCustomeStyle,
                    item.className
                  )}
                  icon={item.icon}
                />
              </Col>
            );
          })}
      </Row>
    </Row>
  );
};
export { TableEmpty };
export type { TableEmptyProps };
