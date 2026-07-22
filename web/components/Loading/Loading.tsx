import styles from "./Loading.module.scss";
import { Icon } from "../Icon";

export type LoadingProps = {
  isLoading?: boolean;
  className?: string;
};

const Loading = (props: LoadingProps) => {
  return props.isLoading == true ? (
    <div
      className={[
        "row justify-center align-center",
        styles.Loading,
        props.className,
      ].join(" ")}
    >
      <div className={styles.Animation}>
        <Icon iconName="Fan" />
      </div>
    </div>
  ) : (
    <></>
  );
};
export default Loading;
