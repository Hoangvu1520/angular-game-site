import React, { useState } from 'react'
import { useRecoilState } from "recoil";
import { useNhostClient } from "@nhost/nextjs";
import { LogoAtom } from '../../../atom';
import styles from "./Header.module.scss"

interface infor {
    userId?: any;
    userName?: string;
    insiderPoint?: number;
}


export type HeaderProps = {
    information?: infor;
};

const Header: React.FC = (HeaderProps: HeaderProps) => {
    //define constants
    const [props, setProps] = useState(HeaderProps);
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

    //functions to render
    const renderButtonHeader = () => {
        return <><div className={[styles.rowComman].join(" ")}></div>
            <div></div></>
    }
    //MAIN RENDER
    return (
        <div></div>
    )
}

export { Header }