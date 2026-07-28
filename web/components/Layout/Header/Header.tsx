import React, { useState } from 'react'
import { useRecoilState } from "recoil";
import { useNhostClient } from "@nhost/nextjs";
import { LogoAtom } from '../../../atom';

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
    const { storage } = useNhostClient();
    const information = props.information;
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