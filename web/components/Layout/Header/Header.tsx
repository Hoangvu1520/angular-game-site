import React, { useEffect, useState } from 'react'
import { useRecoilState } from "recoil";
import { useNhostClient } from "@nhost/nextjs";
import { LogoAtom } from '../../../atom';
import styles from "./Header.module.scss"
import { Input } from '../../Input';
import { CommanList } from "../CommanList";
import { Menu } from "./Menu";
import { Stores, Community, SignIn, Chat, Love, Basket } from "../Comman";

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
    const [logo, setLogo] = useRecoilState<any>(LogoAtom);
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
        return <><>
            <div className={["col-9 row", styles.rowComman1].join(" ")}>
                <div className={["col-4", styles.colComman1].join(" ")}>
                    <Stores disable={true} />
                </div>
                <div className={["col-4", styles.colComman1].join(" ")}>
                    <Community information={information} disable={true} />
                </div>
                <div className={["col-4", styles.colComman1].join(" ")}>
                    <SignIn information={information} />
                </div>
            </div>
            <div
                className={[
                    "col-3 row",
                    "col-sm-12",
                    "col-lg-12",
                    styles.rowComman2,
                ].join(" ")}
            >
                <div className={["col-4", styles.Comman4].join(" ")}>
                    <Chat information={information} disable={true} />
                </div>
                <div className={["col-4", styles.Comman5].join(" ")}>
                    <Love information={information} disable={true} />
                </div>
                {/* <div className={["col-4", styles.Comman6].join(" ")}>
                    <Basket information={information} />
                </div> */}
            </div>
        </></>
    }

    const renderLogo = () => {
        return <a href="/"><img /></a>
    }

    const renderSearch = () => {
        return (
            <Input
                className={[styles.InputSreach].join(" ")}
                placeholder={"Nhập sản phẩm tìm kiếm"}
                prefix="Search"
                value={search}
                onPressEnter={onEnter}
            />
        );
    };

    //MAIN RENDER
    return (
        <div className={styles.Header}>
            <div className={[""].join(" ")}>
                <div
                    className={[
                        "container row align-center justify-between",
                        styles.TopHeader,
                    ].join(" ")}
                >
                    <div
                        className={[
                            "row align-center col-6",
                            "col-xl-5 justify-start",
                            "col-lg-10",
                            "col-md-9",
                            "col-sm-8",
                            styles.LogoAndSreach,
                        ].join(" ")}
                    >
                        <div
                            className={["col-4", "col-xl-3", styles.logo].join(" ")}
                        >
                            {renderLogo()}
                        </div>
                        <div
                            className={["col-8", "col-xl-9", styles.sreach].join(
                                " "
                            )}
                        >
                            {renderSearch()}
                        </div>
                    </div>
                    <div
                        className={[
                            "col-6 align-end",
                            "col-xl-7 justify-end",
                            "col-lg-2",
                            "col-md-3",
                            "col-sm-4",
                            "row",
                            styles.Comman,
                        ].join(" ")}
                    >
                        {renderButtonHeader()}
                    </div>
                </div>
            </div>
            <CommanList
                className={[styles.CommanList].join(" ")}
                information={props.information}
            />
            <div className={[styles.BottomHeader].join(" ")}>
                {navigation && navigation.length > 0 && (
                    <Menu menuItems={navigation} />
                )}
            </div>
        </div>
    )
}

export { Header }