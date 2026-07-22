import React, {
  Key,
  useState,
  CSSProperties,
  useEffect,
  useRef,
} from "react";
import { Icon } from "../Icon";
import styles from "./Select.module.scss";

interface options {
  label?: string;
  value?: string | number;
  disabled?: boolean;
}

export type SelectProps = {
  value?: string | number;
  options?: options[];
  disabled?: boolean;
  onChange?: (value: any) => void;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
  defaultValue?: string;
  type?: "small" | "big";
  placeholder?: string;
};

const Select = (SelectProps: SelectProps) => {
  //define constants
  const [selectedOption, setSelectedOption] = useState<any>(
    SelectProps.value &&
      SelectProps.options &&
      SelectProps.options.length > 0
      ? SelectProps.options.find(
          (el: any) => el.value == SelectProps.value
        )
      : {}
  );
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  //functions to create

  //functions to handle action
  const handleClickOutside = (event: any) => {
    if (
      selectRef?.current &&
      !selectRef?.current?.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };
  const handleChange = (e: any) => {
    setSelectedOption(e.target.value);
    SelectProps.onChange && SelectProps.onChange(e.target.value);
  };
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleOptionClick = (option: any) => {
    setSelectedOption(option);
    SelectProps.onChange && SelectProps.onChange(option);
    setIsOpen(false);
  };
  //function hooks
  useEffect(() => {
    if (
      SelectProps.value &&
      SelectProps.options &&
      SelectProps.options.length > 0
    ) {
      var value = SelectProps.options.find(
        (el: any) => el.value == SelectProps.value
      );
      setSelectedOption(value);
    } else {
      setSelectedOption(null);
    }
    // SelectProps.value &&  setSelectedOption(SelectProps.value);
  }, [SelectProps.value, SelectProps.options]);
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  //functions to render
  const renderSelect = (options: any) => {
    return (
      <div
        className={[
          SelectProps.type == "big"
            ? styles.BigSelect
            : styles.SmallSelect,
          `${isOpen ? styles.open : ``}`,
        ].join(" ")}
        style={{
          opacity: SelectProps.disabled ? "0.5" : "",
          cursor: SelectProps.disabled ? "not-allowed" : "",
        }}
      >
        <div
          className={[
            styles[`SelectContainer`],
            "row justify-between",
          ].join(" ")}
        >
          <div className={[styles.Placeholder].join(" ")}>
            {selectedOption
              ? selectedOption.label
              : SelectProps?.placeholder}
          </div>
          <div className={[styles.IconOutline].join(" ")}>
            {
              <Icon
                iconName={"ChevronDown"}
                className={[styles.Icon].join(" ")}
              />
            }
          </div>
        </div>

        {!SelectProps.disabled && isOpen && (
          <div className={[styles.Options].join(" ")}>
            {options &&
              options.length > 0 &&
              options.map((item: any, key: Key) => (
                <div
                  className={[styles.Option].join(" ")}
                  key={key}
                  onClick={() => handleOptionClick(item)}
                >
                  {item.label}
                </div>
              ))}
          </div>
        )}
      </div>
    );
  };

  //MAIN RENDER
  return (
    <div
      className={[styles[`Select`], SelectProps.className].join(" ")}
      ref={selectRef}
      onClick={toggleDropdown}
    >
      {renderSelect(SelectProps.options)}
    </div>
  );
};

export { Select };
