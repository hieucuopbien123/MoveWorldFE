import { Box, Button, ButtonGroup, Spinner, Tab, TabList, Tabs, Text } from "@chakra-ui/react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from "@chakra-ui/react";
import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import { clientAxios } from "@/utils/axiosConfig";
import { useAppContext } from "@/store";
import { formatPrice } from "@/utils/format";
import { usePagination } from "@ajna/pagination";
import { useRouter } from "next/router";
import CustomPagination from "@/components/CustomPagination";
import AnimatedPageWrapper from "@/components/AnimatedPageWrapper";
import Head from "next/head";
import { NextSeo } from "next-seo";

const perPage = 10;
const rankingHeaderConfig = [
  {
    title: "Rank",
    isSortable: false,
    align: "center",
  },
  {
    title: "Collection",
    isSortable: true,
    align: "left",
    name: "name",
  },
  {
    title: "Total Volume",
    isSortable: true,
    align: "right",
    name: "currentVolume",
  },
  {
    title: "Volume change",
    isSortable: true,
    align: "right",
    name: "volumeChange",
  },
  {
    title: "Floor Price",
    isSortable: true,
    align: "right",
    name: "currentFloorPrice",
  },
  {
    title: "Floor Change",
    isSortable: true,
    align: "right",
    name: "currentFloorPriceChange",
  },
  {
    title: "Total Holder",
    isSortable: true,
    align: "right",
    name: "holder",
  },
  {
    title: "Item",
    isSortable: true,
    align: "right",
    name: "numNft",
  },
];

const Ranking = () => {
  const router = useRouter();
  const { aptosToDollar } = useAppContext();
  const [sortConfig, setSortConfig] = useState({
    name: "currentVolume",
    isAsc: true,
  });
  const [data, setData] = useState([]);
  const [numberOfPage, setNumberOfPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initData();
  }, []);
  const initData = async () => {
    try{
      setLoading(true);
      const response = await clientAxios.get(`v1/collection/ranking`, {
        params: {
          fromTime: Date.now() - 24 * 60 * 60 * 1000,
          pageSize: perPage,
          sort: "-currentVolume",
          page: 1,
        },
      });
      const processedData = response.data.data.map((d: any) => ({
        uri:
          d?.uri && (d.uri.startsWith("/") || d.uri.startsWith("http"))
            ? d.uri
            : "/user/background.png",
        name: d?.name || "Unnamed",
        isKYCed: d?.isKyc || false,
        numNft: d?.numNft || 0,
        creator: d.creator,
        currentVolume: d?.currentVolume / Math.pow(10, 8),
        currentFloorPrice: d?.currentFloorPrice / Math.pow(10, 8),
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
      setData(processedData);
      setNumberOfPage(response.data.meta.pageCount);
      setLoading(false);
    } catch(e){
      console.log(e);
      const processedData = [
        {
          uri: "/user/background.png",
          name: "Unnamed",
          isKYCed: true,
          numNft: 1,
          creator: "0x000000000000001",
          currentVolume: 100000000000 / Math.pow(10, 8),
          currentFloorPrice: 100000000000 / Math.pow(10, 8),
          percentVolumeChange: 10,
          percentFloorChange: 10,
          holder: "0x000000000000001",
        }
      ];
      setData(processedData);
      setNumberOfPage(1);
      setLoading(false);
    }
  };

  const [fromTime, setFromTime] = useState(Date.now() - 24 * 60 * 60 * 1000);
  const [isDollarUnit, setIsDollarUnit] = useState(false);

  const { currentPage, setCurrentPage, pagesCount, pages } = usePagination({
    pagesCount: numberOfPage,
    initialState: { currentPage: 1 },
    limits: {
      outer: 1,
      inner: 2,
    },
  });
  const fetchData = async (sortTerm: any, fromTime: any, page: any) => {
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
    setData(processedData);
  };
  const handleChangeSortConfig = (name: any) => {
    let isAsc = sortConfig.isAsc;
    let sortTerm = "";

    if (sortConfig) {
      if (sortConfig.name === name) {
        isAsc = !isAsc;
        sortTerm = isAsc ? "-" + name : name;
        fetchData(sortTerm, fromTime, currentPage);
      } else {
        isAsc = true;
        sortTerm = isAsc ? "-" + name : name;
        setCurrentPage(1);
        fetchData(sortTerm, fromTime, 1);
      }
    }
    setSortConfig({ name, isAsc });
  };
  const toggleUnit = () => {
    setIsDollarUnit((state) => !state);
  };
  const getSortTerm = () => {
    return sortConfig.isAsc ? "-" + sortConfig.name : sortConfig.name;
  };
  const handleChangeTabIndex = (index: any) => {
    let _fromTime = 0;
    if (index == 0) _fromTime = Date.now() - 24 * 60 * 60 * 1000;
    else if (index == 1) _fromTime = Date.now() - 7 * 24 * 60 * 60 * 1000;
    else _fromTime = 0;
    setFromTime(_fromTime);
    setCurrentPage(1);
    fetchData(getSortTerm(), _fromTime, 1);
  };

  const pageChange = (pageNum: any) => {
    setCurrentPage(pageNum);
    fetchData(getSortTerm(), fromTime, pageNum);
  };

  const goToCollection = (ele: any) => {
    router.push(`/explore/${ele.creator}/${ele.name}`);
  };

  return (
    <>
      <Head>
        <title>Collection ranking - MoveWorld</title>
        <NextSeo
          useAppDir={true}
          description="Collection ranking on MoveWorld- The world&#x27;s largest web3 defi marketplace for NFTs and crypto collectibles on Aptos blockchain. Browse, create, buy, sell, and auction NFTs today."
          openGraph={{
            url: "https://moveworld.io/stats/ranking",
            title: "Collection ranking - MoveWorld",
            images: [
              {
                url: "/nft assets/collectionnft1.jpg",
                alt: "Collection Image",
              },
            ],
            type: "website",
            siteName: "MoveWorld",
          }}
          canonical="https://moveworld.io/stats/ranking"
        />
        <meta
          name="twitter:image"
          content="https://i.pinimg.com/564x/0b/5e/e0/0b5ee065375780bab4be09673f9e16e0.jpg"
        />
      </Head>
      <AnimatedPageWrapper animated="fadeIn">
        <Box px={"20px"} mt={30} pb={100}>
          <Box textAlign={"center"} fontSize={40} fontWeight={"bold"} mb={5}>
            <Text>Collection Ranking</Text>
          </Box>
          <Box display={"flex"} justifyContent="space-between">
            <Tabs
              variant={"soft-rounded"}
              onChange={(index) => {
                handleChangeTabIndex(index);
              }}
              colorScheme="green"
            >
              <TabList>
                <Tab>24 hours</Tab>
                <Tab>7 days</Tab>
                <Tab>All time</Tab>
              </TabList>
            </Tabs>
            <ButtonGroup isAttached variant={"solid"}>
              <Button
                backgroundColor={!isDollarUnit ? "#c6f6d5" : "initial"}
                color={!isDollarUnit ? "#276749" : "#4a5568"}
                onClick={toggleUnit}
                _hover={{ opacity: "0.8" }}
              >
                APT
              </Button>
              <Button
                backgroundColor={isDollarUnit ? "#c6f6d5" : "initial"}
                color={isDollarUnit ? "#276749" : "#4a5568"}
                onClick={toggleUnit}
                _hover={{ opacity: "0.8" }}
              >
                USD
              </Button>
            </ButtonGroup>
          </Box>
          <Box mb={5}></Box>
          <TableContainer
            borderRadius={"16px"}
            sx={{
              "&::-webkit-scrollbar-track": {
                backgroundColor: "background",
              },
              "&::-webkit-scrollbar": {
                height: "7px",
              },
              "&::-webkit-scrollbar-thumb": {
                borderRadius: "10px",
                backgroundColor: "primary",
              },
            }}
          >
            {loading ? (
              <Box textAlign={"center"}>
                <Spinner color="primary" thickness="4px" size={"lg"} />
              </Box>
            ) : (
              <Table variant={"striped"} colorScheme={"blackAlpha"}>
                <Thead backgroundColor={"tableHeader"}>
                  <Tr>
                    {rankingHeaderConfig.map((el) => {
                      return (
                        <Th key={el.title} padding={"20px 24px"}>
                          <Box
                            display={"flex"}
                            color={"gray.300"}
                            sx={{
                              "&:hover": {
                                color: "white",
                                transition: ".2s linear",
                              },
                            }}
                            justifyContent={el.align}
                            onClick={() => {
                              handleChangeSortConfig(el.name);
                            }}
                          >
                            <Box cursor={"pointer"}>{el.title}</Box>
                            {el.isSortable && (
                              <Box marginLeft={"10px"} cursor={"pointer"}>
                                {el.name === sortConfig.name ? (
                                  sortConfig.isAsc ? (
                                    <ArrowUpIcon></ArrowUpIcon>
                                  ) : (
                                    <ArrowDownIcon></ArrowDownIcon>
                                  )
                                ) : (
                                  <ArrowUpDownIcon></ArrowUpDownIcon>
                                )}
                              </Box>
                            )}
                          </Box>
                        </Th>
                      );
                    })}
                  </Tr>
                </Thead>
                <Tbody>
                  {data.map((el: any, index: number) => {
                    return (
                      <Tr
                        key={index}
                        sx={{
                          "&:hover": {
                            bgColor: "hoverTable",
                          },
                        }}
                        cursor="pointer"
                        onClick={() => goToCollection(el)}
                      >
                        <Td padding={"24px 24px"} textAlign={"center"}>
                          {index + 1 + (currentPage - 1) * perPage == 1 && (
                            <Image
                              src={"/ranking/top1.png"}
                              alt="top1"
                              width={30}
                              height={30}
                            ></Image>
                          )}
                          {index + 1 + (currentPage - 1) * perPage == 2 && (
                            <Image
                              src={"/ranking/top2.png"}
                              alt="top2"
                              width={30}
                              height={30}
                            ></Image>
                          )}
                          {index + 1 + (currentPage - 1) * perPage == 3 && (
                            <Image
                              src={"/ranking/top3.png"}
                              alt="top3"
                              width={30}
                              height={30}
                            ></Image>
                          )}
                          {index + 1 + (currentPage - 1) * perPage > 3 &&
                            index + 1 + (currentPage - 1) * perPage}
                        </Td>
                        <Td padding={"24px 24px"}>
                          <Box display={"flex"} alignItems="center">
                            <Box borderRadius="50%" overflow={"hidden"} width={30} height={30}>
                              <Image
                                src={el.uri}
                                width={30}
                                height={30}
                                style={{
                                  borderRadius: "50%",
                                  width: "30px",
                                  height: "30px",
                                  backgroundColor: "#b9bec7",
                                }}
                                alt="collection"
                              ></Image>
                            </Box>

                            <Text fontWeight={"bold"} marginLeft={"12px"}>
                              {el.name}
                            </Text>
                            {el.isKYCed && (
                              <div
                                className="w-5 h-5 flex"
                                style={{ marginLeft: "5px", position: "relative", top: "2px" }}
                              >
                                <svg viewBox="0 0 30 30" className="w-full">
                                  <path
                                    d="M13.474 2.801a2 2 0 0 1 3.052 0l.963 1.136a2 2 0 0 0 2 .65l1.447-.353a2 2 0 0 1 2.469 1.794l.11 1.485a2 2 0 0 0 1.237 1.702l1.378.564a2 2 0 0 1 .943 2.903l-.783 1.266a2 2 0 0 0 0 2.104l.783 1.266a2 2 0 0 1-.943 2.903l-1.378.564a2 2 0 0 0-1.236 1.702l-.111 1.485a2 2 0 0 1-2.47 1.794l-1.446-.353a2 2 0 0 0-2 .65l-.963 1.136a2 2 0 0 1-3.052 0l-.963-1.136a2 2 0 0 0-2-.65l-1.447.353a2 2 0 0 1-2.469-1.794l-.11-1.485a2 2 0 0 0-1.237-1.702l-1.378-.564a2 2 0 0 1-.943-2.903l.783-1.266a2 2 0 0 0 0-2.104l-.783-1.266a2 2 0 0 1 .943-2.903l1.378-.564a2 2 0 0 0 1.236-1.702l.111-1.485a2 2 0 0 1 2.47-1.794l1.446.353a2 2 0 0 0 2-.65l.963-1.136Z"
                                    fill="#2081e2"
                                  />
                                  <path
                                    d="M13.5 17.625 10.875 15l-.875.875 3.5 3.5 7.5-7.5-.875-.875-6.625 6.625Z"
                                    fill="#fff"
                                    stroke="#fff"
                                  />
                                </svg>
                              </div>
                            )}
                          </Box>
                        </Td>
                        <Td padding={"24px 24px"}>
                          <Box display={"flex"} justifyContent="end">
                            {isDollarUnit && <Text>$</Text>}
                            <Text>
                              {formatPrice(
                                isDollarUnit
                                  ? el.currentVolume * (aptosToDollar || 0)
                                  : el.currentVolume
                              )}
                            </Text>
                            {!isDollarUnit && <Text marginLeft={"5px"}>APT</Text>}
                          </Box>
                        </Td>
                        <Td padding={"24px 24px"}>
                          <Box width={"100%"} display="flex" justifyContent={"end"}>
                            {el.percentVolumeChange != 0 ? (
                              <Box
                                width={"fit-content"}
                                backgroundColor={
                                  el.percentVolumeChange > 0 ? "#34c77b1F" : "#ff42381f"
                                }
                                padding={"0px 8px"}
                                borderRadius="24px"
                                display={"flex"}
                                alignItems={"center"}
                              >
                                {el.percentVolumeChange > 0 ? (
                                  <FiTrendingUp color="#34c77b"></FiTrendingUp>
                                ) : (
                                  <FiTrendingDown color="#FF4238"></FiTrendingDown>
                                )}
                                <Text
                                  color={el.percentVolumeChange > 0 ? "#34c77b" : "#FF4238"}
                                  marginLeft={"5px"}
                                >
                                  {Math.abs(el.percentVolumeChange)}
                                  {"%"}
                                </Text>
                              </Box>
                            ) : (
                              <Text>-&nbsp;%</Text>
                            )}
                          </Box>
                        </Td>
                        <Td padding={"24px 24px"}>
                          <Box display={"flex"} justifyContent="end">
                            {isDollarUnit && <Text>$</Text>}
                            <Text>
                              {formatPrice(
                                isDollarUnit
                                  ? el.currentFloorPrice * (aptosToDollar || 0)
                                  : el.currentFloorPrice
                              )}
                            </Text>
                            {!isDollarUnit && <Text marginLeft={"5px"}>APT</Text>}
                          </Box>
                        </Td>
                        <Td padding={"24px 24px"}>
                          <Box width={"100%"} display="flex" justifyContent={"end"}>
                            {el.percentFloorChange != 0 ? (
                              <Box
                                width={"fit-content"}
                                backgroundColor={
                                  el.percentFloorChange > 0 ? "#34c77b1F" : "#ff42381f"
                                }
                                padding={"0px 8px"}
                                borderRadius="24px"
                                display={"flex"}
                                alignItems={"center"}
                              >
                                {el.percentFloorChange > 0 ? (
                                  <FiTrendingUp color="#34c77b"></FiTrendingUp>
                                ) : (
                                  <FiTrendingDown color="#FF4238"></FiTrendingDown>
                                )}
                                <Text
                                  color={el.percentFloorChange > 0 ? "#34c77b" : "#FF4238"}
                                  marginLeft={"5px"}
                                >
                                  {Math.abs(el.percentFloorChange)}
                                </Text>
                              </Box>
                            ) : (
                              <Text>-&nbsp;%</Text>
                            )}
                          </Box>
                        </Td>
                        <Td padding={"24px 24px"} isNumeric>
                          {el.holder}
                        </Td>
                        <Td padding={"24px 24px"} isNumeric>
                          {el.numNft}
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            )}
          </TableContainer>
          <Box mb={5}></Box>
          <CustomPagination
            onPageChange={(page: any) => {
              pageChange(page);
            }}
            {...{ pagesCount, currentPage, pages }}
          />
        </Box>
      </AnimatedPageWrapper>
    </>
  );
};

export default Ranking;
// export async function getServerSideProps() {
//   const response = await clientAxios.get(`v1/collection/ranking`, {
//     params: {
//       fromTime: Date.now() - 24 * 60 * 60 * 1000,
//       pageSize: perPage,
//       sort: "-currentVolume",
//       page: 1,
//     },
//   });
//   const processedData = response.data.data.map((d: any) => ({
//     uri: (d?.uri && (d.uri.startsWith("/") || d.uri.startsWith("http"))) ? d.uri : "/user/background.png",
//     name: d?.name || "Unnamed",
//     isKYCed: d?.isKyc || false,
//     numNft: d?.numNft || 0,
//     creator: d.creator,
//     currentVolume: d?.currentVolume / Math.pow(10, 8),
//     currentFloorPrice: d?.currentFloorPrice / Math.pow(10, 8),
//     percentVolumeChange:
//       d.previousVolume > 0
//         ? (d.currentVolume - d.previousVolume) / d.previousVolume
//         : (d.currentVolume - d.previousVolume) / Math.pow(10, 8),
//     percentFloorChange:
//       d.previousFloorPrice > 0
//         ? (d.currentFloorPrice - d.previousFloorPrice) / d.previousFloorPrice
//         : (d.currentFloorPrice - d.previousFloorPrice) / Math.pow(10, 8),
//     holder: d?.holder,
//   }));
//   return {
//     props: {
//       collection: processedData,
//       pageCount: response.data.meta.pageCount,
//     },
//   };
// }
