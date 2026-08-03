import React, { Key, useEffect, useState } from "react";
import { Authen } from "../../Authen";
import { Icon } from "../../../Icon";
import { Dropdown } from "../../../Dropdown";
import styles from "./Community.module.scss";
import { useAuthenticationStatus } from "@nhost/nextjs";

interface infor {
  userId?: number;
  userName?: string;
  Community?: [];
}

export type CommunityProps = {
  information?: infor;
  disable?:boolean;
};

const Community = (CommunityProps: CommunityProps) => {
  const [props, setProps] = useState(CommunityProps);
  const { isLoading, isAuthenticated } = useAuthenticationStatus();


  useEffect(() => {
    setProps(CommunityProps);
  }, [CommunityProps]);

  const option = [
    {
      img: "https://www.sephora.com/contentimages/meganav/icons/community_home.jpg",
      text1: "Trang chủ cộng đồng",
      text2: "Đặt câu hỏi, tham gia thử thách và nhận đề xuất từ những người như bạn",
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

  const menu = [
    {
      title: "Cộng đồng",
      subTitle: "Tin tức, sự kiện",
      icon: "faUsers",
      children: (
        <div className={[styles.Community].join(" ")}>
          <div className={["row", styles.box1].join(" ")}>
            <Icon
              className={["col-2", styles.Icon].join(" ")}
              icon={"faCircleUser"}
              type={"solid"}
            />
            <div className={["col-8", styles.textbox1].join(" ")}>
              {props.information ? (
                <>
                  <div className={["row", styles.text1box1].join(" ")}>
                    Thông tin cộng đồng
                  </div>

                  <div className={["row", styles.text2box1].join(" ")}>
                    Chào {props.information.userName}, cập nhật thông tin và sự kiện tại đây.
                  </div>
                </>
              ) : (
                <>
                  <div className={["row", styles.text1box1].join(" ")}>
                    Thông tin cộng đồng
                  </div>
                  <div className={["row", styles.text2box1].join(" ")}>
                    Đăng nhập để cập nhật thông tin và sự kiện của chúng tôi.
                  </div>
                </>
              )}
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

          {box4Text.map((item: any, key: Key) => {
            return (
              <div key={key} className={[styles.box4].join(" ")}>
                <div className={[styles.headerbox4].join(" ")}>
                  {item.header}
                </div>

                <div className={[styles.textbox4].join(" ")}>{item.text1}</div>

                <div className={[styles.textbox4].join(" ")}>{item.text2}</div>

                <div className={[styles.textbox4].join(" ")}>{item.text3}</div>
              </div>
            );
          })}
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
              disable={props.disable}
              cursorNoDrop={true}
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
export default Community;
