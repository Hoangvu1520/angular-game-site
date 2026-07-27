import React, { ReactNode, useState, useEffect } from 'react'
import styles from "./Footer.module.scss"

interface section1 {
    icon?: string;
    title?: string;
    content?: ReactNode;
    link?: string;
}
export type FooterProps = {
    section1?: section1[];
};

const Footer: React.FC = (FooterProps: FooterProps) => {
    //define constants

    //functions to create

    //functions to handle actions

    //useEffect

    //functions to render
    const feedback = () => {
        return (
            <div
                className={[
                    "row",
                    "justify-center",
                    "align-center",
                    styles.FeedBack,
                ].join(" ")}
            >
                <div>Phản hồi trang web? Hãy cho chúng tôi biết ▸</div>
            </div>
        );
    };
    //MAIN RENDER
    return (
        <div>Footer</div>
    )
}

export { Footer }