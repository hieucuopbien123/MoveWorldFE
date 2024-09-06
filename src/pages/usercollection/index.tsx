import React, { useEffect, useState } from "react";
import { Box, Button, Container, Spinner, Text } from "@chakra-ui/react";
import { useAppContext } from "@/store";
import AnimatedPageWrapper from "@/components/AnimatedPageWrapper";
import { BsFillCollectionFill } from "react-icons/bs";
import Item from "@/components/pages/explore/Item";
import Link from "next/link";
import { clientAxios } from "@/utils/axiosConfig";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import Head from "next/head";
import { NextSeo } from "next-seo";

const UserCollection = () => {
  const { showAvatar } = useAppContext();
  const [loading, setLoading] = useState(false);
  const { account } = useWallet();
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [account?.address]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (account?.address) {
        const response = await clientAxios.get(`/v1/collection`, {
          params: {
            page: 1,
            pageSize: 100000,
            creator: account.address,
          },
        });
        const processedData: any = response.data.data.map((d: any) => ({
          icon:
            d?.uri && (d?.uri.startsWith("/") || d?.uri.startsWith("http"))
              ? d.uri
              : "/user/background.png",
          featuredImage:
            d?.featuredImage &&
            (d?.featuredImage.startsWith("/") || d?.featuredImage.startsWith("http"))
              ? d.featuredImage
              : "/explore/defaultbackground.jpg",
          name: d?.name || "",
          isKYCed: d?.isKyc || false,
          creator: d.creator,
          heart: d?.numLike || 0,
        }));
        setData(processedData);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  if (!showAvatar) {
    return (
      <Box height="calc(100vh - 82px)" display="flex" justifyContent="center" alignItems="center">
        <Text style={{ fontSize: "x-large" }}>Please connect your wallet and try again!</Text>
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>User Collection - MoveWorld</title>
        <NextSeo
          useAppDir={true}
          description="Visit your collection on MoveWorld - The world&#x27;s largest web3 defi marketplace for NFTs and crypto collectibles on Aptos blockchain. Browse, create, buy, sell, and auction NFTs today."
          openGraph={{
            url: "https://moveworld.io/usercollection",
            title: `User Collection - MoveWorld`,
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
          canonical="https://moveworld.io/usercollection"
        />
        <meta
          name="twitter:image"
          content="https://i.pinimg.com/564x/0b/5e/e0/0b5ee065375780bab4be09673f9e16e0.jpg"
        />
      </Head>
      <AnimatedPageWrapper animated="fadeIn">
        <Container maxW="2100px" px={["0px", "50px", "80px"]}>
          <Box py={2}></Box>
          <Text fontSize={"xx-large"} fontWeight="bold">
            My Collections
          </Text>
          <Text pt={1} pb={3}>
            Create, curate, and manage collections of unique NFTs to share and sell.
          </Text>
          <Link href="/createcollection">
            <Button size="lg" colorScheme={"green"}>
              <BsFillCollectionFill />
              &nbsp;&nbsp;Create a collection (Aptos)
            </Button>
          </Link>
          <Box py={6}></Box>
          {!loading && (
            <Box className="grid min-[0px]:grid-cols-1 min-[850px]:grid-cols-2 min-[1150px]:grid-cols-3 min-[1300px]:grid-cols-4 min-[2000px]:grid-cols-5 gap-4">
              {data.map((item: any, i: any) => (
                <Item key={i} item={item} />
              ))}
            </Box>
          )}
          {loading && (
            <Box textAlign="center" padding={"20px"}>
              <Spinner color="primary" />
            </Box>
          )}
        </Container>
      </AnimatedPageWrapper>
    </>
  );
};

export default UserCollection;
