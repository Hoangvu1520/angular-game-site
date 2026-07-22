import React, { useEffect, useState } from "react";
import styles from "./Order.module.scss";
import { Input, Select } from "../../index";
import Image from "next/image";

export type OrderProps = {
  expectedPrice: number;
  onChange?: (value: any) => void;
  image?: string;
};
const Order = (OrderProps: OrderProps) => {
  //define constants
  const [valueForm, setValueForm] = useState<any>({
    quantity: 0,
    price: 0,
    currentPrice: 0,
  });
  const options: any = Array.from({ length: 10 }, (_, index) => ({
    value: index + 1,
    label: `${index + 1} Sản phẩm`,
  }));
  //function to create

  //function to handle actions
  const handleChange = (value: number) => {
    setValueForm({
      ...valueForm,
      quantity: value,
      price: OrderProps.expectedPrice * 5 * value,
      currentPrice: OrderProps.expectedPrice,
    });
    OrderProps.onChange &&
      OrderProps.onChange({
        ...valueForm,
        quantity: value,
        price: OrderProps.expectedPrice * 5 * value,
        currentPrice: OrderProps.expectedPrice,
      });
  };

  //functions to hook
  //functions to render
  //funtion to effect {
  useEffect(() => {
    setValueForm((item: any) => ({
      ...item,
      price: OrderProps.expectedPrice * 5 * item.quantity,
      currentPrice: OrderProps.expectedPrice,
    }));
  }, [OrderProps.expectedPrice]);
  //MAIN RENDER
  return (
    <div className={[styles.Order].join(" ")}>
      <p className={[styles.Title].join(" ")}>Đặt hàng</p>
      <p className={[styles.Des].join(" ")}>
        Khách hàng đặt gia công vàng sẽ được nhân viên của vietagold
        liên hệ trực tiếp để làm hợp đồng và thanh toán
      </p>
      <div className="row">
        <div className="col-6">
          <p className={[styles.InputName].join(" ")}>
            Số lượng: (1 sản phẩm tương đương với 5 lượng vàng)
          </p>
          <Input
            type="number"
            min={1}
            className={styles.Input}
            onChange={(e: any) => {
              handleChange(e);
            }}
          />
          <p className={[styles.Price].join(" ")}>
            Đơn giá:{" "}
            {OrderProps.expectedPrice.toLocaleString("en-US")} VNĐ
          </p>
          <p className={[styles.Price].join(" ")}>
            Giá dự kiến:{" "}
            {OrderProps.expectedPrice
              ? valueForm.price.toLocaleString("en-US")
              : 0}{" "}
            VNĐ
          </p>
        </div>
        <div className="col-6">
          <div className={[styles.WarpImage].join(" ")}>
            <Image
              className={[styles.Image].join(" ")}
              src={OrderProps.image ? OrderProps.image : "/TTLP1.png"}
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

export { Order };
