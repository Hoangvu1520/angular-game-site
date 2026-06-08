import React, { useState } from "react";
import { Table, useAuthContext } from "@/stories";
import permissionsCheck from "@/utils/permission";


const Roles = () => {
  //define constants
  const { userData } = useAuthContext()

  //functions to create

  //configs
  const table = {
    dataSource: {
      table: "roles",
      isBackendData: true,
      data: [],
    },
    config: {
      tableInformation: {
        title: "TẤT CẢ VAI TRÒ",
        description: "TẤT CẢ VAI TRÒ NGƯỜI DÙNG ĐÃ ĐƯỢC TẠO",
        noData: "CHƯA CÓ VAI TRÒ ĐƯỢC TẠO",
        callToActions: [{
          children: "Tạo quyền truy cập",
          icon: "PlusCircle",
          href: "/cms_ums/tao-quyen-truy-cap",
          disabled: permissionsCheck("cms_ums/roles/2", userData?.permission)
        },]
      },
      tableDisplay: {
        columns: [
          {
            title: "",
            dataIndex: "id",
            hidden: true,
            ellipsis: true,
            render: (col: any, record: any, index: number) =>
              index + 1,
            width: 70,
          },
          {
            title: "Tên vai trò",
            dataIndex: "title",
            ellipsis: true,
          },
          {
            title: "",
            dataIndex: "name",
            ellipsis: true,
            hidden: true
          },
          {
            title: "Ngày khởi tạo",
            dataIndex: "created_at",
            ellipsis: true,
          },
        ],
        rowActions: [
          {
            title: "XÓA",
            icon: "Trash",
            description: "XÓA",
            actionType: "DELETE",
            tableName: "roles",
            disabled: permissionsCheck("cms_ums/roles/4", userData?.permission)
          },
          {
            title: "CHỈNH SỬA",
            icon: "Pencil",
            description: "CHỈNH SỬA",
            actionType: "PUBLISH",
            onActionTrigger: (record: any) => {
              window.location.href = `/cms_ums/tao-quyen-truy-cap?update=${record[0].id}`;
            },
            tableName: "roles",
            disabled: permissionsCheck("cms_ums/roles/3", userData?.permission)
          },
        ],
      },
      tableOptions: {
        tableActions: [
          {
            title: "XÓA",
            icon: "Trash",
            description: "XÓA",
            actionType: "DELETE",
            tableName: "roles",
            disabled: permissionsCheck("cms_ums/roles/4", userData?.permission)
          },
        ],
        search: {
          title: "Tìm kiếm vai trò",
          enable: true,
          placeholder: "Tìm kiếm đơn hàng",
          onChange: (value: any) => {
          },
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

export default Roles;
