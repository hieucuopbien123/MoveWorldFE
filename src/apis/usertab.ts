import { UserItemTab } from "@/constance/configuseritemtab";
import getConnectedInstance, { clientAxios } from "@/utils/axiosConfig";
import { useQuery } from "react-query";

export const useUserTab = ({
  tabIndex,
  currentPage,
  account,
  sortParams,
  refetchData,
  signMessage,
  perPage,
  setNumberOfPage,
  setCurrentPage,
}: any) => {
  const { data, isLoading, isError } = useQuery(
    [`UseritemContent${UserItemTab[tabIndex]}`, currentPage, account, sortParams],
    () =>
      fetchDataReactQuery({
        sortParams,
        account,
        signMessage,
        tabIndex,
        currentPage,
        perPage,
        setNumberOfPage,
        setCurrentPage,
      }),
    {
      refetchInterval: () => (refetchData ? 2000 : false),
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchIntervalInBackground: false,
    }
  );
  return {
    data,
    isLoading,
    isError,
  };
};

const fetchDataReactQuery = async ({
  sortParams,
  account,
  signMessage,
  tabIndex,
  currentPage,
  perPage,
  setNumberOfPage,
  setCurrentPage,
}: any) => {
  try{
    let tempData = [];
    let sort = undefined;
    if (sortParams == "high_to_low") sort = "-price";
    else if (sortParams == "low_to_high") sort = "price";
    let resNftLikes: any = [];
    const accessToken = localStorage.getItem("AccessToken");
    if (accessToken && accessToken != "undefined") {
      resNftLikes = await (
        await getConnectedInstance(account, signMessage, accessToken).get("/v1/user/profile")
      ).data.data.likeNfts;
    }
    if (tabIndex == 0 && account?.address) {
      const response = await clientAxios.get("/v1/nft", {
        params: {
          owner: account?.address,
          status: 0,
          page: currentPage,
          pageSize: perPage,
          sort,
        },
      });
      tempData = response.data.data.map((d: any) => ({
        name: d.name,
        price: d.price / Math.pow(10, 8),
        heart: d.likes,
        lastSale: 1000000 / Math.pow(10, 8),
        image: d.uri.startsWith("/") || d.uri.startsWith("http") ? d.uri : "/user/background.png",
        id: d.id,
        liked: resNftLikes.includes(d.id),
        creator: d.creator,
        collection: d.collection,
      }));
      setNumberOfPage(response.data.meta.pageCount);
    } else if (tabIndex == 2 && account?.address) {
      const response = await clientAxios.get("/v1/nft", {
        params: {
          creator: account?.address,
          page: currentPage,
          pageSize: perPage,
          sort,
          status: 3,
        },
      });
      tempData = response.data.data.map((d: any) => ({
        name: d.name,
        price: d.price / Math.pow(10, 8),
        heart: d.likes,
        lastSale: 1000000 / Math.pow(10, 8),
        image: d.uri.startsWith("/") || d.uri.startsWith("http") ? d.uri : "/user/background.png",
        id: d.id,
        liked: resNftLikes.includes(d.id),
      }));
      setNumberOfPage(response.data.meta.pageCount);
    } else if (tabIndex == 3 && account?.address) {
      const accessToken = localStorage.getItem("AccessToken");
      if (accessToken && accessToken != "undefined") {
        const response = await getConnectedInstance(account, signMessage, accessToken).get(
          "/v1/inventory/like",
          {
            params: {
              page: currentPage,
              pageSize: perPage,
              sort,
              status: 3,
            },
          }
        );
        tempData = response.data.data.map((d: any) => ({
          name: d.name,
          price: d.price / Math.pow(10, 8),
          heart: d.numLike,
          lastSale: 1000000 / Math.pow(10, 8),
          image: d.uri.startsWith("/") || d.uri.startsWith("http") ? d.uri : "/user/background.png",
          id: d.id,
          liked: true,
        }));
        setNumberOfPage(response.data.meta.pageCount);
      }
    } else if (tabIndex == 4 && account?.address) {
      const accessToken = localStorage.getItem("AccessToken");
      if (accessToken && accessToken != "undefined") {
        const response = await getConnectedInstance(account, signMessage, accessToken).get(
          "/v1/nft",
          {
            params: {
              owner: account.address,
              page: currentPage,
              pageSize: perPage,
              sort,
              status: 2,
            },
          }
        );
        tempData = response.data.data.map((d: any) => ({
          name: d.name,
          price: d.price / Math.pow(10, 8),
          heart: d.likes,
          lastSale: 1000000 / Math.pow(10, 8),
          image: d.uri.startsWith("/") || d.uri.startsWith("http") ? d.uri : "/user/background.png",
          id: d.id,
          liked: resNftLikes.includes(d.id),
          auctionOfferPrice: (d?.auctionOfferPrice || 0) / Math.pow(10, 8),
          auctionCurrentBidPrice: (d?.auctionCurrentBidPrice || 0) / Math.pow(10, 8),
          auctionEndAt: d?.auctionEndAt || 0,
        }));
        setNumberOfPage(response.data.meta.pageCount);
      }
    }
    if (tempData.length == 0) setCurrentPage(1);
    return tempData;
  } catch(e) {
    console.log(e);
    const tempData = [
      {
        name: "Hieu",
        price: 100000000000 / Math.pow(10, 8),
        heart: 1,
        lastSale: 1000000 / Math.pow(10, 8),
        image: "/user/background.png",
        id: "0001",
        liked: true,
        auctionOfferPrice: 1000000000 / Math.pow(10, 8),
        auctionCurrentBidPrice: 1000000000 / Math.pow(10, 8),
        auctionEndAt: 0,
      }
    ];
    setNumberOfPage(1);
    return tempData;
  }
};
