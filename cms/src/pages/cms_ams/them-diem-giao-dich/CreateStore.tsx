import { Form, Header, Spin, Message } from "@/stories";
import React, { useEffect, useState } from "react";
import styles from "./CreateStore.module.scss";
import { GetAll, Insert, Update } from "@/stories/services";
import { useRouter } from "next/router";
import { Form as FormAntd } from "antd";

const CreateStore = () => {
  //Define constant
  const [formValue, setFormValue] = useState<any>({
    information: {},
  });

  const [messageApi, contextHolder] = Message.useMessage();
  const router = useRouter();
  const updateUrl: any = router.query?.update;
  const [formInstance] = FormAntd.useForm();
  const table = "stores";
  const [loading, setLoading] = useState(false);

  const configInput: any = {
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
        label: "Thông tin điểm giao dịch",
        col: { span: 24 },
        divider: true,
        className: [styles.FormItem].join(" "),
        fields: [
          {
            label: "Tên", // show label
            dataIndex: "name", // key
            displayType: "Input", // type input
            col: { lg: 12 },
            rules: [
              {
                required: true,
                message: "Địa chỉ không được để trống",
              },
            ],
            input: {
              shapeRound: false,
              placeholder: "Phòng giao dịch Cầu Giấy",
            },
          },
          {
            label: "Địa chỉ", // show label
            dataIndex: "address", // key
            displayType: "Input", // type input
            col: { lg: 12 },
            rules: [
              {
                required: true,
                message: "Địa chỉ không được để trống",
              },
            ],
            input: {
              shapeRound: false,
              placeholder:
                "Phòng giao dịch Vietagold, Tầng 1 tòa CT1, Khu đô thị, Mễ Trì, Nam Từ Liêm, Hà Nội",
            },
          },
        ],
      },
    ],
  };

  //Function to create
  const getDataToUpdate = () => {
    setLoading(true);
    GetAll({
      table: "stores",
      fields: ["name", "id", "ext"],
      where: { id: { _eq: updateUrl } },
    })
      .then((res: any) => {
        const data = res.stores[0];
        setFormValue((item: any) => ({
          information: { name: data.name, ...data.ext },
        }));
        formInstance.setFieldsValue({ name: data.name, ...data.ext });
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        messageApi.open({
          type: "error",
          content: `${error}`,
        });
      });
  };
  //Function to handle action
  const handleSubmit = () => {
    updateUrl ? handleUpdateStore() : handleInsertStore();
  };
  const handleInsertStore = async () => {
    return await formInstance.validateFields().then(async () => {
      return await Insert({
        table: table,
        insert: {
          data: {
            name: formValue.information.name,
            ext: { address: formValue.information.address },
          },
          result: "*",
        },
      })
        .then((res) => {
          if (res?.error) {
            res?.error && console.error(res?.error);
            messageApi.open({
              type: "error",
              content: `${res?.error}`,
            });
          } else {
            messageApi.open({
              type: "success",
              content: "Tạo điểm giao dịch thành công",
            });
            setInterval(() => {
              window.location.href = "/cms_ams/tat-ca-diem-giao-dich";
            }, 1);
          }
        })
        .catch((err) => {
          console.error(err);
          messageApi.open({
            type: "error",
            content: `${err}`,
          });
        });
    });
  };

  const handleUpdateStore = async () => {
    return await formInstance.validateFields().then(async () => {
      return await Update({
        table: table,
        where: { id: { _eq: updateUrl } },
        object: {
          name: formValue.information.name,
          ext: { address: formValue.information.address },
        },
      })
        .then((res) => {
          if (res?.error) {
            res?.error && console.error(res?.error);
            messageApi.open({
              type: "error",
              content: `${res?.error}`,
            });
          } else {
            messageApi.open({
              type: "success",
              content: "Cập nhật điểm giao dịch thành công",
            });
            setInterval(() => {
              window.location.href = "/cms_ams/tat-ca-diem-giao-dich";
            }, 2);
          }
        })
        .catch((err) => {
          console.error(err);
          messageApi.open({
            type: "error",
            content: `${err}`,
          });
        });
    });
  };

  //Function to effect
  useEffect(() => {
    updateUrl && getDataToUpdate();
  }, [updateUrl]);
  //Main render
  return (
    <>
      {contextHolder}
      <Spin spinning={loading} fullscreen />
      <Header
        title={"Tạo điểm giao dịch"}
        description={"Tạo điểm giao dịch mới và cập nhật thông tin"}
        callToActions={[
          {
            children: "Hủy",
            icon: "FolderPlus",
            href: `/cms_ams/tat-ca-diem-giao-dich`,
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
        <Form form={formInstance} {...configInput} />
      </div>
    </>
  );
};

export default CreateStore;
