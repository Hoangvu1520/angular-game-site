import React, { Key, useEffect, useState } from "react";
import styles from "./Input.module.scss";
import classNames from "classnames";
import { Select } from "../index";
import { Input as InputAntd } from "antd";

const cx = classNames.bind(styles);
export type InputProps = {
  shapeRound?: boolean;
  mode?: "TextArea";
  [key: string]: any;
};

const { Option } = Select;
const { TextArea } = InputAntd;

const Input = (InputProps: InputProps) => {
  //Define constant
  const addon = (type: string, key: string) => {
    return InputProps.defaultAddon && InputProps.defaultAddon[type][key]
      ? InputProps.defaultAddon[type][key]
      : type;
  };
  const defaultVal =
    InputProps.addonAfter &&
    InputProps.addonAfter.length > 0 &&
    InputProps.addonBefore &&
    InputProps.addonBefore.length > 0
      ? {
          value: undefined,
          [addon("addonAfter", "key")]: addon("addonAfter", "value")
            ? addon("addonAfter", "value")
            : undefined,
          [addon("addonBefore", "key")]: addon("addonBefore", "value")
            ? addon("addonBefore", "value")
            : undefined,
        }
      : InputProps.addonAfter && InputProps.addonAfter.length > 0
      ? {
          value: undefined,
          [addon("addonAfter", "key")]: addon("addonAfter", "value")
            ? addon("addonAfter", "value")
            : undefined,
        }
      : InputProps.addonBefore && InputProps.addonBefore.length > 0
      ? {
          value: undefined,
          [addon("addonBefore", "key")]: addon("addonBefore", "value")
            ? addon("addonBefore", "value")
            : undefined,
        }
      : "";

  const [input, setInput] = useState<any>(
    InputProps.defaultValue ? InputProps.defaultValue : defaultVal
  );

  //Function handle action
  const setForm = (key: string, value: any) => {
    InputProps.onChange && InputProps.onChange({ ...input, [key]: value });
    return setInput((oldValues: any) => ({
      ...oldValues,
      [key]: value,
    }));
  };

  const handleChangeAfter = (type: string, value: string) => {
    setForm(addon(type, "key"), value);
  };

  const handleChangeInput = (e: any) => {
    if (
      (InputProps.addonAfter && InputProps.addonAfter.length > 0) ||
      (InputProps.addonBefore && InputProps.addonBefore.length > 0)
    ) {
      setForm("value", e.target.value);
    } else {
      setInput(e.target.value);
      InputProps.onChange && InputProps.onChange(e.target.value);
    }
  };

  //Function hook
  useEffect(() => {
    setInput(InputProps.value ? InputProps.value : defaultVal);
  }, [InputProps.value]);

  //Function to render
  const renderSelectAfter = (type: string, option?: any) => {
    return option && option.length > 0 ? (
      <Select
        onChange={(e) => {
          handleChangeAfter(type, e);
        }}
        className={cx(type == "before" && styles.before)}
        defaultValue={
          input[
            InputProps.defaultAddon && InputProps.defaultAddon[type]?.key
              ? InputProps.defaultAddon[type].key
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
      InputProps.option
    );
  };

  //Main render
  return (
    <InputAntd
      {...InputProps}
      addonBefore={renderSelectAfter("addonBefore", InputProps.addonBefore)}
      addonAfter={renderSelectAfter("addonAfter", InputProps.addonAfter)}
      className={cx(
        (InputProps.shapeRound == undefined || InputProps.shapeRound) && styles.shapeRound,
        (InputProps.shapeRound == undefined || InputProps.shapeRound) &&
          !InputProps.prefix &&
          !InputProps.suffix &&
          styles.shapeRoundPrefix,
        InputProps.className
      )}
      // allowClear={true}
      onChange={handleChangeInput}
      value={
        (InputProps.addonAfter && InputProps.addonAfter.length > 0) ||
        (InputProps.addonBefore && InputProps.addonBefore.length > 0)
          ? input.value
          : input
      }
      defaultValue={
        (InputProps.addonAfter && InputProps.addonAfter.length > 0) ||
        (InputProps.addonBefore && InputProps.addonBefore.length > 0)
          ? input.value
          : input
      }
    />
  );
};
export { Input };
