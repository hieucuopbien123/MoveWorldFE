import AnimatedPageWrapper from "@/components/AnimatedPageWrapper";
import { Box, Button, Container, SimpleGrid, Text } from "@chakra-ui/react";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Aos from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import React, { useEffect } from "react";
import LiveListing from "@/components/pages/home/LiveListing";
import TopCollection from "@/components/pages/home/TopCollection";
import { title } from "./_app";
import Head from "next/head";
import { NextSeo } from "next-seo";

const Home = ({}: // liveListingData, topCollectionData
any) => {
  useEffect(() => {
    Aos.init();
    Aos.refresh();
  }, []);

  return (
    <>
      <Head>
        <NextSeo
          useAppDir={true}
          description="MoveWorld is the world&#x27;s largest web3 defi marketplace for NFTs and crypto collectibles on Aptos blockchain. Browse, create, buy, sell, and auction NFTs today."
          openGraph={{
            url: `https://moveworld.io/`,
            title: `HomePage - MoveWorld`,
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
          canonical="https://moveworld.io/"
        />
        <meta
          name="twitter:image"
          content="https://i.pinimg.com/564x/0b/5e/e0/0b5ee065375780bab4be09673f9e16e0.jpg"
        />
      </Head>
      <AnimatedPageWrapper animated="fadeIn">
        <Container maxW="1500px" px={["20px", "50px", "80px"]}>
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            paddingTop={"50px"}
            paddingBottom={"10px"}
            gap={"30px"}
            alignItems="center"
          >
            <Box
              w={{ base: "100%" }}
              position="relative"
              display={{ base: "inline-block", md: "none" }}
            >
              <Image
                priority
                src={"/home/homeTop.png"}
                alt="Home Page"
                width="0"
                height="0"
                sizes="100vw"
                style={{ width: "100%", margin: "0 auto", maxWidth: "510px" }}
              />
            </Box>
            <Box w={{ base: "100%" }}>
              <Text
                style={{ fontWeight: "bold", paddingBottom: "10px" }}
                fontSize={{ base: "xx-large", lg: "xxx-large" }}
              >
                Discover Digital Art, Collect and Sell Your Specific NFTs.
              </Text>
              <Text
                style={{ paddingBottom: "20px", fontSize: "larger" }}
                className={title.className}
              >
                Explore the most outstanding NTFs in all topics of life. Buy NFTs (or sell &apos;em)
                to earn rewards.
              </Text>
              <Box display={"flex"} gap="20px">
                <Link href="/explore" style={{ flexGrow: 1 }}>
                  <Button
                    size={"lg"}
                    width="100%"
                    bgColor="primary"
                    opacity={0.9}
                    style={{ border: "0 auto" }}
                    minWidth="40%"
                    _hover={{ backgroundColor: "#179b9b" }}
                  >
                    Get Started
                  </Button>
                </Link>
                <Link href="/createcollection" style={{ flexGrow: 1.3 }}>
                  <Button
                    size={"lg"}
                    width="100%"
                    variant="outline"
                    style={{ border: "0 auto" }}
                    minWidth="40%"
                    bgColor={"cover"}
                  >
                    Create
                  </Button>
                </Link>
              </Box>
            </Box>
            <Box
              w={{ base: "100%" }}
              position="relative"
              display={{ base: "none", md: "inline-block" }}
            >
              <Image
                priority
                src={"/home/homeTop.png"}
                alt="Home Page"
                width="0"
                height="0"
                sizes="100vw"
                style={{ width: "100%", margin: "0 auto", maxWidth: "510px" }}
              />
            </Box>
          </SimpleGrid>
          <LiveListing />
          <Box py={1}></Box>
          <TopCollection />
          <Box pb={"10px"}></Box>
        </Container>
      </AnimatedPageWrapper>
    </>
  );
};

export default Home;

// export async function getServerSideProps(context: any) {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/nft?status=0&pageSize=20&page=1`
//   );
//   const data = await response.json();

//   const liveListingData = data.data.map((d: any) => ({
//     collection: d.collection,
//     creator: d.creator,
//     name: d.name || "",
//     price: (d?.price || 0) / Math.pow(10, 8),
//     image: d?.uri || "/user/background.png",
//     heart: d.likes,
//   }));

//   const response2 = await fetch(
//     `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/collection/ranking?fromTime=0&pageSize=10&page=1&sort=-currentVolume`
//   );
//   const data2 = await response2.json();
//   const topCollectionData = data2.data.map((d: any) => ({
//     creator: d.creator,
//     name: d.name,
//     icon: d.uri || "/user/background.png",
//     floorPrice: (d?.currentFloorPrice || 0) / Math.pow(10, 8),
//     volume: (d?.currentVolume || 0) / Math.pow(10, 8),
//     floorChange:
//       d.previousFloorPrice == 0 && d.currentFloorPrice == 0
//         ? 0.0
//         : d.previousFloorPrice == 0
//         ? (d.currentFloorPrice - d.previousFloorPrice) / Math.pow(10, 8)
//         : ((d.currentFloorPrice - d.previousFloorPrice) * 100) / d.previousFloorPrice,
//     volumeChange:
//       d.previousVolume == 0 && d.currentVolume == 0
//         ? 0.0
//         : d.previousVolume == 0
//         ? (d.currentVolume - d.previousVolume) / Math.pow(10, 8)
//         : ((d.currentVolume - d.previousVolume) * 100) / d.previousVolume,
//   }));

//   return {
//     props: {
//       liveListingData,
//       topCollectionData,
//     },
//   };
// }
