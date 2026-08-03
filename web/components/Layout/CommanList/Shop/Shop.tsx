import React from "react";
import { Authen } from "../../Authen";
import { Icon } from "../../../Icon";
import { Dropdown } from "../../../Dropdown";
import styles from "./Shop.module.scss";
import { Key, ReactNode, useEffect, useState } from "react";
import { Category } from "../../../Category";

export type ShopProps = {
  className?: string;
  [props: string]: any;
};

const Shop = (ShopProps: ShopProps) => {

  const [props, setProps] = useState(ShopProps);

  //Function hook
  useEffect(() => {
    setProps(ShopProps);
  }, [ShopProps]);

  const option = [
    {
      title: "foundation",
      src: "https://www.sephora.com/contentimages/homepage/060222/Homepage/RWD/CategoryTiles/homepage_featured_category_tile_samples_32_us_ca_rwd_slice.png?imwidth=53",
      link: "#",
    },
    {
      title: "foundation",
      src: "https://www.sephora.com/contentimages/homepage/060222/Homepage/RWD/CategoryTiles/homepage_featured_category_tile_samples_32_us_ca_rwd_slice.png?imwidth=53",
      link: "#",
    },
    {
      title: "foundation",
      src: "https://www.sephora.com/contentimages/homepage/060222/Homepage/RWD/CategoryTiles/homepage_featured_category_tile_samples_32_us_ca_rwd_slice.png?imwidth=53",
      link: "#",
    },
    {
      title: "foundation",
      src: "https://www.sephora.com/contentimages/homepage/060222/Homepage/RWD/CategoryTiles/homepage_featured_category_tile_samples_32_us_ca_rwd_slice.png?imwidth=53",
      link: "#",
    },
    {
      title: "foundation",
      src: "https://www.sephora.com/contentimages/homepage/060222/Homepage/RWD/CategoryTiles/homepage_featured_category_tile_samples_32_us_ca_rwd_slice.png?imwidth=53",
      link: "#",
    },
    {
      title: "foundation",
      src: "https://www.sephora.com/contentimages/homepage/060222/Homepage/RWD/CategoryTiles/homepage_featured_category_tile_samples_32_us_ca_rwd_slice.png?imwidth=53",
      link: "#",
    },
    {
      title: "foundation",
      src: "https://www.sephora.com/contentimages/homepage/060222/Homepage/RWD/CategoryTiles/homepage_featured_category_tile_samples_32_us_ca_rwd_slice.png?imwidth=53",
      link: "#",
    },
    {
      title: "foundation",
      src: "https://www.sephora.com/contentimages/homepage/060222/Homepage/RWD/CategoryTiles/homepage_featured_category_tile_samples_32_us_ca_rwd_slice.png?imwidth=53",
      link: "#",
    },
  ];

  return (
    <div className={[, styles.Shop].join(" ")}>
      <div className={[, styles.Header].join(" ")}>Dịch vụ</div>
      <div className={["row", styles.ShopCategory].join(" ")}>
        {option.map((item: any, key: Key) => {
          return (
            <div key={key} className={["col-6", styles.Category].join(" ")}>
              <Category
                className={[styles.MiniCategory].join(" ")}
                type={"horizon"}
                title={item.title}
                src={item.src}
                link={item.link}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Shop;
