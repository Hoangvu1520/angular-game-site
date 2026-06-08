// import fetchGraphQL from "../connection";
// import convertObjectToString from "../converObjectToString";
// type getAllProps = {
//   table?: string;
//   object: any[];
//   where?: any;
//   type?: "snake" | "camel";
// };
// const QueryByPK = async ({ table, object, where, type }: getAllProps) => {
//   return await fetchGraphQL(
//     `query MyQuery{
//         ${table}${type == "camel" ? "ByPk" : "_by_pk"}(${convertObjectToString(
//       where
//     )}){
//             ${object && Object.keys(object).toString()}
//         }
//     }`
//   )
//     .then((res) => {
//       if (res) {
//         return res.data[table + (type == "camel" ? "ByPk" : "_by_pk")];
//       }
//       return res;
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// };
// export { QueryByPK };
