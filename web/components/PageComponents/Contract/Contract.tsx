import React, { useState } from "react";
import styles from "./Contract.module.scss";
import { Input, Select } from "../..";
import Image from "next/image";

export type ContractProps = {
  bill: number;
  cost: number;
  quantity: number;
  price: number;
  newPrice: number;
  onChange: (value: number) => void;
  extend: any;
  image?: string;
};

const Contract = (ContractProps: ContractProps) => {
  //Define constant
  const [value, setValue] = useState<any>(0);
  const liquid =
    ContractProps?.extend?.liquid &&
    ContractProps.extend.liquid.length > 0
      ? [...ContractProps.extend.liquid]
      : [];
  const reduceLiquid = liquid.reduce(
    (accumulator, currentValue) =>
      accumulator + currentValue.quantity,
    0
  );

  //Function to handle action
  const handleChange = (value: number) => {
    setValue(value);
    ContractProps.onChange(value);
  };

  //Function to render
  const renderInfoContract = () => {
    return (
      <div className="">
        <div className={[styles.Text].join(" ")}>
          Phí thanh lý / 1 sản phẩm:{" "}
          {ContractProps.bill.toLocaleString("en-US")} VNĐ
        </div>
        <div className={[styles.Text].join(" ")}>
          Số lượng sản phẩm: {ContractProps.quantity} (
          {`${ContractProps.quantity * 5}`} lượng)
        </div>
        {liquid && liquid.length > 0 && (
          <div className={[styles.Text].join(" ")}>
            Đã thanh lý: {reduceLiquid} ({`${reduceLiquid * 5}`}{" "}
            lượng)
          </div>
        )}
        <div className={[styles.Text].join(" ")}>
          Đơn giá Vietagold mua vào hiện tại:{" "}
          {ContractProps.newPrice.toLocaleString("en-US")} VNĐ
        </div>
        <div className={[styles.Text].join(" ")}>
          Tổng giá thời điểm mua:{" "}
          {ContractProps.price.toLocaleString("en-US")} VNĐ
        </div>
        <div className={[styles.Text].join(" ")}>
          Tổng giá thời điểm hiện tại:{" "}
          {(
            ContractProps.newPrice *
            ContractProps.quantity *
            5
          ).toLocaleString("en-US")}{" "}
          VNĐ
        </div>
        <br />
      </div>
    );
  };

  const renderFormChangeValue = () => {
    return (
      <div className="">
        <div className={[styles.Text].join(" ")}>
          Số lượng thanh lý: (Bạn sẽ tiến hành thanh lý toàn bộ nếu
          không chọn số lượng)
          <Input
            type="number"
            min={0}
            max={
              liquid && liquid.length > 0
                ? ContractProps.quantity - reduceLiquid
                : ContractProps.quantity
            }
            className={styles.Input}
            onChange={(e: any) => {
              handleChange(parseInt(e));
            }}
          />
        </div>
        <div className={[styles.Text].join(" ")}>
          Giá dự kiến:{" "}
          {(
            (value
              ? value * 5 * ContractProps.newPrice -
                ContractProps.bill * value
              : ContractProps.newPrice * ContractProps.quantity * 5) -
            ContractProps.bill * ContractProps.quantity
          ).toLocaleString("en-US")}{" "}
          VNĐ
        </div>
      </div>
    );
  };
  //Main render
  return (
    <div className={[styles.Contract].join(" ")}>
      <div className={[styles.Title].join(" ")}>
        Thanh lý hợp đồng
      </div>
      <div className={[styles.Text].join(" ")}>
        Khách hàng đặt gia công vàng sẽ được nhân viên của VIETAGOLD
        liên hệ trực tiếp
      </div>
      <div className="row">
        <div className="col-6">
          {renderInfoContract()}
          {renderFormChangeValue()}
        </div>
        <div className="col-6">
          <div className={[styles.WarpImage].join(" ")}>
            <Image
              className={[styles.Image].join(" ")}
              src={
                ContractProps.image
                  ? ContractProps.image
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

export { Contract };
