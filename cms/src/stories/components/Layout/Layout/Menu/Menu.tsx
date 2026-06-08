import { Layout as AntLayout, Menu as AntMenu } from "antd";
import React, { ReactNode, useEffect, useState } from "react";
import styles from "./Menu.module.scss";
import { Icon, Button, Row, Typography } from "../../../index";
import classNames from "classnames";
import { useRouter } from "next/router";
import permissionsCheck from "@/utils/permission";

const { Sider } = AntLayout;

export type MenuProps = {
  appList: Array<any>;
  permissions: string[];
  // onItemClick: Function
};
const cx = classNames.bind(styles);
const Menu = ({ appList, permissions }: MenuProps) => {
  const [mainMenu, setMainMenu] = useState();
  const location = useRouter();
  const [routePermission, setRoutePermission] = useState<any>([]);
  const [collapsed, setCollapsed] = useState(false);
  const appPermissions =
    permissions.length > 0
      ? {
          appId: [...new Set(permissions.map((item) => item.split("/")?.[0]))],
          category: [
            ...new Set(
              permissions.map((item) => item.split("/")?.[1].toUpperCase())
            ),
          ],
        }
      : { appId: [], category: [] };
  const renderActionMainMenu = (
    appIcon: any,
    appName: ReactNode,
    appCallToAction: ReactNode,
    appCallToActionHref: string,
    rule: string,
    onClick?: () => void
  ) => {
    return (
      <Row justify="center" align="middle" className={cx(styles.ActionMenu)}>
        <Typography.Title level={5} className={cx(styles.AppHeader)}>
          <Icon component={appIcon} /> {appName}
        </Typography.Title>
        <Button
          icon="PlusLg"
          type="primary"
          size="large"
          className={styles.ButtonSiderChild}
          onClick={onClick}
          typeColor="default"
          href={appCallToActionHref}
          disabled={permissionsCheck(rule, permissions)}
        >
          {appCallToAction}
        </Button>
      </Row>
    );
  };

  const menuBuilder = () => {
    const appMainMenu: any = [];
    const appsMenu: any = {};
    const getRouterPermission: any = [];

    appList &&
      appList.map((appManifest: any) => {
        if (
          appPermissions.appId.length > 0 &&
          appPermissions.appId.includes(appManifest.appID)
        ) {
          const appMenu: any = [
            {
              label: renderActionMainMenu(
                appManifest.appIcon,
                appManifest.appName,
                appManifest.appCallToAction,
                appManifest.appCallToActionHref &&
                  `/${appManifest?.appID}${appManifest.appCallToActionHref}`,
                appManifest.appCallToActionRule,
                appManifest.appCallToActionEvent
              ),
              key: appManifest.appID + "-" + "action",
              type: "group",
            },
          ];
          !permissionsCheck(appManifest.appCallToActionRule, permissions) &&
            getRouterPermission.push({
              route: `/${appManifest?.appID}${appManifest.appCallToActionHref}`,
              rule: appManifest.appCallToActionRule,
            });
          appManifest?.categories &&
            appManifest?.categories.map((category: string) => {
              const categoryChildItems: Array<any> = [];
              appManifest?.routes &&
                appManifest?.routes.map((routeItem: any) => {
                  if (
                    category.toUpperCase() ==
                      routeItem.categories.toUpperCase() &&
                    !permissionsCheck(routeItem.rule, permissions)
                  ) {
                    getRouterPermission.push({
                      route: `/${appManifest?.appID}${routeItem.path}`,
                      rule: routeItem.rule,
                    });
                    categoryChildItems.push({
                      label: (
                        <a href={"/" + appManifest?.appID + routeItem.path}>
                          {routeItem.title}
                        </a>
                      ),
                      key: "/" + appManifest?.appID + routeItem.path,
                      icon: routeItem?.icon,
                    });
                  }
                });
              appMenu.push({
                label: category,
                key: appManifest?.appID + "-" + category,
                type: "group",
                children: categoryChildItems,
              });
            });
          appsMenu[appManifest.appID] = {
            ...appManifest,
            menuItems: appMenu,
          };
          //Build Main Menu
          appMainMenu.push({
            key: appManifest?.appID,
            label: <Icon component={appManifest?.appIcon} />,
            children: appMenu,
            popupClassName: styles.CustomeSubMenu,
          });
        }
      });
    setRoutePermission([...getRouterPermission]);
    setMainMenu(appMainMenu);
  };
  useEffect(() => {
    menuBuilder();
  }, []);

  useEffect(() => {
    if (
      !location.pathname.startsWith("/auth") &&
      location.pathname.startsWith("/profiles") &&
      ((location.pathname != "/" &&
        routePermission &&
        routePermission.length > 0 &&
        !routePermission.find((el: any) => el.route == location.pathname)) ||
        !routePermission)
    ) {
      window.location.href = "/";
    }
  }, [location, routePermission]);
  return (
    <Sider className={cx(styles.MainMenu)} width={collapsed ? 300 : 50}>
      <AntMenu
        theme="dark"
        mode="vertical"
        items={mainMenu && mainMenu}
        defaultSelectedKeys={[location.asPath]}
        triggerSubMenuAction="click"
        // onOpenChange={(e) => {
        //   setCollapsed(e.length > 0);
        //   console.log(2, e);
        // }}
      />
    </Sider>
  );
};

export default Menu;
