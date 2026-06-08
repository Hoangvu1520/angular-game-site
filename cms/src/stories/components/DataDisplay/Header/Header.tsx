import styles from "./Header.module.scss";
import { Layout } from "antd";
import { Button, Col, Row, Typography } from "../../index";
import React, { Key, ReactNode, useEffect, useState } from "react";
import classNames from "classnames";

const cx = classNames.bind(styles);
const { Title } = Typography;
type HeaderProps = {
  title?: ReactNode;
  description?: ReactNode;
  callToActions?: any[];
  className?: string;
  background?: boolean;
};
const HeaderANTD = Layout.Header;
const Header = (headerProps: HeaderProps) => {
  const [prop, setProp] = useState(headerProps);
  useEffect(() => {
    setProp(headerProps);
  }, [headerProps]);
  return (
    <HeaderANTD
      className={cx(
        styles.HeaderPage,
        !prop.background && styles.Background,
        prop.className
      )}
    >
      <Row
        align="middle"
        justify="space-between"
        className={cx(styles.WarpHeader, "container")}
      >
        <Col>
          <div className={cx(styles.WarpTypographyHeader)}>
            <Title level={2} className={cx(styles.TitleHeader)}>
              {prop.title}
            </Title>
            <Title level={5} className={cx(styles.ContentHeader)}>
              {prop.description}
            </Title>
          </div>
        </Col>
        <Row className={cx(styles.WarpButton)}>
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
                      styles.ButtonCustomeStyle,
                      "ButtonOutLine",
                      item.className
                    )}
                    icon={item.icon}
                  />
                </Col>
              );
            })}
        </Row>
      </Row>
    </HeaderANTD>
  );
};
Header.defaultProps = {
  background: true,
};
export { Header };
export type { HeaderProps };
