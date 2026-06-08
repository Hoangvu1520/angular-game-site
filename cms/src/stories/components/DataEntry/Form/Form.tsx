/* eslint-disable react-hooks/exhaustive-deps */
import {
  Input,
  Col,
  Row,
  Typography,
  Divider,
  Button,
  RichTextEditor,
  InputNumber,
  Select,
  Switch,
  Slider,
  ColorPicker,
  Checkbox,
  UploadMedia,
  TextArea,
  AutoComplete,
  DebounceSelect,
  DatePicker, TimePicker
} from "../../index";
import { Form as FormAntd } from "antd";
import { FormInstance } from "antd/lib/form";
import React, { Key, ReactNode, useEffect, useState } from "react";
import styles from "./Form.module.scss";
import classNames from "classnames";
import dayjs from "dayjs";
import { Skeleton } from "../../Feedback/index";

const cx = classNames.bind(styles);
interface update {
  where?: any;
  isBackendData?: boolean;
  data?: any;
}
interface dataSource {
  table: string;
  update?: update;
}
interface fields {
  rules?: any[];
  name?: string;
  displayType:
  | "Select"
  | "Input"
  | "SelectOption"
  | "InputNumber"
  | "SwitchToggle"
  | "ColorPicker"
  | "UploadButton"
  | "EditorHTML"
  | "Slider"
  | "Checkbox"
  | "Group"
  | "TreeSelect"
  | "TextArea"
  | "AutoComplete";
  dataIndex?: string;
  label?: ReactNode;
  hint?: ReactNode;
  col?: {
    [span: string]: any;
  };
  divider?: boolean;
  className?: string;
  fields?: fields[];
  input?: any;
}
interface buttonCallToAction {
  icon?: string;
  title?: ReactNode;
  actionType?: "SUBMIT";
  shape?: string;
  onActionTrigger?: (value: any) => void;
  className?: string;
}

type FormProps = {
  dataSource?: dataSource;
  fields: fields[];
  justifyButtonCallToAction?: "start" | "end" | "center";
  buttonCallToAction?: buttonCallToAction[];
  valuesFormOnChange?: (value: any) => void;
  className?: string;
  style?: any;
  nameForm?: ReactNode;
  divider?: boolean;
  styleDivider?: any;
  form?: FormInstance;
  validateMessages?: any;
};

const initValueForm = (fields: any, group?: string) => {
  var newAr: any = {};
  fields &&
    fields.length > 0 &&
    fields.map((item: any) => {
      newAr =
        item.displayType != "Group"
          ? {
            ...newAr,
            [item.dataIndex ? item.dataIndex : item.label]: item.defaultValue
              ? item.defaultValue
              : undefined,
          }
          : {
            ...newAr,
            [item.dataIndex ? item.dataIndex : item.label]: initValueForm(
              item.fields,
              item.dataIndex ? item.dataIndex : item.label
            ),
          };
    });
  return newAr;
};

const Form = (FormProps: FormProps) => {
  //Define constant
  const [valueForm, setValueForm] = useState<any>(
    initValueForm(FormProps.fields)
  );
  // const [form] = FormAntd.useForm();
  const [loading, setLoading] = useState(false);
  //Function to create
  const setDataNoBackend = () => {
    !FormProps.dataSource?.update?.isBackendData &&
      FormProps.dataSource?.update?.data
      ? setValueForm(FormProps.dataSource?.update?.data)
      : setValueForm(initValueForm(FormProps.fields));
    setLoading(false);
  };
  const firstRender = async () => {
    return await (Object.keys(valueForm).length > 0 &&
      loading &&
      FormProps.dataSource?.update?.isBackendData
      ? ""
      :
      setDataNoBackend());
  };

  //change value in group
  const changeValueInGroup = (
    input: any,
    value: any,
    group: string[],
    keyOpen: number
  ) => {
    var newObj = input;

    newObj =
      keyOpen == group.length - 1
        ? { ...newObj, [group[keyOpen]]: value }
        : {
          ...newObj,
          [group[keyOpen]]: changeValueInGroup(
            newObj[group[keyOpen]],
            value,
            group,
            keyOpen + 1
          ),
        };

    return newObj;
  };

  //find value in group  input
  const valueInGroup: any = (input: any, group: string[], keyOpen: number) => {
    if (input === undefined) {
      // Handle the case where input is undefined, maybe return a default value or throw an error
      return undefined;
    }
    return keyOpen == group.length - 1
      ? input[group[keyOpen]]
      : valueInGroup(input[group[keyOpen]], group, keyOpen + 1);
  };

  //Function to handle action
  const handleChangeForm = (input: string, value: any, group?: string[]) => {
    var valueFormNew = valueForm;
    valueFormNew =
      group && group.length > 0
        ? {
          ...valueFormNew,
          ...changeValueInGroup(valueForm, value, [...group, input], 0),
        }
        : {
          ...valueFormNew,
          [input]: value,
        };
    setValueForm(valueFormNew);
    FormProps.valuesFormOnChange && FormProps.valuesFormOnChange(valueFormNew);
  };

  //Funtion hook
  useEffect(() => {
    !FormProps.dataSource?.update?.isBackendData &&
      FormProps.dataSource?.update?.data
      ? setValueForm(FormProps.dataSource?.update?.data)
      : setValueForm(initValueForm(FormProps.fields));
  }, [FormProps.dataSource?.update?.data]);
  useEffect(() => {
    if (FormProps.dataSource?.update) {
      setLoading(true);
      firstRender();
    }
  }, []);
  //CRUD
  const handleSubmit = async () => {
    // FormProps.dataSource &&
    //   (FormProps.dataSource.update
    //     ? await Update({
    //         table: FormProps.dataSource.table,
    //         object: valueForm,
    //         where: FormProps.dataSource.update?.where,
    //       })
    //     : await Insert({
    //         table: FormProps.dataSource.table,
    //         object: valueForm,
    //       }));
  };
  //render Input
  const renderInput = (item: any, group?: string[]) => {
    return (
      <Input
        size="large"
        {...item.input}
        onChange={(value: any) => {
          handleChangeForm(
            item.dataIndex ? item.dataIndex : item.label,
            value,
            group
          );
          item.input?.onChange && item.input.onChange(value);
        }}
        defaultValue={
          group && group.length > 0
            ? valueInGroup(
              valueForm,
              [...group, item.dataIndex ? item.dataIndex : item.label],
              0
            )
            : valueForm &&
            valueForm[item.dataIndex ? item.dataIndex : item.label]
        }
        value={
          group && group.length > 0
            ? valueInGroup(
              valueForm,
              [...group, item.dataIndex ? item.dataIndex : item.label],
              0
            )
            : valueForm &&
            valueForm[item.dataIndex ? item.dataIndex : item.label]
        }
        className={cx(styles.CustomeInput, item.className)}
      />
    );
  };
  //render AutoComplete
  const renderAutoComplete = (item: any, group?: string[]) => {
    return (
      <AutoComplete
        {...item.input}
        onChange={(value: any) => {
          handleChangeForm(
            item.dataIndex ? item.dataIndex : item.label,
            value,
            group
          );
          item.input?.onChange && item.input.onChange(value);
        }}
        defaultValue={
          group && group.length > 0
            ? valueInGroup(
              valueForm,
              [...group, item.dataIndex ? item.dataIndex : item.label],
              0
            )
            : valueForm &&
            valueForm[item.dataIndex ? item.dataIndex : item.label]
        }
        value={
          group && group.length > 0
            ? valueInGroup(
              valueForm,
              [...group, item.dataIndex ? item.dataIndex : item.label],
              0
            )
            : valueForm &&
            valueForm[item.dataIndex ? item.dataIndex : item.label]
        }
        className={cx(styles.CustomeInput, item.className)}
      />
    );
  };
  //render Select
  const renderSelect = (item: any, group?: string[]) => {
    return (
      <Select
        {...item.input}
        onChange={(value: any) => {
          handleChangeForm(
            item.dataIndex ? item.dataIndex : item.label,
            value,
            group
          );
          item.input?.onChange && item.input.onChange(value);
        }}
        defaultValue={
          group && group.length > 0
            ? valueInGroup(
              valueForm,
              [...group, item.dataIndex ? item.dataIndex : item.label],
              0
            )
            : valueForm &&
            valueForm[item.dataIndex ? item.dataIndex : item.label]
        }
        value={
          group && group.length > 0
            ? valueInGroup(
              valueForm,
              [...group, item.dataIndex ? item.dataIndex : item.label],
              0
            )
            : valueForm &&
            valueForm[item.dataIndex ? item.dataIndex : item.label]
        }
        className={cx(styles.CustomeInput, item.className)}
      />
    );
  };
  //render ColorPicker
  const renderColorPicker = (item: any, group?: string[]) => {
    return (
      <ColorPicker
        onChange={(color, hex) => {
          handleChangeForm(
            item.dataIndex ? item.dataIndex : item.label,
            hex,
            group
          );
          item.input?.onChange && item.input.onChange(hex);
        }}
        value={
          group && group.length > 0
            ? valueInGroup(
              valueForm,
              [...group, item.dataIndex ? item.dataIndex : item.label],
              0
            )
            : valueForm &&
            valueForm[item.dataIndex ? item.dataIndex : item.label]
        }
      />
    );
  };

  // render SelectOption
  const renderSelectOption = (item: any, group?: string[]) => {
    return (
      <DebounceSelect
        onChange={(e) => {
          handleChangeForm(
            item.dataIndex ? item.dataIndex : item.label,
            e,
            group
          );
          item.input?.onChange && item.onChange(e);
        }}
        size="large"
        placeholder="— Select the option —"
        {...item.input}
        className={cx(styles.CustomeInput, item.className)}
        defaultValue={
          group && group.length > 0
            ? valueInGroup(
              valueForm,
              [...group, item.dataIndex ? item.dataIndex : item.label],
              0
            )
            : valueForm &&
            valueForm[item.dataIndex ? item.dataIndex : item.label]
        }
        value={
          group && group.length > 0
            ? valueInGroup(
              valueForm,
              [...group, item.dataIndex ? item.dataIndex : item.label],
              0
            )
            : valueForm &&
            valueForm[item.dataIndex ? item.dataIndex : item.label]
        }
      />
    );
  };

  //render Input Number
  const renderInputNumber = (item: any, group?: string[]) => {
    return (
      <InputNumber
        {...item.input}
        onChange={(value: any) => {
          handleChangeForm(
            item.dataIndex ? item.dataIndex : item.label,
            value,
            group
          );
          item.input?.onChange && item.input.onChange(value);
        }}
        size="large"
        defaultValue={
          group && group.length > 0
            ? valueInGroup(
              valueForm,
              [...group, item.dataIndex ? item.dataIndex : item.label],
              0
            )
            : valueForm &&
            valueForm[item.dataIndex ? item.dataIndex : item.label]
        }
        value={
          group && group.length > 0
            ? valueInGroup(
              valueForm,
              [...group, item.dataIndex ? item.dataIndex : item.label],
              0
            )
            : valueForm &&
            valueForm[item.dataIndex ? item.dataIndex : item.label]
        }
        className={cx(styles.CustomeInput, item.className)}
      />
    );
  };

  //render Slider

  const renderSlider = (item: any, group?: string[]) => {
    const formatter = (value?: number | string) => `${value}px`;
    return (
      <Slider
        onChange={(value: any) => {
          handleChangeForm(
            item.dataIndex ? item.dataIndex : item.label,
            value,
            group
          );
          item.input?.onChange && item.input.onChange(value);
        }}
        defaultValue={
          group && group.length > 0
            ? valueInGroup(
              valueForm,
              [...group, item.dataIndex ? item.dataIndex : item.label],
              0
            )
            : valueForm &&
            valueForm[item.dataIndex ? item.dataIndex : item.label]
        }
        value={
          group && group.length > 0
            ? valueInGroup(
              valueForm,
              [...group, item.dataIndex ? item.dataIndex : item.label],
              0
            )
            : valueForm &&
            valueForm[item.dataIndex ? item.dataIndex : item.label]
        }
        tooltip={{ formatter }}
        {...item.input}
      />
    );
  };

  //render Switch Toggle
  const renderSwitchToggle = (item: any, group?: string[]) => {
    return (
      <Switch
        {...item.input}
        onChange={(value) => {
          handleChangeForm(
            item.dataIndex ? item.dataIndex : item.label,
            value,
            group
          );
          item.input?.onChange && item.input.onChange(value);
        }}
        defaultChecked={
          group && group.length > 0
            ? valueInGroup(
              valueForm,
              [...group, item.dataIndex ? item.dataIndex : item.label],
              0
            )
            : valueForm &&
            valueForm[item.dataIndex ? item.dataIndex : item.label]
        }
        checked={
          group && group.length > 0
            ? valueInGroup(
              valueForm,
              [...group, item.dataIndex ? item.dataIndex : item.label],
              0
            )
            : valueForm &&
            valueForm[item.dataIndex ? item.dataIndex : item.label]
        }
      ></Switch>
    );
  };

  //render Upload Button
  const renderUploadButton = (item: any, group?: string[]) => {
    return (
      <>
        <UploadMedia
          {...item.input}
          onChange={(value: any) => {
            handleChangeForm(
              item.dataIndex ? item.dataIndex : item.label,
              value,
              group
            );
            item.input?.onChange && item.input.onChange(value);
          }}
          defaultValue={
            group && group.length > 0
              ? valueInGroup(
                valueForm,
                [...group, item.dataIndex ? item.dataIndex : item.label],
                0
              )
              : valueForm &&
              valueForm[item.dataIndex ? item.dataIndex : item.label]
          }
        />
      </>
    );
  };

  //render checkbox
  const renderCheckbox = (item?: any, group?: string[]) => {
    return (
      <Checkbox
        {...item.input}
        onChange={(value: any) => {
          handleChangeForm(
            item.dataIndex ? item.dataIndex : item.label,
            value,
            group
          );
          item.input?.onChange && item.input.onChange(value);
        }}
        defaultValue={
          group && group.length > 0
            ? valueInGroup(
              valueForm,
              [...group, item.dataIndex ? item.dataIndex : item.label],
              0
            )
            : valueForm &&
            valueForm[item.dataIndex ? item.dataIndex : item.label]
        }
        value={
          group && group.length > 0
            ? valueInGroup(
              valueForm,
              [...group, item.dataIndex ? item.dataIndex : item.label],
              0
            )
            : valueForm &&
            valueForm[item.dataIndex ? item.dataIndex : item.label]
        }
      />
    );
  };

  // //render Editor HTML
  const renderEditorHTML = (item: any, group?: string[]) => {
    return (
      <RichTextEditor
        {...item.input}
        onChange={(value: any) => {
          handleChangeForm(
            item.dataIndex ? item.dataIndex : item.label,
            value,
            group
          );
          item.input?.onChange && item.input.onChange(value);
        }}
        value={
          group && group.length > 0
            ? valueInGroup(
              valueForm,
              [...group, item.dataIndex ? item.dataIndex : item.label],
              0
            )
            : valueForm &&
            valueForm[item.dataIndex ? item.dataIndex : item.label]
        }
        defaultValue={
          group && group.length > 0
            ? valueInGroup(
              valueForm,
              [...group, item.dataIndex ? item.dataIndex : item.label],
              0
            )
            : valueForm &&
            valueForm[item.dataIndex ? item.dataIndex : item.label]
        }
      />
    );
  };

  const renderTextArea = (item: any, group?: string[]) => {
    return (
      <TextArea
        size="large"
        {...item.input}
        onChange={(value: any) => {
          handleChangeForm(
            item.dataIndex ? item.dataIndex : item.label,
            value.target.value,
            group
          );
          item.input?.onChange && item.input.onChange(value.target.value);
        }}
        defaultValue={
          group && group.length > 0
            ? valueInGroup(
              valueForm,
              [...group, item.dataIndex ? item.dataIndex : item.label],
              0
            )
            : valueForm &&
            valueForm[item.dataIndex ? item.dataIndex : item.label]
        }
        value={
          group && group.length > 0
            ? valueInGroup(
              valueForm,
              [...group, item.dataIndex ? item.dataIndex : item.label],
              0
            )
            : valueForm &&
            valueForm[item.dataIndex ? item.dataIndex : item.label]
        }
        className={cx(styles.CustomeInput, item.className)}
      />
    );
  };

  // const renderDatePicker = (item: any, group?: string[]) => {
  //   return <DatePicker
  //     {...item.input}
  //     onChange={(value: any) => {
  //       handleChangeForm(
  //         item.dataIndex ? item.dataIndex : item.label,
  //         value,
  //         group
  //       );
  //       item.input?.onChange && item.input.onChange(value);
  //     }}
  //     defaultValue={
  //       group && group.length > 0
  //         ? valueInGroup(
  //           valueForm,
  //           [...group, item.dataIndex ? item.dataIndex : item.label],
  //           0
  //         )
  //         : valueForm &&
  //         valueForm[item.dataIndex ? item.dataIndex : item.label]
  //     }
  //     value={
  //       group && group.length > 0
  //         ? valueInGroup(
  //           valueForm,
  //           [...group, item.dataIndex ? item.dataIndex : item.label],
  //           0
  //         )
  //         : valueForm &&
  //         valueForm[item.dataIndex ? item.dataIndex : item.label]
  //     }
  //     className={cx(styles.CustomeInput, item.className)} />
  // }
  // const renderDateRangePicker = (item: any, group?: string[]) => {
  //   return <DatePicker.RangePicker
  //     {...item.input}
  //     onChange={(value: any) => {
  //       handleChangeForm(
  //         item.dataIndex ? item.dataIndex : item.label,
  //         value,
  //         group
  //       );
  //       item.input?.onChange && item.input.onChange(value);
  //     }}
  //     defaultValue={
  //       group && group.length > 0
  //         ? valueInGroup(
  //           valueForm,
  //           [...group, item.dataIndex ? item.dataIndex : item.label],
  //           0
  //         )
  //         : valueForm &&
  //         valueForm[item.dataIndex ? item.dataIndex : item.label]
  //     }
  //     value={
  //       group && group.length > 0
  //         ? valueInGroup(
  //           valueForm,
  //           [...group, item.dataIndex ? item.dataIndex : item.label],
  //           0
  //         )
  //         : valueForm &&
  //         valueForm[item.dataIndex ? item.dataIndex : item.label]
  //     }
  //     className={cx(styles.CustomeInput, item.className)} />
  // }
  // const renderTimePicker = (item: any, group?: string[]) => {
  //   return <TimePicker
  //     {...item.input}
  //     onChange={(value: any) => {
  //       handleChangeForm(
  //         item.dataIndex ? item.dataIndex : item.label,
  //         value,
  //         group
  //       );
  //       item.input?.onChange && item.input.onChange(value);
  //     }}
  //     defaultValue={
  //       group && group.length > 0
  //         ? valueInGroup(
  //           valueForm,
  //           [...group, item.dataIndex ? item.dataIndex : item.label],
  //           0
  //         )
  //         : valueForm &&
  //         valueForm[item.dataIndex ? item.dataIndex : item.label]
  //     }
  //     value={
  //       group && group.length > 0
  //         ? valueInGroup(
  //           valueForm,
  //           [...group, item.dataIndex ? item.dataIndex : item.label],
  //           0
  //         )
  //         : valueForm &&
  //         valueForm[item.dataIndex ? item.dataIndex : item.label]
  //     }
  //     className={cx(styles.CustomeInput, item.className)} />
  // }
  const renderTimeRangePicker = (item: any, group?: string[]) => {
    const value = group && group.length > 0
      ? valueInGroup(
        valueForm,
        [...group, item.dataIndex ? item.dataIndex : item.label],
        0
      )
      : valueForm &&
      valueForm[item.dataIndex ? item.dataIndex : item.label]
    return <TimePicker.RangePicker
      {...item.input}
      onChange={(value: any, valueString: string) => {
        handleChangeForm(
          item.dataIndex ? item.dataIndex : item.label,
          valueString,
          group
        );
        item.input?.onChange && item.input.onChange(valueString);
      }}
      defaultValue={
        value && JSON.parse(JSON.stringify(value)).map((v: string) => (dayjs(v, 'HH:mm:ss')))
      }
      value={
        value && JSON.parse(JSON.stringify(value)).map((v: string) => (dayjs(v, 'HH:mm:ss')))
      }
      className={cx(styles.CustomeInput, item.className)} />
  }

  //render form
  const renderGroupInput = (item: any, group?: string[]) => {
    return renderChild(
      item.fields,
      group
        ? [...group, item.dataIndex ? item.dataIndex : item.label]
        : [item.dataIndex ? item.dataIndex : item.label]
    );
  };

  const renderChild = (fields: any, group?: string[]) => {
    return (
      fields && (
        <Row className={cx(styles.WarpForm)}>
          {fields.map((item: any, key: Key) => {
            return (
              <Col key={key} className={styles.WarpChild} {...item.col}>
                {renderListInput(item, group)}
              </Col>
            );
          })}
        </Row>
      )
    );
  };

  // render button call to action
  const renderButtonCallToAction = () => {
    return (
      <Row
        justify={
          FormProps.justifyButtonCallToAction
            ? FormProps.justifyButtonCallToAction
            : "center"
        }
      >
        {FormProps.buttonCallToAction &&
          FormProps.buttonCallToAction.length > 0 &&
          FormProps.buttonCallToAction.map((item: any, key: Key) => {
            return (
              <FormAntd.Item key={key}>
                <Button
                  size="large"
                  shape="round"
                  {...item}
                  type={undefined}
                  className={cx("ButtonOutLine", item.className)}
                  htmlType={item.actionType == "SUBMIT" ? "submit" : undefined}
                  onClick={() => {
                    !item.onActionTrigger &&
                      item.actionType == "SUBMIT" &&
                      handleSubmit();
                    item.onActionTrigger && item.onActionTrigger(valueForm);
                  }}
                >
                  {item.title}
                </Button>
              </FormAntd.Item>
            );
          })}
      </Row>
    );
  };
  const renderListInput = (item: any, group?: string[]) => {
    const renderItem = (displayType: string) => {
      switch (displayType) {
        case "InputNumber":
          return renderInputNumber(item, group);
        case "SelectOption":
          return renderSelectOption(item, group);
        case "SwitchToggle":
          return renderSwitchToggle(item, group);
        case "ColorPicker":
          return renderColorPicker(item, group);
        case "UploadButton":
          return renderUploadButton(item, group);
        case "EditorHTML":
          return renderEditorHTML(item, group);
        case "Checkbox":
          return renderCheckbox(item, group);
        case "Slider":
          return renderSlider(item, group);
        case "TextArea":
          return renderTextArea(item, group);
        case "Select":
          return renderSelect(item, group);
        case "AutoComplete":
          return renderAutoComplete(item, group);
        // case "DatePicker":
        //   return renderDatePicker(item, group);
        // case "DateRangePicker":
        //   return renderDateRangePicker(item, group);
        // case "TimePicker":
          // return renderTimePicker(item, group);
        case "TimeRangePicker":
          return renderTimeRangePicker(item, group);
        case "Group":
          return renderGroupInput(item, group);
        case "Input":
        default:
          return renderInput(item, group);
      }
    };
    return (
      <FormAntd.Item
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        {...item}
        name={item.dataIndex}
      >
        {item.displayType == "Group" && item.divider == true && (
          <Divider className={styles.CustomeDivider} />
        )}
        {renderItem(item.displayType)}
      </FormAntd.Item>
    );
  };

  //Main render
  return (
    <div>
      {loading ? (
        <Skeleton active />
      ) : (
        <FormAntd
          form={FormProps.form}
          name="control-hooks"
          autoComplete="off"
          className={cx(styles.Form, FormProps.className)}
          style={FormProps.style}
        // form={form}
        >
          {FormProps.nameForm && (
            <>
              <Typography.Title level={5} style={{ fontWeight: 400 }}>
                {FormProps.nameForm}
              </Typography.Title>
            </>
          )}
          {FormProps.divider && <Divider style={FormProps.styleDivider} />}
          {renderChild(FormProps.fields)}
          {renderButtonCallToAction()}
        </FormAntd>
      )}
    </div>
  );
};

export { Form };
export type { FormProps };
