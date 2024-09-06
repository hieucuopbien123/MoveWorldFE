import AnimatedPageWrapper from "@/components/AnimatedPageWrapper";
import ListTrader from "@/components/pages/stats/listtrader";
import { Box, Container, Tab, TabList, Tabs, Text } from "@chakra-ui/react";
import Head from "next/head";
import React, { useState } from "react";
import { GiRank1, GiRank2, GiRank3 } from "react-icons/gi";
import { NextSeo } from "next-seo";

const TopTrader = () => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <>
      <Head>
        <title>Top Traders - MoveWorld</title>
        <NextSeo
          useAppDir={true}
          description="Top traders on MoveWorld - The world&#x27;s largest web3 defi marketplace for NFTs and crypto collectibles on Aptos blockchain. Browse, create, buy, sell, and auction NFTs today."
          openGraph={{
            url: "https://moveworld.io/stats/toptrader",
            title: `Top Traders - MoveWorld`,
            type: "website",
            images: [
              {
                url: "/nft assets/collectionnft1.jpg",
                alt: "Collection Image",
                type: "image/jpg",
              },
            ],
            siteName: "MoveWorld",
          }}
          canonical="https://moveworld.io/stats/toptrader"
        />
        <meta
          name="twitter:image"
          content="https://i.pinimg.com/564x/0b/5e/e0/0b5ee065375780bab4be09673f9e16e0.jpg"
        />
      </Head>
      <AnimatedPageWrapper animated="fadeIn">
        <Container maxW="2100px" px={["20px", "50px", "80px"]}>
          <Box py={7}></Box>
          <Text fontWeight={700} fontSize="xxx-large" textAlign={"center"}>
            Top Traders
          </Text>
          <Box py={2}></Box>
          <Box>
            <Tabs
              margin={"0 auto"}
              variant="soft-rounded"
              padding={"7px"}
              colorScheme="green"
              bgColor="divider"
              borderRadius={"20px"}
              width={"fit-content"}
              onChange={(index: any) => setTabIndex(index)}
            >
              <TabList gap={"10px"}>
                <Tab color={"text"}>
                  <GiRank1 />
                  &nbsp;Top 24h
                </Tab>
                <Tab color={"text"}>
                  <GiRank2 />
                  &nbsp;Top 7 days
                </Tab>
                <Tab color={"text"}>
                  <GiRank3 />
                  &nbsp;All time
                </Tab>
              </TabList>
            </Tabs>
          </Box>
          <Box py={5}></Box>
          <ListTrader tabIndex={tabIndex} />
          <Box py={5}></Box>
        </Container>
      </AnimatedPageWrapper>
    </>
  );
};

export default TopTrader;
