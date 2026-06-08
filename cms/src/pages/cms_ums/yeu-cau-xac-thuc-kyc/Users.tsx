import React, { useState } from "react";
import {
  Message,
  Table,
  Modal,
  Spin,
  useAuthContext,
  Form,
  Collapse,
} from "@/stories";
import { GetAll, Update } from "@/stories/services";
import styles from "./Users.module.scss";
import { Form as FormAntd } from "antd";
import permissionsCheck from "@/utils/permission";

const Users = () => {
  //define constants

  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = Message.useMessage();
  const [open, setOpen] = useState<any>();
  const { userData } = useAuthContext();
  const [profiles, setProfiles] = useState<any>();
  const [transaction, setTransaction] = useState<any>();
  const [formInstance] = FormAntd.useForm();
  const [filter, setFilter] = useState([1, 2, 3]);

  const templateTransation: any = {
    user_name: "Tên",
    email: "Email",
    value: {
      process: "Trạng thái",
      respone_fail: "Phản hồi",
    },
    time: "Thời gian thực hiện",
  };
  const kycRender = [
    {
      title: "Họ và Tên",
      dataIndex: "full_name",
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
    },
    {
      title: "Quốc gia",
      dataIndex: "nationality",
    },
    {
      title: "Địa chỉ",
      dataIndex: "ext",
      prefixQuery: "users",
    },
    {
      title: "Số định danh",
      dataIndex: "id_number",
    },
    {
      title: "Loại giấy định danh",
      dataIndex: "id_type",
    },
    {
      title: "Mặt trước giấy định danh",
      dataIndex: "image_front_card",
      type: "image",
    },
    {
      title: "Mặt sau giấy định danh",
      dataIndex: "image_back_card",
      type: "image",
    },
    {
      title: "Khuôn mặt",
      dataIndex: "image_face",
      type: "image",
    },
  ];

  const [formValue, setFormValue] = useState<any>({});
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
        label: "Duyệt đơn", // show label
        dataIndex: "process", // key
        displayType: "Select", // type input
        col: { lg: 24 },
        rules: [
          {
            required: true,
            message: "Không được bỏ trống",
          },
        ],
        input: {
          options: [
            { label: "Chờ xác thực", value: 1 },
            { label: "Đã xác thực", value: 2 },
            { label: "Thất bại", value: 3 },
          ],
          shapeRound: false,
          placeholder: "Chờ xác nhận",
        },
      },
      {
        label: "Lý do từ chối", // show label
        dataIndex: "respone_fail", // key
        displayType: "TextArea", // type input
        col: { lg: 24 },
        rules: [
          {
            required: formValue?.process == 3,
            message: "Nhập lý do nếu từ chối",
          },
        ],
        input: {
          disabled: !(formValue?.process == 3),
          shapeRound: false,
          placeholder: "Mô tả",
        },
      },
    ],
  };
  //functions to create
  //configs
  const table = {
    loading: loading,
    dataSource: {
      table: "profiles",
      isBackendData: true,
      data: [],
      where: {
        "users.deleted_at": {
          _eq: null,
        },
        process: {
          _in: filter && filter.length > 0 ? filter : [1, 2, 3],
        },
      },
      join: [
        {
          table: "users",
          foreign: ["users.id", "profiles.user_id"],
        },
      ],
    },
    config: {
      tableInformation: {
        title: "TẤT CẢ YÊU CẦU XÁC THỰC KYC",
        description: "Quản lý toàn bộ yêu cầu",
        noData: "CHƯA CÓ YÊU CẦU NÀO",
      },
      tableDisplay: {
        columns: [
          {
            title: "",
            dataIndex: "user_id",
            prefixQuery: "profiles",
            ellipsis: true,
            render: (col: any, record: any, index: number) => index + 1,
            width: 70,
          },
          {
            title: "Email",
            dataIndex: "email",
            prefixQuery: "users",
            ellipsis: true,
          },
          {
            title: "Họ và Tên",
            dataIndex: "full_name",
            prefixQuery: "profiles",
            ellipsis: true,
          },
          {
            title: "Địa chỉ",
            dataIndex: "ext",
            prefixQuery: "users",
            ellipsis: true,
            render: (val: any) => val?.address,
          },
          {
            title: "",
            dataIndex: "transaction",
            prefixQuery: "profiles",
            hidden: true,
            ellipsis: true,
          },
          {
            title: "Trạng thái",
            dataIndex: "process",
            prefixQuery: "profiles",
            render: (col: string | number) => {
              const process = {
                color: col == 1 ? "#cbb300" : col == 2 ? "green" : "red",
                component:
                  col == 1
                    ? "Chờ xác nhận"
                    : col == 2
                    ? "Đã duyệt"
                    : "Thất bại",
              };
              return (
                <div title={process.component} style={{ color: process.color }}>
                  {process.component}
                </div>
              );
            },
            ellipsis: true,
            filters: [
              {
                text: "Chờ xác nhận",
                value: 1,
              },
              {
                text: "Đã duyệt",
                value: 2,
              },
              {
                text: "Thất bại",
                value: 3,
              },
            ],
          },
        ],
        rowActions: [
          {
            title: "Thông tin KYC",
            icon: "ClipboardData",
            description: "Thông tin KYC",
            onActionTrigger: (record: any) => {
              getDataKYC(
                record[0].user_id,
                record[0].process,
                record[0].respone_fail
              );
            },
          },
          {
            title: "Lịch sử duyệt",
            icon: "Activity",
            description: "Lịch sử duyệt",
            onActionTrigger: (record: any) => {
              setOpen(true);
              setTransaction(record[0].transaction);
            },
          },
        ],
      },
      tableOptions: {
        tableActions: [],
        search: {
          title: "Tìm kiếm người dùng",
          enable: true,
          placeholder: "Tìm kiếm người dùng",
          onChange: (value: any) => {},
          fields: [],
          showSizeChanger: true,
        },
        paging: {
          enable: true,
          pagingType: "PAGING / LAZZYLAOD",
        },
        filter: filter,
        onChange: (pagination: any, filter: any) => {
          setFilter(filter.process);
        },
      },
    },
  };

  //Function to create
  const getDataKYC = async (id: string, process: number, respone_fail: any) => {
    setLoading(true);
    await GetAll({
      table: "profiles",
      fields: [
        ...kycRender.map(
          (item) =>
            `${item.prefixQuery ? item.prefixQuery : "profiles"}.${
              item.dataIndex
            }`
        ),
        "profiles.created_at",
      ],
      where: {
        user_id: {
          _in: [id],
        },
      },
      join: [
        {
          table: "users",
          foreign: ["users.id", "profiles.user_id"],
        },
      ],
    })
      .then((res) => {
        if (res?.profiles && res?.profiles?.length > 0) {
          setProfiles({ user_id: id, ...res.profiles[0] });
          setOpen(true);
          setFormValue({
            process: process,
            respone_fail: respone_fail,
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        messageApi.error(error);
      });
  };

  //function to handle actions

  const handleCloseModal = () => {
    setOpen(false);
    setProfiles(undefined);
    setFormValue({});
    setTransaction([]);
  };
  const handleUpdateProfile = async () => {
    return await formInstance.validateFields().then(async () => {
      const userTransation = {
        user_name: userData.user_name,
        email: userData.email,
        value: formValue,
        time: Date(),
      };
      setLoading(true);
      Update({
        table: "profiles",
        where: {
          user_id: { _in: [profiles.user_id] },
        },
        object: {
          ...formValue,
          transaction: JSON.stringify(
            profiles?.transaction
              ? [...profiles?.transaction, userTransation]
              : [userTransation]
          ),
        },
      })
        .then(async (res) => {
          if (res) {
            messageApi.open({
              type: "success",
              content: "Cập nhật thành công",
            });
            handleCloseModal();
          }
          setLoading(false);
        })
        .catch((err) => {
          messageApi.open({
            type: "error",
            content: err,
          });
          handleCloseModal();
          setLoading(false);
        });
    });
  };

  //functions to hook
  //functions to render
  const renderKYCView = () => {
    return (
      <div>
        {kycRender.map((kyc, index) => {
          return (
            <div key={index}>
              {kyc.title}:{" "}
              {kyc?.type == "image" ? (
                <div className={styles.WarpImage}>
                  <img src={profiles[kyc.dataIndex]}></img>
                </div>
              ) : kyc?.dataIndex == "ext" ? (
                profiles[kyc.dataIndex]?.address
              ) : (
                profiles[kyc.dataIndex]
              )}
            </div>
          );
        })}
        {!permissionsCheck("cms_ums/users/3-2", userData?.permission) && (
          <Form form={formInstance} {...configInput} />
        )}
      </div>
    );
  };

  const renderTransaction = (data: any, templateTransation: any) => {
    return (
      <div>
        {Object.keys(templateTransation).map((item: string) => {
          return (
            <p>
              {typeof templateTransation[item] == "string"
                ? `${templateTransation[item]}: ${
                    data[item] == 1
                      ? "Chờ xác nhận"
                      : data[item] == 2
                      ? "Đã duyệt"
                      : data[item] == 3
                      ? "Thất bại"
                      : data[item]
                  }`
                : renderTransaction(data[item], templateTransation[item])}
            </p>
          );
        })}
      </div>
    );
  };
  //MAIN RENDER
  return (
    <>
      {contextHolder}
      <Spin fullscreen spinning={loading} />
      <Table {...table} />
      <Modal
        open={open}
        cancelText={"Hủy"}
        okText={"Xác nhận"}
        onCancel={() => {
          handleCloseModal();
        }}
        onOk={() => {
          profiles && handleUpdateProfile();
        }}
        title={profiles ? "Duyệt KYC người dùng" : "Lịch sử duyệt"}
        className={styles[`Modal_${open}`]}
        footer={
          !permissionsCheck("cms_ums/users/3-2", userData?.permission)
            ? undefined
            : false
        }
      >
        {profiles ? (
          renderKYCView()
        ) : (
          <div>
            {transaction && transaction.length > 0 ? (
              <Collapse
                accordion
                items={transaction.map((item: any, key: number) => ({
                  key: key,
                  label: `${
                    item?.value?.process == 1
                      ? "Chờ xác nhận"
                      : item?.value?.process == 2
                      ? "Đã duyệt"
                      : "Thất bại"
                  } - ${item?.time}`,
                  children: renderTransaction(item, templateTransation),
                }))}
              />
            ) : (
              "Chưa có hành động nào thực hiện với yêu cầu này"
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default Users;
