import React, { Key, useEffect, useState } from "react";
import { Authen } from "../../Authen";
import { Icon } from "../../../Icon";
import { Dropdown } from "../../../Dropdown";
import styles from "./Basket.module.scss";
import { Button } from "../../../Button";
import { Acount, Cart, CartDelete } from "../../../../services";
import { CartAtom, LoadingAtom } from "../../../../atom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useRouter } from "next/router";
import {
  useAuthenticationStatus,
  useNhostClient,
  useUserData,
} from "@nhost/nextjs";

interface infor {
  userId?: any;
  userName?: string;
  carts?: [];
}

export type BasketProps = {
  information?: infor;
  cart?: any;
};

const totalPoint = (pointUser: any, pointProduct: any) => {
  if (typeof pointUser == "string" || typeof pointProduct == "string") {
    return Number(pointUser) + Number(pointProduct);
  } else {
    return Number(pointUser + pointProduct);
  }
};

const convertToArr = (variant: string) => {
  return eval(variant);
};

const Basket = (BasketProps: BasketProps) => {
  const [props, setProps] = useState(BasketProps);
  //Define constant
  const [cart, setCart] = useRecoilState<any>(CartAtom);
  const setLoadingState = useSetRecoilState(LoadingAtom);
  const { isLoading, isAuthenticated } = useAuthenticationStatus();
  const { storage } = useNhostClient();
  const user = useUserData();
  const router = useRouter();
  const basket = router.pathname;
  const information: any = useUserData()?.metadata;

  const totalPrice = () => {
    const total = cart
      .filter((item: any) => item.order_id == null || item.price == null)
      .reduce((accumulator: number, item: any) => {
        return accumulator + item.price;
      }, 0);
    return total ? total.toLocaleString() : 0;
  };

  const handelDelete = (item: any) => {
    if (item.gift == true && item?.grade != null) {
      props.information?.userId &&
        CartDelete({
          user_id: props.information?.userId,
          cart_id: item.id,
        }).then((res: any) => {
          if ((res = 1)) {
            setCart(cart.filter((NewArr: any) => NewArr != item));
          }
        });
      props.information?.userId &&
        Acount({
          idUser: props.information?.userId,
          point:
            information?.insiderPoint && item?.grade
              ? totalPoint(information?.insiderPoint, item?.grade)
              : "0",
          fristName: information?.fristName ? information?.fristName : "",
          lastName: information?.lastName ? information?.lastName : "",
          email: information?.Email ? information?.Email : "",
          phone: information?.phone ? information?.phone : "",
          birthday: information?.Birthday ? information?.Birthday : "",
        }).then((el: any) => {
          if (el) {
            router.reload();
            alert("Đã trả lại quà đổi thưởng !!!");
          }
        });
    } else {
      props.information?.userId &&
        CartDelete({
          user_id: props.information?.userId,
          cart_id: item.id,
        }).then((res: any) => {
          if ((res = 1)) {
            setCart(cart.filter((NewArr: any) => NewArr != item));
          }
        });
    }
  };

  //Function hook
  useEffect(() => {
    setProps(BasketProps);
  }, [BasketProps]);
  useEffect(() => {
    setLoadingState(true);
    if (isAuthenticated) {
      setLoadingState(false);
      Cart({ userId: user?.id }).then((res: any) => {
        res && res.length > 0 && setCart(res);
      });
    } else {
      setLoadingState(false);
      setCart([]);
    }
  }, [isAuthenticated]);
  //Function to render
  const menu = [
    {
      icon: "faBasketShopping",
      children: (
        <div className={[styles.Basket].join(" ")}>
          {props.information && isAuthenticated ? (
            <>
              <div className={[, styles.header].join(" ")}>Giỏ hàng</div>
              {cart && cart.length > 0 && (
                <div className={["row justify-center", styles.box1].join(" ")}>
                  Các sản phẩm bạn đã chọn.
                </div>
              )}
              {cart && cart.length > 0 && isAuthenticated ? (
                <div className={[styles.basketCard].join(" ")}>
                  <div className={[styles.headerCard].join(" ")}>Mặt hàng</div>
                  <div className={[styles.basketProduct].join(" ")}>
                    {cart.map((item: any, key: Key) => {
                      return (
                        <div
                          key={key}
                          className={[
                            "row justify-between",
                            styles.basketProductList,
                          ].join(" ")}
                        >
                          <div className={["col-2", styles.outImg].join(" ")}>
                            <a href={`/san-pham/${item.product?.slug}`}>
                              <img
                                className={[, styles.tagImg].join(" ")}
                                src={
                                  item.product?.images &&
                                  convertToArr(item.product?.images).length >
                                    0 &&
                                  storage.getPublicUrl({
                                    fileId: convertToArr(
                                      item.product?.images
                                    )[0],
                                  })
                                }
                              />
                            </a>
                          </div>
                          <div
                            className={[
                              "col-10 justify-end",
                              styles.outContentProductList,
                            ].join(" ")}
                          >
                            <a href={`/san-pham/${item.product?.slug}`}>
                              <div
                                className={[
                                  "row",
                                  styles.contentProductList,
                                ].join(" ")}
                              >
                                <div
                                  className={[
                                    "col-9",
                                    styles.contentProduct,
                                  ].join(" ")}
                                >
                                  <div
                                    className={[
                                      "row",
                                      styles.headerProductBasket,
                                    ].join(" ")}
                                  >
                                    {item.gift == true
                                      ? `${item.product.name} (Quà tặng)`
                                      : item.product?.name}
                                  </div>
                                  <div
                                    className={[
                                      "row",
                                      styles.contentProductBasket,
                                    ].join(" ")}
                                  >
                                    {item.product?.sub_title}
                                  </div>
                                </div>
                                <div
                                  className={[
                                    "col-3",
                                    styles.priceProduct,
                                  ].join(" ")}
                                >
                                  {item.price && item.gift != true
                                    ? item.price.toLocaleString()
                                    : "Miễn phí"}
                                </div>
                              </div>
                            </a>

                            <div
                              className={["row", styles.BottomProductList].join(
                                " "
                              )}
                            >
                              <div
                                className={["col-10", styles.MovetoLoves].join(
                                  " "
                                )}
                              >
                                Chuyển sang mục yêu thích
                              </div>
                              <div
                                className={["col-2", styles.Remove].join(" ")}
                                onClick={() => handelDelete(item)}
                              >
                                Xóa
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className={["row", styles.Total].join(" ")}>
                    <div className={["col-9", styles.Subtotal].join(" ")}>
                      Tổng ( {cart.length} sản phẩm )
                    </div>
                    <div className={["col-3", styles.Pricetotal].join(" ")}>
                      {totalPrice()}
                    </div>
                  </div>
                  <Button
                    className={["row", styles.ButtonBuy].join(" ")}
                    color={"fill"}
                    borderRadius={"round"}
                    children={"Xem giỏ hàng và thanh toán"}
                    link={"/gio-hang"}
                  />
                </div>
              ) : (
                <div className={[styles.basketEmpty].join(" ")}>
                  <div
                    className={[
                      "row justify-center",
                      styles.textBasketEmpty,
                    ].join(" ")}
                  >
                    Giỏ hàng của bạn đang trống.
                  </div>
                  <div
                    className={[
                      "row justify-center",
                      styles.buttonBasketEmpty,
                    ].join(" ")}
                  >
                    <Button
                      className={[, styles.button].join(" ")}
                      border={true}
                      children={"Mua sắm ngay"}
                      borderRadius={"round"}
                      type={"button"}
                      color={"fill"}
                      link={"/cua-hang"}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className={[, styles.header].join(" ")}>Giỏ hàng</div>
              <div className={["row justify-center", styles.box1].join(" ")}>
                Đăng nhập để xem các mục bạn có thể đã thêm trước đó.
              </div>
              <Authen className={["row"].join(" ")} />
            </>
          )}

          <div className={[styles.box3].join(" ")}>
            <div className={["row", styles.row].join(" ")}>
              <Icon
                className={["col-1", styles.icon].join(" ")}
                icon={"faHouse"}
              />
              <div className={["col-11", styles.textbox3].join(" ")}>
                <div className={["row", styles.contenttext].join(" ")}>
                  Xem mẫu, phần thưởng và khuyến mãi trong giỏ hàng.
                </div>
              </div>
            </div>

            <div className={["row", styles.row].join(" ")}>
              <Icon
                className={["col-1", styles.icon].join(" ")}
                icon={"faTruck"}
              />
              <div className={["col-11", styles.textbox3].join(" ")}>
                <div className={["row", styles.contenttext].join(" ")}>
                  Beauty Point được đổi quà tiêu chuẩn MIỄN PHÍ cho
                  tất cả các đơn đặt hàng.
                </div>
              </div>
            </div>
{/* 
            <div className={["row", styles.row].join(" ")}>
              <Icon
                className={["col-1", styles.icon].join(" ")}
                icon={"faCreditCard"}
              />
              <div className={["col-11", styles.textbox3].join(" ")}>
                <div className={["row", styles.headertext].join(" ")}>
                  Chương trình thẻ tín dụng Sephora
                </div>

                <div className={["row", styles.contenttext].join(" ")}>
                  Tiết kiệm 25% cho đơn hàng này khi bạn mở và sử dụng Thẻ tín
                  dụng Sephora ngay hôm nay*
                </div>

                <div className={["row", styles.contenttext].join(" ")}>
                  * Tùy thuộc vào phê duyệt tín dụng. Áp dụng loại trừ.
                </div>
              </div>
            </div> */}
          </div>
        </div>
      ),
      position: "end",
    },
  ];

  //Main render
  return (
    <div className={["row justify-center"].join(" ")}>
      {menu.map((item: any, key: Key) => {
        return (
          <div key={key} className={styles.DropdownHeader1}>
            {basket == "/gio-hang" ? (
              <div className={[styles.Drop].join("")}>
                <div className={["row justify-center", styles.Title].join(" ")}>
                  {
                    <a className={[styles.linkicon].join(" ")}>
                      <div className={[styles.Outicon].join(" ")}>
                        <Icon
                          className={[styles.icon1].join(" ")}
                          icon={item.icon}
                          type={item.iconType ? item.iconType : "solid"}
                        />
                      </div>
                      {cart && cart.length > 0 && (
                        <div className={[, styles.totalCard].join(" ")}>
                          <span
                            className={[
                              "justify-center",
                              styles.intotalCard,
                            ].join(" ")}
                          >
                            {cart.length}
                          </span>
                        </div>
                      )}
                    </a>
                  }
                </div>
              </div>
            ) : (
              <Dropdown
                className={[styles.Drop].join("")}
                classNameTitle={["row justify-center", styles.Title].join(" ")}
                classNameChildren={[styles.children].join(" ")}
                title={
                  basket == "/gio-hang" ? (
                    <a className={[styles.linkicon].join(" ")}>
                      <div className={[styles.Outicon].join(" ")}>
                        <Icon
                          className={[styles.icon1].join(" ")}
                          icon={item.icon}
                          type={item.iconType ? item.iconType : "solid"}
                        />
                      </div>
                      {cart && cart.length > 0 && (
                        <div className={[styles.totalCard].join(" ")}>
                          <span
                            className={[
                              "justify-center",
                              styles.intotalCard,
                            ].join(" ")}
                          >
                            {cart.length}
                          </span>
                        </div>
                      )}
                    </a>
                  ) : (
                    <a className={[styles.linkicon].join(" ")} href={"/gio-hang"}>
                      <div className={[styles.Outicon].join(" ")}>
                        <Icon
                          className={[styles.icon1].join(" ")}
                          icon={item.icon}
                          type={item.iconType ? item.iconType : "solid"}
                        />
                      </div>
                      {cart && cart.length > 0 && (
                        <div className={[styles.totalCard].join(" ")}>
                          <span
                            className={[
                              "justify-center",
                              styles.intotalCard,
                            ].join(" ")}
                          >
                            {cart.length}
                          </span>
                        </div>
                      )}
                    </a>
                  )
                }
                mode={"bubble"}
                children={item.children}
                bubblePosition={item.position}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
export default Basket;
