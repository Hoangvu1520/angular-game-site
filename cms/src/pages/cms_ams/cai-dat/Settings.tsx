import { Form, Header, Message, Row, Col, Spin } from "@/stories";
import React, { useEffect, useState } from "react";
import styles from "./Settings.module.scss";
import { GetAll, apiConfig } from "@/stories/services";
import { Form as FormAntd } from "antd";
import dayjs from "dayjs";

const Settings = () => {
  //Define constant
  const [formInstance] = FormAntd.useForm();
  const [spin, setSpin] = useState(false);
  const dayOpenConfig = [
    { label: "Thứ 2", value: "monday" },
    { label: "Thứ 3", value: "tuesday" },
    { label: "Thứ 4", value: "wednesday" },
    { label: "Thứ 5", value: "thursday" },
    { label: "Thứ 6", value: "friday" },
    { label: "Thứ 7", value: "saturday" },
    { label: "Chủ nhật", value: "sunday" },
  ];
  const [formValue, setFormValue] = useState<any>({
    buy_any_sell: { accumulateBuy: 0, accumulateSell: 0 },
    quantity: { minBuyAccumulate: 0, maxDrawAccumulate: 0 },
    float: { validationFloat: 0 },
    fee: {
      accumulateDraw: 0,
    },
    money: {
      drawMoney: 0,
      feeDrawMoney: 0,
      minDrawMoney: 0,
      minDepositMoney: 0,
      maxDepositMoney: 0,
    },
    timeOpenAccumulate: {
      monday: ["", ""],
      tuesday: ["", ""],
      wednesday: ["", ""],
      thursday: ["", ""],
      friday: ["", ""],
      saturday: ["", ""],
      sunday: ["", ""],
    },
    bank: {
      accountNo: 0,
      accountName: "",
    },
    limit: {
      limitBuyAccumulate: 0,
    },
  });
  const [messageApi, contextHolder] = Message.useMessage();
  //function to create
  const getSettingApi = async () => {
    setSpin(true);
    GetAll({
      table: "settings",
      fields: ["id", "key", "value", "type"],
      where: {
        key: {
          _in: [
            "minBuyAccumulate",
            "maxDrawAccumulate",
            "accumulateBuy",
            "accumulateSell",
            "accumulateDraw",
            "validationFloat",
            "drawMoney",
            "feeDrawMoney",
            "minDrawMoney",
            "minDepositMoney",
            "maxDepositMoney",
            "timeOpenAccumulate",
            "maxBuyAccumulate",
            "minDrawAccumulate",
            "bank",
            "limitBuyAccumulate",
          ],
        },
      },
    }).then((res) => {
      const result = {
        buy_and_sell: {
          accumulateBuy: "",
          accumulateSell: "",
        },
        quantity: {
          minBuyAccumulate: "",
          maxBuyAccumulate: "",
          minDrawAccumulate: "",
          maxDrawAccumulate: "",
        },
        float: {
          validationFloat: "",
        },
        fee: {
          accumulateDraw: "",
        },
        money: {
          drawMoney: "",
          feeDrawMoney: "",
          minDrawMoney: "",
          minDepositMoney: "",
          maxDepositMoney: "",
        },
        timeOpenAccumulate: {
          monday: ["", ""],
          tuesday: ["", ""],
          wednesday: ["", ""],
          thursday: ["", ""],
          friday: ["", ""],
          saturday: ["", ""],
          sunday: ["", ""],
        },
        bank: {
          accountNo: 0,
          accountName: "",
        },
        limit: {
          limitBuyAccumulate: 0,
        },
      };

      // Fill the result object and update the form fields
      res?.settings?.forEach((item: any) => {
        switch (item.key) {
          case "accumulateBuy":
            result.buy_and_sell.accumulateBuy = item.value;
            formInstance.setFieldsValue({ accumulateBuy: item.value });
            break;
          case "accumulateSell":
            result.buy_and_sell.accumulateSell = item.value;
            formInstance.setFieldsValue({ accumulateSell: item.value });
            break;
          case "minBuyAccumulate":
            result.quantity.minBuyAccumulate = item.value;
            formInstance.setFieldsValue({ minBuyAccumulate: item.value });
            break;
          case "maxBuyAccumulate":
            result.quantity.maxBuyAccumulate = item.value;
            formInstance.setFieldsValue({ maxBuyAccumulate: item.value });
            break;
          case "minDrawAccumulate":
            result.quantity.minDrawAccumulate = item.value;
            formInstance.setFieldsValue({ minDrawAccumulate: item.value });
            break;
          case "maxDrawAccumulate":
            result.quantity.maxDrawAccumulate = item.value;
            formInstance.setFieldsValue({ maxDrawAccumulate: item.value });
            break;
          case "validationFloat":
            result.float.validationFloat = item.value;
            formInstance.setFieldsValue({ validationFloat: item.value });
            break;
          case "accumulateDraw":
            result.fee.accumulateDraw = item.value;
            formInstance.setFieldsValue({ accumulateDraw: item.value });
            break;
          case "drawMoney":
            result.money.drawMoney = item.value;
            formInstance.setFieldsValue({ drawMoney: item.value });
            break;
          case "feeDrawMoney":
            result.money.feeDrawMoney = item.value;
            formInstance.setFieldsValue({ feeDrawMoney: item.value });
            break;
          case "minDrawMoney":
            result.money.minDrawMoney = item.value;
            formInstance.setFieldsValue({ minDrawMoney: item.value });
            break;
          case "minDepositMoney":
            result.money.minDepositMoney = item.value;
            formInstance.setFieldsValue({ minDepositMoney: item.value });
            break;
          case "maxDepositMoney":
            result.money.maxDepositMoney = item.value;
            formInstance.setFieldsValue({ maxDepositMoney: item.value });
            break;
          case "timeOpenAccumulate":
            const newTime = Object.fromEntries(
              Object.entries(JSON.parse(item.value)).map(
                ([day, [start, end]]: any) => [
                  day,
                  [dayjs(start, "HH:mm:ss"), dayjs(end, "HH:mm:ss")],
                ]
              )
            );
            result.timeOpenAccumulate = newTime;
            formInstance.setFieldsValue(newTime);
            break;
          case "bank":
            result.bank = JSON.parse(item.value);
            formInstance.setFieldsValue({
              accountNo: result.bank.accountNo,
              accountName: result.bank.accountName,
            });
            break;
          case "limitBuyAccumulate":
            result.limit.limitBuyAccumulate = item.value;
            formInstance.setFieldsValue({
              limitBuyAccumulate: item.value,
            });
            break;
        }
      });

      // Now set the form values
      setFormValue(result);
      setSpin(false);
    });
  };

  //config
  const configInput: any = {
    valuesFormOnChange: (value: any) => {
      setFormValue({ ...formValue, ...value });
    },
    dataSource: {
      table: `posts`,
      update: {
        // where: update,
        isBackendData: false,
        data: formValue ? formValue : undefined,
      },
    },
    fields: [
      {
        displayType: "Group",
        dataIndex: "buy_and_sell",
        label: "CÀI ĐẶT GIÁ VÀNG",
        col: { span: 24 },
        divider: true,
        className: [styles.FormItem].join(" "),
        fields: [
          {
            label: "Giá khách mua (VND/Chỉ)", // show label
            dataIndex: "accumulateBuy", // key
            displayType: "InputNumber", // type input
            col: { span: 12 },
            rules: [
              {
                required: true,
                message: "Không được để trống phần này",
              },
            ],
            input: {
              controls: false,
              placeholder: "1000000",
              formatter: (value: number) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            },
          },
          {
            label: "Giá khách bán (VND/Chỉ)", // show label
            dataIndex: "accumulateSell", // key
            displayType: "InputNumber", // type input
            col: { span: 12 },
            rules: [
              {
                required: true,
                message: "Không được để trống phần này",
              },
            ],
            input: {
              controls: false,
              placeholder: "Giá bán",
              formatter: (value: number) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            },
          },
        ],
      },
      {
        displayType: "Group",
        dataIndex: "quantity",
        label: "CÀI ĐẶT KHỐI LƯỢNG VÀNG GIAO DỊCH",
        col: { span: 24 },
        divider: true,
        className: [styles.FormItem].join(" "),
        fields: [
          {
            label: "Mua tối thiểu (Chỉ)", // show label
            dataIndex: "minBuyAccumulate", // key
            displayType: "InputNumber", // type input
            col: { span: 12 },
            rules: [
              {
                required: true,
                message: "Không được để trống phần này",
              },
            ],
            input: {
              controls: false,
              placeholder: "Giá mua",
            },
          },
          {
            label: "Mua tối đa (Chỉ)", // show label
            dataIndex: "maxBuyAccumulate", // key
            displayType: "InputNumber", // type input
            col: { span: 12 },
            rules: [
              {
                required: true,
                message: "Không được để trống phần này",
              },
            ],
            input: {
              controls: false,
              placeholder: "Giá mua",
            },
          },
          {
            label: "Rút tối thiểu (Chỉ)", // show label
            dataIndex: "minDrawAccumulate", // key
            displayType: "InputNumber", // type input
            col: { span: 12 },
            rules: [
              {
                required: true,
                message: "Không được để trống phần này",
              },
            ],
            input: {
              controls: false,
              placeholder: "Lượng vàng rút tối đa",
              formatter: (value: number) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            },
          },
          {
            label: "Rút tối đa (Chỉ)", // show label
            dataIndex: "maxDrawAccumulate", // key
            displayType: "InputNumber", // type input
            col: { span: 12 },
            rules: [
              {
                required: true,
                message: "Không được để trống phần này",
              },
            ],
            input: {
              controls: false,
              placeholder: "Lượng vàng rút tối đa",
              formatter: (value: number) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            },
          },
        ],
      },
      {
        displayType: "Group",
        dataIndex: "fee",
        col: { span: 24 },
        divider: true,
        className: [styles.FormItem].join(" "),
        fields: [
          {
            label: "Phí gia công (VND/Chỉ)", // show label
            dataIndex: "accumulateDraw", // key
            displayType: "InputNumber", // type input
            col: { span: 12 },
            rules: [
              {
                required: true,
                message: "Không được để trống phần này",
              },
            ],
            input: {
              controls: false,
              placeholder: "Giá gia công",
              formatter: (value: number) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            },
          },
        ],
      },
      {
        displayType: "Group",
        dataIndex: "float",
        col: { span: 24 },
        divider: true,
        className: [styles.FormItem].join(" "),
        fields: [
          {
            label: "Số thập phân được làm tròn (vd: 2 kết quả là 0.01)", // show label
            dataIndex: "validationFloat", // key
            displayType: "InputNumber", // type input
            col: { span: 12 },
            rules: [
              {
                required: true,
                message: "Không được để trống phần này",
              },
            ],
            input: {
              controls: false,
              placeholder: "Số được làm tròn",
              formatter: (value: number) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            },
          },
        ],
      },
      {
        displayType: "Group",
        dataIndex: "money",
        label: "CÀI ĐẶT NẠP RÚT TIỀN", // show label
        col: { span: 24 },
        divider: true,
        className: [styles.FormItem].join(" "),
        fields: [
          {
            label: "Giá trị rút tối đa (VND/Lần)", // show label
            dataIndex: "drawMoney", // key
            displayType: "InputNumber", // type input
            col: { span: 12 },
            rules: [
              {
                required: true,
                message: "Không được để trống phần này",
              },
            ],
            input: {
              controls: false,
              placeholder: "50,000,000",
              formatter: (value: number) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            },
          },
          {
            label: "Phí rút tiền (%)", // show label
            dataIndex: "feeDrawMoney", // key
            displayType: "InputNumber", // type input
            col: { span: 12 },
            rules: [
              {
                required: true,
                message: "Không được để trống phần này",
              },
            ],
            input: {
              controls: false,
              placeholder: "0",
              formatter: (value: number) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            },
          },
          {
            label: "Giá trị rút tối thiểu (VND/Lần)", // show label
            dataIndex: "minDrawMoney", // key
            displayType: "InputNumber", // type input
            col: { span: 12 },
            rules: [
              {
                required: true,
                message: "Không được để trống phần này",
              },
            ],
            input: {
              controls: false,
              placeholder: "0",
              formatter: (value: number) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            },
          },
          {
            label: "Giá trị nạp tối đa (VND/Lần)", // show label
            dataIndex: "maxDepositMoney", // key
            displayType: "InputNumber", // type input
            col: { span: 12 },
            rules: [
              {
                required: true,
                message: "Không được để trống phần này",
              },
            ],
            input: {
              controls: false,
              placeholder: "0",
              formatter: (value: number) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            },
          },
          {
            label: "Giá trị nạp tối thiểu (VND/Lần)", // show label
            dataIndex: "minDepositMoney", // key
            displayType: "InputNumber", // type input
            col: { span: 12 },
            rules: [
              {
                required: true,
                message: "Không được để trống phần này",
              },
            ],
            input: {
              controls: false,
              placeholder: "0",
              formatter: (value: number) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            },
          },
        ],
      },
      {
        displayType: "Group",
        dataIndex: "bank",
        label: "CÀI ĐẶT TÀI KHOẢN NGÂN HÀNG",
        col: { span: 24 },
        divider: true,
        className: [styles.FormItem].join(" "),
        fields: [
          {
            label: "Số tài khoản", // show label
            dataIndex: "accountNo", // key
            displayType: "InputNumber", // type input
            col: { span: 12 },
            rules: [
              {
                required: true,
                message: "Không được để trống phần này",
              },
            ],
            input: {
              controls: false,
              placeholder: "12345689",
            },
          },
          {
            label: "Chủ tài khoản(viết hoa và không dấu)", // show label
            dataIndex: "accountName", // key
            displayType: "Input", // type input
            col: { span: 12 },
            rules: [
              {
                required: true,
                message: "Không được để trống phần này",
              },
            ],
            input: {
              controls: false,
              placeholder: "NGAN HANG VIETABANK",
            },
          },
        ],
      },
      {
        displayType: "Group",
        dataIndex: "timeOpenAccumulate",
        label: "CÀI ĐẶT GIỜ HOẠT ĐỘNG",
        col: { span: 24 },
        divider: true,
        className: [styles.FormItem].join(" "),
        fields: dayOpenConfig.map((day) => ({
          label: day.label,
          dataIndex: day.value,
          displayType: "TimeRangePicker",
          col: { span: 6 },
          rules: [
            {
              required: true,
              message: "Không được để trống phần này",
            },
          ],
          input: {
            placeholder: ["Bắt đầu", "Kết thúc"],
          },
        })),
      },
      {
        displayType: "Group",
        dataIndex: "limit",
        label: "CÀI ĐẶT TỒN KHO",
        col: { span: 24 },
        divider: true,
        className: [styles.FormItem].join(" "),
        fields: [
          {
            label: "Kim tài lộc - Kim long 0,1 chỉ (Sản phẩm)",
            dataIndex: "limitBuyAccumulate",
            displayType: "InputNumber",
            col: { span: 6 },
            rules: [
              {
                required: true,
                message: "Không được để trống phần này",
              },
            ],
            input: {
              controls: false,
              formatter: (value: number) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            },
          },
        ],
      },
    ],
  };

  const convertToRawHours = (formValues: Record<string, any>) => {
    const result: Record<string, [string, string]> = {};

    for (const [day, range] of Object.entries(formValues)) {
      if (
        Array.isArray(range) &&
        range.length === 2 &&
        dayjs.isDayjs(range[0]) &&
        dayjs.isDayjs(range[1])
      ) {
        result[day] = [
          range[0].format("HH:mm:ss"),
          range[1].format("HH:mm:ss"),
        ];
      } else {
        result[day] = [range[0], range[1]]; // Default value if not valid
      }
    }

    return result;
  };

  //Function to hook
  useEffect(() => {
    getSettingApi();
  }, []);

  //Function to handle action

  //function handle API
  const handleSubmit = () => {
    formInstance.validateFields().then(async () => {
      // console.log("formValue", formValue.limit.limitBuyAccumulate);
      // return;
      apiConfig("/cms/update", {
        table: "settings",
        update: {
          data: [
            {
              where: {
                key: {
                  _in: ["accumulateBuy"],
                },
              },
              fields: {
                value: formValue.buy_and_sell.accumulateBuy,
              },
            },
            {
              where: {
                key: {
                  _in: ["accumulateSell"],
                },
              },
              fields: {
                value: formValue.buy_and_sell.accumulateSell,
              },
            },
            {
              where: {
                key: {
                  _in: ["minBuyAccumulate"],
                },
              },
              fields: {
                value: formValue.quantity.minBuyAccumulate,
              },
            },
            {
              where: {
                key: {
                  _in: ["maxBuyAccumulate"],
                },
              },
              fields: {
                value: formValue.quantity.maxBuyAccumulate,
              },
            },
            {
              where: {
                key: {
                  _in: ["minDrawAccumulate"],
                },
              },
              fields: {
                value: formValue.quantity.minDrawAccumulate,
              },
            },
            {
              where: {
                key: {
                  _in: ["maxDrawAccumulate"],
                },
              },
              fields: {
                value: formValue.quantity.maxDrawAccumulate,
              },
            },
            {
              where: {
                key: {
                  _in: ["validationFloat"],
                },
              },
              fields: {
                value: formValue.float.validationFloat,
              },
            },
            {
              where: {
                key: {
                  _in: ["accumulateDraw"],
                },
              },
              fields: {
                value: formValue.fee.accumulateDraw,
              },
            },
            {
              where: {
                key: {
                  _in: ["drawMoney"],
                },
              },
              fields: {
                value: formValue.money.drawMoney,
              },
            },
            {
              where: {
                key: {
                  _in: ["feeDrawMoney"],
                },
              },
              fields: {
                value: formValue.money.feeDrawMoney,
              },
            },
            {
              where: {
                key: {
                  _in: ["minDepositMoney"],
                },
              },
              fields: {
                value: formValue.money.minDepositMoney,
              },
            },
            {
              where: {
                key: {
                  _in: ["maxDepositMoney"],
                },
              },
              fields: {
                value: formValue.money.maxDepositMoney,
              },
            },
            {
              where: {
                key: {
                  _in: ["minDrawMoney"],
                },
              },
              fields: {
                value: formValue.money.minDrawMoney,
              },
            },
            {
              where: {
                key: {
                  _in: ["timeOpenAccumulate"],
                },
              },
              fields: {
                value: JSON.stringify(
                  convertToRawHours(formValue.timeOpenAccumulate)
                ),
              },
            },
            {
              where: {
                key: {
                  _in: ["bank"],
                },
              },
              fields: {
                value: JSON.stringify(formValue.bank),
              },
            },
            {
              where: {
                key: {
                  _in: ["limitBuyAccumulate"],
                },
              },
              fields: {
                value: formValue.limit.limitBuyAccumulate,
              },
            },
          ],
        },
      })
        .then((res: any) => {
          if (!res || res.error) {
            messageApi.open({
              type: "error",
              content: "Cập nhật không thành công",
            });
            res.error && console.error(res.error);
          } else {
            messageApi.open({
              type: "success",
              content: "Cập nhật thành công",
            });
          }
        })
        .catch((error) => {
          messageApi.open({
            type: "error",
            content: `${error}`,
          });
        });
    });
  };

  //Function to render
  //Main render
  return (
    <>
      {contextHolder}
      <Spin spinning={spin} fullscreen />
      <Header
        title={"Cài đặt"}
        description={"Chỉnh sửa và cập nhật lại thông tin"}
        callToActions={[
          {
            children: "Hủy",
            icon: "FolderPlus",
            href: `/cms_shopify/don-hang`,
          },
          {
            children: "Lưu",
            icon: "CalendarPlus",
            onClick: () => handleSubmit(),
          },
        ]}
        background={false}
      />
      <div className="container">
        <Form form={formInstance} {...configInput} />
      </div>
    </>
  );
};

export default Settings;
