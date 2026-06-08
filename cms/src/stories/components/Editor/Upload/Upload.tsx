import React, {
  DragEvent,
  DragEventHandler,
  Key,
  useEffect,
  useState,
} from "react";
import styles from "./Upload.module.scss";
import { Icon, Modal } from "../../index";
import _ from "lodash";
// import { useNhostClient } from "@nhost/nextjs";

interface files {
  url: Blob;
  [file: string]: any;
}
export type UploadProps = {
  listType?: "text" | "picture";
  defaultFiles?: files[];
  defaultTrigger?: files[];
  onDelete?: (files: string) => void;
  onTriggerSelect?: (
    files: string[],
    file?: string,
    remove?: boolean
  ) => void;
  files?: files[] | string[];
  triggerFiles?: files[] | string[];
  className?: string;
  maxSelect?: number;
  countUpload?: number;
};

export type ImagePreviewProps = {
  imageFile: Blob | string;
};

export const Upload = (UploadProps: UploadProps) => {
  // Define Constants
  const [files, setFiles] = useState<any>(
    UploadProps.defaultFiles ? UploadProps.defaultFiles : []
  );
  const [preview, setPreview] = useState<Blob | string>();
  // const { storage } = useNhostClient();
  const [trigger, setTrigger] = useState<any>(
    UploadProps.defaultTrigger ? UploadProps.defaultTrigger : []
  );
  // Function to Handle Action

  const handleOnPreview = (e: any) => {
    setPreview(e);
  };

  const handleOnDelete = (e: string) => {
    var newArr = files.filter((item: any) => !_.isEqual(e, item));
    var newTrigger = trigger.filter((el: files) => !_.isEqual(e, el));

    if (
      UploadProps.onTriggerSelect &&
      newTrigger.length !== trigger.length
    ) {
      UploadProps.onTriggerSelect(newTrigger, e, true);
      setTrigger(newTrigger);
    }

    UploadProps.onDelete && UploadProps.onDelete(e);

    setFiles(newArr);
  };

  const handleClosePreview = () => {
    setPreview(undefined);
  };

  const handleOnTrigger = (item?: string) => {
    var newTrigger = trigger;
    newTrigger = newTrigger.find((el: files) => _.isEqual(el, item))
      ? newTrigger.filter((el: files) => !_.isEqual(el, item))
      : [...newTrigger, item];
    if (
      UploadProps.onTriggerSelect &&
      (!newTrigger.find((el: string) => _.isEqual(el, item)) ||
        (UploadProps.maxSelect &&
          trigger.length < UploadProps.maxSelect) ||
        !UploadProps.maxSelect)
    ) {
      UploadProps.onTriggerSelect(newTrigger, item);
      setTrigger(newTrigger);
    }
  };
  //Function hook

  useEffect(() => {
    UploadProps.files && setFiles(UploadProps.files);
  }, [UploadProps.files]);

  useEffect(() => {
    UploadProps.triggerFiles && setTrigger(UploadProps.triggerFiles);
  }, [UploadProps.triggerFiles]);

  // Function to Render

  const ImagePreview = (ImagePreview: ImagePreviewProps) => {
    // return ImagePreview.imageFile && ImagePreview.imageFile != "" ? (
    //   <img
    //     className={[styles.Image].join(" ")}
    //     src={
    //       typeof ImagePreview.imageFile == "string"
    //         ? storage.getPublicUrl({ fileId: ImagePreview.imageFile })
    //         : ""
    //     }
    //   />
    // ) : (
    return <div>Loading</div>;
    // );
  };

  const renderActionImage = (item: string) => {
    return (
      <div className={styles.WarpAction}>
        {
          <Icon
            component="Eye"
            className={styles.Action}
            onClick={() => {
              handleOnPreview(item);
            }}
          />
        }
        {
          <Icon
            component="Trash"
            className={styles.Action}
            onClick={() => {
              handleOnDelete(item);
            }}
          />
        }
      </div>
    );
  };

  const renderListImage = () => {
    const numbers = Array.from(
      {
        length: UploadProps.countUpload ? UploadProps.countUpload : 0,
      },
      (_, index) => index
    );
    return (
      <div className={styles.ListImage}>
        {files &&
          files.length > 0 &&
          files.map((item: any, key: Key) => {
            return (
              <div
                key={key}
                className={[
                  styles.WarpImage,
                  UploadProps.onTriggerSelect &&
                    trigger &&
                    trigger.length > 0 &&
                    trigger.find((el: files) =>
                      _.isEqual(el, item)
                    ) &&
                    styles.HightLight,
                ].join(" ")}
              >
                <div
                  className={styles.EffectHover}
                  onClick={() => {
                    UploadProps.onTriggerSelect &&
                      handleOnTrigger(item);
                  }}
                >
                  {item && <ImagePreview imageFile={item} />}
                </div>
                {renderActionImage(item)}
              </div>
            );
          })}
        {numbers &&
          numbers.length > 0 &&
          numbers.map((index: number) => {
            return (
              <div
                key={index}
                className={[styles.WarpImage].join(" ")}
              >
                Loading
              </div>
            );
          })}
      </div>
    );
  };

  // Main Render

  const renderListType = (listType?: string) => {
    switch (listType) {
      case "text":
      case "picture":
      default:
        return renderListImage();
    }
  };
  return (
    <div className={[styles.Upload, UploadProps.className].join(" ")}>
      {renderListType()}
      <Modal
        open={preview ? true : false}
        onCancel={handleClosePreview}
        footer={null}
      >
        {preview && (
          <div className={styles.WarpImagePreview}>
            <ImagePreview imageFile={preview} />
          </div>
        )}
      </Modal>
    </div>
  );
};

Upload.defaultProps = {
  listType: "picture",
};

export default Upload;
