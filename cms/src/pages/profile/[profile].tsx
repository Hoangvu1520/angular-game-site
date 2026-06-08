import { DebounceSelect, Divider, Form, Header, Message } from "@/stories";
import React, { useEffect, useState } from "react";
import styles from "./Profiles.module.scss";
import { GetAll, Update, apiConfig } from "@/stories/services";
import { useRouter } from "next/router";
import { Form as FormAntd } from "antd";
import { sha256 } from "@/utils";

const Profiles = () => {
  //Define constant
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const [formValue, setFormValue] = useState<any>({
    information: {},
    ext: {},
  });
  const [messageApi, contextHolder] = Message.useMessage();
  const router = useRouter();
  const updateUrl: any = router.query.profile;
  const [formInstance] = FormAntd.useForm();
  const configTable: any = {
    valuesFormOnChange: (value: any) => {
      setFormValue({ ...formValue, ...value });
    },
    dataSource: {
      table: `users`,
      update: {
        // where: update,
        isBackendData: false,
        data: formValue ? formValue : undefined,
      },
    },
    fields: [
      {
        displayType: "Group",
        dataIndex: "information",
        label: "Thông tin người dùng",
        col: { span: 24 },
        divider: true,
        className: [styles.FormItem].join(" "),
        fields: [
          {
            label: "Họ và tên", // show label
            dataIndex: "user_name", // key
            displayType: "Input", // type input
            // name: "user_name",
            col: { lg: 12 },
            rules: [
              {
                required: true,
                message: "Họ và tên người dùng không được để trống",
              },
            ],
            input: {
              placeholder: "Nguyễn Văn A",
            },
          },
          {
            label: "Email", // show label
            dataIndex: "email", // key
            displayType: "Input", // type input
            // name: "email",
            col: { lg: 12 },
            rules: [
              {
                required: true,
                message: "Email không được để trống",
              },
              {
                pattern: emailRegex,
                message: "Email không hợp lệ",
              },
            ],
            input: {
              type: "email",
              placeholder: "example@gmail.com",
            },
          },
          {
            label: "Số điện thoại", // show label
            dataIndex: "phone", // key
            displayType: "Input", // type input
            col: { lg: 12 },
            // name: "phone",
            input: {
              placeholder: "0123456789",
            },
            rules: [
              {
                required: false,
                message: "Số điện thoại không được để trống",
              },
            ],
          },
          {
            label: "Mật khẩu", // show label
            dataIndex: "password", // key
            displayType: "Input", // type input
            // name: "password",
            col: { lg: 12 },
            rules: [
              {
                required: updateUrl ? false : true,
                message: "Mật khẩu không được để trống",
              },
              {
                validator: (_: any, value: any) => {
                  if (!value) return Promise.resolve();

                  const minLength = /^.{8,}$/;
                  const hasUpper = /[A-Z]/;
                  const hasLower = /[a-z]/;
                  const hasNumber = /[0-9]/;
                  const hasSpecial = /[^A-Za-z0-9]/;

                  // Check liên tiếp: 123, 234, 345, 456, ...
                  const hasSequentialNumbers =
                    /(012|123|234|345|456|567|678|789|890)/;

                  if (!minLength.test(value)) {
                    return Promise.reject("Mật khẩu phải có ít nhất 8 ký tự");
                  }

                  if (!hasUpper.test(value)) {
                    return Promise.reject(
                      "Mật khẩu phải chứa ít nhất một chữ hoa"
                    );
                  }

                  if (!hasLower.test(value)) {
                    return Promise.reject(
                      "Mật khẩu phải chứa ít nhất một chữ thường"
                    );
                  }

                  if (!hasNumber.test(value)) {
                    return Promise.reject("Mật khẩu phải chứa ít nhất một số");
                  }

                  if (!hasSpecial.test(value)) {
                    return Promise.reject(
                      "Mật khẩu phải chứa ít nhất một ký tự đặc biệt"
                    );
                  }

                  if (hasSequentialNumbers.test(value)) {
                    return Promise.reject(
                      "Mật khẩu không được chứa số liên tiếp như 123, 456..."
                    );
                  }

                  return Promise.resolve();
                },
              },
            ],
            input: {
              type: "password",
              placeholder: "password",
              visibilityToggle: true,
            },
          },
        ],
      },
      {
        displayType: "Group",
        dataIndex: "ext",
        label: "Thông tin khác",
        col: { span: 24 },
        divider: true,
        className: [styles.FormItem].join(" "),
        fields: [
          {
            label: "Mã số thuế", // show label
            dataIndex: "taxCode", // key
            displayType: "Input", // type input
            // name: "taxCode",
            col: { lg: 12 },
            rules: [],
            input: {
              // placeholder: "Nguyễn Văn A",
            },
          },
          {
            label: "Chức vụ", // show label
            dataIndex: "position", // key
            displayType: "Input", // type input
            // name: "position",
            col: { lg: 12 },
            rules: [],
            input: {
              // placeholder: "example@gmail.com",
            },
          },
          {
            label: "Tên chủ tài khoản ngân hàng(viết hoa và không đấu)", // show label
            dataIndex: "accountBankName", // key
            displayType: "Input", // type input
            col: { lg: 12 },
            // name: "accountName",
            input: {
              placeholder: "NGUYEN VAN A",
            },
            rules: [],
          },
          {
            label: "Số tài khoản", // show label
            dataIndex: "accountBankNo", // key
            displayType: "InputNumber", // type input
            // name: "accountNo",
            col: { lg: 12 },
            rules: [],
            input: {
              placeholder: "123456789",
            },
          },
          {
            label: "Địa chỉ", // show label
            dataIndex: "address", // key
            displayType: "Input", // type input
            // name: "accountNo",
            col: { lg: 12 },
            rules: [],
            input: {
              placeholder: "Tòa nhà Sông Đà, 18 Phạm Hùng, Bắc Từ Niêm",
            },
          },
        ],
      },
    ],
  };

  //Function to create
  const getDataToUpdate = () => {
    GetAll({
      table: "users",
      fields: [
        "id",
        "user_name",
        "email",
        "phone",
        "ext",
        "sale",
        "internal",
        "invest",
      ],
      where: { id: { _eq: updateUrl } },
    })
      .then((res: any) => {
        setFormValue((item: any) => ({
          ...item,
          ext: res.users[0]?.ext ? { ...item.ext, ...res.users[0].ext } : {},
          information: res.users[0],
          sale: res.users[0].sale,
        }));
        formInstance.setFieldsValue({
          ...res.users[0],
          ...res.users[0]?.ext,
        });
      })
      .catch((error) => {
        messageApi.open({
          type: "error",
          content: `${error}`,
        });
      });
  };

  //Function to handle action
  const handleSubmit = () => {
    updateUrl && handleUpdateUser();
  };

  const handleUpdateUser = async () => {
    formInstance.validateFields().then(async () => {
      const inforUpdate = Update({
        table: "users",
        where: { id: { _in: [updateUrl] } },
        object: formValue.information.password
          ? {
              ...formValue.information,
              ext: formValue.ext,
              password: sha256(formValue.information.password),
            }
          : {
              ext: formValue.ext,
              email: formValue.information.email,
              user_name: formValue.information.user_name,
              phone: formValue.information.phone,
            },
      }).catch((err) => {
        console.error(err);
        throw messageApi.open({
          type: "error",
          content: `${err}`,
        });
      });

      //Update roles
      await Promise.all([await inforUpdate])
        .then((res) => {
          if (res) {
            messageApi.open({
              type: "success",
              content: "Cập nhật thông tin người dùng thành công",
            });
            setInterval(() => {
              window.location.href = "/cms_ums/tat-ca-nguoi-dung";
            }, 1);
          }
        })
        .catch((err) => {
          messageApi.open({
            type: "error",
            content: `${err}`,
          });
        });
    });
  };
  //Function to render

  //Function to effect
  useEffect(() => {
    updateUrl && getDataToUpdate();
  }, [updateUrl]);
  //Main render
  return (
    <>
      {contextHolder}
      <Header
        title={"Thông tin người dùng"}
        description={"Cập nhật thông tin cá nhân"}
        callToActions={[
          {
            children: "Hủy",
            icon: "FolderPlus",
            href: `/cms_ums/tat-ca-nguoi-dung`,
          },
          {
            children: "Lưu",
            icon: "CalendarPlus",
            htmlType: "submit",
            onClick: () => handleSubmit(),
          },
        ]}
        background={false}
      />
      <div className="container">
        <Form form={formInstance} {...configTable} />
      </div>
    </>
  );
};

export default Profiles;
