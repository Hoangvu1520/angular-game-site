import React, { ReactNode, useState } from "react";
import styles from "./Layout.module.scss";
import { httpHandler } from "../../services";
import { useAuthContext } from "../../components/Provider/Provider";
import Image from "next/image";
import ReactModal from "react-modal";

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
  // const [active, setActive] = useState<string>();

  // const { userData } = useAuthContext();

  //function to create

  //function to handle actions


  //function to hook

  //function to render
  
  
  //Function to effect
  
  //MAIN RENDER
  return (
    <div className={[styles.Layout].join(" ")}>
      
    </div>
  );
};

export { Layout };
