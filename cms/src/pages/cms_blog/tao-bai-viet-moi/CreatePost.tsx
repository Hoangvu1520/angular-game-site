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
import styles from "./CreatePost.module.scss";
import { Form as FormAntd } from "antd";
import { apiConfig, GetAll, Insert, Update } from "@/stories/services";
import { useRouter } from "next/router";
import { toBase64 } from "@/utils";

const CreatePost = () => {
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
      table: `posts`,
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
        label: "Nội dung",
        col: { span: 18 },
        divider: true,
        className: [styles.FormItem].join(" "),
        fields: [
          {
            label: "Tiêu đề", // show label
            dataIndex: "title", // key
            displayType: "Input", // type input
            col: { span: 12 },
            rules: [
              {
                required: true,
                message: "Không được để trống phần này",
              },
            ],
            input: {
              placeholder: "Viết tiêu đề",
              shapeRound: false,
            },
          },
          {
            label: "Phụ đề", // show label
            dataIndex: "sub_title", // key
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
            label: "Nội dung", // show label
            dataIndex: "post", // key
            displayType: "EditorHTML", // type input
            col: { span: 24 },
            rules: [
              {
                required: true,
                message: "Không được để trống phần này",
              },
            ],
            input: {
              style: { marginTop: "42px" },
            },
          },
        ],
      },
      {
        displayType: "Group",
        dataIndex: "group2",
        label: "Thể loại",
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
          {
            label: "Tên", // show label
            dataIndex: "type", // key
            displayType: "Select", // type input
            col: { span: 24 },
            rules: [
              {
                required: true,
                message: "Không được để trống phần này",
              },
            ],
            input: {
              placeholder: "Chọn thể loại",
              shapeRound: false,
              options: [
                { label: "Tin cập nhật", value: 1 },
                { label: "Xu hướng", value: 2 },
                { label: "Thị trường", value: 3 },
              ],
            },
          },
        ],
      },
    ],
  };
  //functions to create
  const getDataToUpdate = () => {
    setLoading(true);
    GetAll({
      table: "blogs",
      fields: [
        "image",
        "title",
        "sub_title",
        "post",
        "type",
        "created_at",
        "publish",
      ],
      where: { id: { _eq: updateUrl } },
    })
      .then((res: any) => {
        const data = res.blogs[0];
        setFormValue((item: any) => ({
          group1: {
            title: data.title,
            sub_title: data.sub_title,
            post: data.post,
          },
          group2: {
            type: data.type,
            publish: data.publish,
          },
        }));
        setPreviewImage(data?.image);
        formInstance.setFieldsValue({
          title: data.title,
          sub_title: data.sub_title,
          post: data.post,
          publish: data.publish,
          type: data.type,
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
    updateUrl ? handleUpdateBlog() : handleSaveBlog();
  };

  const handleSaveBlog = () => {
    formInstance.validateFields().then(async () => {
      return await Insert({
        table: "blogs",
        insert: {
          data: {
            ...formValue.group1,
            ...formValue.group2,
            author_id: userData.id,
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
              content: "Tạo bài viết thành công",
            });
            setInterval(() => {
              window.location.href = "/cms_blog/tat-ca-bai-viet";
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

  const handleUpdateBlog = () => {
    formInstance.validateFields().then(async () => {
      return await Update({
        table: "blogs",
        where: { id: { _eq: updateUrl } },
        object: {
          ...formValue.group1,
          ...formValue.group2,
          author_id: userData.id,
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
              content: "Cập nhật bài viết thành công",
            });
            setInterval(() => {
              window.location.href = "/cms_blog/tat-ca-bai-viet";
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
        title={"Tạo bài viết"}
        description={"Tạo hoặc chỉnh sửa bài viết"}
        callToActions={[
          {
            children: "Hủy",
            icon: "FolderPlus",
            href: `/cms_blog/tat-ca-bai-viet`,
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

export default CreatePost;
