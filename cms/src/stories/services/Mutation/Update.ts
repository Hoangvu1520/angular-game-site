import apiConfig from "../apiConfig";
import convertObjectToString from "../converObjectToString";
type getAllProps = {
  table: string;
  object: any;
  where?: any;
  result?: string[] | string;
  type?: "snake" | "camel";
};
const Update = async ({ table, object, where, result }: getAllProps) => {
  return await apiConfig("/cms/update", {
    table: table,
    update: {
      data: [
        {
          where: where,
          fields: object,
        },
      ],
      result: result && result.length > 0 ? result : Object.keys(object),
    },
  })
    .then((res) => {
      console.log(1);
      if (res?.error) {
        console.log(2);
        throw res?.error;
      }
      return res;
    })
    .catch((error) => {
      console.error(3, error);
      throw error;
    });
};
export { Update };
