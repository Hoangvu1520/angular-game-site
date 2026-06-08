import { Checkbox as CheckboxAntd } from "antd";
import { Typography, Row, Col, Input, Divider, Icon } from "../../index";
import React, { useState, useEffect, useRef, Key, ReactNode } from "react";
import type { CheckboxValueType } from "antd/es/checkbox/Group";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import styles from "./Checkbox.module.scss";
import classNames from "classnames";

interface addField {
  onAddField?: boolean;
  icon?: string;
  title?: ReactNode;
}

export type CheckboxProps = {
  title?: ReactNode;
  type?: "horizontal" | "vertical"; // default horizontal
  addField?: addField;
  isDeleted?: boolean;
  defaultValue?: any[];
  CheckAll?: boolean;
  value?: any[];
  onChangeOptions?: (list: any[], option: any, remove?: boolean) => void;
  className?: string;
  [key: string]: any;
};

// useRef handleOutside
const handleClickOutside = (handler: any) => {
  const domNode = useRef<any>();
  useEffect(() => {
    const mybeHandler = (e: any) => {
      if (!domNode.current.contains(e.target)) {
        handler();
      }
    };
    document.addEventListener("mousedown", mybeHandler);
    return () => {
      document.removeEventListener("mousedown", mybeHandler);
    };
  });
  return domNode;
};

const initValueCheckBox = (checkbox: any, defaultValue?: any) => {
  var check: any = [];
  defaultValue &&
    defaultValue.map((item: any) => {
      check.push(
        checkbox.find(
          (key: any) =>
            (item?.value ? item.value : item?.label ? item.label : item) ==
            (key?.value ? key.value : key?.label ? key.label : key)
        )
      );
    });
  return check;
};
const { Title } = Typography;
const cx = classNames.bind(styles);
const Checkbox = (CheckboxProps: CheckboxProps) => {
  //Define constant
  const [isAdded, setAdded] = useState(true);
  const [input, setInput] = useState("");
  const [checkbox, setCheckbox] = useState<any>(CheckboxProps.options);
  const [checkList, setCheckList] = useState(
    initValueCheckBox(checkbox, CheckboxProps.defaultValue)
  );
  //Function to create
  const addItem = () => {
    const newItem = { value: input, label: input };
    if (checkbox && input.length > 0) {
      setCheckbox([...checkbox, newItem]);
    }
    setInput("");
    CheckboxProps.onChangeOptions &&
      CheckboxProps.onChangeOptions([...checkbox, newItem], newItem);
  };

  const deleteItem = (item: any) => {
    const filter = (option: any) => {
      return option.filter((element: any) => element != item);
    };
    setCheckbox(filter(checkbox));
    setCheckList(filter(checkList));
    CheckboxProps.onChange && CheckboxProps.onChange(filter(checkList));
    CheckboxProps.onChangeOptions &&
      CheckboxProps.onChangeOptions(filter(checkbox), item, true);
  };

  //Function to handle action
  const domNode = handleClickOutside(() => {
    setAdded(true);
  });

  const onChange = (checkedValues: CheckboxValueType[], option: any) => {
    CheckboxProps.onChange &&
      CheckboxProps.onChange(
        checkedValues
          ? [...checkList, option]
          : checkList.filter(
              (element: any) =>
                JSON.stringify(element) != JSON.stringify(option)
            )
      );

    checkedValues
      ? setCheckList([...checkList, option])
      : setCheckList(
          checkList.filter(
            (element: any) => JSON.stringify(element) != JSON.stringify(option)
          )
        );
  };

  const handleChangeInput = (value: any, e: any) => {
    setInput(value);
  };

  //check all
  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckList(e.target.checked ? checkbox : []);
    CheckboxProps.onChange &&
      CheckboxProps.onChange(e.target.checked ? checkbox : []);
  };
  // Function to render

  useEffect(() => {
    setCheckbox(CheckboxProps.options);
    setCheckList(
      initValueCheckBox(
        CheckboxProps.options,
        CheckboxProps.value ? CheckboxProps.value : CheckboxProps.defaultValue
      )
    );
  }, [CheckboxProps.options]);

  useEffect(() => {
    setCheckList(initValueCheckBox(checkbox, CheckboxProps.value));
  }, [CheckboxProps.value]);

  const renderCheckbox = (option?: any) => {
    return (
      <Row
        className={cx([
          CheckboxProps.type && styles[CheckboxProps.type],
          CheckboxProps.className && CheckboxProps.className,
        ])}
      >
        {option &&
          option.length > 0 &&
          option.map((item: any, key: Key) => {
            return (
              <Row
                key={key}
                justify="space-between"
                className={styles.WarpCheckbox}
              >
                <Col className={cx(styles.CheckboxCol)}>
                  <CheckboxAntd
                    onChange={(value: any) => {
                      onChange(value.target.checked, item);
                    }}
                    checked={
                      checkList &&
                      checkList.length > 0 &&
                      checkList.find(
                        (el: any) => JSON.stringify(el) == JSON.stringify(item)
                      )
                        ? true
                        : false
                    }
                    disabled={item.disabled}
                  >
                    <span
                      className={cx(styles.Check)}
                      title={
                        item.label ? item.label : item.value ? item.value : item
                      }
                    >
                      {item.label ? item.label : item.value ? item.value : item}
                    </span>
                  </CheckboxAntd>
                </Col>
                {CheckboxProps.isDeleted && (
                  <Col className={cx(styles.CheckboxCol)}>
                    <Icon
                      onClick={() => {
                        deleteItem(item);
                      }}
                      component={"Trash"}
                      className={cx(styles.Button)}
                    />
                  </Col>
                )}
              </Row>
            );
          })}
      </Row>
    );
  };

  const renderCheclAllAndTitle = () => {
    return (
      <Row>
        {CheckboxProps.checkAll ? (
          <Col className={cx(styles.CheckAll)}>
            <CheckboxAntd
              indeterminate={
                checkList.length > 0 && checkList.length < checkbox.length
              }
              onChange={onCheckAllChange}
              checked={checkList.length == checkbox.length}
            >
              {
                <Title level={5} className={cx(styles.Title)}>
                  {CheckboxProps.title ? CheckboxProps.title : "Check all"}
                </Title>
              }
            </CheckboxAntd>
          </Col>
        ) : (
          <Title level={5} className={cx(styles.Title)}>
            {CheckboxProps.title}
          </Title>
        )}
        <Divider className={cx(styles.Divider)} />
      </Row>
    );
  };

  const renderAddCheckbox = () => {
    return (
      <>
        <Divider className={cx(styles.Divider)} />
        {isAdded ? (
          <Row onClick={() => setAdded(false)} align="middle">
            <Col className={styles.WarpAddButton}>
              <Icon
                component={
                  CheckboxProps.addField?.icon
                    ? CheckboxProps.addField?.icon
                    : "Plus"
                }
                className={cx(styles.NewItem)}
              />
              {CheckboxProps.addField?.title
                ? CheckboxProps.addField?.title
                : "Add"}
            </Col>
          </Row>
        ) : (
          <Input
            className={cx(styles.Input)}
            value={input}
            onChange={handleChangeInput}
            onPressEnter={addItem}
            allowClear={true}
          />
        )}
      </>
    );
  };
  //Main render
  return (
    <Col className={cx(styles.Checkbox)} ref={domNode}>
      {(CheckboxProps.title || CheckboxProps.checkAll == true) &&
        renderCheclAllAndTitle()}
      {renderCheckbox(checkbox)}
      {CheckboxProps.addField?.onAddField == true && renderAddCheckbox()}
    </Col>
  );
};
Checkbox.defaultProps = {
  type: "horizontal",
  checkAll: false,
};
export { Checkbox };
