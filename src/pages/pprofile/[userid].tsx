import { clientAxios } from "@/utils/axiosConfig";
import { formatAddress } from "@/utils/format";
import { usePagination } from "@ajna/pagination";
import { Box, Container, Tab, TabList, Tabs, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { CgMail } from "react-icons/cg";
import { FiTwitter } from "react-icons/fi";
import { GiEarthAmerica } from "react-icons/gi";
import { TbBrandDiscord } from "react-icons/tb";
import PProfileTab from "@/components/pages/pprofile/PProfileTab";
import RefetchButton from "@/components/RefetchButton";
import FilterPrice from "@/components/pages/FilterPrice";
import AnimatedPageWrapper from "@/components/AnimatedPageWrapper";
import CopyAddress from "@/components/CopyAddress";
import WrapperCopy from "@/components/WrapperCopy";
import CustomPagination from "@/components/CustomPagination";
import Head from "next/head";
import { NextSeo } from "next-seo";

const PProfile = ({ data }: any) => {
  const router = useRouter();
  const { userid } = router.query;
  const [numListed, setNumListed] = useState(0);
  const [numCreated, setNumCreated] = useState(0);
  const [numAuction, setNumAuction] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    fetchNum();
  }, []);

  const fetchNum = async () => {
    try{
      const data = await Promise.all([
        clientAxios.get("/v1/nft", {
          params: {
            owner: userid,
            status: 0,
          },
        }),
        clientAxios.get("/v1/nft", {
          params: {
            creator: userid,
            status: 3,
          },
        }),
        clientAxios.get("/v1/nft", {
          params: {
            owner: userid,
            status: 2,
          },
        }),
      ]);
      setNumListed(data[0].data.meta.total);
      setNumCreated(data[1].data.meta.total);
      setNumAuction(data[2].data.meta.total);
    } catch(e){
      console.log(e);
    }
  };

  const [numberOfPage, setNumberOfPage] = useState(1);
  const perPage = 12;
  const { currentPage, setCurrentPage, pagesCount, pages } = usePagination({
    pagesCount: numberOfPage,
    initialState: { currentPage: 1 },
    limits: {
      outer: 1,
      inner: 2,
    },
  });

  const imageSeo = data.background ? data.background : data.avatar ? data.avatar : "";

  return (
    <>
      <Head>
        <title>{`${data.name ? `Profile ${data.name} ` : "User Profile "}- MoveWorld`}</title>
        <NextSeo
          useAppDir={true}
          description="User public profile - MoveWorld is the world&#x27;s largest web3 defi marketplace for NFTs and crypto collectibles on Aptos blockchain. Browse, create, buy, sell, and auction NFTs today."
          openGraph={{
            url: `https://moveworld.io/pprofile/${data.address}`,
            title: `Profile ${data.name} - MoveWorld`,
            images: [
              {
                url: imageSeo ? imageSeo : "/explore/defaultbackground.jpg",
                alt: "User Image",
              },
            ],
            type: "website",
            siteName: "MoveWorld",
          }}
          canonical={`https://moveworld.io/pprofile/${data.address}`}
        />
        <meta
          name="twitter:image"
          content={
            imageSeo
              ? imageSeo
              : "https://i.pinimg.com/564x/0b/5e/e0/0b5ee065375780bab4be09673f9e16e0.jpg"
          }
        />
      </Head>
      <AnimatedPageWrapper animated="fadeIn">
        <Box position="relative">
          <Image
            src={
              data.background.startsWith("/") | data.background.startsWith("http")
                ? data.background
                : "/explore/defaultbackground.jpg"
            }
            alt="background"
            width="0"
            height="0"
            sizes="100vw"
            style={{
              width: "100%",
              minHeight: "200px",
              maxHeight: "250px",
              objectFit: "cover",
              objectPosition: "center",
              backgroundColor: "#c3c3c3",
            }}
          />
          <Box position="absolute" left={0} right={0} bottom={"-50px"} textAlign="center">
            <Container maxW="2100px" px={["20px", "50px", "70px"]}>
              <Box
                width={{ base: "100px", sm: "120px", md: "168px" }}
                height={{ base: "100px", sm: "120px", md: "168px" }}
                bgColor={"background"}
                borderRadius="50%"
                padding="6px"
                overflow={"hidden"}
                position="relative"
              >
                <Image
                  src={
                    data.avatar.startsWith("/") || data.avatar.startsWith("http")
                      ? data.avatar
                      : "/user/background.png"
                  }
                  alt="avatar"
                  fill
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                    objectPosition: "center",
                    backgroundColor: "#c3c3c3",
                  }}
                />
              </Box>
            </Container>
          </Box>
        </Box>
        <Box py={"30px"}></Box>
        <Container maxW="2100px" px={["20px", "50px", "80px"]}>
          <Box
            display={"flex"}
            justifyContent="space-between"
            alignItems={"center"}
            gap="10px"
            flexWrap={"wrap"}
          >
            <Box display={"flex"} alignItems="center">
              <Text style={{ fontSize: "x-large", fontWeight: "bold" }}>
                {data.name?.length > 0 ? data.name : "Unnamed"}
              </Text>
            </Box>
            <Box display={"flex"} gap="15px" justifyContent="center">
              <WrapperCopy
                text={data?.discordName}
                label="discord"
                isRedirect={false}
                link=""
                IconTag={<TbBrandDiscord />}
              />
              <WrapperCopy
                text={""}
                label="twitter"
                isRedirect={true}
                link={data?.twitter}
                IconTag={<FiTwitter />}
              />
              <WrapperCopy
                text={""}
                label="website"
                isRedirect={true}
                link={data?.website}
                IconTag={<GiEarthAmerica />}
              />
              <WrapperCopy
                text={data?.email}
                label="email"
                isRedirect={false}
                link=""
                IconTag={<CgMail />}
              />
            </Box>
          </Box>
          <Box style={{ fontSize: "large" }} pt="5px">
            <Text display="inline" fontWeight="bold" whiteSpace="nowrap">
              {formatAddress(data.address, 20)}
              <CopyAddress address={data.address} />
            </Text>
            {(data?.createdAt || 0) > 0 && (
              <Text display="inline" color="text" whiteSpace="nowrap">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joined&nbsp;
                {new Date(data?.createdAt || 0).toDateString().slice(4)}
              </Text>
            )}
          </Box>
          {data.bio.length > 0 && <Box py="5px"></Box>}
          <Text color={"bioText"}>{data.bio}</Text>
          <Box py={3}></Box>
          <Box display={"flex"} gap="10px" flexGrow={1}>
            <RefetchButton />
            {tabIndex == 1 && <FilterPrice />}
          </Box>
          <Box py={1}></Box>
          <Tabs
            variant="soft-rounded"
            colorScheme="green"
            onChange={(index: any) => setTabIndex(index)}
          >
            <TabList
              boxShadow={"0 1px 3px 0 rgba(0, 0, 0, 0.1),0 1px 2px 0 rgba(0, 0, 0, 0.06)"}
              backgroundColor={"backgroundTab"}
              padding="5px"
              borderRadius={"5px"}
              gap="20px"
              overflowX="auto"
              minWidth="100%"
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
                "& button": {
                  py: "12px",
                  px: "25px",
                  borderRadius: "5px",
                  color: "text",
                  whiteSpace: "nowrap",
                  border: "1px dashed #c6f6d533",
                  "&:hover": {
                    borderColor: "text",
                  },
                },
              }}
            >
              <Tab>Created ({numCreated})</Tab>
              <Tab>Listed Items ({numListed})</Tab>
              <Tab>Auction ({numAuction})</Tab>
            </TabList>
            <Box pt="20px"></Box>
            {tabIndex == 0 && (
              <PProfileTab
                tabIndex={tabIndex}
                {...{ currentPage, perPage, setNumberOfPage, setCurrentPage }}
              />
            )}
            {tabIndex == 1 && (
              <PProfileTab
                tabIndex={tabIndex}
                {...{ currentPage, perPage, setNumberOfPage, setCurrentPage }}
              />
            )}
            {tabIndex == 2 && (
              <PProfileTab
                tabIndex={tabIndex}
                {...{ currentPage, perPage, setNumberOfPage, setCurrentPage }}
              />
            )}
          </Tabs>
          <Box py={3}></Box>
          <CustomPagination onPageChange={setCurrentPage} {...{ pagesCount, currentPage, pages }} />
          <Box py={3}></Box>
        </Container>
      </AnimatedPageWrapper>
    </>
  );
};

export default PProfile;

export async function getServerSideProps(context: any) {
  try{
    const { query } = context;
    const { userid } = query;
    const response = await clientAxios.get(`/v1/user/profile/public/${userid}`);
  
    const processedData = {
      background: response.data.data?.background || "",
      email: response.data.data?.email || "",
      name: response.data.data?.username || "",
      discordName: response.data.data?.discord || "",
      bio: response.data.data?.bio || "",
      address: response.data.data?.address,
      avatar: response.data.data?.avatar || "",
      twitter: response.data.data?.twitter || "",
      website: response.data.data?.website || "",
      createdAt: response.data.data?.createAt,
    };
    return {
      props: {
        data: processedData,
      },
    };
  } catch(e){
    console.log(e);
    const processedData = {
      background: "",
      email: "hieucuopbien123@gmail.com",
      name: "Hieu",
      discordName: "Nguyen Thu Hieu",
      bio: "This is my bio",
      address: "0x00000000000000001",
      avatar: "",
      twitter: "https://twitter.com",
      website: "https://example.com",
      createdAt: 0,
    };
    return {
      props: {
        data: processedData,
      },
    };
  }
}
