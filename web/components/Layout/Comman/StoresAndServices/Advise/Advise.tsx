import React, { Key, useState, useEffect } from "react";
import styles from "./Advise.module.scss";
import { Input } from "../../../../Input";
import { Button } from "../../../../Button";
import { AdviseService, UserForm } from "../../../../../services";
import { Authen } from "../../../Authen";
import {
  useAuthenticationStatus,
  useUserData,
  useMultipleFilesUpload,
} from "@nhost/nextjs";
import Image from "next/image";

export type AdviseProps = {
  onClick?: () => void;
};

const Advise = (AdviseProps: AdviseProps) => {
  const [props, setProps] = useState(AdviseProps);
  const { upload, add, clear } = useMultipleFilesUpload();
  const user: any | "" = {
    ...useUserData()?.metadata,
    userId: useUserData()?.id,
  };
  const { isAuthenticated } = useAuthenticationStatus();

  const [formSP, setFormSP] = useState<any>({
    name: user.userName,
    userId: user.userId,
    phone: user.phone,
    mail: user.Email,
    img_before: "",
    img_left: "",
    img_right: "",
  });
  const valueChange = (key: string, newValue: string) => {
    return {
      ...formSP,
      [key]: newValue,
    };
  };
  const sendEmail = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mail: formSP.mail,
          message: "Bạn có yêu cầu tư vấn da mặt mới",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        return res
      } else {
        console.log(data?.message)
      }
    } catch (error) {
      console.log("")
    }
  };
  const handelSubmit = async () => {
    if (formSP.name != "" && formSP.phone != null && formSP.mail != "") {
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (emailRegex.test(formSP.mail) == false) {
        alert("Email nhập không hợp lệ !!");
      } else {
        clear();
        add({
          files: [formSP.img_before, formSP.img_left, formSP.img_right],
          bucketId: "service",
        });
        await upload()
          .then(async (e: any) => {
            await UserForm({
              name: formSP.name,
              phone: formSP.phone,
              mail: formSP.mail,
              user_id: formSP.userId,
              img_before: e.files[0]._state.event.id,
              img_left: e.files[1]._state.event.id,
              img_right: e.files[2]._state.event.id,
            })
              .then((res: any) => {
                if (res) {
                  alert(
                    "Chúng tôi đã xác nhận tình trạng của bạn. Vui lòng đợi chúng tôi liên hệ. Cảm ơn !!!"
                  );
                  sendEmail()
                }
              })
              .catch((error) => {
                alert(
                  "Có lỗi xảy ra vui lòng thử lại sau hoặc liên hệ với bộ phận kỹ thuật để được hỗ trợ"
                );
                console.error(error);
              });
          })
          .catch((error) => {
            alert(
              "Có lỗi xảy ra vui lòng thử lại sau hoặc liên hệ với bộ phận kỹ thuật để được hỗ trợ"
            );
            console.error(error);
          });
      }
    } else {
      alert("Mời nhập đầy đủ thông tin !!!");
    }
  };
  const valueDefault = (key: string) => {
    switch (key) {
      case "name":
        return user.userName;
      case "phone":
        return `${user.phone}`;
      case "mail":
        return user.Email;
      default:
        return "";
    }
  };

  const form = [
    { hint: "Họ tên", type: "text", key: "name" },
    { hint: "Số điện thoại", type: "number", key: "phone" },
    { hint: "Email", type: "email", key: "mail" },
  ];

  const uploadMedia = [
    {
      hint: "Ảnh mặt trước",
      key: "img_before",
      img: "front.jpg",
    },
    {
      hint: "Ảnh mặt trái",
      key: "img_left",
      img: "left.jpg",
    },
    {
      hint: "Ảnh mặt phải",
      key: "img_right",
      img: "right.jpg",
    },
  ];

  //Function hook
  useEffect(() => {
    setProps(AdviseProps);
  }, [AdviseProps]);

  return (
    <div className={[, styles.childrenAuthen].join(" ")}>
      <div className={["row", styles.headerCreateAcc].join(" ")}>
        Thông tin tư vấn
      </div>
      {user ? (
        <div className={["row", styles.contentCreateAcc1].join(" ")}>
          Nhập đầy đủ thông tin để chúng tôi có thể tư vấn và trợ giúp cho bạn.
        </div>
      ) : (
        <div className={["row", styles.contentCreateAcc2].join(" ")}>
          Đăng nhập hoặc đăng ký để được hỗ trợ.
        </div>
      )}

      {user ? (
        <>
          <div className={[styles.form].join(" ")}>
            {form.map((item: any, key: Key) => {
              return (
                <div key={key} className={["row", styles.row1].join(" ")}>
                  <div className={[, styles.textInput].join(" ")}>
                    {item.hint}:
                  </div>
                  <div className={["col-12", styles.Input1].join(" ")}>
                    <Input
                      placeholder={item.hint}
                      type={item.type}
                      defaultValue={valueDefault(item.key)}
                      shape={"standard"}
                      onChange={(e: any) => {
                        setFormSP(valueChange(item.key, e));
                      }}
                    />
                  </div>
                </div>
              );
            })}
            <div className={["row", styles.contentCreateAccImg].join(" ")}>
              *Dùng camera sau của điện thoại và làm theo ví dụ
            </div>
            {uploadMedia.map((item: any, key: Key) => {
              return (
                <div key={key} className={["row", styles.row1].join(" ")}>
                  <div className={[, styles.textInput].join(" ")}>
                    {item.hint}:
                  </div>
                  <div className={["col-12 row", styles.hint].join(" ")}>
                    <div className={[, styles.textHint].join(" ")}>Vd: </div>
                    <div className={[, styles.outImgHint].join(" ")}>
                      <Image
                        src={`/${item.img}`}
                        alt="Your Image"
                        width={100} // Set the width of the image
                        height={100} // Set the height of the image
                      />
                    </div>
                  </div>
                  <div className={["col-12", styles.Input2].join(" ")}>
                    <input
                      type="file"
                      onChange={(e: any) => {
                        setFormSP(valueChange(item.key, e.target.files[0]));
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className={["row", styles.content1].join(" ")}>
            Bằng cách nhấp vào “Xác nhận”, bạn sẽ cho chúng tôi biết tình trạng
            da hiện tại của bạn, chúng tôi sẽ liên hệ sớm nhất để tư vấn.
          </div>

          <Button
            className={[, styles.buttonResign].join(" ")}
            border={true}
            children={"Xác nhận"}
            borderRadius={"round"}
            type={"button"}
            color={"fill"}
            onClick={handelSubmit}
          />
        </>
      ) : (
        <Authen command={"Normal"} />
      )}
    </div>
  );
};
export default Advise;
