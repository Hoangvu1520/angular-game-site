import React from "react";
import { Authen } from "../../Authen";
import { Icon } from "../../../Icon";
import { Dropdown } from "../../../Dropdown";
import styles from "./Community.module.scss";
import { Key, ReactNode, useEffect, useState } from "react";
import { useAuthenticationStatus } from "@nhost/nextjs";

interface infor {
  userId?: number;
  userName?: string;
  Community?: [];
}

export type CommunityProps = {
  className?: string;
  information?: infor;
};

const Community = (CommunityProps: CommunityProps) => {
  const [props, setProps] = useState(CommunityProps);
  const { isLoading, isAuthenticated } = useAuthenticationStatus();


  //Function hook
  useEffect(() => {
    setProps(CommunityProps);
  }, [CommunityProps]);

  const option = [
    {
      img: "https://www.sephora.com/contentimages/meganav/icons/community_home.jpg",
      text1: "Trang chủ cộng đồng",
      text2:
        "Đặt câu hỏi, tham gia thử thách và nhận đề xuất từ những người như bạn",
    },
    {
      img: "https://www.sephora.com/contentimages/meganav/icons/community_groups.jpg",
      text1: "Các nhóm",
      text2: "Khám phá các chủ đề phù hợp với sở thích làm đẹp của bạn",
    },
    {
      img: "https://www.sephora.com/contentimages/meganav/icons/community_gallery.jpg",
      text1: "Phòng trưng bày",
      text2: "Thêm ảnh của bạn và lấy cảm hứng từ những người yêu cái đẹp",
    },
  ];

  const box4Text = [
    {
      header: "Nhóm nổi bật",
      text1: "Xu hướng tại Sephora",
      text2: "Tin tức nóng hổi",
      text3: "Mỹ phẩm, trang sức, tóc",
    },
    {
      header: "Chủ đề nổi bật",
      text1: "Phần thưởng đặc biệt ở Sephora",
      text2: "Tìm hiểu thêm về cộng đồng",
      text3: "Chia sẻ dự án tiềm năng",
    },
  ];

  return (
    <div className={[styles.Community].join(" ")}>
      <div className={[, styles.Header].join(" ")}>Cộng đồng</div>
      <div className={["row", styles.box1].join(" ")}>
        <div className={["col-10 row", styles.Icon].join(" ")}>
          <Icon
            className={[, styles.Icon].join(" ")}
            icon={"faCircleUser"}
            type={"solid"}
          />
          <div className={[, styles.textbox1].join(" ")}>
            {props.information ? (
              <>
                <div className={["row", styles.text1box1].join(" ")}>
                  Thông tin cộng đồng
                </div>

                <div className={["row", styles.text2box1].join(" ")}>
                  Thồng tin của {props.information.userName}
                </div>
              </>
            ) : (
              <>
                <div className={["row", styles.text1box1].join(" ")}>
                  Thông tin cộng đồng
                </div>

                <div className={["row", styles.text2box1].join(" ")}>
                  Đăng nhập để xem thông tin của bạn
                </div>
              </>
            )}
          </div>
        </div>

        <Icon
          className={["col-1", styles.miniIcon1].join(" ")}
          icon={"faBell"}
          type={"regular"}
        />

        <Icon
          className={["col-1", styles.miniIcon2].join(" ")}
          icon={"faEnvelope"}
          type={"regular"}
        />
      </div>

      {props.information && isAuthenticated? (
        <></>
      ) : (
        <Authen className={["row", styles.box2].join(" ")} />
      )}

      <div className={[styles.box3].join(" ")}>
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

      {box4Text.map((item: any, key: Key) => {
        return (
          <div key={key} className={[styles.box4].join(" ")}>
            <div className={[styles.headerbox4].join(" ")}>{item.header}</div>

            <div className={[styles.textbox4].join(" ")}>{item.text1}</div>

            <div className={[styles.textbox4].join(" ")}>{item.text2}</div>

            <div className={[styles.textbox4].join(" ")}>{item.text3}</div>
          </div>
        );
      })}
    </div>
  );
};
export default Community;
