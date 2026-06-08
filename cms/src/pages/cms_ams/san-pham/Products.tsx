import React from "react";
import { Icon, Table, useAuthContext } from "@/stories";
import moment from "moment";
import permissionsCheck from "@/utils/permission";

const Products = () => {
  //define constants
  const { userData } = useAuthContext();

  //functions to create

  //configs
  const table = {
    dataSource: {
      table: "products",
      isBackendData: true,
      data: [],
      where: { deleted_at: { _eq: null } },
    },
    config: {
      tableInformation: {
        title: "TẤT CẢ SẢN PHẨM",
        description: "TẤT CẢ SẢN PHẨM ĐÃ TẠO",
        noData: "CHƯA SẢN PHẨM NÀO ĐƯỢC TẠO",
        callToActions: [
          {
            children: "Thêm sản phẩm",
            icon: "PlusCircle",
            href: "/cms_ams/them-san-pham",
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
            title: "MSP",
            dataIndex: "sku",
            ellipsis: true,
          },
          {
            title: "Tên sản phẩm",
            dataIndex: "name",
            ellipsis: true,
          },
          {
            title: "Giá gia công (VNĐ)",
            dataIndex: "price",
          },
          {
            title: "Khối lượng sản phẩm (chỉ)",
            dataIndex: "weight",
          },
          {
            title: "Trạng thái hiển thị",
            dataIndex: "publish",
          },
          {
            title: "Ngày tạo",
            dataIndex: "created_at",
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
            tableName: "products",
            disabled: permissionsCheck(
              "cms_ams/stores/4",
              userData?.permission
            ),
          },
          {
            title: "HIỂN THỊ",
            icon: "Eye",
            actionType: "PUBLISH",
            tableName: "products",
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
              window.location.href = `/cms_ams/them-san-pham?update=${record[0].id}`;
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

export default Products;
