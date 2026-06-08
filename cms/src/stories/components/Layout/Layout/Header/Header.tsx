import { Layout, Menu } from "antd";
import { Col, Row } from "../../../index";
import styles from "./Header.module.scss";
import { Logo } from "../../../../Assets/Images";
import React from "react";
import classNames from "classnames";
import Image from "next/image";
const { Header: AntHeader } = Layout;

export interface HeaderProps {
  menu: any;
}
const cx = classNames.bind(styles);
const Header = ({ menu }: HeaderProps) => {
  return (
    <AntHeader className={styles.HeaderLayout}>
      <Row justify="space-between">
        <Col span={12}>
          <div className={styles.Logo}>
            <a href="/">
              <Image src={Logo} alt="" />
            </a>
          </div>
          <Menu
            theme="light"
            mode="horizontal"
            items={menu.mainMenu}
            className={styles.MenuHeaderLayout}
          />
        </Col>
        <Col span={12} className={cx(styles.WarpMenuRight)}>
          <Menu
            theme="light"
            mode="horizontal"
            className={styles.MenuHeaderLayoutRight}
            items={menu.userMenu}
          />
        </Col>
      </Row>
    </AntHeader>
  );
};

export default Header;
