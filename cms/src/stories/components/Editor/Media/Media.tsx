import _ from "lodash";
import React, {
  Key,
  useEffect,
  useState,
  DragEvent,
  DragEventHandler,
} from "react";
// import Upload from "";
import { Icon, Modal, Tabs, Upload } from "@/stories";
import styles from "./Media.module.scss";
// import { useNhostClient, useMultipleFilesUpload } from "@nhost/nextjs";
import Item from "antd/es/list/Item";

export type MediaProps = {
  open: boolean;
  onCancel?: () => void;
  onOk?: (files: any) => void;
  onSelect?: (items: any) => void;
  onChange?: (listFiles: any, files?: any) => void;
  defaultFiles?: any;
  defaultFilesSelect?: any;
  files?: any;
  fileSelect?: any;
  collection?: string[];
  upload?: boolean;
  data?: any[];
  onDelete?: (fileId: string) => void;
  maxSelect?: number;
};

const Media = (MediaProps: MediaProps) => {
  //Define constant
  const [listItem, setListItem] = useState(MediaProps.defaultFiles);
  const [selectItem, setSelectItem] = useState(MediaProps.defaultFilesSelect);
  // const { upload, add, clear } = useMultipleFilesUpload();
  const [countUpload, setCountUpload] = useState(0);

  // const { storage } = useNhostClient();
  //Function to create

  //Function to handle action
  const handleOnOk = () => {
    MediaProps.onOk && MediaProps.onOk(selectItem);
  };

  const handleOnUpload = async (
    filesUpload: FileList,
    bucketId?: string,
    remove?: boolean
  ) => {
    if (remove) {
    } else {
      // setCountUpload(filesUpload.length);
      // clear();
      // add({ files: filesUpload, bucketId: bucketId });
      // upload().then((e: any) => {
      //   var newList = listItem;
      //   e.files &&
      //     e.files.length > 0 &&
      //     e.files.map((item: any) => {
      //       const newImg = item._state.event;
      //       newList.push({ url: newImg.id, collection: newImg.bucketId });
      //     });
      //   setListItem(newList);
      //   setCountUpload(0);
      // });
    }
  };

  const handleDrag: DragEventHandler<HTMLDivElement> = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent, item?: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleOnUpload(e.dataTransfer.files, item);
    }
  };

  const handleSelect = (items: any, item: any, remove?: boolean) => {
    if (remove) {
      MediaProps.onSelect &&
        MediaProps.onSelect(
          selectItem.filter((el: any) => !_.isEqual(el, item))
        );
      setSelectItem(selectItem.filter((el: any) => !_.isEqual(el, item)));
    } else if (
      selectItem &&
      selectItem.length > 0 &&
      selectItem.find((el: any) => _.isEqual(el, item))
    ) {
      MediaProps.onSelect &&
        MediaProps.onSelect(
          selectItem.filter((el: any) => !_.isEqual(el, item))
        );
      setSelectItem(selectItem.filter((el: any) => !_.isEqual(el, item)));
    } else if (
      (MediaProps.maxSelect && selectItem.length < MediaProps.maxSelect) ||
      !MediaProps.maxSelect
    ) {
      MediaProps.onSelect && MediaProps.onSelect([...selectItem, item]);
      setSelectItem([...selectItem, item]);
    }
  };

  const handleOnDelete = (e: string) => {
    // storage.setAdminSecret("tekify2023");
    // storage.delete({ fileId: e });
    MediaProps.onDelete && MediaProps.onDelete(e);
  };

  //Function to hook
  useEffect(() => {
    MediaProps.fileSelect && setSelectItem(MediaProps.fileSelect);
  }, [MediaProps.fileSelect]);

  useEffect(() => {
    MediaProps.files && setListItem(MediaProps.files);
  }, [MediaProps.files]);

  //Function to render
  const renderTabBody = (listItem: any, collection?: string[]) => {
    var newTab: any = [];
    newTab =
      collection && collection.length > 0
        ? collection.map((item: any, key: Key) => ({
            label: item,
            key: key,
            children: renderChildren(
              listItem &&
                listItem.length > 0 &&
                listItem.filter((el: any) => el.collection == item),
              item
            ),
          }))
        : null;
    return newTab;
  };

  const renderUploadButton = (bucketId?: string) => {
    return (
      <label htmlFor="UploadButton" className={styles.UploadButton}>
        <Icon component="Plus" />
        <input
          className={styles.InputFile}
          id="UploadButton"
          type="file"
          onChange={(e) => {
            e.target.files &&
              e.target.files.length > 0 &&
              handleOnUpload(e.target.files, bucketId);
          }}
          multiple
        />
      </label>
    );
  };
  const renderChildren = (listItem: any, item?: string) => {
    var newList: any = [];
    listItem &&
      listItem.length > 0 &&
      listItem.map((files: any) => {
        var list =
          selectItem &&
          selectItem.length > 0 &&
          selectItem.filter((select: any) => _.isEqual(files, select));
        if (list && list.length > 0) {
          newList = [...newList, files];
        }
      });
    return (
      <div
        onDragOver={handleDrag}
        onDrop={(e: DragEvent) => {
          handleDrop(e, item);
        }}
        // onDragEnter={handleDragIn}
        // onDragLeave={handleDragOut}
        className={styles.WarpChildren}
      >
        {listItem && listItem.length > 0 ? (
          <Upload
            onTriggerSelect={handleSelect}
            files={listItem.map((item: any) => item.url)}
            countUpload={countUpload}
            triggerFiles={selectItem}
            maxSelect={MediaProps.maxSelect}
            onDelete={handleOnDelete}
          />
        ) : (
          <div className={styles.NoData}>
            <h1>
              Kéo và thả ảnh vào đây <br /> hoặc
            </h1>
          </div>
        )}
        {renderUploadButton(item)}
      </div>
    );
  };

  //Main render
  const renderMedia = (collection?: any) => {
    switch (collection && collection.length > 0) {
      case true:
        return (
          <Tabs
            items={renderTabBody(listItem, collection)}
            className={[styles.Tabs].join(" ")}
          />
        );
      case false:
        return renderChildren(listItem);
    }
  };
  return (
    <Modal
      open={MediaProps.open}
      onCancel={MediaProps.onCancel}
      onOk={handleOnOk}
      className={styles.Media}
    >
      {renderMedia(MediaProps.collection)}
    </Modal>
  );
};

Media.defaultProps = {
  upload: true,
  collection: false,
  defaultFiles: [],
  defaultFilesSelect: [],
};
export { Media };
