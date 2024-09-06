import Axios from "axios";

export const clientAxios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  timeout: 1 * 1000,
  // timeout: 100 * 1000,
});

const getConnectedInstance = (account: any, signMessage: any, accessToken: any) => {
  const connectedInstance = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
    timeout: 1 * 1000,
  });

  // request chỉ được gọi khi connect trong trạng thái thành công, có tk ok và ta chỉ check TH duy nhất là đang dùng
  // dở thì hết hạn thôi. Đảm bảo là AccessToken, tk tồn tại rồi.
  // PP cũ này kém bảo mật vì có thể đổi time trong localStorage gây lỗi
  connectedInstance.interceptors.request.use(
    async (config) => {
      const objectAccessToken = JSON.parse(accessToken);
      // lấy accessToken nếu hết hạn
      // const accessToken = localStorage.getItem("AccessToken");
      // if (accessToken && accessToken != "undefined") {
      if (parseInt(objectAccessToken?.exp) <= new Date().getTime() / 1000 + 20) {
        localStorage.removeItem("AccessToken");
        const resNonce = await clientAxios
          .post("/v1/auth/nonce", { address: account?.address })
          .then((res) => res.data);
        const dataSigned = await signMessage({
          message: resNonce.data.message,
          nonce: resNonce.data.nonce,
          address: true,
        });
        const bodyLogin = {
          address: account?.address,
          pubKey: account?.publicKey,
          fullMessage: (dataSigned as any).fullMessage,
          signature: (dataSigned as any).signature,
        };
        const resLogin = await clientAxios
          .post("/v1/auth/login", bodyLogin)
          .then((res) => res.data);
        localStorage.setItem("AccessToken", JSON.stringify((resLogin as any).data));
      }
      // Gán bearer
      (config as any).headers.Authorization = `Bearer ${objectAccessToken.token}`;
      return config;
      // }
      //   else {
      //     return Promise.reject("Access token not exist");
      //   }
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  return connectedInstance;
};
export default getConnectedInstance;
