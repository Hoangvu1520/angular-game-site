import React, { Key, useEffect, useState } from "react";
import { Authen } from "../../Authen";
import { Icon } from "../../../Icon";
import { Dropdown } from "../../../Dropdown";
import styles from "./SignIn.module.scss";
import { useSignOut, useAuthenticationStatus } from "@nhost/nextjs";
import { useRouter } from "next/router";
import { useAuthContext } from "../../../Provider/Provider";

interface infor {
  email?: string;
  userId?: number;
  userName?: string;
  insiderPoint?: number;
  SignIn?: [];
  fristName?: string;
  lastName?: string;
}

export type SignInProps = {
  information?: infor;
};

const SignIn = (SignInProps: SignInProps) => {
  const { isLoading, isError, isAuthenticated } =
    useAuthenticationStatus();
  const { signOut } = useSignOut();
  const { handleOpenModal, changeTypeModal }: any = useAuthContext();
  const displayName =
    SignInProps.information?.fristName &&
    SignInProps.information?.lastName
      ? SignInProps.information?.fristName +
        " " +
        SignInProps.information?.lastName
      : SignInProps.information?.email;

  const onCLickSignOut = () => {
    signOut();
  };

  const box3 = [
    {
      icon: "faBox",
      header: "Đơn đặt hàng",
      content: "Xem và theo dõi các đơn đặt hàng trực tuyến",
      slug: "order",
    },
    {
      icon: "faUser",
      header: "Cài đặt tài khoản",
      content: "Thanh toán, thông tin liên hệ, địa chỉ, mật khẩu",
      slug: "account",
    },
    // {
    //   icon: "faCreditCard",
    //   header: "Thanh toán & Tín dụng",
    //   content: "Thanh toán đơn hàng qua tín dụng của bạn",
    //   slug: "payment",
    // },
    // {
    //   icon: "faBagShopping",
    //   header: "Same-Day Unlimited",
    //   content: "Get Unlimited Free Same-Day Delivery",
    // },
  ];

  const menu = [
    {
      title:
        SignInProps.information && isAuthenticated
          ? "Chào, " + `${displayName}`
          : "Đăng nhập",
      subTitle:
        SignInProps.information && isAuthenticated
          ? `Điểm thưởng: ${
              SignInProps.information.insiderPoint
                ? SignInProps.information.insiderPoint
                : 0
            }`
          : "Miến phí vận chuyển",
      icon: "faCircleUser",
      type: "auth",
      children: (
        <div className={[styles.SignIn].join(" ")}>
          <div className={["row", styles.box1].join(" ")}>
            <Icon
              className={["col-2", styles.Icon].join(" ")}
              icon={"faCircleUser"}
              type={"solid"}
            />
            <div className={["col-10", styles.textbox1].join(" ")}>
              {SignInProps.information && isAuthenticated ? (
                <>
                  <div
                    className={["row", styles.text1box1].join(" ")}
                  >
                    Xin chào,{" "}
                    <div className={[styles.name].join(" ")}>
                      {displayName}
                    </div>
                    . 👋
                  </div>
                  <div
                    className={["row", styles.text2box1].join(" ")}
                  >
                    MIỄN PHÍ vận chuyển tiêu chuẩn trên tất cả các đơn
                    đặt hàng cho bạn.
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={["row", styles.text1box1].join(" ")}
                  >
                    Xin chào, người đẹp. 👋
                  </div>
                  <div
                    className={["row", styles.text2box1].join(" ")}
                  >
                    Đăng nhập để được giao hàng tiêu chuẩn MIỄN PHÍ
                    cho tất cả các đơn đặt hàng.
                  </div>
                  <Authen
                    className={["row", styles.box2].join(" ")}
                  />
                </>
              )}
            </div>
          </div>
          <div className={["row", styles.boxpoint].join(" ")}>
            <div className={["col-8", styles.content].join(" ")}>
              <div className={["row", styles.titlepoint].join(" ")}>
                Đổi thưởng
              </div>
              <div
                className={["row", styles.sub_titlepoint].join(" ")}
              >
                Đổi thưởng, hàng mẫu và nhiều hơn,...
              </div>
            </div>
            <div className={["col-4", styles.point].join(" ")}>
              {SignInProps.information?.insiderPoint
                ? SignInProps.information?.insiderPoint
                : 0}{" "}
              điểm
            </div>
          </div>
          <div className={[styles.box3].join(" ")}>
            {box3.map((item: any, key: Key) => {
              return (
                <div key={key}>
                  {isAuthenticated ? (
                    <a
                      className={["row", styles.Linkrow].join(" ")}
                      href={
                        item.slug == "tai-khoan"
                          ? `/tai-khoan`
                          : `/tai-khoan/${item.slug}`
                      }
                    >
                      <div className={["row", styles.row].join(" ")}>
                        <Icon
                          className={["col-1", styles.icon].join(" ")}
                          icon={item.icon}
                        />
                        <div
                          className={["col-11", styles.textbox3].join(
                            " "
                          )}
                        >
                          <div
                            className={[
                              "row",
                              styles.headertext,
                            ].join(" ")}
                          >
                            {item.header}
                          </div>

                          <div
                            className={[
                              "row",
                              styles.contenttext,
                            ].join(" ")}
                          >
                            {item.content}
                          </div>
                        </div>
                      </div>
                    </a>
                  ) : (
                    <div
                      className={["row", styles.Linkrow].join(" ")}
                      onClick={() => {
                        handleOpenModal(true);
                        changeTypeModal("signIn");
                      }}
                    >
                      <div className={["row", styles.row].join(" ")}>
                        <Icon
                          className={["col-1", styles.icon].join(" ")}
                          icon={item.icon}
                        />
                        <div
                          className={["col-11", styles.textbox3].join(
                            " "
                          )}
                        >
                          <div
                            className={[
                              "row",
                              styles.headertext,
                            ].join(" ")}
                          >
                            {item.header}
                          </div>
                          <div
                            className={[
                              "row",
                              styles.contenttext,
                            ].join(" ")}
                          >
                            {item.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {SignInProps.information && isAuthenticated ? (
            <div
              className={["row", styles.signOut].join(" ")}
              onClick={() => {
                onCLickSignOut();
              }}
            >
              Đăng xuất
            </div>
          ) : (
            <></>
          )}
        </div>
      ),
      position: "mid",
    },
  ];

  return (
    <div className={["row justify-center"].join(" ")}>
      {menu.map((item: any, key: Key) => {
        return (
          <div key={key} className={styles.DropdownHeader1}>
            <Dropdown
              className={[styles.Drop].join("")}
              classNameTitle={["row", styles.Title].join(" ")}
              classNameChildren={[styles.children].join(" ")}
              title={
                <div className={["row", styles.title].join(" ")}>
                  <div className={[, styles.Outicon1].join(" ")}>
                    <Icon
                      className={[styles.icon1].join(" ")}
                      icon={item.icon}
                      type={item.iconType ? item.iconType : "solid"}
                    />
                  </div>
                  <div className={[, styles.textchildren].join(" ")}>
                    {item.title && (
                      <h3 className={styles.textchildrenHeader}>
                        {item.title}
                      </h3>
                    )}
                    {item.subTitle && (
                      <h5 className={styles.textchildrenContent}>
                        {item.subTitle}
                      </h5>
                    )}
                  </div>
                </div>
              }
              mode={"bubble"}
              children={item.children}
              bubblePosition={item.position}
            />
          </div>
        );
      })}
    </div>
  );
};
export default SignIn;
