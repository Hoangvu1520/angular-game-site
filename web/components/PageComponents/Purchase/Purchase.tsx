import React, { Key, ReactNode, useEffect, useState } from "react";
import styles from "./Purchase.module.scss";
import { exportExcel, Input, Select } from "../..";
import moment from "moment";

interface onClick {
  download?: () => void;
  contract?: () => void;
  schedule?: () => void;
}
interface data {
  index: string;
  created_at: string;
  quantity: string;
  price: string;
  cost: string;
  state: string;
  onClick?: onClick;
}
export type PurchaseProps = {
  data?: data[];
};
const conditionFilter = (data: data[] | [], filter: any) => {
  var result = data;
  const condition = (type: string, data: data[]) => {
    switch (type) {
      case "index":
        return data.filter(
          (el) =>
            !filter[type] ||
            el.index
              .toString()
              .includes(
                filter[type].toUpperCase().replaceAll("DH", "")
              )
        );
      case "state":
        return data.filter(
          (el) => !filter[type] || filter[type] == el.state
        );
      case "date":
        return data.filter(
          (el) =>
            !filter.date.start ||
            !filter.date.end ||
            (new Date(filter.date.start) < new Date(el.created_at) &&
              new Date(el.created_at) < new Date(filter.date.end))
        );
      default:
        return data;
    }
  };
  Object.keys(filter).map((item) => {
    result = condition(item, result);
  });
  return result;
};
const Purchase = (PurchaseProps: PurchaseProps) => {
  //define constants
  const [pagination, setPagination] = useState({ page: 1, item: 10 });
  const [filter, setFilter] = useState({
    index: "",
    state: undefined,
    date: {
      start: undefined,
      end: undefined,
    },
  });
  const [onFilter, setOnFilter] = useState(filter);
  const data = conditionFilter(
    PurchaseProps.data ? PurchaseProps.data : [],
    onFilter
  );
  const column = [
    {
      title: "Mã",
      dataIndex: "index",
      render: (el: string | number) => {
        return `DH${el}`;
      },
    },
    {
      title: "Ngày đặt",
      dataIndex: "created_at",
      render: (el: string | number) => {
        return el
          ? `${moment(el).utc().format().split("T")[0]} ${moment(el).utc().format().split("T")[1].split("Z")[0]
          }`
          : "";
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Đã thanh lý / hẹn lấy",
      dataIndex: "extend",
      key: "liquid",
      render: (el: any) => {
        return (el?.liquid && el.liquid.length > 0
          ? el.liquid.reduce(
            (accumulator: number, currentValue: any) =>
              accumulator + currentValue.quantity,
            0
          )
          : 0) + (el?.oldSchedule ? el.oldSchedule.reduce(
            (accumulator: number, currentValue: any) =>
              accumulator + currentValue,
            0
          ) : 0);
      },
    },
    {
      title: "Đơn giá",
      dataIndex: "cost",
      render: (el: any) => {
        return el ? parseInt(el).toLocaleString("en-US") : "";
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "price",
      render: (el: any) => {
        return el ? parseInt(el).toLocaleString("en-US") : "";
      },
    },
    {
      title: "Tổng tiền thanh lý",
      dataIndex: "extend",
      key: "total_liquid",
      render: (val: any, record: any) => {
        return val && val?.liquid && parseInt(val.liquid.reduce((sum: any, product: any) => sum + product.price, 0)).toLocaleString(
          "en-US"
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "state",
    },
    {
      title: "Ngày hẹn lấy",
      dataIndex: "extend",
      render: (el: any, record: any) => {
        var convert = moment(el?.schedule);
        el?.extSchedule &&
          el.extSchedule.length > 0 &&
          el.extSchedule.map((ext: any) => {
            if (ext.day && ext.day > 0) {
              convert = convert.add(ext.day, "d");
            }
          });
        return record.state != "Đã thanh toán" && el?.schedule && convert
          ? `${convert.format().split("T")[0]}`
          : "";
      },
    },
  ];

  //function to create


  //function to handle actions
  const handleOnChangeFilter = (key: string, value: any) => {
    setFilter((item) => ({ ...item, [key]: value }));
  };
  const handleOnChangeFilterDate = (key: string, value: any) => {
    const date = filter.date;
    setFilter((item) => ({
      ...item,
      date: { ...date, [key]: value },
    }));
  };
  const handleOnFilter = () => {
    setOnFilter(filter);
  };
  const handleClearFilter = () => {
    setFilter({
      index: "",
      state: undefined,
      date: {
        start: undefined,
        end: undefined,
      },
    });
    setOnFilter({
      index: "",
      state: undefined,
      date: {
        start: undefined,
        end: undefined,
      },
    });
  };

  const handleExportExcel = () => {
    const exportData = data && data.length > 0 && data.map((item: any) => {
      var cvtItem = item
      column.map((col: any) => {
        cvtItem[col.key ? col.key : col.dataIndex] = col && col.render
          ? col.render(item[col.dataIndex], item)
          : item[col.dataIndex]
      })
      return cvtItem
    })
    exportExcel({
      nameFile: moment().format(),
      excel: [
        {
          data: exportData,
          headerMapping: {
            index: "Mã",
            created_at: "Ngày đặt",
            quantity: "Số lượng",
            liquid: "Đã thanh lý",
            cost: "Đơn giá",
            price: "Tổng tiền",
            total_liquid: "Tổng tiền thanh lý",
            state: "Trạng thái",
            extend: "Ngày hẹn lấy",
          },
        },
      ],
    });
  }
  //functions to hook
  useEffect(() => {
    setPagination({ page: 1, item: 10 });
  }, [onFilter]);

  //function to render
  const renderTable = (data: data[]) => {
    const start = (pagination.page - 1) * pagination.item;
    const end = start + pagination.item;
    return (
      <table className={[styles.Table].join(" ")}>
        <thead>
          <tr>
            {column.map((item, index) => (
              <th key={index} className={[styles.Cell].join(" ")}>
                {item.title}
              </th>
            ))}
            <th className={[styles.Cell].join(" ")}>
              Hợp đồng điện tử
            </th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.length > 0 &&
            data.slice(start, end).map((item: any, key: number) => {
              return (
                <tr
                  key={key}
                  className={item.deleted_at && styles.PunishContract}
                >
                  {column.map((col, index) => {
                    return (
                      <td
                        key={index}
                        className={[styles.Cell].join(" ")}
                      >
                        {col && col.render
                          ? col.render(item[col.dataIndex], item)
                          : item[col.dataIndex]}
                      </td>
                    );
                  })}

                  <td className={[styles.Cell].join(" ")}>
                    <button
                      className={styles.Button}
                      onClick={item.onClick?.download}
                    >
                      Tải hợp đồng
                    </button>
                    {["Đặt hàng"].includes(
                      item.state
                    ) && (
                        <button
                          className={styles.Button}
                          onClick={item.onClick?.getQR}
                        >
                          Thanh toán đơn đặt
                        </button>
                      )}
                    {["Đã thanh toán", "Đã xử lý 1 phần"].includes(
                      item.state
                    ) && !item.deleted_at && (
                        <button
                          className={styles.Button}
                          onClick={item.onClick?.contract}
                        >
                          Thanh lý
                        </button>
                      )}
                    {[
                      "Đã thanh toán",
                      "Hẹn giao vàng",
                      "Đã xử lý 1 phần",
                    ].includes(item.state) && !item.deleted_at && (
                        <button
                          className={styles.Button}
                          onClick={item.onClick?.schedule}
                        >
                          {item.state == "Hẹn giao vàng"
                            ? "Gia hạn"
                            : "Hẹn lấy vàng"}
                        </button>
                      )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    );
  };
  const renderPagination = (data: number) => {
    return (
      <div className={[styles.Pagination, "row-none-warp"].join(" ")}>
        {[...Array(Math.ceil(data / pagination.item)).keys()].map(
          (i, key) => {
            return (
              <div
                key={key}
                className={[
                  styles.WarpPage,
                  pagination.page == i + 1 && styles.ActivePage,
                ].join(" ")}
                onClick={() => {
                  setPagination((item) => ({ ...item, page: i + 1 }));
                }}
              >
                {i + 1}
              </div>
            );
          }
        )}
      </div>
    );
  };
  const renderFilter = () => {
    return (
      <div
        className={[styles.HeaderToolbar, "row align-center"].join(
          " "
        )}
      >
        <div className={styles.WarpTool}>
          <Input
            className={styles.InputSearch}
            placeholder="Lọc theo mã đơn hàng"
            value={filter.index}
            onChange={(value) => handleOnChangeFilter("index", value)}
          />
        </div>
        <div className={styles.WarpTool}>
          <Select
            options={[
              "Đặt hàng",
              "Đã thanh toán",
              "Chờ thanh lý",
              "Đã thanh lý",
              "Hẹn giao vàng",
              "Đã giao hàng",
            ].map((item) => ({ label: item, value: item }))}
            className={styles.SelectFilter}
            placeholder="Lọc theo trạng thái"
            value={filter.state}
            onChange={(value) =>
              handleOnChangeFilter("state", value.value)
            }
          />
        </div>
        <div className={styles.WarpTool}>
          <Input
            className={styles.InputSearch}
            value={onFilter.date.start}
            type={"date"}
            onChange={(value: any) =>
              handleOnChangeFilterDate("start", value)
            }
            placeholder={"mm/dd/yyyy"}
          />
          <Input
            className={styles.InputSearch}
            value={onFilter.date.end}
            type={"date"}
            onChange={(value: any) =>
              handleOnChangeFilterDate("end", value)
            }
            placeholder={"mm/dd/yyyy"}
          />
        </div>
        <div className={styles.WarpButton} onClick={handleOnFilter}>
          Lọc
        </div>
        <div
          className={styles.WarpButton}
          onClick={handleClearFilter}
        >
          Xóa
        </div>
        <div
          className={styles.WarpButton}
          onClick={handleExportExcel}
        >
          Tải xuống excel
        </div>
      </div>
    );
  };
  //MAIN RENDER
  return (
    <div className={styles.Purchase}>
      <div className="row justify-between align-center">
        <p className={[styles.Title].join(" ")}>Quản lý đơn hàng</p>
        {renderFilter()}
      </div>
      <div className={[styles.WarpTable].join(" ")}>
        {renderTable(data)}
      </div>
      {renderPagination(data.length > 0 ? data.length : 1)}
    </div>
  );
};

export { Purchase };
