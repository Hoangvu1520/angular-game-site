import { Key, useState } from "react";
import { Slick } from "../../../Slick";
import styles from "./Menu.module.scss";
import { useWidth } from "../../../GlobalFunc";
import { useNhostClient } from "@nhost/nextjs";

export type MenuProps = {
  menuItems?: any[];
};

const convertToArr = (variant: string) => {
  return eval(variant);
};

export const Menu = (MenuProps: MenuProps) => {
  //Define constant
  const { storage } = useNhostClient();

  //Function to render

  const renderImage = (Images?: any) => {
    return (
      <div className={["row", styles.Banner].join(" ")}>
        {Images &&
          convertToArr(Images).length > 0 &&
          convertToArr(Images).map((item: any, key: Key) => {
            return (
              <a key={key} href={item.slug} className="col">
                <img
                  src={storage.getPublicUrl({
                    fileId: item,
                  })}
                />
              </a>
            );
          })}
      </div>
    );
  };
  const renderChildren = (children?: any) => {
    return (
      <div className={["row", styles.Children].join(" ")}>
        {children &&
          children.length > 0 &&
          children.map((items: any, key: Key) => {
            return (
              <div key={key} className={["col-3", styles.colNavi].join(" ")}>
                {items.key_category?.shopify_categories &&
                  items.key_category?.shopify_categories?.length > 0 &&
                  items.key_category?.shopify_categories.map(
                    (itemChildren: any, reKey: Key) => {
                      return (
                        <div
                          key={reKey}
                          className={[styles.WarpLink].join(" ")}
                        >
                          <a
                            href={"/shop/" + itemChildren.slug}
                            className={[styles.Link].join(" ")}
                            style={{
                              fontWeight:
                                itemChildren.bold == true ? "600" : "500",
                            }}
                          >
                            {itemChildren.name}
                          </a>
                        </div>
                      );
                    }
                  )}
              </div>
            );
          })}
      </div>
    );
  };

  const renderMenu = (children?: any, images?: any) => {
    var col = images ? (images.length == 1 ? 3 : 6) : 0;
    return (
      <div className={[styles.MenuChildren].join(" ")}>
        <div className="container row">
          <div className={`col-${12 - col}`}>{renderChildren(children)}</div>
          {col > 0 && (
            <div className={`col-${col} row justify-end`}>
              {renderImage(images)}
            </div>
          )}
        </div>
      </div>
    );
  };
  const menuRender = (menuItems?: any[]) => {
    return useWidth() > 992 ? (
      <div className={["row"].join(" ")}>
        <div className={["col"].join(" ")}>
          <a href="/brand-list" style={{ color: "white" }}>
            <div
              className={[
                styles.Title,
                "row",
                "justify-center",
                "align-center",
              ].join(" ")}
            >
              Tất cả
            </div>
          </a>
        </div>
        {menuItems &&
          menuItems.length > 0 &&
          menuItems.map((item: any, key: Key) => {
            return (
              <div className={["col", styles.ActiveMenu].join(" ")} key={key}>
                <a
                  className={[
                    styles.Title,
                    "row",
                    "justify-center",
                    "align-center",
                  ].join(" ")}
                  href={`/shop/${item.slug}`}
                >
                  {item.title}
                </a>
                {renderMenu(item.navigation_keys, item.images)}
              </div>
            );
          })}
      </div>
    ) : (
      <Slick
        className={styles.Slick2}
        dots={false}
        infinite-={false}
        slidesToShow={menuItems && Math.min(menuItems?.length, 6)}
        swipeToSlide={true}
        arrows={false}
        responsive={[
          {
            breakpoint: 576,
            settings: {
              slidesToShow: 3,
            },
          },
          {
            breakpoint: 376,
            settings: {
              slidesToShow: 2,
            },
          },
        ]}
      >
        <div className={["col", styles.ActiveMenu].join(" ")}>
          <div
            className={[
              styles.Title,
              "row",
              "justify-center",
              "align-center",
            ].join(" ")}
          >
            Tất cả
          </div>
        </div>
        {menuItems &&
          menuItems.length > 0 &&
          menuItems.map((item: any, key: Key) => {
            return (
              <div className={["col", styles.ActiveMenu].join(" ")} key={key}>
                <div
                  className={[
                    styles.Title,
                    "row",
                    "justify-center",
                    "align-center",
                  ].join(" ")}
                >
                  {item.title}
                </div>
                {renderMenu(item.children, item.images)}
              </div>
            );
          })}
      </Slick>
    );
  };

  //Main render
  return (
    <div className={["container", styles.Menu].join(" ")}>
      {menuRender(MenuProps.menuItems)}
    </div>
  );
};
