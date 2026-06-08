import { Icon, Modal, Typography } from "../../index";
import styles from "./ImageCard.module.scss";
import React, { useEffect, useState } from "react";
// import { useNhostClient } from "@nhost/nextjs";

const { Title, Paragraph } = Typography;
type ImageCardProps = {
  imageFile?: Blob | string;
  preview?: boolean;
  className?: string;
  style?: any;
  hightLightHover?: boolean;
  actions?: any;
};

const ImageCard = (ImageCardProps: ImageCardProps) => {
  const [props, setProps] = useState(ImageCardProps);
  // const { storage } = useNhostClient();

  const [imageData, setImageData] = useState(
    // props.imageFile
    //   ? typeof props.imageFile == "string"
    //     ? storage.getPublicUrl({ fileId: props.imageFile })
    //     : URL.createObjectURL(props.imageFile)
    //   : ""
  );
  const [openPreview, setOpenPreview] = useState(false);

  //Function to handle action
  const handleClosePreview = () => {
    setOpenPreview(false);
  };
  const handleOnPreview = (e: any) => {
    setOpenPreview(true);
  };

  //Function to render
  const renderActionImage = (item: Blob | string) => {
    return (
      <div className={styles.WarpAction}>
        {props.actions.preview && props.actions.preview.children ? (
          props.actions.preview.children
        ) : (
          <Icon
            component="Eye"
            className={styles.Action}
            onClick={() => {
              handleOnPreview(item);
            }}
          />
        )}
      </div>
    );
  };

  useEffect(() => {
    setProps(ImageCardProps);
  }, [ImageCardProps]);
  //main render
  return imageData ? (
    <div
      className={[
        styles.ImageCard,
        props.actions && styles.HightLight,
        props.className,
      ].join(" ")}
      style={props.style}
    >
      <div className={styles.EffectHover}>
        {imageData && (
          <img
            className={[styles.Image].join(" ")}
            src={imageData}
            alt="error"
          />
        )}
      </div>
      {props.actions && renderActionImage(imageData)}
      {props.actions?.preview && (
        <Modal
          title="Image preview"
          open={openPreview}
          footer={null}
          onCancel={handleClosePreview}
          closable={false}
        >
          <img width="100%" src={imageData} />
        </Modal>
      )}
    </div>
  ) : (
    <></>
  );
};
ImageCard.defaultProps = {
  actions: {
    preview: {},
  },
};
export { ImageCard };
export type { ImageCardProps };
