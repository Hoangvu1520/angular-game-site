import classNames from "classnames";
import { Upload, Button, Media, Row, Col } from "../../index";
import React, { useEffect, useState } from "react";
import styles from "./UploadMedia.module.scss";
import _ from "lodash";
import { Delete } from "@/stories/services";

const cx = classNames.bind(styles);

interface files {
  url: Blob | string;
  [file: string]: any;
}
type UploadMediaProps = {
  onChange?: (listFiles?: files[] | string[]) => void;
  onUpload?: (listFiles: files[], files: files[]) => void;
  configAPI?: any;
  className?: string;
  collection?: string[];
  defaultFiles?: any[];
  defaultValue?: any[];
  maxUpload?: number;
};

const UploadMedia = (UploadMediaProps: UploadMediaProps) => {
  //define constant
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [select, setSelect] = useState(UploadMediaProps.defaultValue);
  const [files, setFiles] = useState(UploadMediaProps.defaultFiles);

  //function to create
  const showModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  //function to handle action
  const handleSelect = (value: any) => {
    setSelect(value);
    UploadMediaProps.onChange && UploadMediaProps.onChange(value);
    setIsModalOpen(!isModalOpen);
  };

  const handleOnDelete = (value: string) => {
    const newListSelect = select?.filter((el: any) => !_.isEqual(el, value));
    setSelect(newListSelect);
    UploadMediaProps.onChange && UploadMediaProps.onChange(newListSelect);
  };

  const handleOnUpload = (listFiles: any, files: any) => {
    UploadMediaProps.onUpload && UploadMediaProps.onUpload(listFiles, files);
  };

  const handleOnDeleteFilesMedia = async (file: string) => {
    Delete({
      table: "Files",
      object: [`"${file}"`],
    }).then((res) => {
      if (res) {
        setFiles(files?.filter((item) => item.url != file));
      }
    });
    // storage.setAdminSecret("tekify2023");
    // storage.delete({ fileId: file }).then(() => {
    // setFiles(files?.filter((item) => item.url != file));
    // });
  };
  //function to hook

  useEffect(() => {
    setSelect(UploadMediaProps.defaultValue);
  }, [UploadMediaProps.defaultValue]);

  useEffect(() => {
    setFiles(UploadMediaProps.defaultFiles);
  }, [UploadMediaProps.defaultFiles]);
  //function to render
  //main render
  return (
    <div className={cx(styles.Show)}>
      <Row className={styles.Warp}>
        {select && select.length > 0 && (
          <Col className={styles.Col}>
            <Upload
              files={select}
              onDelete={handleOnDelete}
              className={cx(styles.File)}
            />
          </Col>
        )}
        <Col className={styles.Col}>
          {((UploadMediaProps.maxUpload &&
            select &&
            select.length < UploadMediaProps.maxUpload) ||
            !UploadMediaProps.maxUpload) && (
            <Button
              onClick={showModal}
              className={cx(styles.Button)}
              icon={"Plus"}
            />
          )}
        </Col>
      </Row>
      <Media
        collection={UploadMediaProps.collection}
        files={files}
        open={isModalOpen}
        onOk={handleSelect}
        onCancel={showModal}
        onChange={handleOnUpload}
        defaultFilesSelect={select}
        fileSelect={select}
        maxSelect={UploadMediaProps.maxUpload}
        onDelete={handleOnDeleteFilesMedia}
      />
    </div>
  );
};

UploadMedia.defaultProps = {
  defaultValue: [],
};

export { UploadMedia };
export type { UploadMediaProps };
