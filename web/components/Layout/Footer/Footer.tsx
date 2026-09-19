import React, { ReactNode, useState, useEffect, Key } from 'react'
import styles from "./Footer.module.scss"
import { Button } from "../../Button";
import { Divider } from "../../Divider";
import { Dropdown } from "../../Dropdown";
import { useWidth } from "../../GlobalFunc";
import { BoostrapIcon } from "../../BoostrapIcon";
import { Input } from '../../Input';

interface section1 {
    icon?: string;
    title?: string;
    content?: ReactNode;
    link?: string;
}
export type FooterProps = {
    section1?: section1[];
};

const Footer: React.FC = (FooterProps: FooterProps) => {
    //define constants
    const [postList, setPostList] = useState<any>();
    const [socialIcon, setSocialIcon] = useState<any>();
    const width = useWidth();
    //functions to create

    //functions to handle actions

    //useEffect

    //functions to render
    const feedback = () => {
        return (
            <div
                className={[
                    "row",
                    "justify-center",
                    "align-center",
                    styles.FeedBack,
                ].join(" ")}
            >
                <div>Phản hồi trang web? Hãy cho chúng tôi biết ▸</div>
            </div>
        );
    };
    const bodySection2 = (data?: any) => {
    return (
      <div className={["row justify-between", styles.Section2].join(" ")}>
        <div className="row col-9 col-lg-12">
          {data &&
            data.length > 0 &&
            data.map((item: any, key: Key) => {
              return (
                <div key={key} className="col-4 col-lg-12">
                  <Dropdown
                    mode={width < 992 ? "drop" : "dropOff"}
                    title={item.title}
                    children={
                      <div>
                        {item.children.map((el: any, key: Key) => {
                          return (
                            <div key={key} className={styles.WarpLink}>
                              <p
                                className={styles.Link}
                                onClick={() =>
                                  (window.location.href = `/dieu-khoan/${el.link}`)
                                }
                              >
                                {el.title}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    }
                  />
                  {width < 992 && <Divider />}
                </div>
              );
            })}
        </div>
        <div
          className={["col-3 col-lg-12 row", styles.ContentSection2].join(" ")}
        >
          <div className={styles.Content}>
            Đăng ký nhận các chương trình khuyến mãi từ chúng tôi
          </div>
          <div className={[styles.outInput].join(" ")}>
            <label htmlFor="sign-up">
              <div className="row">
                <Input
                  className={[styles.Input].join(" ")}
                  placeholder="Nhập email của bạn"
                  type="email"
                  shape="standard"
                />
                <div>
                  <Button
                    color={"outline"}
                    className={[styles.Button].join(" ")}
                    children="Đăng ký"
                    borderRadius={"round"}
                  />
                </div>
              </div>
            </label>
            {/* <Button /> */}
          </div>
        </div>
      </div>
    );
  };

  const bodySection3 = () => {
    return (
      <div className={["row justify-end", styles.Section3].join(" ")}>
        <div className={[styles.WarpIcon].join(" ")}>
          {socialIcon &&
            socialIcon.length > 0 &&
            socialIcon.map((item: any, key: Key) => {
              if (item.icon && typeof item.icon == "string") {
                // const getBootstrapIconClass = (iconName: string) => {
                //   return `bi bi-${iconName.toLowerCase().replace(/\s+/g, "-")}`;
                // };
                return (
                  <BoostrapIcon
                    iconName={item.icon}
                    className={[styles.Icon].join(" ")}
                    onClick={() => (window.location.href = `${item.value}`)}
                  />
                );
              } else {
                return <></>;
              }
            })}
        </div>
      </div>
    );
  };
    //MAIN RENDER
    return (
        <div className={styles.Footer}>
            {feedback()}
            <div className={styles.BodyFooter}>
                <div className="container">
                    <>
                        {bodySection2(postList)}
                        <Divider />
                        {bodySection3()}
                    </>
                </div>
            </div>
        </div>
    )
}

export { Footer }