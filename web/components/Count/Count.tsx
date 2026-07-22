import React, { useState } from "react";
import styles from "./Count.module.scss";

export type CountProps = {
  placeholder?: string;
};

const Count = (CountProps: CountProps) => {
  //define constants
  const [inputValue, setInputValue] = useState();
  //functions to create

  //functions to handle actions

  //functions to hook

  //functions to render

  //main render
  return <div className={[styles.Count].join(" ")}>Count</div>;
};

export { Count };
