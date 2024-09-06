import { clientAxios } from "@/utils/axiosConfig";
import { useQuery } from "react-query";

export const useRanking = ({ sortTerm, fromTime, page, perPage, setNumberOfPage }: any) => {
  const { data, isLoading, isError } = useQuery(
    ["Ranking", sortTerm, fromTime, page],
    () => fetchData(sortTerm, fromTime, page, perPage, setNumberOfPage),
    {
      refetchInterval: false,
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

const fetchData = async (
  sortTerm: any,
  fromTime: any,
  page: any,
  perPage: any,
  setNumberOfPage: any
) => {
  try{
    const response = await clientAxios.get(`v1/collection/ranking`, {
      params: {
        fromTime: fromTime,
        pageSize: perPage,
        sort: sortTerm,
        page: page,
      },
    });
    const processedData = response.data.data.map((d: any) => ({
      uri:
        d?.uri && (d?.uri.startsWith("/") || d?.uri.startsWith("http"))
          ? d.uri
          : "/user/background.png",
      name: d?.name || "",
      isKYCed: d?.isKyc || false,
      numNft: d?.numNft || 0,
      currentVolume: d?.currentVolume / Math.pow(10, 8),
      currentFloorPrice: d?.currentFloorPrice / Math.pow(10, 8),
      creator: d.creator,
      percentVolumeChange:
        d.previousVolume > 0
          ? (d.currentVolume - d.previousVolume) / d.previousVolume
          : (d.currentVolume - d.previousVolume) / Math.pow(10, 8),
      percentFloorChange:
        d.previousFloorPrice > 0
          ? (d.currentFloorPrice - d.previousFloorPrice) / d.previousFloorPrice
          : (d.currentFloorPrice - d.previousFloorPrice) / Math.pow(10, 8),
      holder: d?.holder,
    }));
    setNumberOfPage(response.data.meta.pageCount);
    return processedData;
  } catch(e){
    console.log(e);
    return {
      
    }
  }
};
