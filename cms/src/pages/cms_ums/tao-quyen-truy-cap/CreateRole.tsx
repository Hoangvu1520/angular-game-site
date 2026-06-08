import { Checkbox, Form, Header, Message } from "@/stories";
import React, { useEffect, useState } from "react";
import styles from "./CreateRole.module.scss";
import { Delete, GetAll, Insert, Update } from "@/stories/services";
import { useRouter } from "next/router";
import { Col, Divider, Form as FormAntd, Row } from "antd";

const CreateRole = () => {
  //Define constant

  const [formValue, setFormValue] = useState<any>({

  });
  const [messageApi, contextHolder] = Message.useMessage();
  const router = useRouter();
  const updateUrl: any = router.query?.update;
  const [formInstance] = FormAntd.useForm();
  const [permissions, setPermissions] = useState({})
  const [valueCheckbox, setValueCheckbox] = useState<{ [name: string]: { label: string, value: string }[] }>({})
  const configTable: any = {
    valuesFormOnChange: (value: any) => {
      setFormValue({ ...formValue, ...value });
    },
    dataSource: {
      table: `roles`,
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
        label: "Thông tin chung",
        col: { span: 24 },
        divider: true,
        className: [styles.FormItem].join(" "),
        fields: [
          {
            label: "Tên",
            dataIndex: "title",
            displayType: "Input",
            col: { lg: 12 },
            rules: [
              {
                required: true,
                message: "Tên hiển thị không được để trống",
              },
            ],
            input: {
              placeholder: "Nhân viên bán hàng",
            },
          },
          {
            label: "Mã (không được đặt trùng hoặc sửa các ký tự sau: sales, admin, user )", // show label
            dataIndex: "name", // key
            displayType: "Input", // type input
            col: { lg: 12 },
            input: {
              placeholder: "sales",
              disabled: formValue?.information?.name && ["sales", "admin", "user"].includes(formValue?.information?.name)
            },
            rules: [
              {
                required: true,
                message: "Số điện thoại không được để trống",
              },
            ],
          },
        ],
      }
    ],
  };

  //Function to create
  const getDataToUpdate = () => {
    GetAll({
      table: "roles",
      fields: ["id", "title", "name",],
      where: { id: { _eq: updateUrl } },
    })
      .then((res: any) => {
        setFormValue((item: any) => ({
          ...item,
          information: res.roles[0],
        }));
        formInstance.setFieldsValue({ ...res.roles[0] });
        GetAll({
          table: "role_permissions",
          fields: [
            "role_permissions.permission_id",
            "permissions.group",
            "permissions.name",
            "role_permissions.created_at"
          ],
          where: { "role_permissions.role_id": { _eq: updateUrl } },
          join: [
            {
              table: "permissions",
              foreign: ["permissions.id", "role_permissions.permission_id"],
            },
          ],
        })
          .then((respone: any) => {
            var cvtRes: any = {}
            respone.role_permissions && respone.role_permissions.length > 0 && respone.role_permissions.map((item: any) => {
              cvtRes = Object.keys(cvtRes).length > 0 ? { ...cvtRes, [item.group]: cvtRes[item.group]?.length > 0 ? [...cvtRes[item.group], { label: item.name, value: item.permission_id }] : [{ label: item.name, value: item.permission_id }] } : { [item.group]: [{ label: item.name, value: item.permission_id }] }
            })
            setValueCheckbox(cvtRes)
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
  const getAllPermissions = async () => {
    return GetAll({
      table: "permissions", fields: ["permissions.id", "permissions.name", "permissions.group"],
    }).then((res: any) => {
      var cvtPermissions: any = {}
      if (res.permissions && res.permissions.length > 0) {
        res.permissions.map((per: { id: string, group: string, key: string, name: string }) => {
          const [group1, group2] = per.group.split("/")
          if (Object.keys(cvtPermissions).length > 0) {
            if (cvtPermissions[group1]) {
              if (cvtPermissions[group1][group2]) {
                cvtPermissions[group1][group2] = [...cvtPermissions[group1][group2], { label: per.name, value: per.id }]
              } else {
                cvtPermissions[group1] = {
                  ...cvtPermissions[group1],
                  [group2]: [{ label: per.name, value: per.id }]
                }
              }
            } else {
              cvtPermissions = {
                ...cvtPermissions,
                [group1]: {
                  [group2]: [
                    { label: per.name, value: per.id }
                  ]
                }
              }
            }
          } else {
            cvtPermissions = {
              [group1]: {
                [group2]: [
                  { label: per.name, value: per.id }
                ]
              }
            }
          }
        })
      }
      setPermissions(cvtPermissions)
    }).catch((error) => {
      messageApi.open({
        type: "error", content: error
      })
    })
  }

  const insertRolePermission = async (id: string) => {
    var objPermission = Object.keys(valueCheckbox)
    var listValue: { role_id: string, permission_id: string }[] = []
    objPermission && objPermission.length > 0 && objPermission.map((permission: string) => {
      listValue = valueCheckbox[permission].length > 0 ? [...listValue, ...valueCheckbox[permission].map((el) => ({ role_id: id, permission_id: el.value }))] : listValue
    })
    await Insert({
      table: "role_permissions", insert: {
        data: listValue,
        result: "*"
      }
    }).then(() => {
      messageApi.open({ type: "success", content: updateUrl ? "Cập nhật quyền truy cập thành công" : "Tạo quyền truy cập mới thành công" }).then(() => {
        setInterval(() => {
          window.location.href = "/cms_ums/tat-ca-vai-tro"
        }, 1);
      })
    }).catch((error) => {
      throw error
    })
  }

  //Function to handle action
  const handleSubmit = () => {
    updateUrl ? handleUpdateUser() : handleInsertUser();
  };

  const handleInsertUser = async () => {
    await formInstance.validateFields().then(() => {
      Insert({
        table: "roles",
        insert: {
          data: {
            name: formValue.information.name,
            title: formValue.information.title,
          },
          result: "*",
        },
      }).then((res) => {
        if (res && res.length > 0 && res[0]?.data.length > 0) {
          res[0].data[0].id && insertRolePermission(res[0].data[0].id)
        }
      }).catch((error) => {
        messageApi.open({ type: "error", content: error })
      })
    });
  };
  const handleCheckbox = (key: string, value: { label: string, value: string }[]) => {
    setValueCheckbox((item: any) => ({ ...item, [key]: value }))
  }
  const handleUpdateUser = async () => {
    formInstance.validateFields().then(async () => {
      Promise.all([Update({
        table: "roles",
        where: { id: { _in: [updateUrl] } },
        object: {
          name: formValue.information.name,
          title: formValue.information.title,
        },
      }),
      Delete({
        table: "role_permissions", column: "role_id", object: [updateUrl]
      })]).then(() => {
        updateUrl && insertRolePermission(updateUrl)
      }).catch((error) => {
        messageApi.open({ type: "error", content: error })
      })
      //Update roles
    });
  };
  //Fuction to render
  const renderCheckBox = (group: { [name: string]: { [name: string]: { label: string, value: string }[] } }) => {
    return <div className={styles.FormItem}>
      <Row justify={"space-between"}>
        {Object.keys(group).map((item: string, key) => {
          return <Col span={24} key={key}>
            <p style={{ fontWeight: 700, fontSize: "25px" }}>
              {item}
            </p>
            <Divider />
            <Col span={24}>
              <Row>
                {Object.keys(group[item]).map((el, index) => {
                  return <Col key={index} flex="1 1 0">
                    <p style={{ fontWeight: 700, fontSize: "15px" }}>{el}</p>
                    {/* {group[item][el].map((checkbox) => {
                      return  */}
                    <Col>
                      <Checkbox options={group[item][el]} type="vertical" value={valueCheckbox[`${item}/${el}`] ? valueCheckbox[`${item}/${el}`] : []} onChange={(value: any) => {
                        handleCheckbox(`${item}/${el}`, value)
                      }} />
                    </Col>
                    {/* })} */}
                  </Col>
                })}
              </Row></Col>
          </Col>
        })}
      </Row>
    </div>
  }
  //Function to effect
  useEffect(() => {
    updateUrl && getDataToUpdate();
  }, [updateUrl]);

  useEffect(() => {
    getAllPermissions()
  }, [])
  //Main render
  return (
    <>
      {contextHolder}
      <Header
        title={"Tạo quyền truy cập mới"}
        description={"Tạo và sửa quyèn truy cập"}
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
        {renderCheckBox(permissions)}
      </div>
    </>
  );
};

export default CreateRole;
