import React from "react";
import { Icon, Table, useAuthContext } from "@/stories";
import moment from "moment";
import permissionsCheck from "@/utils/permission";

const Stores = () => {
  //define constants
  const { userData } = useAuthContext();

  //functions to create

  //configs
  const table = {
    dataSource: {
      table: "stores",
      isBackendData: true,
      data: [],
      where: { deleted_at: { _eq: null } },
    },
    config: {
      tableInformation: {
        title: "TẤT CẢ ĐIỂM GIAO DỊCH",
        description: "TẤT CẢ ĐIỂM GIAO DỊCH ĐÃ TẠO",
        noData: "CHƯA ĐIỂM GIAO DỊCH NÀO ĐƯỢC TẠO",
        callToActions: [
          {
            children: "Thêm điểm giao dịch",
            icon: "PlusCircle",
            href: "/cms_ams/them-diem-giao-dich",
            disabled: permissionsCheck(
              "cms_ams/stores/2",
              userData?.permission
            ),
          },
        ],
      },
      tableDisplay: {
        columns: [
          {
            title: "",
            dataIndex: "id",
            ellipsis: true,
            render: (col: any, record: any, index: number) => index + 1,
            width: 70,
          },
          {
            title: "Tên phòng giao dịch",
            dataIndex: "name",
            ellipsis: true,
          },
          {
            title: "Địa chỉ",
            dataIndex: "ext",
            ellipsis: true,
            render: (el: any) => (el?.address ? el?.address : ""),
          },
          {
            title: "Hiển thị",
            dataIndex: "publish",
            ellipsis: true,
            render: (el: boolean | null) => (
              <Icon
                style={{ color: el ? "green" : "red" }}
                component={el ? "CheckCircle" : "DashCircle"}
              />
            ),
            width: 150,
          },
          {
            title: "Ngày tạo",
            dataIndex: "created_at",
            prefixQuery: "stores",
            ellipsis: true,
            render: (val: any) => {
              const convert = moment(val).format();
              return `${convert.split("T")[0]} ${convert.split("T")[1]}`;
            },
            width: 250,
          },
        ],
        rowActions: [
          {
            title: "XÓA",
            icon: "Trash",
            actionType: "DELETE",
            tableName: "stores",
            disabled: permissionsCheck(
              "cms_ams/stores/4",
              userData?.permission
            ),
          },
          {
            title: "HIỂN THỊ",
            icon: "Eye",
            actionType: "PUBLISH",
            tableName: "stores",
            disabled: permissionsCheck(
              "cms_ams/stores/3",
              userData?.permission
            ),
          },
          {
            title: "CHỈNH SỬA",
            icon: "Pencil",
            actionType: "EDIT",
            tableName: "stores",
            onActionTrigger: (record: any) => {
              window.location.href = `/cms_ams/them-diem-giao-dich?update=${record[0].id}`;
            },
            disabled: permissionsCheck(
              "cms_ams/stores/3",
              userData?.permission
            ),
          },
        ],
      },
      tableOptions: {
        tableActions: [],
        search: {
          title: "Tìm điểm giao dịch",
          enable: true,
          placeholder: "Tìm điểm giao dịch",
          onChange: (value: any) => {},
          fields: ["name"],
          showSizeChanger: true,
        },
        paging: {
          enable: true,
          pagingType: "PAGING / LAZZYLAOD",
        },
        filter: {},
      },
    },
  };

  //functions to handle actions

  //function to hook

  //functions to render

  //MAIN RENDER
  return <Table {...table} />;
};

export default Stores;
