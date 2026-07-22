import React, {
  useState,
  CSSProperties,
  useEffect,
  Key,
} from "react";
import styles from "./Input.module.scss";
import { Icon } from "../Icon";

export type InputProps = {
  value?: string | number;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  defaultValue?: string;
  type?:
  | "text"
  | "password"
  | "email"
  | "number"
  | "emailNumber"
  | "date"
  | "datetime-local";
  shape?: "round" | "standard";
  clear?: boolean;
  onChange?: (value: string | number) => void;
  onChangeTypeEmailNumber?: (value: string) => void;
  onClick?: () => void;
  onPressEnter?: () => void;
  style?: CSSProperties;
  className?: string;
  disabled?: boolean;
  eyePassword?: boolean;
  key?: Key;
  iconClassName?: string;
  textClassName?: string;
  min?: number;
  max?: number;
};
const Input = (InputProps: InputProps) => {
  //define constants
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState<string | number>(
    InputProps.defaultValue ? InputProps.defaultValue : ""
  );
  const [change, setChange] = useState(false);
  //functions to create

  //functions to handle actions
  const handlerKeyUp = (e: any) => {
    if (e.keyCode === 13) {
      InputProps.onPressEnter && InputProps.onPressEnter();
    }
  };

  const handleClear = () => {
    setValue("");
  };
  const handleChange = (e: any) => {
    setValue(e.target.value);
    InputProps.onChange && InputProps.onChange(e.target.value);
  };

  const handleVisible = () => {
    setVisible(!visible);
  };

  const changeEmailNumber = () => {
    setChange(!change);
    setValue("");
  };
  //functions to hook
  useEffect(() => {
    setValue(InputProps.value ? InputProps.value : "");
  }, [InputProps.value]);

  useEffect(() => {
    InputProps.onChangeTypeEmailNumber &&
      InputProps.onChangeTypeEmailNumber(
        change ? "email" : "phoneNumber"
      );
  }, [change]);
  //functions to render
  const renderInputText = (
    type: "text" | "email" | "date" | "datetime-local",
    value: string | number
  ) => {
    return (
      <input
        type={type}
        value={value}
        placeholder={InputProps.placeholder}
        className={[
          styles.InputInside,
          InputProps.textClassName,
        ].join(" ")}
        autoFocus={false}
        onChange={handleChange}
      />
    );
  };
  const renderNumber = (value: string | number) => {
    return (
      <input
        type={"number"}
        pattern="\d*"
        placeholder={InputProps.placeholder}
        value={value}
        className={[
          styles.InputInside,
          InputProps.textClassName,
          styles.InputNumber,
        ].join(" ")}
        autoFocus={false}
        onChange={handleChange}
        min={InputProps.min}
        max={InputProps.max}
      />
    );
  };
  const renderPassword = (value: string | number) => {
    return (
      <input
        value={value}
        onChange={handleChange}
        type={visible ? "text" : "password"}
        className={[
          styles.InputInside,
          InputProps.textClassName,
        ].join(" ")}
        autoFocus={false}
        placeholder={InputProps.placeholder}
      />
    );
  };

  const renderEmailNumber = (value: string | number) => {
    return (
      <>
        <div className="col-7">
          <input
            value={value}
            onChange={handleChange}
            type={change ? "email" : "number"}
            className={[
              styles.InputInside,
              styles.InputNumber,
              InputProps.textClassName,
            ].join(" ")}
            autoFocus={false}
            placeholder={change ? "Nhập email" : "Nhập số điện thoại"}
          />
        </div>
        <span
          onClick={changeEmailNumber}
          className={[styles.ChangeText, "col-4"].join(" ")}
        >
          | {change ? "Sử dụng số điện thoại" : "Sử dụng email"}
        </span>
      </>
    );
  };

  const renderInput = (
    type:
      | "text"
      | "password"
      | "email"
      | "number"
      | "emailNumber"
      | "date"
      | "datetime-local"
  ) => {
    switch (type) {
      case "text" || "email":
        return renderInputText(type, value);
      case "number":
        return renderNumber(value);
      case "password":
        return renderPassword(value);
      case "emailNumber":
        return renderEmailNumber(value);
      default:
        return renderInputText(type, value);
    }
  };
  //MAIN RENDER
  return (
    <div
      onClick={InputProps.onClick}
      className={[
        styles.Input,
        InputProps.className,
        "row-none-warp align-center justify-between",
        InputProps.shape && styles[`Shape_${InputProps.shape}`],
      ].join(" ")}
    >
      {InputProps.prefix && (
        <Icon
          className={[styles.Icon, InputProps.iconClassName].join(
            " "
          )}
          iconName={InputProps.prefix}
        />
      )}
      {InputProps.type
        ? renderInput(InputProps.type)
        : renderInput("text")}
      {InputProps.clear && (
        <Icon
          iconName="X"
          onClick={handleClear}
          className={[
            styles.Icon,
            InputProps.iconClassName,
            styles.Clear,
          ].join(" ")}
        />
      )}
      {InputProps.type == "password" && InputProps.eyePassword && (
        <Icon
          iconName={visible ? "Eye" : "EyeSlash"} 
          type={"solid"}
          onClick={handleVisible}
          className={[
            styles.Icon,
            InputProps.iconClassName,
            styles.Clear,
          ].join(" ")}
        />
      )}
      {InputProps.suffix && (
        <Icon
          className={[styles.Icon, InputProps.iconClassName].join(
            " "
          )}
          iconName={InputProps.suffix}
        />
      )}
    </div>
  );
};

export { Input };
