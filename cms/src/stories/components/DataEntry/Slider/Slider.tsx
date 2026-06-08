import { Slider as SliderAntd } from "antd";
import React, { useState, useEffect } from "react";

type SliderProps = {
  [key: string]: any;
};

const Slider = (SliderProps: SliderProps) => {
  const [prop, setProp] = useState(SliderProps);
  // const [slider, setSlider] = useState();

  //useEffect
  useEffect(() => {
    setProp(SliderProps);
  }, [SliderProps]);

  //render
  return <SliderAntd {...prop} />;
};

export { Slider };
export type { SliderProps };
