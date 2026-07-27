import React, { useState } from 'react'
import { useRecoilState } from "recoil";
import { useNhostClient } from "@nhost/nextjs";

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
    const [navigation, setNavigation] = useState<[]>();
    const [search, setSearch] = useState<any>("");
    const [logo, setLogo] = useRecoilState(LogoAtom);
    const { storage } = useNhostClient();
    //functions to create

    //functions to handle actions

    //useEffect

    //functions to render

    //MAIN RENDER
    return (
        <div></div>
    )
}

export { Header }