import { CSSProperties, ReactNode, useState } from "react";
import { Icon } from "../Icon";
import styles from "./Dropdown.module.scss";

export type DropdownProps = {
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  classNameTitle?: string;
  classNameChildren?: string;
  styleTitle?: CSSProperties;
  styleChildren?: CSSProperties;
  style?: CSSProperties;
  stateDefault?: boolean;
  onClick?: () => void;
  onTriggerActionOpen?: (open: Boolean) => void;
  mode?: "bubble" | "drop" | "dropOff" | "bubbleClick";
  bubblePosition?: "start" | "mid" | "end";
  animationIcon?: (open: boolean) => ReactNode;
  disable?: boolean;
  cursorNoDrop?: boolean;
};
export const Dropdown = (DropdownProps: DropdownProps) => {
  // Define constant
  const [open, setOpen] = useState(
    DropdownProps.stateDefault ? DropdownProps.stateDefault : false
  );

  //Function to create

  //Function to action
  const handleOnClickTitle = () => {
    (DropdownProps.mode == "drop" || "bubbleClick") && setOpen(!open);
    DropdownProps.onClick && DropdownProps.onClick();
  };

  //Function hook

  //Function to render
  const renderTitle = (title?: ReactNode) => {
    return (
      <div
        onClick={handleOnClickTitle}
        className={[
          "row",
          "justify-between",
          styles[`Title_${DropdownProps.mode}`],
          DropdownProps.classNameTitle,
        ].join(" ")}
        style={DropdownProps.styleTitle}
      >
        {title}
        {DropdownProps.mode == "drop" &&
          (DropdownProps.animationIcon ? (
            DropdownProps.animationIcon(open)
          ) : (
            <Icon
              icon="faArrowRight"
              className={[styles.Icon, open && styles.Active].join(" ")}
            />
          ))}
      </div>
    );
  };

  const renderChildrenBubbleClick = (children: ReactNode) => {
    return (
      <div
        className={[
          styles[`Children_${DropdownProps.mode}`],
          DropdownProps.bubblePosition &&
            styles[`Bubble_${DropdownProps.bubblePosition}`],
          DropdownProps.classNameChildren,
          open && styles.OpenBubbleClick,
        ].join(" ")}
        style={DropdownProps.styleChildren}
      >
        {children}
      </div>
    );
  };

  const renderChildrenBubble = (children: ReactNode) => {
    return (
      <div
        className={[
          styles[`Children_${DropdownProps.mode}`],
          DropdownProps.bubblePosition &&
            styles[`Bubble_${DropdownProps.bubblePosition}`],
          DropdownProps.classNameChildren,
        ].join(" ")}
        style={DropdownProps.styleChildren}
      >
        {children}
      </div>
    );
  };

  const renderChildrenDrop = (children: ReactNode) => {
    return (
      <div
        className={[
          styles[`Children_${DropdownProps.mode}`],
          open && styles.Open,
          open && styles.classNameChildren,
          DropdownProps.classNameChildren,
        ].join(" ")}
        style={DropdownProps.styleChildren}
      >
        {children}
      </div>
    );
  };
  const renderChildrenDropOff = (children: ReactNode) => {
    return <div style={DropdownProps.styleChildren}>{children}</div>;
  };

  const renderChildrenType = (mode?: string) => {
    switch (mode) {
      case "bubble":
        return renderChildrenBubble(DropdownProps.children);
      case "drop":
        return renderChildrenDrop(DropdownProps.children);
      case "dropOff":
        return renderChildrenDropOff(DropdownProps.children);
      case "bubbleClick":
        return renderChildrenBubbleClick(DropdownProps.children);
      default:
        return renderChildrenDrop(DropdownProps.children);
    }
  };

  //Main render
  return (
    <div
      className={[styles.Dropdown, styles.Bubble, DropdownProps.className].join(
        " "
      )}
      style={
        DropdownProps.cursorNoDrop
          ? { ...DropdownProps.style, cursor: "no-drop" }
          : { ...DropdownProps.style, cursor: "pointer" }
      }
    >
      <>
        {renderTitle(DropdownProps.title)}
        {DropdownProps.disable
          ? undefined
          : renderChildrenType(DropdownProps.mode)}
      </>
    </div>
  );
};

Dropdown.defaultProps = {
  action: "click",
  mode: "dropOff",
  bubblePosition: "mid",
  disable: false,
  cursorNoDrop: false,
};
