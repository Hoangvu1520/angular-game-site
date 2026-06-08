// Import Meta
import { Layout as AntLayout, Row, Col } from "antd";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import styles from "./Layout.module.scss";
import Header from "./Header";
import Menu from "./Menu";
import { Icon, useAuthContext, Message } from "../../index";
import { Bell } from "react-bootstrap-icons";
import httpHandler from "@/stories/services/apiConfig";
import { url } from "inspector";
import Link from "next/link";
// let socket: any;
const { Content } = AntLayout;

export interface LayoutProps {
  appList: Array<any>;
  i18n?: any;
  children: ReactNode;
}
const Layout = (LayoutProps: LayoutProps) => {
  // Constants define
  const [messageApi, contextHolder] = Message.useMessage();
  const { isAuthenticator, userData, socket, setRefreshData, refreshData } =
    useAuthContext();
  const [notiMessage, setNotiMessage] = useState<any>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isUnlockedRef = useRef(false);
  const topMenu = {
    userMenu: [
      {
        key: "notification",
        label: (
          <Row align="middle" justify="center">
            {notiMessage && notiMessage.length > 0 && (
              <Col className={styles.Notification}></Col>
            )}
            <Col>
              <Icon component={Bell} className={styles.IconNotify} />
            </Col>
          </Row>
        ),
        children:
          notiMessage && notiMessage.length > 0
            ? notiMessage.map((item: any, key: number) => ({
                label: (
                  <Row
                    onClick={() => {
                      window.location.href = item.url;
                    }}
                  >
                    {item.message}
                  </Row>
                ),
                key: `notify${key}`,
              }))
            : [],
      },
      {
        key: "profile",
        label: <span>{userData?.user_name}</span>,
        children: [
          {
            label: (
              <Link href={`/profile/${userData?.id}`}>Thông tin cá nhân</Link>
            ),
            key: "profile0",
          },
          {
            label: (
              <Row
                onClick={() => {
                  httpHandler("/auth/logout", {}, "GET").then(() => {
                    localStorage.removeItem("accessToken");
                    window.location.href = "/auth/login";
                  });
                }}
              >
                Đăng xuất
              </Row>
            ),
            key: "profile1",
          },
        ],
      },
    ],
  };

  //Set Muti Languages
  //Function to create
  const sendActiveNotification = (message: string, url?: string) => {
    console.log("sendActiveNotification", message, url);
    if (typeof window === "undefined" || !("Notification" in window)) return;

    const show = () => {
      const notification = new Notification("Thông báo", {
        body: message,
        icon: "https://cdn-icons-png.flaticon.com/512/1827/1827349.png",
        data: { url },
      });

      notification.onclick = (e) => {
        e.preventDefault();
        if (notification.data?.url) {
          window.open(notification.data.url, "_blank");
        }
      };

      if (audioRef.current && isUnlockedRef.current) {
        audioRef.current.play().catch((err) => {
          console.warn("Không thể phát âm thanh:", err);
        });
      }
    };

    if (Notification.permission === "granted") {
      show();
    } else if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          show();
        }
      });
    }
  };

  // //Function to hook
  useEffect(() => {
    // Chuẩn bị âm thanh
    audioRef.current = new Audio("/audio/notification.mp3");
    const unlockAudio = () => {
      if (audioRef.current && !isUnlockedRef.current) {
        audioRef.current
          .play()
          .then(() => {
            audioRef.current?.pause();
            audioRef.current!.currentTime = 0;
            isUnlockedRef.current = true;
            messageApi.open({
              type: "success",
              content: "Âm thanh đã được mở khóa",
              duration: 2,
            });
            console.log("✅ Đã mở khóa âm thanh");
          })
          .catch((err) => {
            console.warn("⚠️ Không mở khóa được âm thanh:", err);
          });
      }
    };

    // Unlock âm thanh khi có tương tác lần đầu
    document.addEventListener("click", unlockAudio, { once: true });
    document.addEventListener("keydown", unlockAudio, { once: true });

    return () => {
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("keydown", unlockAudio);
    };
  }, []);
  useEffect(() => {
    if (!socket) return;
    const handleNotification = (data: any) => {
      if (!data?.message) return;
      setNotiMessage([...notiMessage, data]);
      sendActiveNotification(data.message, data.url);

      messageApi.open({
        type: "warning",
        content: data.message,
        duration: 10,
        onClick: () => {
          if (data.url) {
            window.location.href = data.url;
          }
        },
        style: { cursor: "pointer" },
      });
    };
    socket.on("notification/received", handleNotification);
  }, [socket]);

  useEffect(() => {
    setRefreshData(refreshData + 1);
  }, [notiMessage]);

  //Function to render
  const AuthProvider = () => {
    return isAuthenticator ? (
      <>
        <Header menu={topMenu} />
        <AntLayout>
          <Menu
            appList={LayoutProps.appList}
            permissions={userData.permission}
          />
          <Content>{LayoutProps.children}</Content>
        </AntLayout>
      </>
    ) : (
      <Content>{LayoutProps.children}</Content>
    );
  };

  return (
    <AntLayout
      className={[styles.Layout, !isAuthenticator && styles.UnAuth].join(" ")}
    >
      {contextHolder}
      {AuthProvider()}
    </AntLayout>
  );
};

export default Layout;
