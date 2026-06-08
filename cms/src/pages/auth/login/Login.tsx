import React, { useState } from "react";
import styles from "./Login.module.scss";
import { Spin, Form, Row } from "@/stories";
import httpHandler from "@/stories/services/apiConfig";
import Image from "next/image";
import { Button } from "@/stories";
import { Form as FormANTD } from "antd/lib";

const checkType = (string: string): string | undefined => {
  const isEmail = (input: string): boolean => {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  const isPhoneNumber = (input: string): boolean => {
    const phoneRegex: RegExp = /^[0-9]{10}$/;
    return phoneRegex.test(input);
  };

  if (isEmail(string)) {
    return "email";
  } else if (isPhoneNumber(string)) {
    return "phone";
  } else {
    return undefined;
  }
};

const Login = () => {
  //define constants
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<any>({
    email: "",
    password: "",
  });
  const [formInstant] = FormANTD.useForm();
  //function to create

  //function to handle actions

  const handleSubmit = async () => {
    formInstant;
    if (form.email != "" && form.password != "") {
      if (checkType(form.email) != undefined) {
        setLoading(true);
        await httpHandler(`/auth/login`, {
          email: checkType(form.email) == "email" ? form.email : null,
          phone: checkType(form.email) == "phone" ? form.email : null,
          password: form.password,
        })
          .then((res: any) => {
            const data = res;
            if (data && data.accessToken) {
              localStorage.setItem("accessToken", data.accessToken);
              window.location.href = "/";
            } else {
              alert(data.error);
              console.error(data.error);
              setLoading(false);
            }
          })
          .catch((error: any) => {
            console.error(`error: ${error}`);
            setLoading(false);
          });
      } else {
        alert("Tài khoản nhập không hợp lệ !!!");
      }
    } else {
      alert("Thông tin không hợp lệ !!!");
    }
  };

  //function to hook

  //function to render

  // Function to useEffect

  // main render
  if (loading) {
    return <Spin spinning={loading} fullscreen />;
  }

  return (
    <div className={[styles.Login].join(" ")}>
      <Row align={"middle"} justify={"center"}>
        <Image src={"/logo.png"} alt="." width={300} height={50} />
      </Row>
      <div className={[styles.Header].join(" ")}>
        <p className={[styles.Title].join(" ")}>ĐĂNG NHẬP</p>
      </div>
      <Form
        form={formInstant}
        dataSource={{
          table: "form",
          update: {
            isBackendData: false,
            data: form,
          },
        }}
        valuesFormOnChange={(e) => {
          setForm(e);
        }}
        fields={[
          {
            dataIndex: "email", // key
            displayType: "Input", // type input
            col: { span: 24 },
            className: styles.Input,
            input: {
              shapeRound: false,
              placeholder: "Nhập email",
            },
          },
          {
            dataIndex: "password", // key
            displayType: "Input", // type input
            col: { span: 24 },
            className: styles.Input,
            input: {
              shapeRound: false,
              type: "password",
              placeholder: "Nhập mật khẩu",
            },
          },
        ]}
      />
      <Button
        htmlType={"submit"}
        shape={"standard"}
        className={styles.ButtonSubmit}
        type="primary"
        onClick={handleSubmit}
      >
        Đăng nhập
      </Button>
    </div>
  );
};

export default Login;
