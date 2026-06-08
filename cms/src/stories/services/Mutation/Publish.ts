import apiConfig from "../apiConfig";
type getAllProps = {
  table: string;
  id: string | number;
  publish?: boolean;
  type?: "snake" | "camel";
};

const Publish = async ({ table, id, publish }: getAllProps) => {
  return await apiConfig("/cms/update", {
    table: table,
    update: {
      data: [
        {
          where: {
            id: {
              _eq: id,
            },
          },
          fields: {
            publish: !publish,
          },
        },
      ],
      result: ["id"],
    },
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
export { Publish };
