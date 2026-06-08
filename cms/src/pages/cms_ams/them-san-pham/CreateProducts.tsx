import React, { useEffect, useState } from "react";
import {
  Col,
  Form,
  Header,
  Row,
  useAuthContext,
  Spin,
  Message,
} from "@/stories";
import styles from "./CreateProducts.module.scss";
import { Form as FormAntd } from "antd";
import { GetAll, Insert, Update } from "@/stories/services";
import { useRouter } from "next/router";
import { toBase64 } from "@/utils";

const CreateProducts = () => {
  //define constants
  const [formValue, setFormValue] = useState<any>();
  const { userData } = useAuthContext();
  const [formInstance] = FormAntd.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = Message.useMessage();
  const router = useRouter();
  const updateUrl: any = router.query?.update;
  const [previewImage, setPreviewImage] = useState<any>();

  //config
  const configInput: any = {
    valuesFormOnChange: (value: any) => {
      setFormValue({ ...formValue, ...value });
    },
    dataSource: {
      table: `products`,
      update: {
        where: "",
        isBackendData: false,
        data: formValue ? formValue : undefined,
      },
    },
    fields: [
      {
        displayType: "Group",
        dataIndex: "group1",
        label: "Thông tin sản phẩm",
        col: { span: 18 },
        divider: true,
        className: [styles.FormItem].join(" "),
        fields: [
          {
            label: "Tên sản phẩm", // show label
            dataIndex: "name", // key
            displayType: "Input", // type input
            col: { span: 12 },
            rules: [
              {
                required: true,
                message: "Không được để trống phần này",
              },
            ],
            input: {
              placeholder: "Nhập tên sản phẩm",
              shapeRound: false,
            },
          },
          {
            label: "Mã sản phẩm", // show label
            dataIndex: "sku", // key
            displayType: "Input", // type input
            col: { span: 12 },
            rules: [
              {
                required: true,
                message: "Không được để trống phần này",
              },
            ],
            input: {
              placeholder: "Viết phụ đề",
              shapeRound: false,
            },
          },
          {
            label: "Giá gia công", // show label
            dataIndex: "price", // key
            displayType: "InputNumber", // type input
            col: { span: 12 },
            rules: [
              {
                required: true,
                message: "Không được để trống phần này",
              },
            ],
            input: {
              controls: false,
              shapeRound: false,
              formatter: (value: number) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            },
          },
          {
            label: "Khối lượng (chỉ)", // show label
            dataIndex: "weight", // key
            displayType: "InputNumber", // type input
            col: { span: 12 },
            rules: [
              {
                required: true,
                message: "Không được để trống phần này",
              },
            ],
            input: {
              shapeRound: false,
            },
          },
        ],
      },
      {
        displayType: "Group",
        dataIndex: "group2",
        label: "Trạng thái",
        col: { span: 6 },
        divider: true,
        className: [styles.FormItem].join(" "),
        fields: [
          {
            label: "Công khai", // show label
            dataIndex: "publish", // key
            displayType: "SwitchToggle", // type input
            col: { span: 24 },
            rules: [
              // {
              //   required: true,
              //   message: "Không được để trống phần này",
              // },
            ],
          },
        ],
      },
    ],
  };
  //functions to create
  const getDataToUpdate = () => {
    setLoading(true);
    GetAll({
      table: "products",
      fields: [
        "image",
        "name",
        "sku",
        "weight",
        "price",
        "created_at",
        "publish",
      ],
      where: { id: { _eq: updateUrl } },
    })
      .then((res: any) => {
        const data = res.products[0];
        setFormValue((item: any) => ({
          group1: {
            name: data.name,
            sku: data.sku,
            price: data.price,
            weight: data.weight,
          },
          group2: {
            publish: data.publish,
          },
        }));
        setPreviewImage(data?.image);
        formInstance.setFieldsValue({
          name: data.name,
          sku: data.sku,
          price: data.price,
          weight: data.weight,
          publish: data.publish,
        });
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

  //functions to handle actions
  const handleSubmit = () => {
    updateUrl ? handleUpdateProduct() : handleSaveProduct();
  };

  const handleSaveProduct = () => {
    formInstance.validateFields().then(async () => {
      return await Insert({
        table: "products",
        insert: {
          data: {
            ...formValue.group1,
            ...formValue.group2,
            image: previewImage,
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
              content: "Tạo sản phẩm thành công",
            });
            setInterval(() => {
              window.location.href = "/cms_ams/san-pham";
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

  const handleUpdateProduct = () => {
    formInstance.validateFields().then(async () => {
      return await Update({
        table: "products",
        where: { id: { _eq: updateUrl } },
        object: {
          ...formValue.group1,
          ...formValue.group2,
          image: previewImage,
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
              content: "Cập nhật sản phẩm thành công",
            });
            setInterval(() => {
              window.location.href = "/cms_ams/san-pham";
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

  //functions to hook
  useEffect(() => {
    updateUrl && getDataToUpdate();
  }, [updateUrl]);
  //functions to render

  //MAIN RENDER
  return (
    <>
      {contextHolder}
      <Spin spinning={loading} fullscreen />
      <Header
        title={"Tạo sản phẩm"}
        description={"Tạo hoặc chỉnh sửa sản phẩm"}
        callToActions={[
          {
            children: "Hủy",
            icon: "FolderPlus",
            href: `/cms_ams/san-pham`,
          },
          {
            children: "Lưu",
            icon: "CalendarPlus",
            onClick: handleSubmit,
          },
        ]}
        background={false}
      />
      <div className="container">
        <Row className={[styles.GroupForm].join(" ")}>
          <Col span={24} className={[styles.WarpForm].join(" ")}>
            <Form form={formInstance} {...configInput} />
          </Col>
          <Col span={18} className={[styles.WarpForm].join(" ")}>
            <Row className={[styles.FormItem, styles.UploadImage].join(" ")}>
              <Col span={12}>
                <input
                  type="file"
                  onChange={async (e: any) => {
                    setPreviewImage(await toBase64(e.target.files[0]));
                  }}
                />
              </Col>
              <Col span={12} className={styles.WarpImage}>
                {previewImage && (
                  <img src={previewImage} style={{ width: "100%" }} alt="..." />
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default CreateProducts;
