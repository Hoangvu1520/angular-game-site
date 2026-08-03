import React from "react";
import { Button } from "../../../Button";
import { Icon } from "../../../Icon";
import { Dropdown } from "../../../Dropdown";
import styles from "./Stores.module.scss";
import { Key, ReactNode, useEffect, useState } from "react";

export type StoresProps = {
  className?: string;
  [props: string]: any;
};

const Stores = (StoresProps: StoresProps) => {
  const [props, setProps] = useState(StoresProps);

  //Function hook
  useEffect(() => {
    setProps(StoresProps);
  }, [StoresProps]);

  const information = [{ Name: "Hoàng Anh" }];

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

  return (
    <div className={[styles.Stores, props.className].join(" ")}>
      <div className={[, styles.Header].join(" ")}>Stores</div>
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
          <div className={["col-9 justify-start", styles.header1].join(" ")}>
            Chỉ có ở Sephora
          </div>
          <div className={["col-3 justify-end", styles.headerlink].join(" ")}>
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
                <img className={[, styles.tagImg].join(" ")} src={item.img} />

                <div className={["col", styles.tagText].join(" ")}>
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
  );
};
export default Stores;
