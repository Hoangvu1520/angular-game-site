import { DebounceSelect, Divider, Form, Header, Message } from "@/stories";
import React, { useEffect, useState } from "react";
import styles from "./CreateUsers.module.scss";
import { GetAll, Update, apiConfig } from "@/stories/services";
import { useRouter } from "next/router";
import { Form as FormAntd } from "antd";
import { sha256 } from "@/utils";

const CreateUsers = () => {
  //Define constant
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const [formValue, setFormValue] = useState<any>({
    information: {},
    ext: {},
    roles: {},
    sale_id: "",
  });
  const [messageApi, contextHolder] = Message.useMessage();
  const router = useRouter();
  const updateUrl: any = router.query?.update;
  const [formInstance] = FormAntd.useForm();
  const [updateRole, setUpdateRole] = useState([]);
  const [roles, setRoles] = useState<[{ label: string; value: string }] | []>(
    []
  );
  const configTable: any = {
    valuesFormOnChange: (value: any) => {
      setFormValue({ ...formValue, ...value });
    },
    dataSource: {
      table: `users`,
      update: {
        // where: update,
        isBackendData: false,
        data: formValue ? formValue : undefined,
      },
    },
    fields: [
      {
        displayType: "Group",
        dataIndex: "information",
        label: "Thông tin người dùng",
        col: { span: 24 },
        divider: true,
        className: [styles.FormItem].join(" "),
        fields: [
          {
            label: "Họ và tên", // show label
            dataIndex: "user_name", // key
            displayType: "Input", // type input
            // name: "user_name",
            col: { lg: 12 },
            rules: [
              {
                required: true,
                message: "Họ và tên người dùng không được để trống",
              },
            ],
            input: {
              placeholder: "Nguyễn Văn A",
            },
          },
          {
            label: "Email", // show label
            dataIndex: "email", // key
            displayType: "Input", // type input
            // name: "email",
            col: { lg: 12 },
            rules: [
              {
                required: true,
                message: "Email không được để trống",
              },
              {
                pattern: emailRegex,
                message: "Email không hợp lệ",
              },
            ],
            input: {
              type: "email",
              placeholder: "example@gmail.com",
            },
          },
          {
            label: "Số điện thoại", // show label
            dataIndex: "phone", // key
            displayType: "Input", // type input
            col: { lg: 12 },
            // name: "phone",
            input: {
              placeholder: "0123456789",
            },
            rules: [
              {
                required: false,
                message: "Số điện thoại không được để trống",
              },
            ],
          },
          {
            label: "Mật khẩu", // show label
            dataIndex: "password", // key
            displayType: "Input", // type input
            // name: "password",
            col: { lg: 12 },
            rules: [
              {
                required: updateUrl ? false : true,
                message: "Mật khẩu không được để trống",
              },
              {
                validator: (_: any, value: any) => {
                  if (!value) return Promise.resolve();

                  const minLength = /^.{8,}$/;
                  const hasUpper = /[A-Z]/;
                  const hasLower = /[a-z]/;
                  const hasNumber = /[0-9]/;
                  const hasSpecial = /[^A-Za-z0-9]/;

                  // Check liên tiếp: 123, 234, 345, 456, ...
                  const hasSequentialNumbers =
                    /(012|123|234|345|456|567|678|789|890)/;

                  if (!minLength.test(value)) {
                    return Promise.reject("Mật khẩu phải có ít nhất 8 ký tự");
                  }

                  if (!hasUpper.test(value)) {
                    return Promise.reject(
                      "Mật khẩu phải chứa ít nhất một chữ hoa"
                    );
                  }

                  if (!hasLower.test(value)) {
                    return Promise.reject(
                      "Mật khẩu phải chứa ít nhất một chữ thường"
                    );
                  }

                  if (!hasNumber.test(value)) {
                    return Promise.reject("Mật khẩu phải chứa ít nhất một số");
                  }

                  if (!hasSpecial.test(value)) {
                    return Promise.reject(
                      "Mật khẩu phải chứa ít nhất một ký tự đặc biệt"
                    );
                  }

                  if (hasSequentialNumbers.test(value)) {
                    return Promise.reject(
                      "Mật khẩu không được chứa số liên tiếp như 123, 456..."
                    );
                  }

                  return Promise.resolve();
                },
              },
            ],
            input: {
              type: "password",
              placeholder: "password",
              visibilityToggle: true,
            },
          },
          {
            label: "Địa chỉ", // show label
            dataIndex: "address", // key
            displayType: "Input", // type input
            // name: "accountNo",
            col: { lg: 12 },
            rules: [],
            input: {
              placeholder: "Tòa nhà Sông Đà, 18 Phạm Hùng, Bắc Từ Niêm",
            },
          },
        ],
      },
      {
        displayType: "Group",
        dataIndex: "ext",
        label: "Thông tin khác",
        col: { span: 24 },
        divider: true,
        className: [styles.FormItem].join(" "),
        fields: [
          {
            label: "Mã số thuế", // show label
            dataIndex: "taxCode", // key
            displayType: "Input", // type input
            // name: "taxCode",
            col: { lg: 12 },
            rules: [],
            input: {
              // placeholder: "Nguyễn Văn A",
            },
          },
          {
            label: "Chức vụ", // show label
            dataIndex: "position", // key
            displayType: "Input", // type input
            // name: "position",
            col: { lg: 12 },
            rules: [],
            input: {
              // placeholder: "example@gmail.com",
            },
          },
          // {
          //   label: "Tên chủ tài khoản ngân hàng(viết hoa và không đấu)", // show label
          //   dataIndex: "accountBankName", // key
          //   displayType: "Input", // type input
          //   col: { lg: 12 },
          //   // name: "accountName",
          //   input: {
          //     placeholder: "NGUYEN VAN A",
          //   },
          //   rules: [],
          // },
          // {
          //   label: "Số tài khoản", // show label
          //   dataIndex: "accountBankNo", // key
          //   displayType: "InputNumber", // type input
          //   // name: "accountNo",
          //   col: { lg: 12 },
          //   rules: [],
          //   input: {
          //     placeholder: "123456789",
          //   },
          // },
        ],
      },
      {
        displayType: "Group",
        dataIndex: "roles",
        label: "Quyền truy cập",
        col: { span: 24 },
        divider: true,
        className: [styles.FormItem].join(" "),
        fields: [
          {
            label: "Người dùng nội bộ", // show label
            dataIndex: "internal", // key
            displayType: "SwitchToggle", // type input
            col: { lg: 12 },
          },
          {
            label: "Chọn quyền truy cập", // show label
            dataIndex: "role", // key
            displayType: "Select", // type input
            col: { lg: 12 },
            rules: [
              {
                required: true,
                message: "Chọn ít nhất 1 quyền",
              },
            ],
            input: {
              options: roles,
              mode: "multiple",
            },
          },
          // {
          //   label:
          //     "Quyền truy cập trang đầu tư (https://giacong.vietagold.com.vn)", // show label
          //   dataIndex: "invest", // key
          //   displayType: "SwitchToggle", // type input
          //   // name: "accountNo",
          //   col: { lg: 12 },
          //   rules: [],
          //   input: {},
          // },
        ],
      },
    ],
  };

  //Function to create
  const getDataToUpdate = () => {
    GetAll({
      table: "users",
      fields: [
        "id",
        "user_name",
        "email",
        "phone",
        "address",
        "ext",
        "sale_id",
        "internal",
        // "invest",
      ],
      where: { id: { _eq: updateUrl } },
    })
      .then((res: any) => {
        const internal = res.users[0].internal;
        setFormValue((item: any) => ({
          ...item,
          ext: res.users[0]?.ext ? { ...item.ext, ...res.users[0].ext } : {},
          information: res.users[0],
          sale_id: res.users[0].sale_id,
        }));
        formInstance.setFieldsValue({
          ...res.users[0],
          ...res.users[0]?.ext,
        });
        GetAll({
          table: "user_role",
          fields: [
            "user_role.uuid",
            "user_role.user_uuid",
            "user_role.role_uuid",
            "roles.name",
          ],
          where: { "user_role.user_uuid": { _eq: updateUrl } },
          join: [
            {
              table: "roles",
              foreign: ["roles.id", "user_role.role_uuid"],
            },
          ],
        })
          .then((res: any) => {
            setFormValue((item: any) => ({
              ...item,
              roles: {
                internal: internal,
                role:
                  res.user_role && res.user_role.length > 0
                    ? res.user_role.map((el: any) => el.name)
                    : [],
              },
            }));
            formInstance.setFieldsValue({
              role:
                res.user_role && res.user_role.length > 0
                  ? res.user_role.map((el: any) => el.name)
                  : [],
              internal: internal,
            });
            setUpdateRole(res.user_role);
          })
          .catch((error) => {
            messageApi.open({
              type: "error",
              content: `${error}`,
            });
          });
      })
      .catch((error) => {
        messageApi.open({
          type: "error",
          content: `${error}`,
        });
      });
  };
  const getAllRole = async () => {
    GetAll({
      table: "roles",
      fields: ["name", "title", "id"],
    })
      .then((res) => {
        if (res && res.roles.length > 0) {
          setRoles(
            res.roles.map((item: any) => ({
              label: item.title,
              value: item.name,
            }))
          );
        } else {
          messageApi.open({
            type: "error",
            content: `Không có quyền truy cập nào được tạo hoặc có lỗi, vui lòng kiểm tra lại`,
          });
        }
      })
      .catch((error) => {
        messageApi.open({
          type: "error",
          content: `${error}`,
        });
      });
  };

  const getAllSale = async (search: string) => {
    return GetAll({
      table: "users",
      fields: ["users.id", "users.user_name", "users.email"],
      where: {
        "roles.name": {
          _eq: "sales",
        },
      },
      join: [
        {
          table: "user_role",
          foreign: ["users.id", "user_role.user_uuid"],
        },
        {
          table: "roles",
          foreign: ["roles.id", "user_role.role_uuid"],
        },
      ],
      searchField: ["users.user_name", "users.email"],
      search: search,
    }).then((res: any) => {
      return res.users.map((user: any) => ({
        label: `${user?.user_name} / ${user?.email}`,
        value: user.id,
      }));
    });
  };
  //Function to handle action
  const handleSubmit = () => {
    updateUrl ? handleUpdateUser() : handleInsertUser();
  };

  const handleInsertUser = async () => {
    formInstance.validateFields().then(() => {
      apiConfig("/cms-ums/register", {
        ...formValue.information,
        ext: formValue.ext,
        ...formValue.roles,
        sale_id: formValue.sale_id,
      })
        .then((res) => {
          if (res?.error) {
            res?.error && console.error(res?.error);
            messageApi.open({
              type: "error",
              content: `${res?.error}`,
            });
          } else {
            messageApi.open({
              type: "success",
              content: "Tạo người dùng thành công",
            });
            setInterval(() => {
              window.location.href = "/cms_ums/tat-ca-nguoi-dung";
            }, 1);
          }
        })
        .catch((err) => {
          console.error(err);
          messageApi.open({
            type: "error",
            content: `${err}`,
          });
        });
    });
  };

  const handleUpdateUser = async () => {
    formInstance.validateFields().then(async () => {
      const inforUpdate = Update({
        table: "users",
        where: { id: { _in: [updateUrl] } },
        object: formValue.information.password
          ? {
              ...formValue.information,
              ext: formValue.ext,
              password: sha256(formValue.information.password),
              sale_id: formValue.sale_id,
              internal: formValue.roles.internal,
            }
          : {
              ext: formValue.ext,
              internal: formValue.roles.internal,
              sale_id: formValue.sale_id,
              email: formValue.information.email,
              user_name: formValue.information.user_name,
              phone: formValue.information.phone,
            },
      }).catch((err) => {
        console.error(err);
        throw messageApi.open({
          type: "error",
          content: `${err}`,
        });
      });

      //Update roles
      const role = formValue.roles.role;
      const deleteRoleUser =
        updateRole.length > 0
          ? updateRole.filter((item: any) => !role.includes(item.name))
          : [];

      const updateRoleNew =
        updateRole.length > 0 && role && role.length > 0
          ? role.filter(
              (item: any) =>
                !updateRole.map((el: any) => el.name).includes(item)
            )
          : role && role.length > 0
          ? role
          : [];
      const roleUpdate = apiConfig("/cms-ums/update-role", {
        userId: updateUrl,
        deleteRole: deleteRoleUser,
        updateRole: updateRoleNew,
      });
      const saleUpdate = apiConfig("/cms-ums/update-sale", {
        userId: updateUrl,
        email: formValue.sale && formValue.sale.split(" / ")[1],
      });

      await Promise.all([await inforUpdate, await roleUpdate, await saleUpdate])
        .then((res) => {
          if (res) {
            messageApi.open({
              type: "success",
              content: "Cập nhật thông tin người dùng thành công",
            });
            setInterval(() => {
              window.location.href = "/cms_ums/tat-ca-nguoi-dung";
            }, 1);
          }
        })
        .catch((err) => {
          messageApi.open({
            type: "error",
            content: `${err}`,
          });
        });
    });
  };
  //Function to render
  const renderAssignSale = () => {
    return (
      <div className={styles.FormItem}>
        <p>Nhân viên bán hàng</p>
        <Divider />
        <div>
          <DebounceSelect
            value={formValue.sale_id}
            placeholder="Tìm kiếm và chọn nhân viên bán hàng phụ trách "
            fetchOptions={getAllSale}
            onChange={(newValue) => {
              setFormValue((item: any) => ({
                ...item,
                sale_id: newValue.value,
              }));
            }}
            style={{ width: "100%" }}
            showSearch
          />
        </div>
      </div>
    );
  };

  //Function to effect
  useEffect(() => {
    updateUrl && getDataToUpdate();
  }, [updateUrl]);

  useEffect(() => {
    getAllRole();
  }, []);
  //Main render
  return (
    <>
      {contextHolder}
      <Header
        title={"Tạo người dùng mới"}
        description={"Tạo người dùng mới và cập nhật thông tin"}
        callToActions={[
          {
            children: "Hủy",
            icon: "FolderPlus",
            href: `/cms_ums/tat-ca-nguoi-dung`,
          },
          {
            children: "Lưu",
            icon: "CalendarPlus",
            htmlType: "submit",
            onClick: () => handleSubmit(),
          },
        ]}
        background={false}
      />
      <div className="container">
        <Form form={formInstance} {...configTable} />
        {renderAssignSale()}
      </div>
    </>
  );
};

export default CreateUsers;
