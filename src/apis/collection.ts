import getConnectedInstance, { clientAxios } from "@/utils/axiosConfig";
import { useQuery } from "react-query";

// State management / Dùng react-query
// Biến nó thành 1 hook để gọi ra từ file khác

const fetchDataReactQuery = async ({
  currentPage,
  perPage,
  sortParams,
  collectionid,
  account,
  signMessage,
  setNumberOfPages,
  statusParams,
  setCurrentPage,
}: any) => {
  try{
    const page = currentPage,
      pageSize = perPage;
    let sort = undefined;
    const status = statusParams;
    if (sortParams == "high_to_low") sort = "-price";
    else if (sortParams == "low_to_high") sort = "price";
    const response = await clientAxios.get(`/v1/nft`, {
      params: {
        collection: collectionid,
        page,
        pageSize,
        sort,
        status: status,
      },
    });
    const data = await response.data;
  
    let resNftLikes: Array<any> = [];
    const accessToken = localStorage.getItem("AccessToken");
    if (accessToken && accessToken != "undefined") {
      resNftLikes = await (
        await getConnectedInstance(account, signMessage, accessToken).get("/v1/user/profile")
      ).data.data.likeNfts;
    }
  
    const processedData = data.data.map((d: any) => ({
      image:
        d?.uri && (d?.uri.startsWith("/") || d?.uri.startsWith("http"))
          ? d.uri
          : "/user/background.png",
      name: d?.name || "",
      price: (d?.price || 0) / Math.pow(10, 8),
      lastSale: (d?.lastSale || 0) / Math.pow(10, 8),
      id: d.id,
      heart: d?.likes || 0,
      seller: d.seller,
      creator: d.creator,
      liked: resNftLikes.includes(d.id),
      collection: d.collection,
      status: d.status,
      auctionOfferPrice: (d?.auctionOfferPrice || 0) / Math.pow(10, 8),
      auctionCurrentBidPrice: (d?.auctionCurrentBidPrice || 0) / Math.pow(10, 8),
      auctionEndAt: d?.auctionEndAt || 0,
    }));
    setNumberOfPages(data.meta.pageCount);
    if (processedData.length == 0) setCurrentPage(1);
    return processedData;
  } catch(e){
    console.log(e);
    const processedData = [
      {
        image: "/user/background.png",
        name: "Hieu",
        price: (10000000000) / Math.pow(10, 8),
        lastSale: 10000000000 / Math.pow(10, 8),
        id: "0001",
        heart: 1,
        seller: "0x000000000001",
        creator: "0x000000000001",
        liked: true,
        collection: "0001",
        status: 0,
        auctionOfferPrice: 0 / Math.pow(10, 8),
        auctionCurrentBidPrice: 0 / Math.pow(10, 8),
        auctionEndAt: 0,
      }
    ];
    setCurrentPage(1);
    return processedData;
  }
};

export const useListCollection = ({
  currentPage,
  perPage,
  sortParams,
  collectionid,
  account,
  signMessage,
  refetchData,
  setNumberOfPages,
  statusParams,
  setCurrentPage,
}: any) => {
  const { data, isLoading, isError } = useQuery(
    [`fetchCollectionItem${collectionid}`, sortParams, currentPage, statusParams],
    () =>
      fetchDataReactQuery({
        currentPage,
        perPage,
        sortParams,
        collectionid,
        account,
        signMessage,
        statusParams,
        setNumberOfPages,
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
