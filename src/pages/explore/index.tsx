import React, { useState } from "react";
import { Box, Container, Heading, Tab, TabList, Tabs, Text, Spinner } from "@chakra-ui/react";
import Empty from "@/components/Empty";
import { TabMenu } from "@/constance/configtab";
import { usePagination } from "@ajna/pagination";
import Item from "@/components/pages/explore/Item";
import { clientAxios } from "@/utils/axiosConfig";
import AnimatedPageWrapper from "@/components/AnimatedPageWrapper";
import CustomPagination from "@/components/CustomPagination";
import Head from "next/head";
import { NextSeo } from "next-seo";

const perPage = 24;

const Explore = ({ collection, pageCount }: any) => {
  const [data, setData]: any = useState(collection);
  const [numberOfPage, setNumberOfPage] = useState(pageCount);

  const { currentPage, setCurrentPage, pagesCount, pages } = usePagination({
    pagesCount: numberOfPage,
    initialState: { currentPage: 1 },
    limits: {
      outer: 1,
      inner: 2,
    },
  });

  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const handleTabsChange = (index: any) => {
    setTabIndex(index);
    setCurrentPage(1);
    fetchData(index, 1);
  };
  const fetchData = async (index: number, pageFetch: any) => {
    setLoading(true);
    try {
      const response = await clientAxios.get(`/v1/collection`, {
        params: {
          page: pageFetch,
          pageSize: perPage,
          type: TabMenu[index].filter,
        },
      });
      const data = await response.data;

      const processedData = data.data.map((d: any) => ({
        icon: d?.uri || "",
        featuredImage: d?.featuredImage || "",
        name: d?.name || "",
        isKYCed: d?.isKyc || false,
        creator: d.creator,
        heart: d?.numLike || 0,
      }));

      setData(processedData);
      setNumberOfPage(data.meta.pageCount);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const pageChange = (pageNum: any) => {
    setCurrentPage(pageNum);
    fetchData(tabIndex, pageNum);
  };

  // const image = collection[0].featuredImage ? collection[0].featuredImage
  //   : (collection[0].icon ? collection[0].icon : "/nft assets/collectionnft1.jpg");
  const image = "/nft assets/collectionnft1.jpg";

  return (
    <>
      <Head>
        <title>Collection Explorer - MoveWorld</title>
        <NextSeo
          useAppDir={true}
          description="Explore collection on MoveWorld - The world&#x27;s largest web3 defi marketplace for NFTs and crypto collectibles on Aptos blockchain. Browse, create, buy, sell, and auction NFTs today."
          openGraph={{
            url: "https://moveworld.io/explore",
            title: "MoveWorld Collection Explorer",
            images: [
              {
                url: image,
                alt: "Collection Image",
              },
            ],
            type: "website",
            siteName: "MoveWorld",
          }}
          canonical="https://moveworld.io/explore"
        />
        <meta
          name="twitter:image"
          content="https://i.pinimg.com/564x/0b/5e/e0/0b5ee065375780bab4be09673f9e16e0.jpg"
        />
      </Head>
      <AnimatedPageWrapper animated="fadeIn">
        <Box py="30px" background="backgroundTop">
          <Heading textAlign={"center"}>
            <Text fontSize={"xxx-large"} fontWeight="bold" display={"inline-block"}>
              Explore Collections
            </Text>
          </Heading>
        </Box>
        <Container maxW="2100px" px={["0px", "50px", "80px"]}>
          <Tabs
            className="mt-10"
            variant={"soft-rounded"}
            isFitted
            onChange={handleTabsChange}
            colorScheme="green"
          >
            <TabList
              overflowX="auto"
              minWidth="100%"
              padding="10px"
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
              {TabMenu.map((tab) => (
                <Tab whiteSpace={"nowrap"} color="text" key={tab.title}>
                  {tab.title}
                </Tab>
              ))}
            </TabList>
          </Tabs>
          <Box py={2}></Box>
          {!loading && data && data?.length <= 0 && (
            <Box py={3} textAlign="center">
              <Empty title="No Item" />
            </Box>
          )}
          {loading && (
            <Box textAlign="center" padding={"20px"}>
              <Spinner color="primary" />
            </Box>
          )}
          {!loading && data?.length > 0 && (
            <>
              <Box className="grid min-[0px]:grid-cols-1 min-[850px]:grid-cols-2 min-[1150px]:grid-cols-3 min-[1300px]:grid-cols-4 min-[2000px]:grid-cols-5 gap-4">
                {data.map((item: any, i: any) => (
                  <Item key={i} item={item} />
                ))}
              </Box>

              <Box py={4}></Box>
              <CustomPagination onPageChange={pageChange} {...{ pagesCount, currentPage, pages }} />
            </>
          )}
        </Container>
        <Box py={4}></Box>
      </AnimatedPageWrapper>
    </>
  );
};

export default Explore;

export const fetchListCollection = async ({ pageSize, page, type }: any) => {
  const response = await clientAxios.get(`/v1/collection`, {
    params: {
      page: page,
      pageSize: pageSize,
      type: type,
    },
  });
  return await response.data;
};

export async function getServerSideProps() {
  let data;
  let processedData;
  try{
    data = await fetchListCollection({
      pageSize: perPage,
      page: 1,
    });
  } catch (e) {
    console.log(e);
    data = {
      data: [
        {
          name: "Test",
          isKyc: true,
          creator: "Hieu",
          numLike: 1,
        }
      ],
      meta: {
        pageCount: 1
      }
    }
  }
  processedData = data.data.map((d: any) => ({
    icon: d?.uri || "",
    featuredImage: d?.featuredImage || "",
    name: d?.name || "",
    isKYCed: d?.isKyc || false,
    creator: d.creator,
    heart: d?.numLike || 0,
  }));

  return {
    props: {
      collection: processedData,
      pageCount: data.meta.pageCount,
    },
  };
}
