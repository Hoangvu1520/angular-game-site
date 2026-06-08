import { orderBy } from "lodash";
import apiConfig from "../apiConfig";

interface Search {
  value?: string;
  fields: string[];
}

interface OrderBy {
  column: string;
  direction: "asc" | "desc";
}

interface Aggregation {
  function: "count" | "avg" | "min" | "max" | "sum";
  column: string;
}

interface GetAllProps {
  table: string;
  fields: (string | { raw: string })[];
  pagingEnable?: boolean;
  where?: Record<string, any>;
  limit?: number;
  offset?: number;
  orderBy?: OrderBy;
  aggregate?: Aggregation;
  searchField?: string[];
  search?: string;
  join?: any;
}

const GetAll = async ({
  table,
  fields,
  where,
  pagingEnable,
  limit = 10,
  offset = 0,
  orderBy,
  aggregate,
  searchField,
  search,
  join,
}: GetAllProps) => {
  // try {
  const url = "/cms/query";
  const body = pagingEnable
    ? {
        table: table,
        fields: fields,
        join: join,
        where: where,
        orderBy: orderBy
          ? orderBy
          : {
              column: "created_at",
              direction: "desc",
            },
        offset: offset * limit,
        // search:search,
        limit: limit,
        aggregate: aggregate
          ? aggregate
          : {
              function: "count",
              column: "id",
            },
        searchField: searchField,
        whereLike: search,
      }
    : {
        table: table,
        fields: fields,
        where: where,
        join: join,
        orderBy: orderBy
          ? orderBy
          : {
              column: "created_at",
              direction: "desc",
            },
        aggregate: aggregate
          ? aggregate
          : {
              function: "count",
              column: "id",
            },
        searchField: searchField,
        whereLike: search,
      };
  return await apiConfig(url, body)
    .then((res) => {
      if (res.error) {
        console.error(res.error);
        throw res.error;
      }
      return res.data;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
  // } catch (error) {
  //   console.log("Error fetching data:", error);
  // }
};

export { GetAll };
