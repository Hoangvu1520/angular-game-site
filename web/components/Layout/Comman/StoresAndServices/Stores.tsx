import React, { Key, useState, useEffect  } from "react";
import { Button } from "../../../Button";
import { Icon } from "../../../Icon";
import { Dropdown } from "../../../Dropdown";
import styles from "./Stores.module.scss";
import Modal from "react-modal";
import { useWidth } from "../../../GlobalFunc";
import { Advise } from "./Advise";


export type StoresProps = {
  disable?:boolean
};

const Stores = (StoresProps:StoresProps) => {
  const [props, setProps] = useState(StoresProps);
  const [open, setOpen] = useState(false);

  
  useEffect(() => {
    setProps(StoresProps);
  }, [StoresProps]);

  const handelOpen = () => {
    setOpen(!open);
  };
  const option = [
    {
      img: "https://www.sephora.com/contentimages/meganav/icons/happening_services.jpg",
      text1: "Dịch vụ",
      text2: "Dịch vụ trang điểm, chăm sóc da và tóc được cá nhân hóa",
    },
    {
      img: "https://www.sephora.com/contentimages/meganav/icons/happening_events_2.jpg",
      text1: "Cửa hàng sự kiện",
      text2: "Ra mắt thú vị, sự kiện, và nhiều hơn nữa!",
    },
    {
      img: "https://www.sephora.com/contentimages/meganav/icons/happening_new.jpg",
      text1: "Có gì mới trong cửa hàng",
      text2: "Khám phá những gì hấp dẫn trong cửa hàng của bạn",
    },
  ];

  const menu = [
    {
      title: "Tư vấn da khoa học",
      subTitle: "Miễn phí",
      icon: "faShop",
      children: (
        <div className={[styles.Stores].join(" ")}>
          <div className={["justify-center", styles.box1].join(" ")}>
            <Button
              className={[styles.button].join(" ")}
              border={true}
              children={"Chọn cửa hàng"}
              borderRadius={"round"}
              type={"button"}
              link={"#"}
              color={"fill"}
            />
          </div>

          <div className={["row justify-start", styles.box2].join(" ")}>
            <Icon
              className={[styles.iconStores].join(" ")}
              icon={"faLocationDot"}
            />
            <div className={[styles.textBox1Stores].join(" ")}>
              Tìm kiếm trên Sephora
            </div>
          </div>

          <div className={[, styles.box3].join(" ")}>
            <div className={["row", styles.header].join(" ")}>
              <div
                className={["col-9 justify-start", styles.header1].join(" ")}
              >
                Chỉ có ở Sephora
              </div>
              <div
                className={["col-3 justify-end", styles.headerlink].join(" ")}
              >
                Xem tất cả
              </div>
            </div>

            <div className={[styles.tagBox3].join(" ")}>
              {option.map((item: any, key: Key) => {
                return (
                  <div
                    key={key}
                    className={["row justify-between", styles.tag1].join(" ")}
                  >
                    <img
                      className={["col-2", styles.tagImg].join(" ")}
                      src={item.img}
                    />

                    <div className={["col-9", styles.tagText].join(" ")}>
                      <div className={["row", styles.tagText1].join(" ")}>
                        {item.text1}
                      </div>
                      <div className={["row", styles.tagText2].join(" ")}>
                        {item.text2}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ),
      position: "start",
    },
  ];

  return (
    <>
      <div className={["row justify-center"].join(" ")} onClick={handelOpen}>
        {menu.map((item: any, key: Key) => {
          return (
            <div key={key} className={styles.DropdownHeader1}>
              <Dropdown
                className={[styles.Drop].join("")}
                classNameTitle={["row", styles.Title].join(" ")}
                classNameChildren={[styles.children].join(" ")}
                disable={props.disable}
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
      <Modal
        isOpen={open}
        onRequestClose={handelOpen}
        portalClassName={styles.body}
        style={
          useWidth() > 768
            ? {
                overlay: {
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.75)",
                  zIndex: "3",
                },
                content: {
                  top: "50%",
                  left: "50%",
                  right: "auto",
                  bottom: "auto",
                  marginRight: "-10%",
                  transform: "translate(-50%, -50%)",
                  maxWidth: "420px",
                  height: "Max-content",
                  maxHeight: "80%",
                  zIndex: "3",
                },
              }
            : {
                overlay: {
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.75)",
                  zIndex: "3",
                },
                content: {
                  top: "0",
                  left: "0",
                  right: "0",
                  bottom: "0",
                  maxHeight: "95vh",
                  zIndex: "3",
                },
              }
        }
      >
        <div className={["row justify-end", styles.exitIcon].join(" ")}>
          <Icon onClick={handelOpen} icon={"faX"} />
        </div>
        <Advise onClick={handelOpen}/>
      </Modal>
    </>
  );
};
export default Stores;
