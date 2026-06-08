import { apiConfig } from "..";
// import convertObjectToString from "../converObjectToString";
type InsertProps = {
  table?: string;
  insert?: any;
};
const Insert = async ({ table, insert }: InsertProps, multipleInsert?: InsertProps[]) => {
  const multiple = multipleInsert && multipleInsert.length > 0 ? multipleInsert : []
  const oneInsert = table && insert ? { table: table, insert: insert } : null
  return await apiConfig("/cms/insert", [
    ...multiple, oneInsert
  ])
    .then((res) => {
      if (!res || res.error) {
        console.error(res.error);
        throw res.error;
      } else {
        return res;
      }
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};
export { Insert };
