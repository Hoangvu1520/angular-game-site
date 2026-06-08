import React, { useState } from "react";
import {
  Select,
  Table,
  Message,
  useAuthContext,
  exportExcel,
  Button,
} from "@/stories";
import { apiConfig, GetAll } from "@/stories/services";
import moment from "moment";
import { Collapse, DatePicker, Modal } from "antd";
import permissionsCheck from "@/utils/permission";

const Orders = () => {
  //define constants
  const [messageApi, contextHolder] = Message.useMessage();
  const [filter, setFilter] = useState([null, false, true]);
  const [loading, setLoading] = useState(false);
  const [paging, setPaging] = useState({
    page: 0,
    defaultSizePage: 10,
  });
  const { userData, refreshData } = useAuthContext();
  const [transation, setTransation] = useState({ state: false, data: [] });
  const templateTransation: any = {
    user_name: "Tên",
    email: "Email",
    state: "Trạng thái",
    time: "Thời gian thực hiện",
  };

  const templateFilter = [
    {
      text: "Huỷ nhận vàng",
      value: false,
    },
    {
      text: "Hẹn giao vàng",
      value: null,
    },
    {
      text: "Đã giao vàng",
      value: true,
    },
  ];
  const [filterDate, setFilterDate] = useState<any>();
  const [onFilter, setOnFilter] = useState<any>();
  //functions to create

  //configs
  const getDataToExport = async () => {
    const res = await GetAll({
      table: "accumulates",
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
        "accumulates.created_at",
        "accumulates.ext",
      ],
      join: [
        {
          table: "users",
          foreign: ["users.id", "accumulates.user_id"],
        },
      ],
      where: {
        type: {
          _eq: 3,
        },
        state: {
          _in: filter && filter.length > 0 ? filter : [null, false, true],
        },
        "accumulates.deleted_at": {
          _eq: null,
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
    if (res && res?.accumulates.length > 0) {
      return res.accumulates.map((item: any) => {
        const val = item.ext;
        var convert = moment(val?.schedule?.date).utc();
        val?.extSchedule &&
          val.extSchedule.length > 0 &&
          val.extSchedule.map((item: any) => {
            if (item.day && item.day > 0) {
              convert = convert.add(item.day, "d");
            }
          });
        return {
          ...item,
          quantity: item.extend?.quantity
            ? item.extend.quantity
            : item.quantity,
          location: val?.schedule?.address ? val.schedule.address : "",
          scheduler: `${convert.format().split("T")[0]}`,
          state:
            item.state === null
              ? "Hẹn giao vàng"
              : item.state
              ? "Đã giao vàng"
              : "Huỷ nhận vàng",
          index: `DH${item.index}`,
          created_at: `${
            moment(item.created_at).utc().format().split("T")[0]
          } ${
            moment(item.created_at).utc().format().split("T")[1].split("Z")[0]
          }`,
        };
      });
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
      table: "accumulates",
      isBackendData: true,
      where: {
        "accumulates.created_at":
          onFilter && onFilter.length > 0
            ? {
                _gt: onFilter[0],
                _lt: onFilter[1],
              }
            : {},
        type: {
          _eq: 3,
        },
        state: {
          _in: filter && filter.length > 0 ? filter : [null, false, true],
        },
        "accumulates.deleted_at": {
          _eq: null,
        },
      },
      join: [
        {
          table: "users",
          foreign: ["users.id", "accumulates.user_id"],
        },
      ],
    },
    config: {
      tableInformation: {
        title: "RÚT VÀNG",
        description: "TẤT CẢ ĐƠN HÀNG ĐÃ ĐƯỢC TẠO",
        noData: "CHƯA CÓ ĐƠN HÀNG ĐƯỢC TẠO",
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
            title: "MGD",
            dataIndex: "index",
            prefixQuery: "accumulates",
            // hidden: true,
            ellipsis: true,
            render: (col: any, record: any, index: number) => `DH${col}`,
            width: 75,
          },
          {
            title: "",
            dataIndex: "id",
            prefixQuery: "accumulates",
            hidden: true,
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
            width: 120,
          },
          {
            title: "Số lượng",
            dataIndex: "quantity",
            prefixQuery: "accumulates",
            render: (val: any, record: any) =>
              (record.extend?.quantity
                ? record.extend.quantity
                : record.quantity) + " chỉ",
          },
          {
            title: "Đơn giá",
            dataIndex: "cost",
            prefixQuery: "accumulates",
            render: (val: any) =>
              parseInt(val).toLocaleString("en-US") + " VNĐ",
          },
          {
            title: "Tổng phí gia công",
            dataIndex: "price",
            prefixQuery: "accumulates",
            ellipsis: true,
            render: (val: any) =>
              parseInt(val).toLocaleString("en-US") + " VNĐ",
          },

          {
            title: "Điểm hẹn",
            dataIndex: "ext",
            prefixQuery: "accumulates",
            render: (val: any) =>
              val?.schedule?.address ? val.schedule.address : "",
          },
          {
            title: "Ngày hẹn",
            dataIndex: "ext",
            prefixQuery: "accumulates",
            ellipsis: true,
            render: (val: any) => {
              var convert = moment(val?.schedule?.date).utc();
              val?.extSchedule &&
                val.extSchedule.length > 0 &&
                val.extSchedule.map((item: any) => {
                  if (item.day && item.day > 0) {
                    convert = convert.add(item.day, "d");
                  }
                });

              return `${convert.format().split("T")[0]}`;
            },
          },
          {
            title: "Ngày đặt",
            dataIndex: "created_at",
            prefixQuery: "accumulates",
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
          {
            title: "Tình trạng",
            dataIndex: "state",
            prefixQuery: "accumulates",
            render: (value: string, record: any) => {
              return (
                <Select
                  options={[
                    {
                      label: "Huỷ nhận vàng",
                      value: false,
                    },
                    {
                      label: "Hẹn giao vàng",
                      value: null,
                    },
                    {
                      label: "Đã giao vàng",
                      value: true,
                    },
                  ]}
                  value={value}
                  onChange={(value: string) =>
                    confirm("Xác nhận thay đổi trạng thái đơn hàng này") &&
                    updateStateOrder(record.id, value, record.ext)
                  }
                  disabled={permissionsCheck(
                    "cms_ams/orders/3-2",
                    userData?.permission
                  )}
                />
              );
            },
            filters: templateFilter,
          },
        ],
        rowActions: [
          {
            title: "Lịch sử duyệt đơn",
            icon: "Activity",
            description: "Lịch sử duyệt đơn",
            onActionTrigger: (record: any) => {
              console.log(record[0].ext);
              setTransation(
                record[0].ext?.transation
                  ? { state: true, data: record[0].ext?.transation }
                  : { state: true, data: [] }
              );
            },
          },
        ],
      },
      tableOptions: {
        tableActions: [],
        search: {
          title: "Tìm kiếm đơn hàng",
          enable: true,
          placeholder: "Tìm kiếm đơn hàng",
          fields: [
            "users.user_name",
            "users.email",
            "users.phone",
            "accumulates.index",
          ],
          showSizeChanger: true,
        },
        paging: {
          enable: true,
          pagingType: "PAGING / LAZZYLAOD",
          onChange: (value: any) => {
            setPaging(value);
          },
        },
        filter: [filter, onFilter, refreshData],
        onChange: (pagination: any, filter: any) => {
          setFilter(filter.state);
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
            quantity: "Số lượng",
            cost: "Đơn giá",
            price: "Tổng phí gia công",
            created_at: "Ngày tạo",
            scheduler: "Ngày hẹn",
            location: "Địa điểm hẹn",
            state: "Tình trạng",
          },
        },
      ],
    });
  };
  const updateStateOrder = async (id: string, value: string, extend: any) => {
    const userTransation = {
      user_name: userData.user_name,
      email: userData.email,
      state: value,
      time: Date(),
    };
    setLoading(true);
    await apiConfig("/cms-accumulate/schedule-requests", {
      id: id,
      value: value,
      log: userTransation,
    })
      .then(async (res) => {
        if (res?.result) {
          messageApi.open({
            type: "success",
            content: "Chuyển trạng thái đơn hàng thành công",
          });
        } else {
          messageApi.open({
            type: "error",
            content: "Chuyển trạng thái đơn hàng thất bại",
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        messageApi.open({
          type: "error",
          content: "Chuyển trạng thái đơn hàng thất bại",
        });
      });
  };
  const handleCloseModal = () => {
    setTransation({ state: false, data: [] });
  };
  //functions to hook

  //functions to render
  const renderTransation = (data: any) => {
    return (
      <div>
        {Object.keys(templateTransation).map((item: string) => {
          return (
            <p>
              {templateTransation[item]}:{" "}
              {item == "state"
                ? templateFilter.find((ie: any) => ie.value == data[item])?.text
                : data[item]}
            </p>
          );
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
      {contextHolder} <Table {...table} />
      <Modal
        open={transation.state}
        onCancel={() => {
          handleCloseModal();
        }}
        footer={false}
        style={{ overflowY: "auto", maxHeight: "70vh" }}
        title={"Lịch sử duyệt đơn"}
      >
        {transation.data && transation.data.length > 0 ? (
          <Collapse
            accordion
            items={transation.data.map((item: any, key) => ({
              key: key,
              label: `${
                templateFilter.find((ie: any) => ie.value == item?.state)?.text
              } - ${item?.time}`,
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
