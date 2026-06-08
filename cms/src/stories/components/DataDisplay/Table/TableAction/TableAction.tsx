import {
  Input,
  Col,
  Divider,
  Row,
  Segmented,
  Typography,
  Icon,
} from "../../../index";
import { Header } from "antd/lib/layout/layout";
import {} from "antd";
import styles from "./TableAction.module.scss";
import { Grid, ListUl, Search, X } from "react-bootstrap-icons";
import React, { ReactNode, useEffect, useState } from "react";
import classNames from "classnames";

const cx = classNames.bind(styles);
const { Title } = Typography;
interface search {
  enable?: boolean;
  onChange?: Function;
  placeholder?: string;
  value?: string;
  onPressEnter?: Function;
}
type TableActionProps = {
  onChangeValueSegmented: Function;
  title?: ReactNode;
  search?: search;
  valueSegmented?: string;
  optionSegmented: any[];
};
const TableAction = (TableActionProps: TableActionProps) => {
  const [prop, setProps] = useState(TableActionProps);
  const [value, setValue] = useState<any>();

  const handleOnChangeInputSearch = (e: any) => {
    setValue(e);
    prop.search?.onChange && prop.search.onChange(e);
  };

  const handleOnPressEnterSearch = (e: string) => {
    prop.search?.onPressEnter && prop.search.onPressEnter(e);
  };
  const handleOnChangeSegmented = (e: any) => {
    prop.onChangeValueSegmented(e);
  };

  const handleOnClickClearButton = () => {
    setValue(undefined);
  };

  useEffect(() => {
    setProps(TableActionProps);
  }, [TableActionProps]);
  useEffect(() => {
    prop.search && setValue(prop.search.value);
  }, [prop.search && prop.search.value]);
  return (
    <Header className={cx(styles.TableAction)}>
      <Row justify="space-between" align="middle">
        {prop.title && (
          <Col>
            <Title level={4} style={{ fontWeight: "400" }}>
              {prop.title}
            </Title>
          </Col>
        )}
        <Col className={cx(styles.WarpRight)}>
          {prop.search &&
            (prop.search.enable == undefined || prop.search.enable) && (
              <>
                <Input
                  placeholder={prop.search.placeholder}
                  prefix={
                    <Icon
                      component={Search}
                      className={cx(styles.prefixIcon)}
                    />
                  }
                  suffix={
                    <Icon
                      component={X}
                      onClick={handleOnClickClearButton}
                      className={cx(styles.suffixIcon)}
                    />
                  }
                  size="large"
                  className={cx(styles.CustomeInput)}
                  value={value}
                  onChange={handleOnChangeInputSearch}
                  shapeRound={true}
                  onPressEnter={(value: any) => {
                    handleOnPressEnterSearch(value.target.value);
                  }}
                />
                <Divider type="vertical" style={{ height: "40px" }} />
              </>
            )}
          <Segmented
            onChange={handleOnChangeSegmented}
            value={prop.valueSegmented}
            options={prop.optionSegmented}
            className={cx(styles.CustomeSegmented)}
          />
        </Col>
      </Row>
    </Header>
  );
};
TableAction.defaultProps = {
  onSearching: true,
  optionSegmented: [
    {
      value: "List",
      icon: <Icon component={ListUl} />,
    },
    {
      value: "Kanban",
      icon: <Icon component={Grid} />,
    },
  ],
};
export { TableAction };
export type { TableActionProps };
