import React, { ReactNode, useState } from "react";
import styles from "./Layout.module.scss";
import { httpHandler } from "../../services";
import { useAuthContext } from "../../components/Provider/Provider";
import Image from "next/image";
import ReactModal from "react-modal";

interface menu {
  link?: string;
  icon?: string;
  type?: "regular" | "solid" | "brands";
}

interface navigation {
  label?: string;
  link?: string;
}

export type LayoutProps = {
  children: ReactNode;
  menu?: menu[];
  offVisble?: boolean;
  navigation?: navigation[];
  title?: string;
};
const Layout = ({
  children,
  // menu,
  // navigation,
  offVisble,
}: LayoutProps) => {
  //define constants
  // const [active, setActive] = useState<string>();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { userData } = useAuthContext();

  //function to create

  //function to handle actions
  // const handleClick = (value: string) => {
  //   setActive(value);
  // };

  const handleLogout = async () => {
    return await httpHandler("/auth/logout", {}, "GET").then(() => {
      localStorage.removeItem("accessToken")
      window.location.href = "dang-nhap";
    });
  };
  //function to hook

  //function to render
  const renderDropDown = () => {
    return (
      <div
        className={[styles.Dropdown, "row"].join(" ")}
        onMouseLeave={() => setDropdownVisible(false)}
        onMouseEnter={() => {
          dropdownVisible == true && setDropdownVisible(true);
        }}
      >
        <div
          className={[styles.Logout, styles.Button].join(" ")}
          onClick={() => {
            window.location.href = "/doi-mat-khau"
          }}
        >
          <span className={[styles.LogoutText].join("")}>
            Đổi mật khẩu
          </span>
        </div>
        <div
          className={[styles.Logout, styles.Button].join(" ")}
          onClick={() => {
            handleLogout();
          }}
        >
          <span className={[styles.LogoutText].join("")}>
            Đăng xuất
          </span>
        </div>
      </div>
    );
  };
  // const renderLink = (
  //   link: string,
  //   icon: string,
  //   type: "regular" | "solid" | "brands",
  //   name: string
  // ) => {
  //   return (
  //     <div className={[styles.Icon].join(" ")}>
  //       {/* <Icon
  //         icon={icon}
  //         type={type}
  //         onClick={() => {
  //           window.location.href = link;
  //         }}
  //       /> */}
  //       <p className={[styles.Name].join(" ")}>{name}</p>
  //     </div>
  //   );
  // };
  // let c = 0;
  const renderHeader = () => {
    return (
      <div
        className={[styles.Header, "row justify-between"].join(" ")}
        onMouseLeave={() => setDropdownVisible(false)}
        onMouseEnter={() => {
          dropdownVisible == true && setDropdownVisible(true);
        }}
      >
        <div className={[styles.Navigation, "row"].join(" ")}>
          <a href="/">
            <Image
              src="/logo.png"
              className={[styles.Logo].join(" ")}
              alt="Logo"
              width={150}
              height={30}
            />
          </a>
          <p className={[styles.Title].join(" ")}>Giao dịch</p>
          <div className={[styles.List, "row"].join(" ")}>
            {/* {navigation &&
              navigation.length > 0 &&
              navigation.map((item: any, key: Key) => {
                c++;
                return (
                  <a
                    href={item.link}
                    key={key}
                    onClick={() => handleClick(item.label)}
                    className={[
                      styles.ListItem,
                      item.label == active ? styles.Active : "",
                    ].join(" ")}
                  >
                    {item.label}
                  </a>
                );
              })} */}
          </div>
          {/* <div className={[styles.Dropdown].join(" ")}>
            <div className={[styles.DropdownTitle].join(" ")}>
              ...
            </div>
            {navigation && navigation.length > 0 && (
              <div className={styles.DropdownContent}>
                {navigation.map((item: any, key: Key) => (
                  <div
                    key={key}
                    onClick={() => handleClick(item.label)}
                    className={[
                      styles.ListItem,
                      item.label === active ? styles.Active : "",
                    ].join(" ")}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </div> */}
        </div>

        <div className={[styles.Notification, "row"].join(" ")}>
          {/* <div className="col">
            <BellFill className={[styles.Icon].join(" ")} />
          </div> */}
          <div className={[styles.Cash].join(" ")}>
            Số dư ví:{" "}
            {userData
              ? (userData.cash
                ? parseInt(userData.cash)
                : 0
              ).toLocaleString("en-US")
              : 0}{" "}
            <i>VNĐ</i>
          </div>
          <div className={[styles.Profile].join(" ")}>
            <p
              className={[styles.UserName].join(" ")}
              onMouseEnter={() => setDropdownVisible(true)}
            >
              {userData &&
                (userData?.user_name
                  ? userData.user_name
                  : userData.email)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  //Function to effect
  //MAIN RENDER
  return (
    <div className={[styles.Layout].join(" ")}>
      {/* {offVisble ? (
        <></>
      ) : (
        <div className={[styles.Sidebar].join(" ")}>
          {menu &&
            menu.length > 0 &&
            menu.map((item: any, key: Key) => {
              return (
                <div key={key}>
                  {renderLink(item.link, item.icon, item.type, item.name)}
                </div>
              );
            })}
        </div>
      )} */}
      {offVisble ? <></> : renderHeader()}
      {dropdownVisible ? renderDropDown() : <></>}
      <div
        className={[offVisble ? "" : styles.MainContent].join(" ")}
      >
        {children}
      </div>
    </div>
  );
};

export { Layout };
