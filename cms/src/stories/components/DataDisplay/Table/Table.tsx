import styles from "./Table.module.scss";
import React, { useEffect, useState } from "react";
import {
  Header,
  TableAction,
  TableEmpty,
  TableContent,
  Row,
  Skeleton,
} from "../../index";
import { GetAll } from "../../../services";
import { TablePaging } from "./TablePaging";
import { useRecoilState } from "recoil";
import { TableState } from "../../../recoil";

interface dataSource {
  table: string;
  isBackendData?: Boolean;
  data?: any;
  where?: any;
  join?: any;
}
interface config {
  tableInformation?: any;
  tableDisplay: any;
  tableOptions: any;
}
type TableProps = {
  loading?: boolean;
  dataSource: dataSource;
  config: config;
  typeGridRender?: "default" | "image";
  valueSegmented?: "Kanban" | "List";
  onRow?: (record?: any, index?: any) => void;
  rowSelection?: any;
  rowClassName?: any;
};

const Table = (TableProps: TableProps) => {
  //Define
  const [changeShow, setChangeShow] = useState(TableProps.valueSegmented);
  const [table, setTable] = useRecoilState<any>(TableState);
  const tableName = TableProps.dataSource.table;
  const [pagination, setPagination] = useState<any>({
    page: 0,
    defaultSizePage: 10,
  });
  const [loading, setLoading] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);
  const [search, setSearch] = useState("");
  const tableActionConfig = {
    title: TableProps.config.tableOptions.search?.title,
    search: {
      ...TableProps.config.tableOptions.search,
      onPressEnter: (e: string) => {
        setSearch(e);
      },
    },
    valueSegmented: changeShow,
    onChangeValueSegmented: (value: any) => {
      setChangeShow(value);
    },
  };

  //Function handle
  const handleOnShowSizeChange = (current: any, defaultSizePage: any) => {
    setPagination((item: any) => ({
      ...item,
      defaultSizePage: defaultSizePage,
    }));
  };
  const handleOnChangePage = (page: any) => {
    setPagination((item: any) => ({ ...item, page: page - 1 }));
    TableProps.config.tableOptions?.paging.onChange &&
      TableProps.config.tableOptions?.paging.onChange({
        ...pagination,
        page: page - 1,
      });
  };

  const addFields = (columns: any[]) => {
    var fields: any = [];
    columns.map((item: any) => {
      if (item.children && item.children.length > 0) {
        fields = [...fields, ...addFields(item.children)];
      } else {
        fields =
          item.dataIndex != "action"
            ? [
                ...fields,
                item.raw
                  ? { raw: item.raw }
                  : item.prefixQuery
                  ? item.prefixQuery + "." + item.dataIndex
                  : item.dataIndex,
              ]
            : fields;
      }
    });
    return fields;
  };
  // Call api
  const getDataFromApi = async (page?: number, defaultSizePage?: number) => {
    var fields: any =
      TableProps.config.tableDisplay.columns &&
      TableProps.config.tableDisplay.columns.length > 0 &&
      addFields(TableProps.config.tableDisplay.columns);
    await (TableProps.dataSource.isBackendData && fields
      ? GetAll({
          table: tableName,
          fields: fields,
          pagingEnable: TableProps.config.tableOptions.paging?.enable,
          limit: defaultSizePage,
          offset: page,
          where: TableProps.dataSource.where,
          searchField: TableProps.config.tableOptions.search?.fields,
          search: search,
          join: TableProps.dataSource.join,
        }).then((res: any) => {
          if (res) {
            table[tableName]
              ? setTable((item: any) => ({
                  ...item,
                  [tableName]: {
                    table: tableName,
                    total: res?.[tableName + "_aggregate"].aggregate.count,
                    data: res[tableName],
                  },
                }))
              : setTable({
                  [TableProps.dataSource.table]: {
                    table: tableName,
                    total: res?.[tableName + "_aggregate"].aggregate.count,
                    data: res[tableName],
                  },
                });
          }
        })
      : table[tableName]
      ? setTable((item: any) => ({
          ...item,
          [TableProps.dataSource.table]: {
            table: tableName,
            total: TableProps.dataSource.data.length,
            data: TableProps.dataSource.data,
          },
        }))
      : setTable({
          [TableProps.dataSource.table]: {
            table: tableName,
            total: TableProps.dataSource.data.length,
            data: TableProps.dataSource.data,
          },
        }));
    setLoadingTable(false);
    setLoading(false);
  };

  //use Effect

  useEffect(() => {
    setLoadingTable(true);
    TableProps.config.tableOptions.paging?.enable
      ? getDataFromApi(pagination.page, pagination.defaultSizePage)
      : getDataFromApi();
  }, [
    pagination,
    search,
    TableProps.loading,
    TableProps.config.tableOptions.filter,
  ]);

  useEffect(() => {
    setPagination({
      page: 0,
      defaultSizePage: 10,
    });
  }, [search, TableProps.config.tableOptions.filter]);

  useEffect(() => {
    getDataFromApi(pagination.page, pagination.defaultSizePage);
  }, [TableProps.dataSource.data]);
  //Function render

  return (
    <>
      {TableProps.config.tableInformation && (
        <Header {...TableProps.config.tableInformation} />
      )}
      <div className={[styles.Table, "container"].join(" ")}>
        {loading ? (
          <Skeleton />
        ) : (
          <>
            {(!table[tableName] ||
              !table[tableName].data ||
              table[tableName].total == 0) &&
              !search &&
              !TableProps.config.tableOptions.filter && (
                <TableEmpty {...TableProps.config.tableInformation} />
              )}
            {((table[tableName] &&
              table[tableName].data &&
              table[tableName].total > 0) ||
              search ||
              TableProps.config.tableOptions.filter) && (
              <>
                <TableAction {...tableActionConfig} />
                <TableContent
                  tableDisplay={TableProps.config.tableDisplay}
                  data={table[tableName]?.data}
                  typeView={changeShow}
                  loading={loadingTable}
                  tableActions={TableProps.config.tableOptions.tableActions}
                  typeKanbanRender={TableProps.typeGridRender}
                  onRow={TableProps.onRow}
                  renderSelect={
                    TableProps.config.tableOptions.renderSelect &&
                    TableProps.config.tableOptions.renderSelect
                  }
                  onChange={TableProps.config.tableOptions.onChange}
                />
              </>
            )}
            {table[tableName] &&
            table[tableName].total &&
            TableProps.config.tableOptions.paging.enable ? (
              <Row justify="center" style={{ margin: "25px 0" }}>
                <TablePaging
                  {...TableProps.config.tableOptions.paging}
                  total={table[tableName].total}
                  onChange={handleOnChangePage}
                  onShowSizeChange={handleOnShowSizeChange}
                  showSizeChanger={true}
                  current={pagination.page + 1}
                  pageSize={
                    pagination.defaultSizePage ? pagination.defaultSizePage : 10
                  }
                />
              </Row>
            ) : (
              <></>
            )}
          </>
        )}
      </div>
    </>
  );
};

Table.defaultValue = {
  valueSegmented: "List",
};
export { Table };
export type { TableProps };
