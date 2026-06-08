import React, { useState } from "react";
import {
  Icon,
  Message,
  // InputNumber,
  Table,
  // Modal,
  // Row,
  // Col,
  // ListView,
  Spin,
  DatePicker,
  Button,
  // Input,
  useAuthContext,
  exportExcel,
} from "@/stories";
import { GetAll, Update } from "@/stories/services";
import moment from "moment";
import styles from "./Users.module.scss";
import permissionsCheck from "@/utils/permission";
const Users = () => {
  //define constants
  const defaultFilter = [
    "Đặt hàng",
    "Đã thanh toán",
    "Chờ thanh lý",
    "Đã xử lý 1 phần",
    "Đã xử lý toàn bộ",
    "Đã thanh lý",
    "Hẹn giao vàng",
    "Đã giao hàng",
  ];
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = Message.useMessage();
  const [filterDate, setFilterDate] = useState<any>();
  const [onFilter, setOnFilter] = useState<any>();
  const { userData } = useAuthContext();
  const [filter, setFilter] = useState<any>([null, 1, 2, 3]);
  //functions to create
  //configs
  const getDataToExport = async () => {
    const res = await GetAll({
      table: "users",
      fields: [
        "users.user_name",
        "users.email",
        "users.phone",
        "users.gold",
        "users.address",
        "users.created_at",
        "profiles.process",
        "users.deleted_at",
        "users.internal",
      ],
      join: [
        {
          table: "profiles",
          foreign: ["users.id", "profiles.user_id"],
          type: "left",
        },
      ],
      where: {
        internal: {
          _eq: true,
        },
        created_at:
          onFilter && onFilter.length > 0
            ? {
                _gt: onFilter[0],
                _lt: onFilter[1],
              }
            : {},
        "profiles.process": {
          _in: filter && filter.length > 0 ? filter : [null, 1, 2, 3],
        },
      },
      orderBy: {
        column: "created_at",
        direction: "asc",
      },
      aggregate: {
        function: "count",
        column: "id",
      },
    });
    if (res && res?.users.length > 0) {
      return res.users.map((item: any, key: number) => ({
        ...item,
        id: key + 1,
        created_at: `${moment(item.created_at).utc().format().split("T")[0]} ${
          moment(item.created_at).utc().format().split("T")[1].split("Z")[0]
        }`,
        deleted_at: item.deleted_at
          ? `${moment(item.deleted_at).utc().format().split("T")[0]} ${
              moment(item.deleted_at).utc().format().split("T")[1].split("Z")[0]
            }`
          : "Chưa bị chặn",
        internal: item.internal ? "Người dùng nội bộ" : "Người dùng thường",
        process: item.process
          ? item.process == 1
            ? "Chờ duyệt"
            : item.process == 2
            ? "Đã duyệt"
            : "Từ chối"
          : "Chưa thực hiện KYC",
        gold: item.gold ? item.gold : 0,
      }));
    } else {
      messageApi.open({
        type: "warning",
        content: `Dữ liệu bạn muốn trích xuất đang rỗng`,
      });
    }
  };
  const table = {
    dataSource: {
      table: "users",
      isBackendData: true,
      data: [],
      where: {
        internal: {
          _eq: true,
        },
        created_at:
          onFilter && onFilter.length > 0
            ? {
                _gt: onFilter[0],
                _lt: onFilter[1],
              }
            : {},
        "profiles.process": {
          _in: filter && filter.length > 0 ? filter : [null, 1, 2, 3],
        },
      },
      join: [
        {
          table: "profiles",
          foreign: ["users.id", "profiles.user_id"],
          type: "left",
        },
      ],
    },
    config: {
      tableInformation: {
        title: "TẤT CẢ NGƯỜI DÙNG THƯỜNG",
        description: "Quản lý toàn bộ người dùng",
        noData: "CHƯA CÓ NGƯỜI DÙNG NÀO ĐƯỢC TẠO",
        callToActions: [
          {
            children: "Xuất dữ liệu",
            icon: "CloudArrowDown",
            onClick: () => handleExportExcel(),
          },
        ],
      },
      tableDisplay: {
        columns: [
          {
            title: "",
            dataIndex: "id",
            // hidden: true,
            ellipsis: true,
            render: (col: any, record: any, index: number) => index + 1,
            width: 70,
            prefixQuery: "users",
          },
          {
            title: "Họ và Tên",
            dataIndex: "user_name",
            prefixQuery: "users",
            ellipsis: true,
            dataFomatter: "title",
          },
          {
            title: "Email",
            prefixQuery: "users",
            dataIndex: "email",
            ellipsis: true,
          },
          {
            title: "Số điện thoại",
            prefixQuery: "users",
            dataIndex: "phone",
            ellipsis: true,
          },
          {
            title: "Số vàng tích lũy",
            dataIndex: "gold",
            prefixQuery: "users",
            ellipsis: true,
            render: (a: any, record: any) => (a ? a : 0) + " chỉ",
          },
          {
            title: "Quyền truy cập",
            prefixQuery: "users",
            dataIndex: "internal",
            ellipsis: true,
            render: (a: any) => (
              <div style={{ color: a ? "green" : "red" }}>
                {a ? "Người dùng nội bộ" : "Người dùng thường"}
              </div>
            ),
          },
          {
            title: "Hoạt động",
            prefixQuery: "users",
            dataIndex: "deleted_at",
            ellipsis: true,
            render: (a: any) => (
              <Icon
                style={{ color: a == null ? "green" : "red" }}
                component={a == null ? "CheckCircle" : "DashCircle"}
              />
            ),
          },
          {
            title: "Trạng thái KYC",
            prefixQuery: "profiles",
            dataIndex: "process",
            ellipsis: true,
            render: (a: any, record: any) => {
              var state =
                a == 1
                  ? "Chờ duyệt"
                  : a == 2
                  ? "Đã duyệt"
                  : a == 3
                  ? "Từ chối"
                  : "Chưa thực hiện KYC";
              return state;
            },
            filters: [
              {
                text: "Chờ duyệt",
                value: 1,
              },
              {
                text: "Đã duyệt",
                value: 2,
              },
              {
                text: "Từ chối",
                value: 3,
              },
              {
                text: "Chưa thực hiện KYC",
                value: null,
              },
            ],
          },
          {
            title: "Ngày tạo",
            prefixQuery: "users",
            dataIndex: "created_at",
            ellipsis: true,
            render: (val: any) => {
              const convert = moment(val).utc().format();
              return `${convert.split("T")[0]} ${
                convert.split("T")[1].split("Z")[0]
              }`;
            },
            filterDropdown: ({
              setSelectedKeys,
              selectedKeys,
              confirm,
              clearFilters,
              close,
            }: any) => {
              return renderFilterDate(
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters,
                close
              );
            },
          },
        ],
        rowActions: [
          {
            title: "Chặn người dùng",
            icon: "DashCircle",
            description: "Chặn người dùng",
            onActionTrigger: (record: any) => {
              setLoading(true);
              handleBlockUser(record[0]);
            },
            disabled: permissionsCheck("cms_ums/users/4", userData?.permission),
          },
          {
            title: "Bỏ chặn người dùng",
            icon: "CheckCircle",
            description: "Bỏ chặn người dùng",
            onActionTrigger: (record: any) => {
              setLoading(true);
              handleActiveUser(record[0]);
            },
            disabled: permissionsCheck("cms_ums/users/4", userData?.permission),
          },
          {
            title: "Chỉnh sửa người dùng",
            icon: "Pencil",
            description: "Chỉnh sửa người dùng",
            onActionTrigger: (record: any) => {
              window.location.href = `/cms_ums/tao-nguoi-dung-moi?update=${record[0].id}`;
            },
            disabled: permissionsCheck("cms_ums/users/3", userData?.permission),
          },
        ],
      },
      tableOptions: {
        tableActions: [
          {
            title: "Xóa",
            icon: "Trash",
            description: "Xóa",
            actionType: "SOFT_DELETE",
            tableName: "users",
            disabled: permissionsCheck("cms_ums/users/4", userData?.permission),
          },
        ],
        search: {
          title: "Tìm kiếm người dùng",
          enable: true,
          placeholder: "Tìm kiếm người dùng",
          onChange: (value: any) => {},
          fields: ["users.email", "users.user_name", "users.phone"],
          showSizeChanger: true,
        },
        paging: {
          enable: true,
          pagingType: "PAGING / LAZZYLAOD",
        },
        filter: onFilter,
        onChange: (pagination: any, filters: any, sorter: any) => {
          setFilter(filters.process);
        },
      },
    },
  };
  //function to handle actions
  const handleExportExcel = async () => {
    const data = await getDataToExport();
    exportExcel({
      nameFile: moment().format(),
      excel: [
        {
          data: data,
          headerMapping: {
            user_name: "Tên",
            email: "Email",
            phone: "Số điện thoại",
            gold: "Số vàng",
            process: "Trạng thái KYC",
            internal: "Quyền truy cập",
            created_at: "Ngày tạo tài khoản",
            deleted_at: "Ngày chặn tài khoản",
          },
        },
      ],
    });
  };
  const handleBlockUser = (record: any) => {
    record.deleted_at != null
      ? messageApi
          .open({
            type: "warning",
            content: "Người dùng này đã bị chặn",
          })
          .then(() => {
            setLoading(false);
          })
      : Update({
          table: "users",
          where: {
            id: { _in: [record.id] },
          },
          object: {
            deleted_at: new Date(),
          },
        })
          .then((res) => {
            if (!res || res.error) {
              messageApi.open({
                type: "error",
                content: res.error
                  ? res.error
                  : "Có lỗi xảy ra vụi lòng thử lại sau",
              });
            } else {
              messageApi.open({
                type: "success",
                content: "Chặn người dùng thành công",
              });
            }
            setLoading(false);
          })
          .catch((err) => {
            messageApi.open({
              type: "error",
              content: err,
            });
            setLoading(false);
          });
  };
  const handleActiveUser = (record: any) => {
    record.deleted_at == null
      ? messageApi
          .open({
            type: "warning",
            content: "Người dùng này vẫn đang hoạt động",
          })
          .then(() => {
            setLoading(false);
          })
      : Update({
          table: "users",
          where: {
            id: { _in: [record.id] },
          },
          object: {
            deleted_at: null,
          },
        })
          .then((res) => {
            if (!res || res.error) {
              messageApi.open({
                type: "error",
                content: res.error
                  ? res.error
                  : "Có lỗi xảy ra vụi lòng thử lại sau",
              });
            } else {
              messageApi.open({
                type: "success",
                content: "Bỏ chặn người dùng thành công",
              });
            }
            setLoading(false);
          })
          .catch((err) => {
            messageApi.open({
              type: "error",
              content: err,
            });
            setLoading(false);
          });
  };

  //functions to hook

  //functions to render
  const renderFilterDate = (
    setSelectedKeys?: any,
    selectedKeys?: any,
    confirm?: any,
    clearFilters?: any,
    close?: any
  ) => {
    return (
      <div style={{ padding: "10px" }} onKeyDown={(e) => e.stopPropagation()}>
        <DatePicker.RangePicker
          showTime
          onChange={(value: any) => {
            setFilterDate(value);
          }}
          placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
          value={filterDate}
        />
        <Button
          onClick={() => {
            filterDate && filterDate.length == 2
              ? setOnFilter([
                  moment(filterDate[0]?.$d).format().replace("+07:00", "Z"),
                  moment(filterDate[1]?.$d).format().replace("+07:00", "Z"),
                  ,
                ])
              : setOnFilter(null);
          }}
          style={{ margin: "0 0 0 10px" }}
        >
          Lọc
        </Button>
        <Button
          onClick={() => {
            setOnFilter(null);
            setFilterDate(null);
          }}
          style={{ margin: "0 0 0 10px" }}
        >
          Xóa
        </Button>
      </div>
    );
  };
  //MAIN RENDER
  return (
    <>
      {contextHolder}
      <Spin fullscreen spinning={loading} />
      <Table {...table} />
    </>
  );
};

export default Users;
