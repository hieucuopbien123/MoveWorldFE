import CustomPagination from "@/components/CustomPagination";
import Empty from "@/components/Empty";
import { clientAxios } from "@/utils/axiosConfig";
import { usePagination } from "@ajna/pagination";
import { CloseIcon } from "@chakra-ui/icons";
import { Box, Spinner, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useQuery } from "react-query";
import CardUser from "./CardUser";

const ListTrader = ({ tabIndex }: any) => {
  const [numberOfPage, setNumberOfPage] = useState(1);
  const perPage = 2;
  const { currentPage, setCurrentPage, pagesCount, pages } = usePagination({
    pagesCount: numberOfPage,
    initialState: { currentPage: 1 },
    limits: {
      outer: 1,
      inner: 2,
    },
  });

  const { data, isLoading, isError } = useQuery(
    [`Stats${tabIndex}`, currentPage],
    () => fetchDataQuery(),
    {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchIntervalInBackground: false,
    }
  );
  const fetchDataQuery = async () => {
    try{
      let tempData = [];
      if (tabIndex == 0) {
        const response = await clientAxios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/user/toptrader?fromTime=${
            Date.now() - 24 * 60 * 60 * 1000
          }&page=${currentPage}&pageSize=${perPage}`
        );
        tempData = response.data.data.map((d: any) => ({
          price: d.amount / Math.pow(10, 8),
          userIcon:
            d.avatar && (d.avatar.startsWith("/") || d.avatar.startsWith("http"))
              ? d.avatar
              : "/user/background.png",
          bgImage:
            d.background && (d.background.startsWith("/") || d.background.startsWith("http"))
              ? d.background
              : "/explore/defaultbackground.jpg",
          name: d.username || "Unnamed",
          address: d.address,
        }));
        setNumberOfPage(response.data.meta.pageCount);
      } else if (tabIndex == 1) {
        const response = await clientAxios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/user/toptrader?fromTime=${
            Date.now() - 24 * 60 * 60 * 1000 * 7
          }&page=${currentPage}&pageSize=${perPage}`
        );
        tempData = response.data.data.map((d: any) => ({
          price: d.amount / Math.pow(10, 8),
          userIcon:
            d.avatar && (d.avatar.startsWith("/") || d.avatar.startsWith("http"))
              ? d.avatar
              : "/user/background.png",
          bgImage:
            d.background && (d.background.startsWith("/") || d.background.startsWith("http"))
              ? d.background
              : "/explore/defaultbackground.jpg",
          name: d.username || "Unnamed",
          address: d.address,
        }));
        setNumberOfPage(response.data.meta.pageCount);
      } else if (tabIndex == 2) {
        const response = await clientAxios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/user/toptrader?fromTime=0&page=${currentPage}&pageSize=${perPage}`
        );
        tempData = response.data.data.map((d: any) => ({
          price: d.amount / Math.pow(10, 8),
          userIcon:
            d.avatar && (d.avatar.startsWith("/") || d.avatar.startsWith("http"))
              ? d.avatar
              : "/user/background.png",
          bgImage:
            d.background && (d.background.startsWith("/") || d.background.startsWith("http"))
              ? d.background
              : "/explore/defaultbackground.jpg",
          name: d.username || "Unnamed",
          address: d.address,
        }));
        setNumberOfPage(response.data.meta.pageCount);
      }
      if (tempData.length == 0) setCurrentPage(1);
      return tempData;
    } catch(e){
      console.log(e);
      const tempData = [
        {
          price: 1000000000 / Math.pow(10, 8),
          userIcon: "/user/background.png",
          bgImage: "/explore/defaultbackground.jpg",
          name: "Unnamed",
          address: "0x0000000000001",
        }
      ];
      setNumberOfPage(1);
      return tempData;
    }
  };

  if (isError) {
    return (
      <Box textAlign="center" py={5}>
        <CloseIcon color="red" />
        <Text color="red">Error fetching data</Text>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <>
        <Box textAlign={"center"}>
          <Spinner color="primary" thickness="4px" size={"lg"} />
        </Box>
      </>
    );
  }

  if (data.length <= 0) {
    return (
      <Box pt={3} textAlign="center">
        <Empty title="No Item" />
      </Box>
    );
  }

  return (
    <>
      <Box className="grid min-[0px]:grid-cols-1 min-[850px]:grid-cols-2 min-[1100px]:grid-cols-3 min-[1250px]:grid-cols-4 min-[2000px]:grid-cols-5 gap-4">
        {data.map((item: any, i: any) => (
          <CardUser item={item} key={i} />
        ))}
      </Box>
      <Box py={3}></Box>
      <CustomPagination onPageChange={setCurrentPage} {...{ pagesCount, currentPage, pages }} />
      <Box py={3}></Box>
    </>
  );
};

export default ListTrader;
