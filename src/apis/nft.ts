import { useQuery } from "react-query";

export const useNFT = ({
  item,
  refetchData,
}: // , creatorIcon, creatorName
any) => {
  const { data, isLoading, isError } = useQuery(
    [`NFTPage_${item.id}`],
    () =>
      fetchData({
        itemid: item.id,
        // , creatorIcon, creatorName
      }),
    {
      refetchInterval: () => (refetchData ? 2000 : false),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchIntervalInBackground: false,
    }
  );

  return {
    data,
    isLoading,
    isError,
  };
};

const fetchData = async ({
  itemid,
}: // , creatorIcon, creatorName
any) => {
  try{
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/nft/${itemid}`);
    const data = await response.json();
  
    const tokenData = {
      collectionid: data.data.collection,
      name: data.data?.name || "",
      creator: data.data.creator,
    };
  
    const processedData = {
      ...tokenData,
      // creatorIcon: creatorIcon,
      // creatorName: creatorName,
      seller: data.data?.seller || "",
      image:
        data.data?.uri && (data.data?.uri.startsWith("/") || data.data?.uri.startsWith("http"))
          ? data.data.uri
          : "/user/background.png",
      price: (data.data?.price || 0) / Math.pow(10, 8),
      id: data.data.id,
      status: data.data.status,
      description: data.data?.description || "",
      histories: data.data?.histories || [],
      auctionHistories: data.data?.auctionHistories || [],
      heart: data.data?.likes || 0,
      properties: data.data?.properties || [],
      transactionFee: data.data?.transactionFee || 5.0,
      royalitiesFee: data.data?.royaltitiesFee || 0.0,
      isKyced: data.data?.isKyc || false,
      auctionOfferPrice: (data.data?.auctionOfferPrice || 0) / Math.pow(10, 8),
      auctionStartAt: data.data?.auctionStartAt || 0,
      auctionEndAt: data.data?.auctionEndAt || 0,
      auctionSeller: data.data?.auctionSeller || "",
      auctionCurrentBidPrice: (data.data?.auctionCurrentBidPrice || 0) / Math.pow(10, 8),
      auctionCurrentBidAddress: data.data?.auctionCurrentBidAddress || "",
      type: data.data?.type || [],
    };
    return processedData;
  } catch(e) {
    console.log(e);
    const tokenData = {
      collectionid: "0001",
      name: "Hieu",
      creator: "0x00000000000001",
    };
    const processedData = {
      ...tokenData,
      seller: "0x00000000000001",
      image: "/user/background.png",
      price: 0 / Math.pow(10, 8),
      id: "0001",
      status: 0,
      description: "This is a description",
      histories: [],
      auctionHistories: [],
      heart: 1,
      properties: [],
      transactionFee: 5.0,
      royalitiesFee: 0.0,
      isKyced: true,
      auctionOfferPrice: (1000000000) / Math.pow(10, 8),
      auctionStartAt: 0,
      auctionEndAt: 0,
      auctionSeller: "",
      auctionCurrentBidPrice: 1000000000 / Math.pow(10, 8),
      auctionCurrentBidAddress: "",
      type: [],
    };
    return processedData;
  }
};
