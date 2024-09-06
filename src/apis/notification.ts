import getConnectedInstance from "@/utils/axiosConfig";
import { useQuery } from "react-query";

const fetchData = async ({ account, signMessage }: any) => {
  try{
    const accessToken = localStorage.getItem("AccessToken");
    let tempData: any = [];
    if (accessToken && accessToken != "undefined") {
      const response = await getConnectedInstance(account, signMessage, accessToken).get(
        "/v1/user/notification"
      );
      tempData = response.data.data.map((d: any) => ({
        title: d?.title || "No Title",
        content: d?.description,
        time: d?.createAt,
        isRead: d?.isRead,
        id: d?._id,
      }));
      tempData = tempData.sort((a: any, b: any) => b.time - a.time);
    }
    const unread = tempData.filter((d: any) => d.isRead == false);
    return {
      all: tempData,
      unread,
      lengthUnread: unread.length,
    };
  } catch(e){
    console.log(e);
    const tempData = [
      {
        title: "No Title",
        content: "This is description",
        time: 0,
        isRead: false,
        id: "123456",
      }
    ];
    return {
      all: tempData,
      unread: [],
      lengthUnread: 0,
    };
  }
};

export const useNotification = ({ account, showAvatar, disableNotis, signMessage }: any) => {
  const { data, isLoading, isError, refetch } = useQuery(
    ["Notification", account?.address],
    () => fetchData({ account, signMessage }),
    {
      refetchInterval: 15000,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchIntervalInBackground: false,
      enabled: showAvatar && !disableNotis,
    }
  );
  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};
