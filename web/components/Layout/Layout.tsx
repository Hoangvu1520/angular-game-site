import React, { ReactNode, useEffect, useState } from "react";
import styles from "./Layout.module.scss";
import { httpHandler } from "../../services";
import { useAuthContext } from "../../components/Provider/Provider";
import Image from "next/image";
import ReactModal from "react-modal";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useAuthenticationStatus, useUserData } from "@nhost/nextjs";

interface menu {
  link?: string;
  icon?: string;
  type?: "regular" | "solid" | "brands";
}

interface navigation {
  label?: string;
  link?: string;
}

export type LayoutProps = {
  children: ReactNode;
  menu?: menu[];
  offVisble?: boolean;
  navigation?: navigation[];
  title?: string;
};
const Layout = ({
  children,
  // menu,
  // navigation,
  offVisble,
}: LayoutProps) => {
  //define constants
  const userData = useUserData();
  const [active, setActive] = useState<string>();
  const { isLoading } = useAuthenticationStatus();
  const [loading, setLoading] = useState(false);
  const [information, setInformation] = useState({
    ...userData?.metadata,
    userId: userData?.id,
    userName: userData?.displayName,
    email: userData?.email,
  })

  //function to create

  //function to handle actions


  //function to hook
  useEffect(()=>{
    isLoading && setLoading(!loading);
    setInformation({
      ...userData?.metadata,
      userId: userData?.id,
      userName: userData?.displayName,
      email: userData?.email,
    });
  }, [userData, loading])
  //function to render


  //Function to effect

  //MAIN RENDER
  return (
    <div className={[styles.Layout].join(" ")}>
      <div className={styles.Header}><Header  /></div>
      <div className={styles.Body}>{children}</div>
      <div className={styles.Footer}></div>
    </div>
  );
};

export { Layout };
