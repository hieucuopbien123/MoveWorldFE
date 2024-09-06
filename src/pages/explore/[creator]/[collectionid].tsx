import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Collapse,
  Container,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useColorMode,
} from "@chakra-ui/react";
import Image from "next/image";
import { TabCollection } from "@/constance/configtab";
import Link from "next/link";
import Collection from "@/components/pages/explore/Collection";
import { BsFillHeartFill } from "react-icons/bs";
import { formatAddress, formatPrice, numberWithCommas } from "@/utils/format";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import AnimatedPageWrapper from "@/components/AnimatedPageWrapper";
import { AiFillFolderAdd } from "react-icons/ai";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { useAppContext } from "@/store";
import CopyAddress from "@/components/CopyAddress";
import SocialList from "@/components/SocialList";
import BoxData from "@/components/pages/explore/BoxData";
import Head from "next/head";
import { NextSeo } from "next-seo";

const Collections = ({ collection }: any) => {
  const mode = useColorMode();
  const [show, setShow] = useState(false);
  const { account } = useWallet();
  const { showAvatar } = useAppContext();
  const [creatorName, setCreatorName] = useState(collection.creator);
  useEffect(() => {
    fetchCreator();
  }, []);
  const fetchCreator = async () => {
    try{
      const responseCreator = await (
        await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/user/profile/public/${collection.creator}`
        )
      ).json();
      setCreatorName(responseCreator.data.username);
    } catch(e){
      console.log(e);
    }
  };

  const urlImageOgSeo = collection.bannerImage
    ? collection.bannerImage
    : collection.icon
    ? collection.icon
    : "";

  return (
    <>
      <Head>
        <title>{`Collection ${collection.name} - MoveWorld`}</title>
        <NextSeo
          useAppDir={true}
          description={`Buy NFT of collection ${collection.name} on MoveWorld - The world&#x27;s largest web3 defi marketplace for NFTs and crypto collectibles on Aptos blockchain. Browse, create, buy, sell, and auction NFTs today.`}
          openGraph={{
            url: `https://moveworld.io/explore/${collection.creator}/${collection.name}`,
            title: `Collection ${collection.name} - MoveWorld`,
            images: [
              {
                url: urlImageOgSeo ? urlImageOgSeo : "/explore/defaultbackground.jpg",
                alt: "Collection Image",
              },
            ],
            type: "website",
            siteName: "MoveWorld",
          }}
          canonical={`https://moveworld.io/explore/${collection.creator}/${collection.name}`}
        />
        <meta
          name="twitter:image"
          content={
            urlImageOgSeo
              ? urlImageOgSeo
              : "https://i.pinimg.com/564x/0b/5e/e0/0b5ee065375780bab4be09673f9e16e0.jpg"
          }
        />
      </Head>
      <AnimatedPageWrapper animated="fadeIn">
        <Box position="relative">
          <Image
            priority
            src={
              collection.bannerImage.startsWith("/") || collection.bannerImage.startsWith("http")
                ? collection.bannerImage
                : "/explore/defaultbackground.jpg"
            }
            width="0"
            height="0"
            sizes="100vw"
            style={{
              objectFit: "cover",
              objectPosition: "center",
              width: "100%",
              maxHeight: "300px",
              backgroundColor: "#c3c3c3",
            }}
            alt="banner"
          />
          <Box position="absolute" left={0} right={0} bottom={"-50px"} textAlign="center">
            <Container maxW="2100px" px={["20px", "50px", "70px"]}>
              <Box
                width={{ base: "110px", sm: "168px" }}
                height={{ base: "110px", sm: "168px" }}
                bgColor={mode.colorMode == "dark" ? "black" : "#f6f7f9"}
                borderRadius="20px"
                padding={"6px"}
              >
                <Box
                  width={"100%"}
                  position="relative"
                  height="100%"
                  overflow={"hidden"}
                  borderRadius="20px"
                >
                  <Image
                    priority
                    src={
                      collection.icon.startsWith("/") || collection.icon.startsWith("http")
                        ? collection.icon
                        : "/user/background.png"
                    }
                    width="0"
                    height="0"
                    sizes="100vw"
                    style={{
                      borderRadius: "20px",
                      objectFit: "cover",
                      objectPosition: "center",
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#c3c3c3",
                    }}
                    alt="icon"
                  />
                </Box>
              </Box>
            </Container>
          </Box>
        </Box>
        <Box py={"30px"}></Box>
        <Container maxW="2100px" px={["20px", "50px", "70px"]}>
          <Box display={"flex"} justifyContent="space-between" alignItems={"center"}>
            <Box display={"flex"} alignItems="center">
              <Text style={{ fontSize: "xx-large", fontWeight: "bold" }}>{collection.name}</Text>
              &nbsp;
              {collection.isKyced && (
                <div
                  className="verified-icon flex items-center w-8 h-8"
                  style={{ top: "2px", position: "relative" }}
                >
                  <div className="w-10 h-10 flex">
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
            <Box display={{ base: "none", md: "flex" }} gap="10px">
              <SocialList social={collection.social} />
              <Box paddingLeft={"1px"} backgroundColor="divider"></Box>
              <Box>
                <Tooltip
                  label={collection.heartNum.toString()}
                  hasArrow
                  borderRadius={"10px"}
                  padding="10px"
                  closeOnClick={false}
                >
                  <IconButton
                    size="lg"
                    bgColor={"transparent"}
                    aria-label={"heart"}
                    icon={<BsFillHeartFill />}
                    borderRadius="50%"
                  />
                </Tooltip>
                {showAvatar && account?.address == collection.creator && (
                  <Link href={`/mintNFT/${collection.name}`}>
                    <Tooltip
                      label={"Add new NFT"}
                      hasArrow
                      borderRadius={"10px"}
                      padding="10px"
                      closeOnClick={false}
                    >
                      <IconButton
                        size="lg"
                        bgColor={"transparent"}
                        aria-label={"new item"}
                        icon={<AiFillFolderAdd />}
                        borderRadius="50%"
                      />
                    </Tooltip>
                  </Link>
                )}
              </Box>
            </Box>
          </Box>
          <Box>
            <Box py={2}></Box>
            <Text style={{ fontSize: "large" }}>
              By&nbsp;
              <Link href={`/pprofile/${collection.creator}`}>
                {creatorName ? (
                  <Tooltip
                    label={formatAddress(collection.creator, 6)}
                    borderRadius={"10px"}
                    padding="10px"
                    closeOnClick={false}
                  >
                    <span style={{ fontWeight: "bold" }}>{creatorName}</span>
                  </Tooltip>
                ) : (
                  <span style={{ fontWeight: "bold" }}>{collection.creator}</span>
                )}
              </Link>
              <CopyAddress address={collection.creator} />
            </Text>
            <Box py={2}></Box>
            <Box display="flex" fontSize={"large"} gap={"20px"} flexWrap="wrap">
              <Text>
                ·&nbsp;Items <b>{numberWithCommas(collection.nftnum)}</b>
              </Text>
              {collection.createdAt > 0 && (
                <Text>
                  ·&nbsp;Created <b>{new Date(collection.createdAt).toDateString().slice(4)}</b>
                </Text>
              )}
            </Box>
            <Box py={2}></Box>
            {collection?.description && (
              <Collapse startingHeight={25} in={show}>
                <Text width={{ base: "100%", md: "80%" }}>{collection?.description}</Text>
              </Collapse>
            )}
            {collection?.description && collection.description.length > 40 && (
              <Button size="sm" variant="unstyled" onClick={() => setShow(!show)} fontSize="medium">
                Show {show ? "Less" : "More"} {show ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </Button>
            )}
            <Box py={2}></Box>
            <Box display="flex" gap="20px" flexWrap="wrap">
              <BoxData
                title="Owners"
                content={numberWithCommas(collection.numberOfOwner)}
                maxW={"175px"}
              />
              <BoxData title="Floor Price" content={`${formatPrice(collection.floorPrice)} APT`} />
              <BoxData
                title="Total volume"
                content={`${formatPrice(collection.totalVolume)} APT`}
              />
              <BoxData title="Best Offer" content={`${formatPrice(collection.bestOffer)} APT`} />
            </Box>
          </Box>
        </Container>
      </AnimatedPageWrapper>
      <Tabs className="mt-4" variant="soft-rounded" colorScheme="green">
        <TabList
          overflowX="auto"
          minWidth="100%"
          justifyContent="center"
          paddingTop="20px"
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
          zIndex={2}
          backdropFilter="blur(5px)"
          bg="header"
        >
          {TabCollection.map((tab) => (
            <Tab
              minWidth={"90px"}
              whiteSpace={"nowrap"}
              color="text"
              key={tab.title}
              fontSize="larger"
              fontWeight={"bold"}
            >
              {tab.title}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          <TabPanel paddingTop={0}>
            <Collection />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Box py={2}></Box>
    </>
  );
};

export default Collections;

export async function getServerSideProps(context: any) {
  try{
    const { query } = context;
    const { collectionid, creator } = query;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/collection/${creator}/${collectionid}`
    );
    const data = await response.json();
  
    const processedData = {
      bannerImage: data.data?.bannerImage || "",
      icon: data.data?.uri || "",
      name: data.data?.name || "",
      isKyced: data.data?.isKyc || false,
      creator: data.data.creator,
      nftnum: data.data?.numNft || 0,
      createdAt: (data.data?.createdAt || 0) / 1000,
      creatorFee: data.data?.creatorFee || 0,
      description: data.data?.description || "",
      numberOfOwner: data.data.holder,
      floorPrice: (data.data?.minFloor || 0) / Math.pow(10, 8),
      bestOffer: (data.data?.bestOffer || 0) / Math.pow(10, 8),
      totalVolume: (data.data?.totalVolume || 0) / Math.pow(10, 8),
      heartNum: data.data?.numLike || 0,
      social: {
        facebook: data.data?.facebookUrl || "",
        twitter: data.data?.twitterUrl || "",
        discord: data.data?.discordUrl || "",
        website: data.data?.website || "",
      },
    };
  
    return {
      props: {
        collection: processedData,
      },
    };
  } catch(e){
    console.log(e);
    
    const processedData = {
      bannerImage: "",
      icon: "",
      name: "TestName",
      isKyced: true,
      creator: "Hieu",
      nftnum: 1,
      createdAt: 0 / 1000,
      creatorFee: 1,
      description: "No description",
      numberOfOwner: 1,
      floorPrice: (10000000000) / Math.pow(10, 8),
      bestOffer: 10000000000 / Math.pow(10, 8),
      totalVolume: 10000000000 / Math.pow(10, 8),
      heartNum: 1,
      social: {
        facebook: "https://facebook.com",
        twitter: "https://twitter.com",
        discord: "https://discord.com",
        website: "https://example.com",
      },
    };
    
    return {
      props: {
        collection: processedData,
      },
    };
  }
}
