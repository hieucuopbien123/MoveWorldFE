import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { useAppContext } from "@/store";
import UserItemContent from "@/components/pages/useritem/UserItemContent";
import Head from "next/head";
import { NextSeo } from "next-seo";

// Setup SEO
const UserItems = () => {
  const { showAvatar } = useAppContext();

  if (!showAvatar) {
    return (
      <>
        <Head>
          <title>User List Items - MoveWorld</title>
          <NextSeo
            useAppDir={true}
            description="Visit your NFTs on MoveWorld - The world&#x27;s largest web3 defi marketplace for NFTs and crypto collectibles on Aptos blockchain. Browse, create, buy, sell, and auction NFTs today."
            openGraph={{
              url: "https://moveworld.io/useritem",
              title: `User List Items - MoveWorld`,
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
            canonical="https://moveworld.io/useritem"
          />
          <meta
            name="twitter:image"
            content="https://i.pinimg.com/564x/0b/5e/e0/0b5ee065375780bab4be09673f9e16e0.jpg"
          />
        </Head>
        <Box height="calc(100vh - 82px)" display="flex" justifyContent="center" alignItems="center">
          <Text style={{ fontSize: "x-large" }}>Please connect your wallet and try again!</Text>
        </Box>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>User List Items - MoveWorld</title>
        <NextSeo
          useAppDir={true}
          description="Visit your NFTs on MoveWorld. MoveWorld is the world&#x27;s largest web3 defi marketplace for NFTs and crypto collectibles on Aptos blockchain. Browse, create, buy, sell, and auction NFTs today."
          openGraph={{
            url: `https://moveworld.io/useritem`,
            title: `User List Items - MoveWorld`,
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
          canonical="https://moveworld.io/useritem"
        />
        <meta
          name="twitter:image"
          content="https://i.pinimg.com/564x/0b/5e/e0/0b5ee065375780bab4be09673f9e16e0.jpg"
        />
      </Head>
      <UserItemContent />
    </>
  );
};

export default UserItems;
