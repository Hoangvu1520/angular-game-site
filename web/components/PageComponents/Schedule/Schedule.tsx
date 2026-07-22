import React, { useEffect, useState } from "react";
import styles from "./Schedule.module.scss";
import { Input, Select } from "../..";
import Image from "next/image";
import moment from "moment";
import httpHandler from "../../../services/apiConfig";
import { title } from "process";

export type ScheduleProps = {
  price?: number;
  onChange?: (date: string, store: string, quantity: number) => void;
  value?: string;
  quantity: number;
  date?: string;
  state?: string;
  extend?: any;
  image?: string;
};

const Schedule = (ScheduleProps: ScheduleProps) => {
  //define constants
  const [input, setInput] = useState<string>(
    ScheduleProps.value ? ScheduleProps.value : ""
  );
  const [quantity, setQuantity] = useState(1)
  const [options, setOptions] = useState([]);
  const [stores, setStores] = useState(
    ScheduleProps.extend?.store ? ScheduleProps.extend.store : ""
  );
  const liquid =
    ScheduleProps?.extend?.liquid &&
      ScheduleProps.extend.liquid.length > 0
      ? [...ScheduleProps.extend.liquid]
      : [];
  const reduceLiquid = liquid.reduce(
    (accumulator, currentValue) =>
      accumulator + currentValue.quantity,
    0
  ) + (ScheduleProps?.extend?.oldSchedule ? ScheduleProps?.extend.oldSchedule.reduce(
    (accumulator: number, currentValue: any) =>
      accumulator + currentValue,
    0
  ) : 0);
  //functions to create
  const numberWithCommas = (number: number) => {
    return number.toLocaleString("en-US");
  };
  const getAddress = () => {
    httpHandler("/invest/get-store", {}, "GET")
      .then((res) => {
        if (res && !res.error && res.length > 0) {
          setOptions(
            res.map((item: any) => ({
              label: item.name,
              value: item.name,
              address: item.ext.address,
            }))
          );
        }
      })
      .catch((error) => {
        alert(`${error}`);
      });
  };

  //functions to handle actions
  const handleChange = (value: string) => {
    setInput(value);
    ScheduleProps.onChange && ScheduleProps.onChange(value, stores, quantity);
  };
  //functions to hook
  useEffect(() => {
    getAddress();
  }, []);

  //functions to render
  const renderInputDate = () => {
    return (
      <Input
        className={[styles.Input].join(" ")}
        value={input}
        type={
          ScheduleProps.date && ScheduleProps.state == "Hẹn giao vàng"
            ? "number"
            : "datetime-local"
        }
        onChange={(value: any) => handleChange(value)}
        placeholder={
          ScheduleProps.date && ScheduleProps.state == "Hẹn giao vàng"
            ? "0"
            : "mm/dd/yyyy"
        }
      />
    );
  };
  const renderInputQuantity = () => {
    return (
      <Input
        className={[styles.Input].join(" ")}
        value={quantity}
        type="number"
        onChange={(value: any) => {
          setQuantity(value)
          ScheduleProps.onChange &&
            ScheduleProps.onChange(input, stores, value);
        }}
        placeholder="0"
        min={1}
      />
    );
  }
  const renderPickStores = () => {
    const data: any =
      options &&
      options.length > 0 &&
      options.find((el: any) => el.label == stores);
    return (
      <div>
        <p className={[styles.Descriptions].join(" ")}>
          Chọn nơi nhận hàng:{" "}
        </p>
        <Select
          options={options}
          className={styles.Select}
          onChange={(e) => {
            setStores(e.value);
            ScheduleProps.onChange &&
              ScheduleProps.onChange(input, e.value, quantity);
          }}
          value={stores}
        />
        <p className={styles.Address}>
          {data && data?.address && data.address}
        </p>
      </div>
    );
  };
  //MAIN RENDER
  return (
    <div>
      <p className={[styles.Title].join(" ")}>Hẹn lấy vàng</p>
      <p className={[styles.Descriptions].join(" ")}>
        Khách hàng đặt gia công vàng sẽ được nhân viên của vieta gold
        liên hệ trực tiếp để thực hiện việc nhận vàng
      </p>
      <div className="row">
        <div className="col-6">
          <p className={[styles.Descriptions].join(" ")}>
            Phí gia công:{" "}
            {ScheduleProps.price
              ? numberWithCommas(ScheduleProps.price)
              : 0}{" "}
            VNĐ / 1 sản phẩm
          </p>
          <p className={[styles.Descriptions].join(" ")}>
            Số lượng: {ScheduleProps.quantity} sản phẩm (
            {ScheduleProps.quantity * 5} lượng)
          </p>
          {reduceLiquid ? (
            <p className={[styles.Descriptions].join(" ")}>
              Đã xử lý: {reduceLiquid} sản phẩm ({reduceLiquid * 5}{" "}
              lượng)
            </p>
          ) : (
            ""
          )}
          <p className={[styles.Descriptions].join(" ")}>
            Tổng tiền:{" "}
            {ScheduleProps.price
              ? numberWithCommas(
                ScheduleProps.price *
                quantity
              )
              : 0}{" "}
            VNĐ
          </p>
          {ScheduleProps.date &&
            ScheduleProps.state != "Hẹn giao vàng" && <>
              <p className={[styles.Descriptions].join(" ")}>
                Số lượng: {" "}
              </p>
              {renderInputQuantity()}
            </>}
          <p className={[styles.Descriptions].join(" ")}>
            Ngày nhận:{" "}
            {ScheduleProps.date &&
              ScheduleProps.state == "Hẹn giao vàng"
              ? `${moment(ScheduleProps.date).format().split("T")[0]
              } ${moment(ScheduleProps.date)
                .format()
                .split("T")[1]
                .split("+")[0]
              }`
              : ""}
          </p>
          {ScheduleProps.date &&
            ScheduleProps.state == "Hẹn giao vàng" && (
              <p className={[styles.Descriptions].join(" ")}>
                Gia hạn: (Ngày)
              </p>
            )}
          {renderInputDate()}
          {renderPickStores()}
        </div>
        <div className="col-6">
          <div className={[styles.WarpImage].join(" ")}>
            <Image
              className={[styles.Image].join(" ")}
              src={
                ScheduleProps.image
                  ? ScheduleProps.image
                  : "/TTLP1.png"
              }
              alt="."
              fill={true}
              priority={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { Schedule };
