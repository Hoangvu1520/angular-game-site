import { useEffect, useState, Key } from "react";
import { Icon } from "../../Icon";
import styles from "./CommanList.module.scss";
import { Stores } from "./StoresAndServices";
import { Community } from "./Community";
import { SignIn } from "./SignIn";
import Modal from "react-modal";
import { Shop } from "./Shop";
import { useWidth } from "../../GlobalFunc";

interface infor {
  userId?: number;
  userName?: string;
}

export type CommanListProps = {
  className?: string;
  information?: infor;
};
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
    height: "70vh",
    width: "92vw",
    top: "20%",
    bottom: "0",
    right: "0",
    left: "0",
    paddingBottom: "20px",
    paddingRight: "57px",
    boxShadow: "0 0 1px black",
    transition: "opacity 2000ms ease-in-out",
  },
};

export const CommanList = (CommanListProps: CommanListProps) => {
  //Define constant
  const [props, setProps] = useState(CommanListProps);

  const [stores, setStores] = useState(false);
  const handleStores = () => {
    setStores(!stores);
    if (stores == true) {
      setShop(false);
      setCommunity(false);
      setSignIn(false);
    }
  };

  const [community, setCommunity] = useState(false);
  const handleCommunity = () => {
    setCommunity(!community);
    if (community == true) {
      setShop(false);
      setStores(false);
      setSignIn(false);
    }
  };

  const [signIn, setSignIn] = useState(false);
  const handleSignIn = () => {
    setSignIn(!signIn);
    if (signIn == true) {
      setShop(false);
      setStores(false);
      setCommunity(false);
    }
  };

  const [shop, setShop] = useState(false);
  const handleShop = () => {
    setShop(!shop);
    if (shop == true) {
      setSignIn(false);
      setStores(false);
      setCommunity(false);
    }
  };

  const handleLink = () => {
    setSignIn(false);
    setStores(false);
    setCommunity(false);
    setShop(false);
  };

  //Function hook
  useEffect(() => {
    setProps(CommanListProps);
  }, [CommanListProps]);

  useEffect(() => {
    setSignIn(false);
    setStores(false);
    setCommunity(false);
    setShop(false);
  }, [useWidth() > 992]);

  const option = [
    {
      icon: "faHouse",
      name: "Trang chủ",
      link: "/",
      handle: handleLink,
    },
    {
      icon: "faBagShopping",
      name: "Dịch vụ",
      open: shop,
      handle: handleShop,
      children: <Shop className={[styles.Stores].join(" ")} />,
    },
    {
      icon: "faTag",
      name: "Khuyến mãi",
      link: "#",
      handle: handleLink,
    },
    {
      icon: "faCircleUser",
      name: "Thông tin",
      open: signIn,
      handle: handleSignIn,
      children: (
        <SignIn
          className={[styles.Stores].join(" ")}
          information={props.information}
        />
      ),
    },
    {
      icon: "faUsers",
      name: "Cộng đồng",
      open: community,
      handle: handleCommunity,
      children: (
        <Community
          className={[styles.Stores].join(" ")}
          information={props.information}
        />
      ),
    },
    {
      icon: "faStore",
      name: "Cửa hàng",
      open: stores,
      handle: handleStores,
      children: <Stores className={[styles.Stores].join(" ")} />,
    },
  ];
  //Function to render
  //Main render
  return (
    <div className={[styles.CommanList, props.className].join(" ")}>
      <div className={["row", styles.ListDefault].join(" ")}>
        {option.map((item: any, key: Key) => {
          return (
            <div
              key={key}
              className={["col-2", styles.children1].join(" ")}
            >
              <a
                className={[, styles.LinkIcon].join(" ")}
                href={item.link}
              >
                <div
                  className={[, styles.IconChildren1].join(" ")}
                  onClick={item.handle}
                >
                  <Icon
                    className={[, styles.Icon].join(" ")}
                    icon={item.icon}
                  />
                </div>
              </a>
              <div className={[, styles.NameChildren1].join(" ")}>
                {item.name}
              </div>
              <div className={[, styles.Modal].join(" ")}>
                {item.open ? (
                  <Modal
                    isOpen={item.open}
                    onRequestClose={item.handle}
                    style={customStyles}
                  >
                    <Icon
                      className={[
                        "row justify-end",
                        styles.ClossButton,
                      ].join(" ")}
                      icon={"faX"}
                      onClick={item.handle}
                    />
                    {item.children}
                  </Modal>
                ) : (
                  <></>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
CommanList.deafultProps = {};
