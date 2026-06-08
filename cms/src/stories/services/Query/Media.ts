// import React, { useEffect, useState } from "react";
// import fetchGraphQL from "../connection";
// type MediaProps = {};
// const MediaAPI = async () => {
//   return await fetchGraphQL(
//     `query MyQuery {
//         buckets {
//          id
//          createdAt
//          updatedAt
//        }
//        files {
//          url: id
//          name
//          collection: bucketId
//          createdAt
//          updatedAt
//        }
//      }
     
//       `
//   )
//     .then((res) => {
//       if (res) {
//         return res.data;
//       }
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// };
// export { MediaAPI };
