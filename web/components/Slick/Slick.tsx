import { Key, ReactNode, useEffect, useState } from "react";
import React from "react";
import styles from "./Slick.module.scss";
import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

export type SlickProps = {
  [props: string]: any;
};

export const Slick = (SlickProps: SlickProps) => {
  //Define constant
  

  //Function to render
  //Main render
  return (
    <Slider
      {...SlickProps}
      infinite={SlickProps.length > 0}
      className={[styles.Slider, SlickProps.className].join(" ")}
    />
  );
};
Slick.deafultProps = {};
