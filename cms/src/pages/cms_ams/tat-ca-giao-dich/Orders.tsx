import React, { useState } from "react";
import { Button, DatePicker, Message, Table, exportExcel } from "@/stories";
import moment from "moment";
import { GetAll } from "@/stories/services";

const Orders = () => {
  //define constants
  const [filter, setFilter] = useState([
    "Mua vàng",
    "Bán vàng",
    "Rút vàng",
    "Nạp tiền",
    "Rút tiền",
    "Hoàn tiền",
  ]);
  const [filterDate, setFilterDate] = useState<any>();
  const [onFilter, setOnFilter] = useState<any>();
  const [messageApi, contextHolder] = Message.useMessage();
  // const [loading, setLoading] = useState(false);

  // functions to create
  const getDataToExport = async () => {
    const res = await GetAll({
      table: "payment_accumulates",
      fields: [
        "payment_accumulates.id",
        "users.user_name",
        "users.email",
        "users.phone",
        "payment_accumulates.message",
        "payment_accumulates.price",
        "accumulates.quantity",
        "payment_accumulates.created_at",
        "users.sale",
        "payment_accumulates.gold",
        "users.ext",
      ],
      join: [
        {
          table: "users",
          foreign: ["users.id", "payment_accumulates.user_id"],
        },
        {
          table: "accumulates",
          foreign: ["accumulates.id", "payment_accumulates.accumulate_id"],
          type: "left",
        },
      ],
      where: {
        message: {
          _in:
            filter && filter.length > 0
              ? filter
              : [
                  "Mua vàng",
                  "Bán vàng",
                  "Rút vàng",
                  "Nạp tiền",
                  "Rút tiền",
                  "Hoàn tiền",
                ],
        },
        "payment_accumulates.created_at":
          onFilter && onFilter.length > 0
            ? {
                _gt: onFilter[0],
                _lt: onFilter[1],
              }
            : {},
        // "payment_accumulates.deleted_at": {
        //   _eq: null,
        // },
        "payment_accumulates.state": {
          _is_null: false,
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

    if (res && res?.payment_accumulates.length > 0) {
      return res.payment_accumulates.map((item: any, key: number) => ({
        ...item,
        id: key + 1,
        created_at: `${moment(item.created_at).utc().format().split("T")[0]} ${
          moment(item.created_at).utc().format().split("T")[1].split("Z")[0]
        }`,
        address: item.ext?.address,
      }));
    } else {
      messageApi.open({
        type: "warning",
        content: `Dữ liệu bạn muốn trích xuất đang rỗng`,
      });
    }
  };

  //configs
  const table = {
    dataSource: {
      table: "payment_accumulates",
      isBackendData: true,
      where: {
        message: {
          _in:
            filter && filter.length > 0
              ? filter
              : [
                  "Mua vàng",
                  "Bán vàng",
                  "Rút vàng",
                  "Nạp tiền",
                  "Rút tiền",
                  "Hoàn tiền",
                ],
        },
        "payment_accumulates.created_at":
          onFilter && onFilter.length > 0
            ? {
                _gt: onFilter[0],
                _lt: onFilter[1],
              }
            : {},
        // "payment_accumulates.deleted_at": {
        //   _eq: null,
        // },
        "payment_accumulates.state": {
          _is_null: false,
        },
      },
      join: [
        {
          table: "users",
          foreign: ["users.id", "payment_accumulates.user_id"],
        },
        {
          table: "accumulates",
          foreign: ["accumulates.id", "payment_accumulates.accumulate_id"],
          type: "left",
        },
      ],
    },
    config: {
      tableInformation: {
        title: "TẤT CẢ GIAO DỊCH",
        description: "TẤT CẢ GIAO DỊCH ĐÃ ĐƯỢC TẠO",
        noData: "CHƯA CÓ GIAO DỊCH ĐƯỢC TẠO",
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
            prefixQuery: "payment_accumulates",
            hidden: true,
            ellipsis: true,
          },
          {
            title: "MGD",
            dataIndex: "order_code",
            prefixQuery: "accumulates",
            // hidden: true,
          },
          {
            title: "Tên",
            dataIndex: "user_name",
            prefixQuery: "users",
            ellipsis: true,
          },
          {
            title: "Email",
            dataIndex: "email",
            prefixQuery: "users",
            ellipsis: true,
          },
          {
            title: "Số điện thoại",
            dataIndex: "phone",
            prefixQuery: "users",
            ellipsis: true,
          },
          // {
          //   title: "Mã đơn hàng",
          //   dataIndex: "index",
          //   prefixQuery: "orders",
          //   ellipsis: true,
          //   render: (col: any, record: any, index: number) => `DH${col}`,
          //   width: 100,
          // },
          {
            title: "Loại giao dịch",
            dataIndex: "message",
            prefixQuery: "payment_accumulates",
            ellipsis: true,
            filters: [
              {
                text: "Mua vàng",
                value: "Mua vàng",
              },
              {
                text: "Bán vàng",
                value: "Bán vàng",
              },
              {
                text: "Rút vàng",
                value: "Rút vàng",
              },
              {
                text: "Nạp tiền",
                value: "Nạp tiền",
              },
              {
                text: "Rút tiền",
                value: "Rút tiền",
              },
              {
                text: "Hoàn tiền",
                value: "Hoàn tiền",
              },
            ],
          },
          {
            title: "Số tiền",
            dataIndex: "price",
            prefixQuery: "payment_accumulates",
            ellipsis: true,
            render: (val: any) => {
              return (
                <div
                  style={{
                    color: parseInt(val) > 0 ? "limegreen" : "red",
                    fontWeight: "700",
                  }}
                  title={`${parseInt(val).toLocaleString("en-US")}`}
                >
                  {parseInt(val).toLocaleString("en-US")}
                </div>
              );
            },
          },
          {
            title: "Khối lượng giao dịch",
            dataIndex: "quantity",
            prefixQuery: "accumulates",
            ellipsis: true,
            render: (a: any) => parseFloat(a)?.toLocaleString() + " chỉ",
          },
          {
            title: "Số dư vàng",
            dataIndex: "gold",
            prefixQuery: "payment_accumulates",
            ellipsis: true,
            render: (a: any) => parseFloat(a)?.toLocaleString() + " chỉ",
          },
          {
            title: "Trạng thái",
            dataIndex: "state",
            prefixQuery: "payment_accumulates",
            ellipsis: true,
            render: (val: any) => {
              return (
                <div
                  style={{
                    color: val === null ? "orange" : val ? "limegreen" : "red",
                    fontWeight: "700",
                  }}
                  title={
                    val === null
                      ? "Đang xử lý"
                      : val
                      ? "Thành công"
                      : "Thất bại"
                  }
                >
                  {val === null
                    ? "Đang xử lý"
                    : val
                    ? "Thành công"
                    : "Thất bại"}
                </div>
              );
            },
          },
          {
            title: "Ngày tạo",
            dataIndex: "created_at",
            prefixQuery: "payment_accumulates",
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
          // {
          //   title: "Nhân viên bán hàng",
          //   dataIndex: "sale",
          //   prefixQuery: "users",
          //   ellipsis: true,
          // },
          {
            title: "Địa chỉ",
            dataIndex: "address",
            prefixQuery: "users",
          },
        ],
        rowActions: [
          // {
          //   title: "XÓA",
          //   icon: "Trash",
          //   description: "XÓA",
          //   actionType: "SOFT_DELETE",
          //   tableName: "orders",
          // },
          // {
          //   title: "CHỈNH SỬA",
          //   icon: "Pencil",
          //   description: "CHỈNH SỬA",
          //   actionType: "PUBLISH",
          //   tableName: "orders",
          // },
        ],
      },
      tableOptions: {
        tableActions: [
          // {
          //   title: "Tất cả đơn hàng",
          //   icon: "Trash",
          //   description: "SHOPIFY_PENDING_TABLE_ACTION_DESCRIPTION_0",
          //   actionType: "SOFT_DELETE",
          //   tableName: "orders",
          // },
        ],
        search: {
          title: "Tìm kiếm giao dịch",
          enable: true,
          placeholder: "Tìm kiếm giao dịch",
          onChange: (value: any) => {},
          fields: ["users.user_name", "users.phone"],
          showSizeChanger: true,
        },
        paging: {
          enable: true,
          pagingType: "PAGING / LAZZYLAOD",
        },
        filter:
          onFilter && onFilter.length > 0 ? [...filter, ...onFilter] : filter,
        onChange: (pagination: any, filter: any) => {
          setFilter(filter.message);
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
            id: "STT",
            user_name: "Tên",
            email: "Email",
            phone: "Số điện thoại",
            message: "Loại giao dịch",
            price: "Số tiền giao dịch",
            quantity: "Khối lượng giao dịch",
            gold: "Số vàng",
            created_at: "Thời gian",
            sale: "Nhân viên bán hàng",
            address: "Địa chỉ",
          },
        },
      ],
    });
  };

  //functions to hook

  //functions to render
  const renderFilterDate = (
    setSelectedKeys: any,
    selectedKeys: any,
    confirm: any,
    clearFilters: any,
    close: any
  ) => {
    return (
      <div style={{ padding: "10px" }} onKeyDown={(e) => e.stopPropagation()}>
        <DatePicker.RangePicker
          showTime
          onChange={(value: any) => {
            setFilterDate(value);
          }}
          placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
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
      </div>
    );
  };
  //MAIN RENDER
  return (
    <>
      {contextHolder}
      <Table {...table} />
    </>
  );
};

export default Orders;
