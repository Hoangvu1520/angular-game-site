import React, { useState } from "react";
import { Icon, Table, TableProps, useAuthContext } from "@/stories";
import permissionsCheck from "@/utils/permission";

const AllPosts = () => {
  //define constants
  const [filter, setFilter] = useState([1, 2, 3]);
  const [paging, setPaging] = useState({
    page: 0,
    defaultSizePage: 10,
  });
  const { userData } = useAuthContext();
  //config
  const table: TableProps = {
    dataSource: {
      table: "blogs",
      isBackendData: true,
      data: [],
      join: [
        {
          table: "users",
          foreign: ["users.id", "blogs.author_id"],
        },
      ],
    },
    config: {
      tableInformation: {
        title: "Tất cả bài viết",
        descriptions: "Tất cả bài viết đã được tạo",
        noData: "Không có bài viết nào được tạo",
        callToActions: [
          {
            children: "Tạo bài viết mới",
            icon: "Plus",
            href: `/cms_blog/tao-bai-viet-moi`,
          },
        ],
      },
      tableDisplay: {
        columns: [
          {
            title: "",
            dataIndex: "id",
            hidden: true,
            ellipsis: true,
            render: (col: any, record: any, index: number) => index + 1,
            prefixQuery: "blogs",
            width: 70,
          },
          {
            title: "Tiêu đề",
            dataIndex: "title",
            ellipsis: true,
            prefixQuery: "blogs",
          },
          {
            title: "Phụ đề",
            dataIndex: "sub_title",
            ellipsis: true,
            prefixQuery: "blogs",
          },
          {
            title: "Lượt xem",
            dataIndex: "views",
            ellipsis: true,
            render: (row: any) => (row ? row.toLocaleString("en-US") : 0),
            prefixQuery: "blogs",
            width: 100,
          },
          {
            title: "Ngày tạo",
            dataIndex: "created_at",
            ellipsis: true,
            prefixQuery: "blogs",
          },
          {
            dataIndex: "user_name",
            ellipsis: true,
            hidden: true,
            prefixQuery: "users",
          },
          {
            title: "Tác giả",
            dataIndex: "email",
            ellipsis: true,
            prefixQuery: "users",
            render: (row: any, record: any) => `${record.user_name} / ${row}`,
          },
          {
            title: "Công khai",
            dataIndex: "publish",
            ellipsis: true,
            render: (el: boolean | null) => (
              <Icon
                style={{ color: el ? "green" : "red" }}
                component={el ? "CheckCircle" : "DashCircle"}
              />
            ),
            width: 100,
          },
        ],
        rowActions: [
          {
            title: "Công khai",
            icon: "CheckCircle",
            description: "",
            actionType: "PUBLISH",
            tableName: "blogs",
            disabled: permissionsCheck(
              "cms_blog/blogs/3",
              userData?.permission
            ),
          },
          {
            title: "Chỉnh sửa",
            icon: "Pencil",
            description: "Chỉnh sửa",
            actionType: "EDIT",
            onActionTrigger: (rows: any) => {
              window.location.href = `/cms_blog/tao-bai-viet-moi?update=${rows[0].id}`;
            },
            disabled: permissionsCheck(
              "cms_blog/blogs/3",
              userData?.permission
            ),
          },
          {
            title: "Xóa ",
            icon: "Trash",
            description: "Xóa",
            actionType: "DELETE",
            tableName: "blogs",
            disabled: permissionsCheck(
              "cms_blog/blogs/4",
              userData?.permission
            ),
          },
        ],
      },
      tableOptions: {
        tableActions: [
          {
            title: "Xóa bài viết",
            icon: "Trash",
            descriptions: "Xóa bài viết",
            actionsType: "DELETE",
            tableName: "blogs",
          },
        ],
        search: {
          title: "Tìm kiếm bài viết",
          enable: true,
          placeholder: "Tìm kiếm bài viết",
          fields: ["blogs.title", "blogs.sub_title"],
          showSizeChanger: true,
        },
        paging: {
          enable: true,
          pagingType: "PAGING / LAZZYLAOD",
          onChange: (value: any) => {
            setPaging(value);
          },
        },
        filter: filter,
        onChange: (pagination: any, filter: any) => {
          setFilter(filter.state);
        },
      },
    },
  };

  //functions to create

  //functions to handle actions

  //functions to useEffect

  //functions to render

  //MAIN RENDER
  return (
    <div>
      <Table {...table} />
    </div>
  );
};

export default AllPosts;
