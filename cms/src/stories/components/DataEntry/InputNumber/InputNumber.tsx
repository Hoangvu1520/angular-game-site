import styles from "./InputNumber.module.scss";
import React, { Key, useEffect, useState } from "react";
import classNames from "classnames";
import { Select } from "../index";
import { InputNumber as InputNumberAntd } from "antd";

const cx = classNames.bind(styles);
type InputNumberProps = {
  shapeRound?: boolean;
  [key: string]: any;
};

const { Option } = Select;

const InputNumber = (InputNumberProps: InputNumberProps) => {
  const addon = (type: string, key: string) => {
    return InputNumberProps.defaultAddon && InputNumberProps.defaultAddon[type][key]
      ? InputNumberProps.defaultAddon[type][key]
      : type;
  };
  const defaultVal =
    InputNumberProps.addonAfter &&
    InputNumberProps.addonAfter.length > 0 &&
    InputNumberProps.addonBefore &&
    InputNumberProps.addonBefore.length > 0
      ? {
          value: undefined,
          [addon("addonAfter", "key")]: addon("addonAfter", "value")
            ? addon("addonAfter", "value")
            : undefined,
          [addon("addonBefore", "key")]: addon("addonBefore", "value")
            ? addon("addonBefore", "value")
            : undefined,
        }
      : InputNumberProps.addonAfter && InputNumberProps.addonAfter.length > 0
      ? {
          value: undefined,
          [addon("addonAfter", "key")]: addon("addonAfter", "value")
            ? addon("addonAfter", "value")
            : undefined,
        }
      : InputNumberProps.addonBefore && InputNumberProps.addonBefore.length > 0
      ? {
          value: undefined,
          [addon("addonBefore", "key")]: addon("addonBefore", "value")
            ? addon("addonBefore", "value")
            : undefined,
        }
      : "";

  const [inputNumber, setInputNumber] = useState<any>(
    InputNumberProps.defaultValue ? InputNumberProps.defaultValue : defaultVal
  );

  const setForm = (key: string, value: any) => {
    InputNumberProps.onChange && InputNumberProps.onChange({ ...inputNumber, [key]: value });
    return setInputNumber((oldValues: any) => ({
      ...oldValues,
      [key]: value,
    }));
  };

  // handle change addonAfter
  const handleChangeAfter = (type: string, value: string) => {
    setForm(addon(type, "key"), value);
  };

  //handle Change inputNumber
  const handleChangeInputNumber = (value: number | null) => {
    if (
      (InputNumberProps.addonAfter && InputNumberProps.addonAfter.length > 0) ||
      (InputNumberProps.addonBefore && InputNumberProps.addonBefore.length > 0)
    ) {
      setForm("value", value);
    } else {
      setInputNumber(value);
      InputNumberProps.onChange && InputNumberProps.onChange(value);
    }
  };

  useEffect(() => {
    setInputNumber(InputNumberProps.value ? InputNumberProps.value : defaultVal);
  }, [InputNumberProps.value]);

  //render addonAfter
  const renderSelectAfter = (type: string, option?: any) => {
    return option && option.length > 0 ? (
      <Select
        onChange={(value: any) => {
          handleChangeAfter(type, value);
        }}
        defaultValue={
          inputNumber[
            InputNumberProps.defaultAddon && InputNumberProps.defaultAddon[type]?.key
              ? InputNumberProps.defaultAddon[type].key
              : type
          ]
        }
        value={
          inputNumber[
            InputNumberProps.defaultAddon && InputNumberProps.defaultAddon[type]?.key
              ? InputNumberProps.defaultAddon[type].key
              : type
          ]
        }
      >
        {option.map((item: any, key: Key) => {
          return (
            <Option value={item.value} key={key}>
              {item.label}
            </Option>
          );
        })}
      </Select>
    ) : (
      InputNumberProps.option
    );
  };

  //main render
  return (
    <InputNumberAntd
      {...InputNumberProps}
      addonBefore={renderSelectAfter("addonBefore", InputNumberProps.addonBefore)}
      addonAfter={renderSelectAfter("addonAfter", InputNumberProps.addonAfter)}
      className={[
        styles.InputNumber,
        (InputNumberProps.shapeRound == undefined || InputNumberProps.shapeRound) && styles.shapeRound,
        (InputNumberProps.shapeRound == undefined || InputNumberProps.shapeRound) &&
          !InputNumberProps.prefix &&
          !InputNumberProps.suffix &&
          styles.shapeRoundPrefix,
        InputNumberProps.className,
      ].join(" ")}
      onChange={handleChangeInputNumber}
      value={
        (InputNumberProps.addonAfter && InputNumberProps.addonAfter.length > 0) ||
        (InputNumberProps.addonBefore && InputNumberProps.addonBefore.length > 0)
          ? inputNumber.value
          : inputNumber
      }
      defaultValue={
        (InputNumberProps.addonAfter && InputNumberProps.addonAfter.length > 0) ||
        (InputNumberProps.addonBefore && InputNumberProps.addonBefore.length > 0)
          ? inputNumber.value
          : inputNumber
      }
    />
  );
};

export { InputNumber };
export type { InputNumberProps };
