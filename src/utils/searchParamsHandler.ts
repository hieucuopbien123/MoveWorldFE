import { NextRouter } from "next/router";

// export const removeQueryParams = (router: NextRouter, paramsToRemove: Array<string> = []) => {
//   if (paramsToRemove.length > 0) {
//     paramsToRemove.forEach((param) => delete router.query[param]);
//   } else {
//     // Remove all query parameters
//     Object.keys(router.query).forEach((param) => delete router.query[param]);
//   }
//   router.replace(
//     {
//       pathname: router.pathname,
//       query: router.query,
//     },
//     undefined,
//     { shallow: true } // Do not refresh the page when the query params are removed
//   );
// };

// Dùng next/router
export const addQueryParams = (router: NextRouter, key: any, val: any) => {
  // Thay vì set lại url từ đầu, ta cũng có thể thêm 1 query vào url cũ như này
  router.query[key] = val;
  router.replace(router, undefined, { shallow: true });
};
