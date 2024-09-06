import React from "react";
import {
  Box,
  Button,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { AiFillEdit, AiFillEye } from "react-icons/ai";
import { BellIcon } from "@chakra-ui/icons";
import Link from "next/link";
import PersonalInfo from "@/components/pages/userprofile/PersonalInfo";
import NotificationSettings from "@/components/pages/userprofile/NotificationSettings";
import { useAppContext } from "@/store";
import AnimatedPageWrapper from "@/components/AnimatedPageWrapper";
import Head from "next/head";
import { NextSeo } from "next-seo";

const UserProfile = () => {
  const { showAvatar } = useAppContext();

  if (!showAvatar) {
    return (
      <>
        <Head>
          <title>User Profile - MoveWorld</title>
          <NextSeo
            useAppDir={true}
            description="MoveWorld is the world&#x27;s largest web3 defi marketplace for NFTs and crypto collectibles on Aptos blockchain. Browse, create, buy, sell, and auction NFTs today."
            openGraph={{
              url: "https://moveworld.io/userprofile",
              title: `User Profile - MoveWorld`,
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
            canonical="https://moveworld.io/userprofile"
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
        <title>User Profile - MoveWorld</title>
        <NextSeo
          useAppDir={true}
          description="Visit user profile on MoveWorld - The world&#x27;s largest web3 defi marketplace for NFTs and crypto collectibles on Aptos blockchain. Browse, create, buy, sell, and auction NFTs today."
          openGraph={{
            url: "https://moveworld.io/stats/userprofile",
            title: `User Profile - MoveWorld`,
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
          canonical="https://moveworld.io/userprofile"
        />
        <meta
          name="twitter:image"
          content="https://i.pinimg.com/564x/0b/5e/e0/0b5ee065375780bab4be09673f9e16e0.jpg"
        />
      </Head>
      <AnimatedPageWrapper animated="fadeIn">
        <Container maxW="1300px" px={["20px", "50px", "80px"]}>
          <Box py={3}></Box>
          <Box
            display={"flex"}
            justifyContent="space-between"
            flexWrap={"wrap"}
            alignItems="center"
            gap="10px"
          >
            <Text fontSize={"xx-large"} fontWeight="bold">
              Settings
            </Text>
            <Link href="/useritem">
              <Button variant={"solid"} colorScheme="green" paddingLeft="10px">
                <AiFillEye />
                &nbsp;Preview
              </Button>
            </Link>
          </Box>
          <Box py={3}></Box>
          <Tabs
            orientation="vertical"
            gap="40px"
            flexWrap="wrap"
            width="100%"
            variant="soft-rounded"
            colorScheme="green"
          >
            <Box flex={"200px"}>
              <TabList
                flex={"200px"}
                flexGrow={1}
                wordBreak="break-word"
                position="sticky"
                top="125px"
                width="100%"
                height="fit-content"
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
                    justifyContent: "flex-start",
                    border: "1px dashed",
                    borderColor: "dividerdash",
                    paddingLeft: "15px",
                  },
                }}
                boxShadow={"0 1px 3px 0 rgba(0, 0, 0, 0.1),0 1px 2px 0 rgba(0, 0, 0, 0.06)"}
                backgroundColor={"backgroundTab"}
                padding="5px"
                borderRadius={"5px"}
                gap="10px"
                overflowX="auto"
              >
                <Tab>
                  <AiFillEdit />
                  &nbsp;&nbsp;Personal Information
                </Tab>
                <Tab>
                  <BellIcon />
                  &nbsp;&nbsp;Notification Setting
                </Tab>
              </TabList>
            </Box>

            <TabPanels
              backgroundColor={"backgroundTab"}
              borderRadius="5px"
              flex={"450px"}
              flexGrow={1000}
              padding={["10px", "30px"]}
              sx={{
                "& div[role=tabpanel]": {
                  padding: 0,
                },
              }}
            >
              <TabPanel>
                <PersonalInfo />
              </TabPanel>
              <TabPanel>
                <NotificationSettings />
              </TabPanel>
            </TabPanels>
          </Tabs>
          <Box py={3}></Box>
        </Container>
      </AnimatedPageWrapper>
    </>
  );
};

export default UserProfile;
