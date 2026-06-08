import apiConfig from "../apiConfig";
type getAllProps = {
  table: string;
  object: any[];
  column?: string;
};

const SoftDelete = async ({ table, object, column }: getAllProps) => {
  return await apiConfig("/cms/soft-delete", {
    table: table,
    column: column ? column : "id",
    where: object,
  })
    .then((res) => {
      if (res) {
        return res;
      }
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};

const Delete = async ({ table, object, column }: getAllProps) => {
  return await apiConfig("/cms/delete", {
    table: table,
    column: column ? column : "id",
    where: object,
  })
    .then((res) => {
      if (res) {
        return res;
      }
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};

export { Delete, SoftDelete };
