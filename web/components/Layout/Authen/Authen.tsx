import { ReactNode, useEffect, useState } from "react";
import styles from "./Authen.module.scss";
import Modal from "react-modal";
import { useWidth } from "../../GlobalFunc";
import { Button } from "../../Button";
import { Icon } from "../../Icon";
import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";

import { useAuthenticationStatus } from "@nhost/nextjs";
import { LoadingAtom } from "../../../atom";
import { useSetRecoilState } from "recoil";
import { ChangePW } from "./ChangePW";
import { useAuthContext } from "../../Provider/Provider";

interface Love {
  miniImg?: string;
  title?: string;
  subTitle?: string;
  price?: number;
}

interface Card {
  miniImg?: string;
  title?: string;
  subTitle?: string;
  price?: number;
}

interface infor {
  name?: string;
  point?: number;
  loveProduct?: Love[];
  basket?: Card[];
}

export type AuthenProps = {
  className?: string;
  informations?: infor[];
  command?: "Normal" | "Love" | "Basket";
  type?: "Provider" | "Normal";
};

export const Authen = (AuthenProps: AuthenProps) => {
  //Define constant
  const [props, setProps] = useState(AuthenProps);
  const { handleOpenModal, changeTypeModal }: any = useAuthContext();
  const { isAuthenticated } = useAuthenticationStatus();
  const setLoadingState = useSetRecoilState(LoadingAtom);

  if (isAuthenticated) {
    handleOpenModal(false);
  }
  // console.log(isAuthenticated);

  //Funtion to handle action
  const setOpenModal = (type: string) => {
    handleOpenModal(true);
    changeTypeModal(type);
  };

  //Function to render

  //Function hook
  useEffect(() => {
    setProps(AuthenProps);
  }, [AuthenProps]);

  const renderLogin = (command?: string) => {
    switch (command) {
      case "Love":
        return <div className={[styles.Love, props.className].join(" ")}></div>;
      case "Basket":
        return (
          <div className={[styles.Basket, props.className].join(" ")}></div>
        );
      default:
        return <></>;
    }
  };

  //Main render
  return (
    <div className={["row", styles.Authen, props.className].join(" ")}>
      {props.informations && props.informations.length > 0 ? (
        <>{renderLogin(props.command)}</>
      ) : (
        <>
          {props.type == "Provider" && (
            <div
              className={[
                "row align-center justify-center",
                styles.HeaderAuthen,
              ].join(" ")}
            >
              Hãy đăng nhập để tiếp tục.
            </div>
          )}
          <div className={["col-6", styles.Outbutton1].join(" ")}>
            <Button
              className={[, styles.button1].join(" ")}
              border={true}
              children={"Đăng nhập"}
              borderRadius={"round"}
              type={"button"}
              onClick={() => {
                setOpenModal("signIn");
              }}
              color={"fill"}
            />
          </div>

          <div className={["col-6", styles.Outbutton2].join(" ")}>
            <Button
              className={[, styles.button2].join(" ")}
              border={true}
              children={"Đăng ký"}
              borderRadius={"round"}
              type={"button"}
              link={"#"}
              onClick={() => {
                setOpenModal("signUp");
              }}
              color={"outline"}
            />
          </div>
        </>
      )}
    </div>
  );
};
Authen.deafultProps = {};
