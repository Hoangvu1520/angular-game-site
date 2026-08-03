import React, { Key, useState, useEffect } from "react";
import { Authen } from "../../Authen";
import { Icon } from "../../../Icon";
import { Dropdown } from "../../../Dropdown";
import styles from "./Love.module.scss";
import Modal from "react-modal";
import { useWidth } from "../../../GlobalFunc";
import { ModalLove } from "./formModal";
import { Button } from "../../../Button";
import { useAuthenticationStatus } from "@nhost/nextjs";

const customStyles: any = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 3,
  },
  content: {
    height: "max-content",
    maxHeight: "80vh",
    width: "88vw",
    top: "auto",
    bottom: "0",
    right: "0",
    left: "0",
    paddingBottom: "20px",
    paddingRight: "70px",
    borderRadius: "9px 9px 0 0",
    boxShadow: "0 0 1px black",
    transition: "opacity 2000ms ease-in-out",
    overflow: "auto",
  },
};

interface infor {
  userId?: number;
  userName?: string;
  love?: [];
}

export type LoveProps = {
  information?: infor;
  disable?: boolean;
};

const Love = (LoveProps: LoveProps) => {
  const [props, setProps] = useState(LoveProps);
  const { isLoading, isAuthenticated } = useAuthenticationStatus();
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };

  useEffect(() => {
    setProps(LoveProps);
  }, [LoveProps]);

  useEffect(() => {
    setOpen(false);
  }, [useWidth() > 768]);

  const products = [
    {
      img: "https://www.sephora.com/productimages/sku/s2640332-main-zoom.jpg?pb=clean-planet-positive-badge-2021&imwidth=96",
      headerProduct: "SEPHORA COLLECTION",
      contentProduct: "Vitamin Eye Masks,Color: Papaya + Vitamin C",
      priceProduct: 10,
    },
    {
      img: "https://www.sephora.com/productimages/sku/s2640332-main-zoom.jpg?pb=clean-planet-positive-badge-2021&imwidth=96",
      headerProduct: "SEPHORA COLLECTION",
      contentProduct: "Vitamin Eye Masks,Color: Papaya + Vitamin C",
      priceProduct: 20,
    },
  ];

  const menu = [
    {
      icon: props.disable == false ? "faHeart" : "faHeartCircleXmark",
      iconType: props.disable == false && "regular",
      children: (
        <div className={[styles.Love].join(" ")}>
          <div className={[, styles.header].join(" ")}>Mục yêu thích</div>
          <div className={["row justify-center", styles.box1].join(" ")}>
            Sử dụng danh sách yêu thích của bạn để theo dõi các sản phẩm yêu
            thích của bạn.
          </div>
          {props.information && isAuthenticated ? <></> : <Authen className={["row"].join(" ")} />}
          {products.map((item: any, key: Key) => {
            return (
              <div key={key} className={["row", styles.LoveList].join(" ")}>
                <img
                  className={["col-2", styles.tagImg].join(" ")}
                  src={item.img}
                />
                <div className={["col-7", styles.contentLoveList].join(" ")}>
                  <div className={["row", styles.headerProduct].join(" ")}>
                    {item.headerProduct}
                  </div>
                  <div className={["row", styles.contentProduct].join(" ")}>
                    {item.contentProduct}
                  </div>
                  <div className={["row", styles.priceProduct].join(" ")}>
                    {item.priceProduct}
                  </div>
                </div>
                <div className={["col-3", styles.outButton].join(" ")}>
                  <Button
                    className={styles.Button}
                    border={true}
                    children={"Add"}
                    borderRadius={"round"}
                    type={"button"}
                    color={"outline"}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ),
      position: "end",
    },
  ];

  return (
    <div className={["row justify-center"].join(" ")}>
      {menu.map((item: any, key: Key) => {
        return (
          <div key={key} className={styles.DropdownHeader1}>
            <Dropdown
              className={[styles.Drop].join("")}
              classNameTitle={["row justify-center", styles.Title].join(" ")}
              classNameChildren={[styles.children].join(" ")}
              disable={props.disable}
              cursorNoDrop={true}
              title={
                <>
                  <div
                    className={[styles.Outicon].join(" ")}
                    onClick={handleOpen}
                  >
                    <Icon
                      className={[styles.icon1].join(" ")}
                      icon={item.icon}
                      type={item.iconType ? item.iconType : "solid"}
                    />
                  </div>
                  {useWidth() < 769 && (
                    <Modal
                      isOpen={open}
                      onRequestClose={handleOpen}
                      style={customStyles}
                    >
                      <Icon
                        className={["row justify-end", styles.ClossButton].join(
                          " "
                        )}
                        icon={"faX"}
                        onClick={handleOpen}
                      />
                      <ModalLove />
                    </Modal>
                  )}
                </>
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
export default Love;
