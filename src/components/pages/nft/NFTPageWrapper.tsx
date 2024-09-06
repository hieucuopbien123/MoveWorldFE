import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Container,
  Divider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
  useColorMode,
  Tooltip,
} from "@chakra-ui/react";
import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import { formatAddress, formatPrice, numberWithCommas } from "@/utils/format";
import { useAppContext } from "@/store";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { errorTopCenter } from "@/utils/toastutils";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import getConnectedInstance, { clientAxios } from "@/utils/axiosConfig";
import debounce from "lodash/debounce";
import AnimatedPageWrapper from "@/components/AnimatedPageWrapper";
import RefetchButton from "@/components/RefetchButton";
import Link from "next/link";
import CopyAddress from "@/components/CopyAddress";

const NFTPageWrapper = ({ item, children }: any) => {
  const { showAvatar } = useAppContext();
  const { colorMode } = useColorMode();

  const [historiesIcon, setHistoriesIcon] = useState(
    Array(item.histories.length).fill("/user/background.png")
  );
  const [historiesName, setHistoriesName] = useState(Array(item.histories.length).fill(""));
  useEffect(() => {
    (async () => {
      try{
        let params = "";
        for (let i = 0; i < item.histories.length; i++) {
          params += `${i == 0 ? "" : "&"}address=${item.histories[i].data.seller}`;
        }
        const response = await clientAxios.get(`/v1/user/profile/public/multi?${params}`);
        setHistoriesIcon(response.data.data.reverse().map((d: any) => d.avatar));
        setHistoriesName(response.data.data.reverse().map((d: any) => d.username));
      } catch(e) {
        console.log(e);
      }
    })();
  }, []);

  const [auctionHistoriesIcon, setAuctionHistoriesIcon] = useState(
    Array(item.auctionHistories.length).fill("/user/background.png")
  );
  const [auctionHistoriesName, setAuctionHistoriesName] = useState(
    Array(item.histories.length).fill("")
  );
  useEffect(() => {
    (async () => {
      try{
        let params = "";
        for (let i = 0; i < item.auctionHistories.length; i++) {
          if (item.auctionHistories[i].historyType == 0) {
            params += `${i == 0 ? "" : "&"}address=${
              item.auctionHistories[i].data?.auctionSeller || ""
            }`;
          } else if (item.auctionHistories[i].historyType == 1) {
            params += `${i == 0 ? "" : "&"}address=${
              item.auctionHistories[i].data?.bidAddress || ""
            }`;
          } else {
            params += `${i == 0 ? "" : "&"}address=${item.auctionHistories[i].data?.seller || ""}`;
          }
        }
        const response = await clientAxios.get(`/v1/user/profile/public/multi?${params}`);
        setAuctionHistoriesIcon(response.data.data.reverse().map((d: any) => d.avatar));
        setAuctionHistoriesName(response.data.data.reverse().map((d: any) => d.username));
      } catch(e) {
      console.log(e);
      }
    })();
  }, []);

  const { account, signMessage } = useWallet();
  const toast = useToast();

  const [heartState, setHeartState] = useState<boolean | undefined>(false);
  const [heartNum, setHeartNum] = useState(item.heart);
  const [showHistories, setShowAllHistories] = useState(6);
  const [showAuctionHistories, setShowAllAuctionHistories] = useState(6);

  useEffect(() => {
    (async () => {
      const accessToken = localStorage.getItem("AccessToken");
      if (accessToken && accessToken != "undefined") {
        const resNftLikes = await (
          await getConnectedInstance(account, signMessage, accessToken).get("/v1/user/profile")
        ).data.data.likeNfts;
        if (resNftLikes.includes(item.id)) {
          setHeartState(true);
        } else {
          setHeartState(false);
        }
      }
    })();
  }, [account]);
  const love = async () => {
    if (heartState != undefined) {
      try {
        if (!showAvatar) throw new Error("You must connect wallet first");
        if (!heartState) {
          setHeartNum(heartNum + 1);
          setHeartState(true);
          debounceUpdateHeart(true);
        } else {
          setHeartNum(heartNum - 1);
          setHeartState(false);
          debounceUpdateHeart(false);
        }
      } catch (e: any) {
        console.log(e);
        toast(errorTopCenter(e?.message ? JSON.stringify(e.message).slice(0, 140) : "Error!"));
      }
    }
  };

  const updateHeart = async (currentState: boolean) => {
    const accessToken = localStorage.getItem("AccessToken");
    if (accessToken && accessToken != "undefined") {
      if (currentState) {
        await getConnectedInstance(account, signMessage, accessToken).post(
          `/v1/user/interactive/${item.id}/like`
        );
      } else {
        await getConnectedInstance(account, signMessage, accessToken).post(
          `/v1/user/interactive/${item.id}/dislike`
        );
      }
    }
  };
  const debounceUpdateHeart = useCallback(debounce(updateHeart, 600), []);

  return (
    <AnimatedPageWrapper animated="fadeIn">
      <Container maxW="1500px" px={["20px", "50px", "80px"]}>
        <Box py={5}></Box>
        <Box display="flex" gap="50px" flexWrap="wrap">
          <Box flex={"300px"} flexGrow={15} wordBreak="break-word">
            <Box position="sticky" top="125px" width="100%">
              <Box
                width="100%"
                padding="5px"
                bgImage={
                  "linear-gradient(315deg, hsla(352, 83%, 64%, 1) 0%, hsla(0, 67%, 61%, 1) 11%, hsla(23, 54%, 59%, 1) 23%, hsla(164, 38%, 56%, 1) 35%, hsla(288, 34%, 56%, 1) 47%, hsla(60, 43%, 60%, 1) 61%, hsla(311, 57%, 65%, 1) 72%, hsla(236, 75%, 68%, 1) 86%, hsla(175, 90%, 68%, 1) 100%)"
                }
                borderRadius="20px"
              >
                <Box borderRadius="20px" overflow={"hidden"} position="relative">
                  <Image
                    src={item.image}
                    sizes="100vh"
                    width="0"
                    height="0"
                    style={{
                      aspectRatio: "1/1",
                      objectFit: "cover",
                      width: "100%",
                      borderRadius: "20px",
                    }}
                    alt="nft"
                  />
                </Box>
              </Box>
              <Box py={"5px"}></Box>
              <Box display="flex" justifyContent="space-between" px="10px">
                <Button
                  variant={"outline"}
                  py="5px"
                  px="20px"
                  borderRadius={"10px"}
                  gap="10px"
                  onClick={love}
                >
                  <Text>{heartNum}</Text>
                  {heartState ? (
                    <FaHeart
                      style={{
                        margin: 0,
                        display: "inline-block",
                        color: "#e73838",
                      }}
                    />
                  ) : (
                    <FiHeart
                      style={{
                        margin: 0,
                        display: "inline-block",
                        color: "gray",
                      }}
                    />
                  )}
                </Button>
                <RefetchButton />
              </Box>
            </Box>
          </Box>
          <Box flex={"380px"} flexGrow={20}>
            <Box display={"flex"} flexWrap={"wrap"} gap="15px">
              {item?.type?.map((t: any, i: number) => (
                <Text
                  key={i}
                  px="10px"
                  py="5px"
                  bgColor={"pink"}
                  opacity="0.8"
                  borderRadius="15px"
                  minWidth={"50px"}
                  textAlign="center"
                >
                  {t}
                </Text>
              ))}
            </Box>
            <Box
              display={"flex"}
              justifyContent="space-between"
              alignItems={"center"}
              flexWrap="wrap"
            >
              <Box
                fontSize="xx-large"
                fontWeight="bold"
                display={"flex"}
                alignItems="center"
                gap={"10px"}
              >
                <div>{item.name}</div>
              </Box>
            </Box>
            <Box py={2}></Box>
            <Box display="flex" gap="10px">
              <Link href={`/pprofile/${item.creator}`}>
                <Box
                  height="60px"
                  width="60px"
                  borderRadius="50%"
                  overflow={"hidden"}
                  position="relative"
                >
                  <Image
                    src={item.creatorIcon}
                    fill
                    style={{
                      objectFit: "cover",
                      backgroundColor: "#b9bec7",
                    }}
                    alt="creator"
                  />
                </Box>
              </Link>
              <Box display="flex" flexDirection={"column"} justifyContent="space-evenly">
                <Text opacity={0.8} fontSize="large">
                  Creator
                  <CopyAddress address={item.creator} />
                </Text>
                <Box wordBreak={"break-word"} display="flex">
                  <Link href={`/pprofile/${item.creator}`}>
                    {item.creatorName ? (
                      <Tooltip
                        label={formatAddress(item.creator, 6)}
                        borderRadius={"10px"}
                        padding="10px"
                        closeOnClick={false}
                      >
                        <span>{item.creatorName}</span>
                      </Tooltip>
                    ) : (
                      <Text>
                        {item?.creator ? formatAddress(item.creator, 10) : item.creator}
                        &nbsp;
                      </Text>
                    )}
                  </Link>
                  {item.isKyced && (
                    <div className="verified-icon flex items-center w-5 h-5">
                      <div className="w-5 h-5 flex">
                        <svg fill="none" viewBox="0 0 30 30" className="w-full">
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
                    </div>
                  )}
                </Box>
              </Box>
            </Box>
            <Box py={4}></Box>
            <Divider borderColor="divider" opacity={0.5} />
            <Box py={5}></Box>
            {children}
            <Box py={5}></Box>
            <Divider borderColor="divider" opacity={0.5} />
            <Box py={5}></Box>

            <Tabs>
              <TabList
                bgColor="backgroundBigText"
                borderRadius={"10px"}
                display="flex"
                gap="10px"
                padding={"10px"}
              >
                <Tab
                  flexGrow={1}
                  bgColor="background"
                  borderRadius="20px"
                  textAlign="center"
                  padding="10px"
                  _selected={{ bg: "primary" }}
                  borderBottomColor="primary"
                >
                  Descriptions
                </Tab>
                <Tab
                  flexGrow={1}
                  bgColor="background"
                  borderRadius="20px"
                  textAlign="center"
                  padding="10px"
                  _selected={{ bg: "primary" }}
                  borderBottomColor="primary"
                >
                  Details
                </Tab>
                <Tab
                  flexGrow={1}
                  bgColor="background"
                  borderRadius="20px"
                  textAlign="center"
                  padding="10px"
                  _selected={{ bg: "primary" }}
                  borderBottomColor="primary"
                >
                  Properties
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Box padding="10px">{item.description}</Box>
                </TabPanel>
                <TabPanel>
                  <Box padding="10px">
                    <Box fontSize="14px">Creator Address</Box>
                    <Text wordBreak={"break-word"}>{item.creator}</Text>
                    <Box py={2}></Box>
                    <Box display={"flex"} justifyContent="space-between">
                      <Box fontSize="14px">Transaction Fee</Box>
                      <Box>{numberWithCommas(item.transactionFee, 2)}%</Box>
                    </Box>
                    <Box py={2}></Box>
                    <Box display={"flex"} justifyContent="space-between">
                      <Box fontSize="14px">Royalties Fee</Box>
                      <Box>{numberWithCommas(item.royalitiesFee, 2)}%</Box>
                    </Box>
                    <Box py={2}></Box>
                    <Box display={"flex"} justifyContent="space-between">
                      <Box fontSize="14px">Listing/Bidding/Cancel</Box>
                      <Box>Free</Box>
                    </Box>
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Box padding={"10px"} display="flex" gap="10px">
                    {item.properties &&
                      item.properties.length > 0 &&
                      item.properties.map((prop: any, id: number) => (
                        <Box
                          key={id}
                          border="1px solid"
                          borderRadius={"20px"}
                          borderColor={"primary"}
                          py="16px"
                          px="30px"
                          textAlign="center"
                          minW="170px"
                        >
                          <Box
                            color="primary"
                            fontWeight="bold"
                            filter={colorMode == "dark" ? "brightness(120%)" : "brightness(90%)"}
                          >
                            {prop.name}
                          </Box>
                          <Box pt={1}></Box>
                          <Box fontWeight="bold" fontSize="large" color="text">
                            {prop.value}
                          </Box>
                          <Box pt={1}></Box>
                          {/* <Box
                            color="primary"
                            fontSize="small"
                            filter={colorMode == "dark" ? "brightness(120%)" : "brightness(90%)"}
                          >
                            {numberWithCommas((prop?.rate || 0.0), 2)}% has this trade
                          </Box> */}
                        </Box>
                      ))}
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
            <Box py={1}></Box>
            <Divider borderColor="divider" opacity={0.5} />
            <Box py={5}></Box>

            <Accordion
              allowMultiple
              defaultIndex={[0]}
              display="flex"
              flexDirection={"column"}
              gap={"15px"}
            >
              <AccordionItem border="0">
                <h2>
                  <AccordionButton
                    backgroundColor="backgroundBigText"
                    borderRadius="10px"
                    justifyContent="space-between"
                    sx={{
                      "&:hover": {
                        background: "primary",
                      },
                    }}
                    p={"5px"}
                  >
                    <Box
                      px="20px"
                      py="10px"
                      fontSize="large"
                      sx={{
                        "&:hover": {
                          background: "primary",
                        },
                      }}
                    >
                      Price history
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel>
                  <Box>
                    <Box pb="10px">
                      {(item.histories?.length || 0) <= 0 && (
                        <>
                          <Text color={"text"} textAlign="center">
                            No histories
                          </Text>
                        </>
                      )}
                      {[...item.histories]
                        .reverse()
                        .slice(0, showHistories)
                        .map((h: any, index: number) => {
                          if (h.historyType == 0) {
                            return (
                              <Box key={index}>
                                <Box py={2}></Box>
                                <Box display="flex" gap="20px">
                                  <Link href={`/pprofile/${h?.data?.seller}`}>
                                    <Box borderRadius={"50%"} overflow="hidden">
                                      <Image
                                        src={historiesIcon[index]}
                                        width="50"
                                        height="50"
                                        style={{
                                          objectFit: "cover",
                                          aspectRatio: "1/1",
                                          height: "50px",
                                          width: "50px",
                                          backgroundColor: "#b9bec7",
                                        }}
                                        alt="user"
                                      />
                                    </Box>
                                  </Link>
                                  <Box
                                    color="text"
                                    display="flex"
                                    flexDir={"column"}
                                    justifyContent="space-evenly"
                                  >
                                    <Text>
                                      <Link href={`/pprofile/${h?.data?.seller}`}>
                                        <span
                                          style={{
                                            color: colorMode == "dark" ? "white" : "black",
                                            wordBreak: "break-word",
                                          }}
                                        >
                                          {historiesName[index]
                                            ? historiesName[index]
                                            : h?.data?.seller?.startsWith("0x")
                                            ? formatAddress(h?.data?.seller, 6)
                                            : h.data.seller}
                                        </span>
                                      </Link>
                                      &nbsp;listed item for{" "}
                                      {formatPrice((h?.data?.price || 0) / Math.pow(10, 8))} APT{" "}
                                    </Text>
                                    {h?.timestamp && (
                                      <Text fontSize="14px">
                                        {new Date(h.timestamp / 1000).toUTCString()}
                                      </Text>
                                    )}
                                  </Box>
                                </Box>
                                <Box py={2}></Box>
                                <Divider borderColor="divider" />
                              </Box>
                            );
                          } else if (h.historyType == 1) {
                            return (
                              <Box key={index}>
                                <Box py={2}></Box>
                                <Box display="flex" gap="20px">
                                  <Link href={`/pprofile/${h?.data?.seller}`}>
                                    <Box borderRadius={"50%"} overflow="hidden">
                                      <Image
                                        src={historiesIcon[index]}
                                        width="50"
                                        height="50"
                                        style={{
                                          objectFit: "cover",
                                          aspectRatio: "1/1",
                                          height: "50px",
                                          width: "50px",
                                          backgroundColor: "#b9bec7",
                                        }}
                                        alt="user"
                                      />
                                    </Box>
                                  </Link>
                                  <Box
                                    color="text"
                                    display="flex"
                                    flexDir={"column"}
                                    justifyContent="space-evenly"
                                  >
                                    <Text>
                                      <Link href={`/pprofile/${h?.data?.seller}`}>
                                        <span
                                          style={{
                                            color: colorMode == "dark" ? "white" : "black",
                                            wordBreak: "break-word",
                                          }}
                                        >
                                          {historiesName[index]
                                            ? historiesName[index]
                                            : h?.data?.seller?.startsWith("0x")
                                            ? formatAddress(h?.data?.seller, 6)
                                            : h.data.seller}
                                        </span>
                                      </Link>
                                      &nbsp;delisted item
                                    </Text>
                                    {h?.timestamp && (
                                      <Text fontSize="14px">
                                        {new Date(h.timestamp / 1000).toUTCString()}
                                      </Text>
                                    )}
                                  </Box>
                                </Box>
                                <Box py={2}></Box>
                                <Divider borderColor="divider" />
                              </Box>
                            );
                          } else if (h.historyType == 2) {
                            return (
                              <Box key={index}>
                                <Box py={2}></Box>
                                <Box display="flex" gap="20px">
                                  <Link href={`/pprofile/${h?.data?.seller}`}>
                                    <Box borderRadius={"50%"} overflow="hidden">
                                      <Image
                                        width="50"
                                        height="50"
                                        src={historiesIcon[index]}
                                        style={{
                                          objectFit: "cover",
                                          aspectRatio: "1/1",
                                          height: "50px",
                                          width: "50px",
                                          backgroundColor: "#b9bec7",
                                        }}
                                        alt="user"
                                      />
                                    </Box>
                                  </Link>
                                  <Box
                                    color="text"
                                    display="flex"
                                    flexDir={"column"}
                                    justifyContent="space-evenly"
                                  >
                                    <Text>
                                      <Link href={`/pprofile/${h?.data?.seller}`}>
                                        <span
                                          style={{
                                            color: colorMode == "dark" ? "white" : "black",
                                            wordBreak: "break-word",
                                          }}
                                        >
                                          {historiesName[index]
                                            ? historiesName[index]
                                            : h?.data?.seller?.startsWith("0x")
                                            ? formatAddress(h?.data?.seller, 6)
                                            : h.data.seller}
                                        </span>
                                      </Link>
                                      &nbsp;transfer to&nbsp;
                                      <Link href={`/pprofile/${h?.data?.buyer}`}>
                                        <span
                                          style={{
                                            color: colorMode == "dark" ? "white" : "black",
                                            wordBreak: "break-word",
                                          }}
                                        >
                                          {historiesName[index]
                                            ? historiesName[index]
                                            : h?.data?.buyer?.startsWith("0x")
                                            ? formatAddress(h?.data?.buyer, 6)
                                            : h.data.buyer}
                                        </span>
                                      </Link>
                                    </Text>
                                    {h?.timestamp && (
                                      <Text fontSize="14px">
                                        {new Date(h.timestamp / 1000).toUTCString()}
                                      </Text>
                                    )}
                                  </Box>
                                </Box>
                                <Box py={2}></Box>
                                <Divider borderColor="divider" />
                              </Box>
                            );
                          } else {
                            return (
                              <Box key={index}>
                                <Box py={2}></Box>
                                <Box display="flex" gap="20px">
                                  <Link href={`/pprofile/${h?.data?.seller}`}>
                                    <Box borderRadius={"50%"} overflow="hidden">
                                      <Image
                                        height={50}
                                        width={50}
                                        src={historiesIcon[index]}
                                        style={{
                                          objectFit: "cover",
                                          aspectRatio: "1/1",
                                          height: "50px",
                                          width: "50px",
                                          backgroundColor: "#b9bec7",
                                        }}
                                        alt="user"
                                      />
                                    </Box>
                                  </Link>
                                  <Box
                                    color="text"
                                    display="flex"
                                    flexDir={"column"}
                                    justifyContent="space-evenly"
                                  >
                                    <Text>
                                      <Link href={`/pprofile/${h?.data?.seller}`}>
                                        <span
                                          style={{
                                            color: colorMode == "dark" ? "white" : "black",
                                            wordBreak: "break-word",
                                          }}
                                        >
                                          {historiesName[index]
                                            ? historiesName[index]
                                            : h?.data?.seller?.startsWith("0x")
                                            ? formatAddress(h?.data?.seller, 6)
                                            : h.data.seller}
                                        </span>
                                      </Link>
                                      &nbsp;change price to{" "}
                                      {formatPrice((h?.data?.price || 0) / Math.pow(10, 8))} APT{" "}
                                    </Text>
                                    {h?.timestamp && (
                                      <Text fontSize="14px">
                                        {new Date(h.timestamp / 1000).toUTCString()}
                                      </Text>
                                    )}
                                  </Box>
                                </Box>
                                <Box py={2}></Box>
                                <Divider borderColor="divider" />
                              </Box>
                            );
                          }
                        })}
                      <Box pt={1}></Box>
                      {showHistories < item.histories.length && (
                        <Button
                          variant={"ghost"}
                          onClick={() => setShowAllHistories(item.histories.length)}
                        >
                          Show all
                        </Button>
                      )}
                    </Box>
                  </Box>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem border="0">
                <h2>
                  <AccordionButton
                    backgroundColor="backgroundBigText"
                    borderRadius="10px"
                    justifyContent="space-between"
                    sx={{
                      "&:hover": {
                        background: "primary",
                      },
                    }}
                    p={"5px"}
                  >
                    <Box
                      px="20px"
                      py="10px"
                      fontSize="large"
                      sx={{
                        "&:hover": {
                          background: "primary",
                        },
                      }}
                    >
                      Auction history
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel>
                  <Box>
                    <Box pb="10px">
                      {(item.auctionHistories?.length || 0) <= 0 && (
                        <>
                          <Text color={"text"} textAlign="center">
                            No auction histories
                          </Text>
                        </>
                      )}
                      {[...item.auctionHistories]
                        .reverse()
                        .slice(0, showAuctionHistories)
                        .map((h: any, index: number) => {
                          if (h.historyType == 0) {
                            return (
                              <Box key={index}>
                                <Box py={2}></Box>
                                <Box display="flex" gap="20px">
                                  <Link href={`/pprofile/${h?.data?.auctionSeller}`}>
                                    <Box borderRadius={"50%"} overflow="hidden">
                                      <Image
                                        height="50"
                                        width="50"
                                        src={auctionHistoriesIcon[index]}
                                        style={{
                                          objectFit: "cover",
                                          aspectRatio: "1/1",
                                          height: "50px",
                                          width: "50px",
                                          backgroundColor: "#b9bec7",
                                        }}
                                        alt="user"
                                      />
                                    </Box>
                                  </Link>
                                  <Box
                                    color="text"
                                    display="flex"
                                    flexDir={"column"}
                                    justifyContent="space-evenly"
                                  >
                                    <Text>
                                      <Link href={`/pprofile/${h?.data?.auctionSeller}`}>
                                        <span
                                          style={{
                                            color: colorMode == "dark" ? "white" : "black",
                                            wordBreak: "break-word",
                                          }}
                                        >
                                          {auctionHistoriesName[index]
                                            ? auctionHistoriesName[index]
                                            : h?.data?.auctionSeller?.startsWith("0x")
                                            ? formatAddress(h?.data?.auctionSeller, 6)
                                            : h.data.auctionSeller}
                                        </span>
                                      </Link>
                                      &nbsp;created an auction for{" "}
                                      {formatPrice((h?.data?.offerPrice || 0) / Math.pow(10, 8))}{" "}
                                      APT
                                    </Text>
                                    {h?.timestamp && (
                                      <Text fontSize="14px">
                                        {new Date(h.timestamp / 1000).toUTCString()}
                                      </Text>
                                    )}
                                  </Box>
                                </Box>
                                <Box py={2}></Box>
                                <Divider borderColor="divider" />
                              </Box>
                            );
                          } else if (h.historyType == 1) {
                            return (
                              <Box key={index}>
                                <Box py={2}></Box>
                                <Box display="flex" gap="20px">
                                  <Link href={`/pprofile/${h.data?.bidAddress}`}>
                                    <Box borderRadius={"50%"} overflow="hidden">
                                      <Image
                                        height="50"
                                        width="50"
                                        src={auctionHistoriesIcon[index]}
                                        style={{
                                          objectFit: "cover",
                                          aspectRatio: "1/1",
                                          height: "50px",
                                          width: "50px",
                                          backgroundColor: "#b9bec7",
                                        }}
                                        alt="user"
                                      />
                                    </Box>
                                  </Link>
                                  <Box
                                    color="text"
                                    display="flex"
                                    flexDir={"column"}
                                    justifyContent="space-evenly"
                                  >
                                    <Text>
                                      <Link href={`/pprofile/${h.data?.bidAddress}`}>
                                        <span
                                          style={{
                                            color: colorMode == "dark" ? "white" : "black",
                                            wordBreak: "break-word",
                                          }}
                                        >
                                          {auctionHistoriesName[index]
                                            ? auctionHistoriesName[index]
                                            : h?.data?.bidAddress?.startsWith("0x")
                                            ? formatAddress(h?.data?.bidAddress, 6)
                                            : h.data.bidAddress}
                                        </span>
                                      </Link>
                                      &nbsp;bid auction for{" "}
                                      {formatPrice((h?.data?.bidPrice || 0) / Math.pow(10, 8))} APT
                                    </Text>
                                    {h?.timestamp && (
                                      <Text fontSize="14px">
                                        {new Date(h.timestamp / 1000).toUTCString()}
                                      </Text>
                                    )}
                                  </Box>
                                </Box>
                                <Box py={2}></Box>
                                <Divider borderColor="divider" />
                              </Box>
                            );
                          } else if (h.historyType == 2) {
                            return (
                              <Box key={index}>
                                <Box py={2}></Box>
                                <Box display="flex" gap="20px">
                                  <Link href={`/pprofile/${h.data?.seller}`}>
                                    <Box borderRadius={"50%"} overflow="hidden">
                                      <Image
                                        height="50"
                                        width="50"
                                        src={auctionHistoriesIcon[index]}
                                        style={{
                                          objectFit: "cover",
                                          aspectRatio: "1/1",
                                          height: "50px",
                                          width: "50px",
                                          backgroundColor: "#b9bec7",
                                        }}
                                        alt="user"
                                      />
                                    </Box>
                                  </Link>
                                  <Box
                                    color="text"
                                    display="flex"
                                    flexDir={"column"}
                                    justifyContent="space-evenly"
                                  >
                                    <Text>
                                      <Link href={`/pprofile/${h.data?.seller}`}>
                                        <span
                                          style={{
                                            color: colorMode == "dark" ? "white" : "black",
                                            wordBreak: "break-word",
                                          }}
                                        >
                                          {auctionHistoriesName[index]
                                            ? auctionHistoriesName[index]
                                            : h?.data?.seller?.startsWith("0x")
                                            ? formatAddress(h?.data?.seller, 6)
                                            : h.data.seller}
                                        </span>
                                      </Link>
                                      &nbsp;cancel the auction
                                    </Text>
                                    {h?.timestamp && (
                                      <Text fontSize="14px">
                                        {new Date(h.timestamp / 1000).toUTCString()}
                                      </Text>
                                    )}
                                  </Box>
                                </Box>
                                <Box py={2}></Box>
                                <Divider borderColor="divider" />
                              </Box>
                            );
                          } else if (h.historyType == 3) {
                            return (
                              <Box key={index}>
                                <Box py={2}></Box>
                                <Box display="flex" gap="20px">
                                  <Link href={`/pprofile/${h.data?.seller}`}>
                                    <Box borderRadius={"50%"} overflow="hidden">
                                      <Image
                                        height="50"
                                        width="50"
                                        src={auctionHistoriesIcon[index]}
                                        style={{
                                          objectFit: "cover",
                                          aspectRatio: "1/1",
                                          height: "50px",
                                          width: "50px",
                                          backgroundColor: "#b9bec7",
                                        }}
                                        alt="user"
                                      />
                                    </Box>
                                  </Link>
                                  <Box
                                    color="text"
                                    display="flex"
                                    flexDir={"column"}
                                    justifyContent="space-evenly"
                                  >
                                    <Text>
                                      <Link href={`/pprofile/${h.data?.seller}`}>
                                        <span
                                          style={{
                                            color: colorMode == "dark" ? "white" : "black",
                                            wordBreak: "break-word",
                                          }}
                                        >
                                          {auctionHistoriesName[index]
                                            ? auctionHistoriesName[index]
                                            : h?.data?.seller?.startsWith("0x")
                                            ? formatAddress(h?.data?.seller, 6)
                                            : h.data.seller}
                                        </span>
                                      </Link>
                                      &nbsp;completed the auction
                                    </Text>
                                    {h?.timestamp && (
                                      <Text fontSize="14px">
                                        {new Date(h.timestamp / 1000).toUTCString()}
                                      </Text>
                                    )}
                                  </Box>
                                </Box>
                                <Box py={2}></Box>
                                <Divider borderColor="divider" />
                              </Box>
                            );
                          } else if (h.historyType == 4) {
                            return (
                              <Box key={index}>
                                <Box py={2}></Box>
                                <Box display="flex" gap="20px">
                                  <Link href={`/pprofile/${h.data?.bidder}`}>
                                    <Box borderRadius={"50%"} overflow="hidden">
                                      <Image
                                        height="50"
                                        width="50"
                                        src={auctionHistoriesIcon[index]}
                                        style={{
                                          objectFit: "cover",
                                          aspectRatio: "1/1",
                                          height: "50px",
                                          width: "50px",
                                          backgroundColor: "#b9bec7",
                                        }}
                                        alt="user"
                                      />
                                    </Box>
                                  </Link>
                                  <Box
                                    color="text"
                                    display="flex"
                                    flexDir={"column"}
                                    justifyContent="space-evenly"
                                  >
                                    <Text>
                                      <Link href={`/pprofile/${h.data?.seller}`}>
                                        <span
                                          style={{
                                            color: colorMode == "dark" ? "white" : "black",
                                            wordBreak: "break-word",
                                          }}
                                        >
                                          {auctionHistoriesName[index]
                                            ? auctionHistoriesName[index]
                                            : h?.data?.seller?.startsWith("0x")
                                            ? formatAddress(h?.data?.seller, 6)
                                            : h.data.seller}
                                        </span>
                                      </Link>
                                      &nbsp;updated endtime
                                      {h.data?.endTime && (
                                        <>
                                          {" "}
                                          to
                                          <span style={{ fontSize: "14px" }}>
                                            &nbsp;{new Date(h.data?.endTime * 1000).toUTCString()}
                                          </span>
                                        </>
                                      )}
                                    </Text>
                                    {h?.timestamp && (
                                      <Text fontSize="14px">
                                        {new Date(h.timestamp / 1000).toUTCString()}
                                      </Text>
                                    )}
                                  </Box>
                                </Box>
                                <Box py={2}></Box>
                                <Divider borderColor="divider" />
                              </Box>
                            );
                          } else if (h.historyType == 5) {
                            return (
                              <Box key={index}>
                                <Box py={2}></Box>
                                <Box display="flex" gap="20px">
                                  <Link href={`/pprofile/${h.data?.seller}`}>
                                    <Box borderRadius={"50%"} overflow="hidden">
                                      <Image
                                        height="50"
                                        width="50"
                                        src={auctionHistoriesIcon[index]}
                                        style={{
                                          objectFit: "cover",
                                          aspectRatio: "1/1",
                                          height: "50px",
                                          width: "50px",
                                          backgroundColor: "#b9bec7",
                                        }}
                                        alt="user"
                                      />
                                    </Box>
                                  </Link>
                                  <Box
                                    color="text"
                                    display="flex"
                                    flexDir={"column"}
                                    justifyContent="space-evenly"
                                  >
                                    <Text>
                                      <Link href={`/pprofile/${h.data?.seller}`}>
                                        <span
                                          style={{
                                            color: colorMode == "dark" ? "white" : "black",
                                            wordBreak: "break-word",
                                          }}
                                        >
                                          {auctionHistoriesName[index]
                                            ? auctionHistoriesName[index]
                                            : h?.data?.seller?.startsWith("0x")
                                            ? formatAddress(h?.data?.seller, 6)
                                            : h.data.seller}
                                        </span>
                                      </Link>
                                      &nbsp;updated price
                                      {h.data?.offerPrice && (
                                        <span style={{ fontSize: "14px" }}>
                                          &nbsp;to{" "}
                                          {formatPrice((h.data?.offerPrice || 0) / Math.pow(10, 8))}{" "}
                                          APT
                                        </span>
                                      )}
                                    </Text>
                                    {h?.timestamp && (
                                      <Text fontSize="14px">
                                        {new Date(h.timestamp / 1000).toUTCString()}
                                      </Text>
                                    )}
                                  </Box>
                                </Box>
                                <Box py={2}></Box>
                                <Divider borderColor="divider" />
                              </Box>
                            );
                          }
                        })}
                      <Box pt={1}></Box>
                      {showAuctionHistories < item.auctionHistories.length && (
                        <Button
                          variant={"ghost"}
                          onClick={() => setShowAllAuctionHistories(item.auctionHistories.length)}
                        >
                          Show all
                        </Button>
                      )}
                    </Box>
                  </Box>
                </AccordionPanel>
              </AccordionItem>
              {/* <AccordionItem border="0">
                <h2>
                  <AccordionButton
                    backgroundColor="backgroundBigText"
                    borderRadius="10px"
                    justifyContent="space-between"
                    sx={{
                      "&:hover": {
                        background: "primary",
                      },
                    }}
                    p={"5px"}
                  >
                    <Box px="20px" py="10px" fontSize="large">
                      Offers
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel>
                  <Box padding="10px">Coming soon</Box>
                </AccordionPanel>
              </AccordionItem> */}
            </Accordion>
          </Box>
        </Box>
        <Box py={2}></Box>
      </Container>
    </AnimatedPageWrapper>
  );
};

export default NFTPageWrapper;
