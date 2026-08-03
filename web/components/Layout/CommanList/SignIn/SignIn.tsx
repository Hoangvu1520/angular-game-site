import React from "react";
import { Authen } from "../../Authen";
import { Icon } from "../../../Icon";
import styles from "./SignIn.module.scss";
import { Key, useEffect, useState } from "react";
import { useAuthenticationStatus } from "@nhost/nextjs";

interface infor {
  userId?: number;
  userName?: string;
  insiderPoint?: number;
  SignIn?: [];
}

export type SignInProps = {
  className?: string;
  information?: infor;
};

const SignIn = (SignInProps: SignInProps) => {
  const [props, setProps] = useState(SignInProps);
  const { isLoading, isAuthenticated } = useAuthenticationStatus();

  //Function hook
  useEffect(() => {
    setProps(SignInProps);
  }, [SignInProps]);

  const box2 = [
    // {
    //   title: "Nội dung làm đẹp",
    //   subTitle: "Xem hoạt động, tiết kiệm, lợi ích,...",
    //   point: (
    //     <img
    //       className={styles.img}
    //       src={"https://www.sephora.com/img/ufe/bi/logo-insider.svg"}
    //       alt="Not Found"
    //     />
    //   ),
    // },
    {
      title: "Phần thưởng",
      subTitle: "Đổi thưởng, hàng mẫu và nhiều hơn,...",
      point: <>{props.information?.insiderPoint} point</>,
    },
  ];

  const box3 = [
    // {
    //   icon: "faRotateRight",
    //   header: "Buy It Again",
    //   content: "Reoder from In-store and online purchases",
    // },
    {
      icon: "faBox",
      header: "Đơn đặt hàng",
      content: "Xem và theo dõi các đơn đặt hàng trực tuyến",
      slug: "order",
    },
    // {
    //   icon: "faArrowsRotate",
    //   header: "Auto-Replenish",
    //   content: "View and manage your subscriptions",
    // },
    // {
    //   icon: "faHeart",
    //   header: "Loves",
    //   content: "View saved products",
    // },
    {
      icon: "faUser",
      header: "Cài đặt tài khoản",
      content: "Thanh toán, thông tin liên hệ, địa chỉ, mật khẩu",
      slug: "account",
    },
    {
      icon: "faCreditCard",
      header: "Thanh toán & Tín dụng",
      content: "Thanh toán đơn hàng qua tín dụng của bạn",
      slug: "payment",
    },
    // {
    //   icon: "faBagShopping",
    //   header: "Same-Day Unlimited",
    //   content: "Get Unlimited Free Same-Day Delivery",
    // },
  ];

  return (
    <div className={[styles.SignIn].join(" ")}>
      <div className={["row", styles.box1].join(" ")}>
        <Icon
          className={["col-1 col-md-2", styles.Icon].join(" ")}
          icon={"faCircleUser"}
          type={"solid"}
        />
        <div className={["col-11 col-md-10", styles.textbox1].join(" ")}>
          {props.information ? (
            <>
              <div className={["row", styles.text1box1].join(" ")}>
                Good afternoon, {props.information.userName}. 👋
              </div>
              <div className={["row", styles.text2box1].join(" ")}>
                FREE standard shipping on all orders for you.
              </div>
            </>
          ) : (
            <>
              <div className={["row", styles.text1box1].join(" ")}>
                Good afternoon, Beautiful. 👋
              </div>
              <div className={["row", styles.text2box1].join(" ")}>
                Sign in for FREE standard shipping on all orders.
              </div>
            </>
          )}
        </div>
      </div>

      {props.information && isAuthenticated ? (
        <></>
      ) : (
        <Authen className={["row", styles.box2].join(" ")} />
      )}

      {box2.map((item: any, key: Key) => {
        return (
          <div key={key} className={["row", styles.boxpoint].join(" ")}>
            <div className={["col-8", styles.content].join(" ")}>
              <div className={["row", styles.titlepoint].join(" ")}>
                {item.title}
              </div>
              <div className={["row", styles.sub_titlepoint].join(" ")}>
                {item.subTitle}
              </div>
            </div>
            <div className={["col-4", styles.point].join(" ")}>
              {item.point}
            </div>
          </div>
        );
      })}

      <div className={[styles.box3].join(" ")}>
        {box3.map((item: any, key: Key) => {
          return (
            <a
              key={key}
              className={["row", styles.Linkrow].join(" ")}
              href={
                item.slug == "tai-khoan" ? `/tai-khoan` : `/tai-khoan/${item.slug}`
              }
            >
              <div className={["row", styles.row].join(" ")}>
                <Icon
                  className={["col-1", styles.icon].join(" ")}
                  icon={item.icon}
                />
                <div className={["col-11", styles.textbox3].join(" ")}>
                  <div className={["row", styles.headertext].join(" ")}>
                    {item.header}
                  </div>

                  <div className={["row", styles.contenttext].join(" ")}>
                    {item.content}
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};
export default SignIn;
