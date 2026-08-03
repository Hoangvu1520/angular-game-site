import React, { Key, useEffect } from "react";
import { Authen } from "../../Authen";
import { Icon } from "../../../Icon";
import { Dropdown } from "../../../Dropdown";
import styles from "./Chat.module.scss";
import { useState } from "react";
import { ModalChat } from "./formModal";
import Modal from "react-modal";
import { useWidth } from "../../../GlobalFunc";
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
  chat?: [];
}

export type ChatProps = {
  information?: infor;
  disable?: boolean;
};

const Chat = (ChatProps: ChatProps) => {
  const [props, setProps] = useState(ChatProps);
  const { isLoading, isAuthenticated } = useAuthenticationStatus();
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };

  useEffect(() => {
    setProps(ChatProps);
  }, [ChatProps]);

  useEffect(() => {
    setOpen(false);
  }, [useWidth() > 768]);

  const menu = [
    {
      icon: props.disable == false ? "faComment" : "faCommentSlash",
      iconType: props.disable == false && "regular",
      children: (
        <div className={[styles.Chat].join(" ")}>
          <div className={[, styles.header].join(" ")}>Chat</div>
          {props.information && isAuthenticated ? (
            <>
              <div className={["row justify-center", styles.box1].join(" ")}>
                Xin chào, {props.information.userName}
              </div>
            </>
          ) : (
            <>
              <div className={["row justify-center", styles.box1].join(" ")}>
                Đăng nhập để trò chuyện
              </div>
              <Authen className={["row", styles.box2].join(" ")} />
            </>
          )}
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
              disable={props.disable}
              cursorNoDrop={true}
              classNameChildren={[styles.children].join(" ")}
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
                      <ModalChat />
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
export default Chat;
