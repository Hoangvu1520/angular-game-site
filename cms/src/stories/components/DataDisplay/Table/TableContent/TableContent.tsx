import React, { ReactNode } from "react";
import { KanbanView, ListView } from "../../../index";

type TableContentProps = {
  typeView?: string;
  tableDisplay: any;
  data: any;
  tableActions?: any;
  loading: boolean;
  scroll?: any;
  typeKanbanRender?: "default" | "image";
  onRow?: (record?: any, index?: any) => void;
  renderSelect?: (value?: ReactNode) => ReactNode;
  onChange?: Function;
  typeName?: "snake" | "camel";
};
const TableContent = (TableContentProps: TableContentProps) => {
  const renderTableContent = (type?: string) => {
    switch (type) {
      case "Kanban":
        return (
          <KanbanView
            {...TableContentProps}
            typeRender={TableContentProps.typeKanbanRender}
          />
        );
      case "List":
        return <ListView {...TableContentProps} />;
      default:
        return <ListView {...TableContentProps} />;
    }
  };
  return <>{renderTableContent(TableContentProps.typeView)}</>;
};
export { TableContent };
export type { TableContentProps };
