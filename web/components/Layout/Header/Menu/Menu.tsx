import { Key, useState, type FormEvent } from "react";
import { Slick } from "../../../Slick";
import styles from "./Menu.module.scss";
import { useWidth } from "../../../GlobalFunc";
import { useNhostClient } from "@nhost/nextjs";



export type MenuProps = {
  menuItems?: any[];
};

type DropdownItem = {
  label: string;
  href: string;
};

type MenuItem = {
  label: string;
  href?: string;
  items?: DropdownItem[];
};

const menuItems: MenuItem[] = [
  {
    label: "Browse Games",
    items: [
      { label: "All Games", href: "/games" },
      { label: "Popular Games", href: "/popular" },
      { label: "Free Games", href: "/free" },
    ],
  },
  {
    label: "Game Jams",
    items: [
      { label: "Browse Game Jams", href: "/jams" },
      { label: "Upcoming Jams", href: "/jams/upcoming" },
      { label: "Create a Jam", href: "/jams/create" },
    ],
  },
  {
    label: "Upload Game",
    href: "/upload",
  },
  {
    label: "Halloween Sale 2026",
    href: "/sale",
  },
  {
    label: "Developer Logs",
    href: "/devlogs",
  },
  {
    label: "Community",
    items: [
      { label: "Forums", href: "/community/forums" },
      { label: "Discussions", href: "/community/discussions" },
    ],
  },
];

const convertToArr = (variant: string) => {
  return eval(variant);
};

export const Menu = (MenuProps: MenuProps) => {
  //Define constant
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (label: string) => {
    setActiveDropdown((current) =>
      current === label ? null : label
    );
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const searchValue = formData.get("search");

    if (typeof searchValue === "string" && searchValue.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(
        searchValue.trim()
      )}`;
    }
  };
  //Main render
  return (
    <div className={["container", styles.Menu].join(" ")}>
      
    </div>
  );
};
