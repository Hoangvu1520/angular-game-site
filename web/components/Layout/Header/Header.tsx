import React, { useEffect, useState } from 'react'
import { useRecoilState } from "recoil";
import { useNhostClient } from "@nhost/nextjs";
import { LogoAtom } from '../../../atom';
import styles from "./Header.module.scss"
import { Input } from '../../Input';

interface infor {
    userId?: any;
    userName?: string;
    insiderPoint?: number;
}


export type HeaderProps = {
    information?: infor;
};

const Header: React.FC = (props: HeaderProps) => {
    //define constants
    const [navigation, setNavigation] = useState<[]>();
    const [search, setSearch] = useState<any>("");
    const [logo, setLogo] = useRecoilState(LogoAtom);
    const [advertisement, setAdvertisement] = useState({
        color: "",
        value: "",
        link: "",
    });
    const { storage } = useNhostClient();
    const information = props.information;
    //functions to create

    //functions to handle actions
    const onEnter = (e: any) => {
        setSearch(e);
        window.location.href = `/store?search=${e}`;
    };
    //useEffect
    useEffect(() => {

    }, [])
    //functions to render
    const renderButtonHeader = () => {
        return <><div className={[styles.rowComman].join(" ")}></div>
            <div></div></>
    }

    const renderLogo = () => {
        return <a href="/"><img /></a>
    }

    const renderSearch = () => {
        return (
            <Input
                className={[styles.InputSreach].join(" ")}
                placeholder={"Nhập sản phẩm tìm kiếm"}
                prefix="faSearch"
                value={search}
                onPressEnter={onEnter}
            />
        );
    };

    const renderAdvertisement = () => {
        return (
            <div
                style={{ backgroundColor: advertisement?.color }}
                className={[
                    styles.Advertisement,
                    "row align-center justify-center",
                ].join(" ")}
            >
                <div
                    onClick={() =>
                    (window.location.href = advertisement?.link
                        ? advertisement?.link
                        : "")
                    }
                    className={styles.AdTitle}
                    dangerouslySetInnerHTML={{ __html: advertisement?.value }}
                />
            </div>
        )
    }
    //MAIN RENDER
    return (
        <div></div>
    )
}

export { Header }