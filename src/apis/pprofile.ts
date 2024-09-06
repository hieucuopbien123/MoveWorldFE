import { PublicUserTab } from "@/constance/configpublicusertab";
import getConnectedInstance, { clientAxios } from "@/utils/axiosConfig";
import { useQuery } from "react-query";

export const usePProfile = ({
  sortParams,
  account,
  signMessage,
  currentPage,
  perPage,
  setNumberOfPage,
  setCurrentPage,
  tabIndex,
  userid,
  refetchData,
}: any) => {
  const { data, isLoading, isError } = useQuery(
    [`PProfile${PublicUserTab[tabIndex]}`, currentPage, account, sortParams],
    () =>
      fetchDataReactQuery({
        sortParams,
        account,
        signMessage,
        currentPage,
        perPage,
        setNumberOfPage,
        setCurrentPage,
        tabIndex,
        userid,
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
  userid,
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
    if (tabIndex == 0 && userid) {
      const response = await clientAxios.get("/v1/nft", {
        params: {
          creator: userid,
          page: currentPage,
          pageSize: perPage,
          sort,
          status: 3,
        },
      });
      tempData = response.data.data.map((d: any) => ({
        name: d?.name || "",
        price: (d?.price || 0) / Math.pow(10, 8),
        heart: d?.likes || 0,
        lastSale: (d?.lastSale || 0) / Math.pow(10, 8),
        image:
          d?.uri && (d?.uri.startsWith("/") || d?.uri.startsWith("http"))
            ? d.uri
            : "/user/background.png",
        id: d.id,
        liked: resNftLikes.includes(d.id),
        status: d.status,
      }));
      setNumberOfPage(response.data.meta.pageCount);
    } else if (tabIndex == 1 && userid) {
      const response = await clientAxios.get("/v1/nft", {
        params: {
          owner: userid,
          status: 0,
          page: currentPage,
          pageSize: perPage,
          sort,
        },
      });
      tempData = response.data.data.map((d: any) => ({
        name: d?.name || "",
        price: (d?.price || 0) / Math.pow(10, 8),
        heart: d?.likes || 0,
        lastSale: (d?.lastSale || 0) / Math.pow(10, 8),
        image:
          d?.uri && (d?.uri.startsWith("/") || d?.uri.startsWith("http"))
            ? d.uri
            : "/user/background.png",
        id: d.id,
        liked: resNftLikes.includes(d.id),
        status: d.status,
      }));
      setNumberOfPage(response.data.meta.pageCount);
    } else if (tabIndex == 2 && userid) {
      const response = await clientAxios.get("/v1/nft", {
        params: {
          owner: userid,
          page: currentPage,
          pageSize: perPage,
          sort,
          status: 2,
        },
      });
      tempData = response.data.data.map((d: any) => ({
        name: d?.name || "",
        price: (d?.price || 0) / Math.pow(10, 8),
        heart: d?.likes || 0,
        image:
          d?.uri && (d?.uri.startsWith("/") || d?.uri.startsWith("http"))
            ? d.uri
            : "/user/background.png",
        id: d.id,
        liked: resNftLikes.includes(d.id),
        status: d.status,
        auctionEndAt: d?.auctionEndAt || 0,
        auctionCurrentBidPrice: (d?.auctionCurrentBidPrice || 0) / Math.pow(10, 8),
        auctionOfferPrice: (d?.auctionOfferPrice || 0) / Math.pow(10, 8),
      }));
      setNumberOfPage(response.data.meta.pageCount);
    }
    if (tempData.length == 0) setCurrentPage(1);
    return tempData;
  } catch(e){
    console.log(e);
    setCurrentPage(1);
    const tempData = [
      {
        name: "Hieu",
        price: 1000000000 / Math.pow(10, 8),
        heart: 1,
        image: "/user/background.png",
        id: "0001",
        liked: true,
        status: 0,
        auctionEndAt: 0,
        auctionCurrentBidPrice: 10000000000 / Math.pow(10, 8),
        auctionOfferPrice: 100000000000 / Math.pow(10, 8),
      }
    ];
    return tempData;
  }
};
