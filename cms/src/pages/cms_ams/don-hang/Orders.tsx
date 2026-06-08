import React, { Key, useState } from "react";
import {
  Table,
  Message,
  useAuthContext,
  Modal,
  Collapse,
  exportExcel,
  DatePicker,
} from "@/stories";
import { GetAll } from "@/stories/services";
import moment from "moment";
import { Button, Select } from "antd";
import { stat } from "fs";
import { set } from "lodash";
import httpHandler from "@/stories/services/apiConfig";

const Orders = () => {
  //define constants
  const [messageApi, contextHolder] = Message.useMessage();
  const [filter, setFilter] = useState({
    state: [true, false, null],
    type: [1, 2, 3],
    process: [null, 1, 2, 3],
    message: ["Mua vàng", "Bán vàng", "Rút vàng", "Hoàn tiền"],
  });
  const [loading, setLoading] = useState(false);
  const [transation, setTransation] = useState<any>({ state: false, data: null });
  const templateTransation: any = {
    user_name: "Tên",
    email: "Email",
    state: "Trạng thái",
  };
  const [filterDate, setFilterDate] = useState<any>();
  const [onFilter, setOnFilter] = useState<any>();

  const selectOptions: { label: string; value: null | boolean }[] = [
    { label: "Chờ xác thực", value: null },
    { label: "Đã xác thực", value: true },
    { label: "Đã hủy", value: false },
  ]
  //functions to create

  //configs
  const getDataToExport = async () => {
    const res = await GetAll({
      table: "payment_accumulates",
      fields: [
        "accumulates.index",
        "users.user_name",
        "users.email",
        "users.phone",
        "accumulates.price",
        "accumulates.cost",
        "accumulates.quantity",
        "accumulates.type",
        "accumulates.state",
        "profiles.process",
        "payment_accumulates.gold",
        "payment_accumulates.message",
        "payment_accumulates.created_at",
      ],
      join: [
        {
          table: "accumulates",
          foreign: ["accumulates.id", "payment_accumulates.accumulate_id"],
        },
        {
          table: "users",
          foreign: ["users.id", "accumulates.user_id"],
        },
        {
          table: "profiles",
          foreign: ["users.id", "profiles.user_id"],
          type: "left",
        },
      ],
      where: {
        "payment_accumulates.created_at":
          onFilter && onFilter.length > 0
            ? {
              _gt: onFilter[0],
              _lt: onFilter[1],
            }
            : {},
        "accumulates.state": {
          _in:
            filter?.state && filter.state.length > 0
              ? filter.state
              : [true, false, null],
        },
        "accumulates.type": {
          _in: filter?.type && filter.type.length > 0 ? filter.type : [1, 2, 3],
        },
        "accumulates.deleted_at": {
          _eq: null,
        },
        "profiles.process": {
          _in:
            filter?.process && filter?.process.length > 0
              ? filter.process
              : [null, 1, 2, 3],
        },
        "payment_accumulates.message": {
          _in:
            filter?.message && filter?.message.length > 0
              ? filter.message
              : ["Mua vàng", "Bán vàng", "Rút vàng", "Hoàn tiền"],
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
      return res.payment_accumulates.map((item: any) => ({
        ...item,
        type:
          item.type == 1
            ? "Mua vàng"
            : item.type == 2
              ? "Bán vàng"
              : "Rút vàng",
        state:
          item.state === null
            ? "Đang xử lý"
            : item.state
              ? "Đã thanh toán"
              : "Chưa thanh toán",
        index: `DH${item.index}`,
        created_at: `${moment(item.created_at).utc().format().split("T")[0]} ${moment(item.created_at).utc().format().split("T")[1].split("Z")[0]
          }`,
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
    loading: loading,
    dataSource: {
      table: "payment_accumulates",
      isBackendData: true,
      where: {
        "payment_accumulates.created_at":
          onFilter && onFilter.length > 0
            ? {
              _gt: onFilter[0],
              _lt: onFilter[1],
            }
            : {},
        "accumulates.deleted_at": {
          _eq: null,
        },
        "accumulates.state": {
          _in:
            filter?.state && filter.state.length > 0
              ? filter.state
              : [true, false, null],
        },
        "accumulates.type": {
          _in: filter?.type && filter.type.length > 0 ? filter.type : [1, 2, 3],
        },
        "profiles.process": {
          _in:
            filter?.process && filter?.process.length > 0
              ? filter.process
              : [null, 1, 2, 3],
        },
        "payment_accumulates.message": {
          _in:
            filter?.message && filter?.message.length > 0
              ? filter.message
              : ["Mua vàng", "Bán vàng", "Rút vàng", "Hoàn tiền"],
        },
      },
      join: [
        {
          table: "accumulates",
          foreign: ["accumulates.id", "payment_accumulates.accumulate_id"],
        },
        {
          table: "users",
          foreign: ["users.id", "accumulates.user_id"],
        },
        {
          table: "profiles",
          foreign: ["users.id", "profiles.user_id"],
          type: "left",
        },
      ],
    },
    config: {
      tableInformation: {
        title: "TẤT CẢ GIAO DỊCH VÀNG",
        description: "TẤT CẢ GIAO DỊCH VÀNG ĐÃ ĐƯỢC TẠO",
        noData: "CHƯA CÓ GIAO DỊCH VÀNG ĐƯỢC TẠO",
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
            prefixQuery: "accumulates",
            hidden: true,
          },
          {
            title: "",
            dataIndex: "accumulate_id",
            prefixQuery: "payment_accumulates",
            hidden: true,
          },
          {
            title: "",
            dataIndex: "user_id",
            prefixQuery: "payment_accumulates",
            hidden: true,
          },
          {
            title: "STT",
            dataIndex: "index",
            prefixQuery: "accumulates",
            width: 70,
          },

          {
            title: "MGD",
            dataIndex: "order_code",
            prefixQuery: "accumulates",
            width: 100,
          },
          {
            title: "Tên",
            dataIndex: "user_name",
            prefixQuery: "users",
            ellipsis: true,
            render: (a: any) => <a>{a}</a>,
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
          {
            title: "Loại",
            dataIndex: "type",
            prefixQuery: "accumulates",
            ellipsis: true,
            render: (a: any) =>
              a == 1 ? (
                <p>Mua vàng</p>
              ) : a == 2 ? (
                <p>Bán vàng</p>
              ) : (
                <p>Rút vàng</p>
              ),
            filters: [
              {
                value: 1,
                text: "Mua vàng",
              },
              {
                value: 2,
                text: "Bán vàng",
              },
              {
                value: 3,
                text: "Rút vàng",
              },
            ],
          },
          {
            title: "Số lượng",
            dataIndex: "quantity",
            prefixQuery: "accumulates",
            render: (a: any) => parseFloat(a)?.toLocaleString() + " chỉ",
          },
          {
            title: "Tổng tiền",
            dataIndex: "price",
            prefixQuery: "accumulates",
            render: (a: any) =>
              (typeof a == "string"
                ? parseInt(a)?.toLocaleString()
                : a?.toLocaleString()) + " VNĐ",
          },
          {
            title: "Đơn giá",
            dataIndex: "cost",
            prefixQuery: "accumulates",
            render: (a: any) =>
              (typeof a == "string"
                ? parseInt(a)?.toLocaleString()
                : a?.toLocaleString()) + " VNĐ",
          },
          {
            title: "Số dư vàng luỹ kế",
            dataIndex: "gold",
            prefixQuery: "payment_accumulates",
            render: (a: any) => parseFloat(a)?.toLocaleString() + " chỉ",
          },
          {
            title: "Ghi chú",
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
                text: "Hoàn tiền",
                value: "Hoàn tiền",
              },
            ],
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
            title: "Tình trạng",
            dataIndex: "state",
            prefixQuery: "accumulates",
            ellipsis: true,
            render: (a: any) =>
              a === null ? (
                <p style={{ color: "blue" }}>Đang xử lý</p>
              ) : a ? (
                <p style={{ color: "green" }}>Đã thanh toán</p>
              ) : (
                <p style={{ color: "red" }}>Đã hủy</p>
              ),
            filters: [
              {
                value: true,
                text: "Đã thanh toán",
              },
              {
                value: false,
                text: "Đã hủy",
              },
              {
                value: null,
                text: "Đang xử lý",
              },
            ],
          },
          {
            title: "Ngày tạo",
            dataIndex: "created_at",
            prefixQuery: "payment_accumulates",
            ellipsis: true,
            render: (val: any) => {
              const convert = moment(val).utc().format();
              return `${convert.split("T")[0]} ${convert.split("T")[1].split("Z")[0]
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
            title: "Duyệt đơn",
            icon: "Activity",
            description: "Duyệt đơn hàng này",
            onActionTrigger: (record: any) => {
              // setTransation(
              //   record[0].extend?.transation
              //     ? { state: true, data: record[0].extend?.transation }
              //     : { state: true, data: [] }
              // );
              setTransation({ state: true, data: [record[0]] }
              );
            },
          },
        ],
      },
      tableOptions: {
        tableActions: [],
        search: {
          title: "Tìm kiếm giao dịch vàng",
          enable: true,
          placeholder: "Tìm kiếm giao dịch vàng",
          fields: [
            "users.user_name",
            "users.phone",
            "order_code",
            "users.email",
          ],
          showSizeChanger: true,
        },
        paging: {
          enable: true,
          pagingType: "PAGING / LAZZYLAOD",
        },
        filter:
          onFilter && onFilter.length > 0 ? [filter, ...onFilter] : filter,
        onChange: (pagination: any, filter: any) => {
          setFilter(filter);
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
            index: "Mã đơn hàng",
            user_name: "Tên",
            email: "Email",
            phone: "Số điện thoại",
            type: "Loại yêu cầu",
            quantity: "Số lượng",
            cost: "Đơn giá",
            price: "Tổng tiền",
            gold: "Số dư vàng luỹ kế",
            process: "Trạng thái KYC",
            message: "Ghi chú",
            state: "Tình trạng",
            created_at: "Ngày tạo",
          },
        },
      ],
    });
  };
  // const updateStateOrder = (id: string, value: string, extend: any) => {};

  const handleCloseModal = () => {
    setTransation({ state: false, data: [] });
  };

  const handleChangeState = (value: null | boolean, id: string, userId: string, refundGold: number, accumulateType: 1 | 2 | 3) => {
    httpHandler("/accumulate/state", {
      accumulateId: id,
      state: value,
      userId: userId,
      refundGold: refundGold,
      type: accumulateType,
    }).then((res) => {
      if (res && !res.error) {
        messageApi.open({ type: "success", content: `Cập nhật tình trạng đơn hàng thành công` });
      } else {
        messageApi.open({ type: "error", content: `Cập nhật tình trạng đơn hàng thất bại` });
      }
    });
    setTransation({ ...transation, data: transation.data.map((item: any) => item.id == id ? { ...item, state: value } : item) });
  }
  //functions to hook

  //functions to render
  const renderTransation = (data: any) => {
    return (
      <div>
        {Object.keys(templateTransation).map((item: string) => {
          if (item == "state") {
            return (<div><span>Tình trạng: </span><Select disabled={data.state == false} onChange={(value) => handleChangeState(value, data.accumulate_id, data.user_id, data.quantity, data.type)} value={data.state} options={selectOptions} /></div>)
          } else {
            return (
              <p>
                {templateTransation[item]}: {data[item]}
              </p>
            );
          }

        })}
      </div>
    );
  };
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
      <Table {...table} />;
      <Modal
        open={transation.state}
        onCancel={() => {
          handleCloseModal();
        }}
        footer={false}
        style={{ overflowY: "auto", maxHeight: "70vh" }}
        title={"Duyệt đơn hàng này"}
      >
        {transation.data && transation.data.length > 0 ? (
          <Collapse
            accordion
            items={transation.data.map((item: any, key: Key) => ({
              key: key,
              label: `${item?.state ? "Đã xử lý" : item?.state == null ? "Đang xử lý" : "Đã hủy"} - ${new Date(item.created_at).toLocaleString("vi-VN")}`,
              children: renderTransation(item),
            }))}
          />
        ) : (
          "Chưa có hành động nào thực hiện với đơn hàng này"
        )}
      </Modal>
    </>
  );
};

export default Orders;
