import React, { useEffect, useState } from "react";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { Box, Container, Tab, TabList, Tabs, Text, Tooltip, IconButton } from "@chakra-ui/react";
import Image from "next/image";
import UserNormalTab from "@/components/pages/useritem/UserNormalTab";
import Link from "next/link";
import { useAppContext } from "@/store";
import getConnectedInstance from "@/utils/axiosConfig";
import { formatAddress } from "@/utils/format";
import { GiEarthAmerica } from "react-icons/gi";
import { FiEdit, FiTwitter } from "react-icons/fi";
import { TbBrandDiscord } from "react-icons/tb";
import { CgMail } from "react-icons/cg";
import { usePagination } from "@ajna/pagination";
import FilterPrice from "@/components/pages/FilterPrice";
import RefetchButton from "@/components/RefetchButton";
import { UserItemTab } from "@/constance/configuseritemtab";
import AnimatedPageWrapper from "@/components/AnimatedPageWrapper";
import WrapperCopy from "@/components/WrapperCopy";
import CustomPagination from "@/components/CustomPagination";
import dynamic from "next/dynamic";
import DelistCard from "./DelistCard";

const DynamicClaimOfferCard = dynamic(() => import("./ClaimOfferCard"), {
  loading: () => <Box py={3}></Box>,
});
const DynamicCancelOfferCard = dynamic(() => import("./CancelOfferCard"), {
  loading: () => <Box py={3}></Box>,
});
const DynamicOnAuctionNormalCard = dynamic(
  () => import("@/components/NormalCard/OnAuctionNormalCard"),
  {
    loading: () => <Box py={3}></Box>,
  }
);
const DynamicUserCreatedCard = dynamic(() => import("@/components/NormalCard/UserCreatedCard"), {
  loading: () => <Box py={3}></Box>,
});
const DynamicUserSellTab2 = dynamic(() => import("./UserSellTab2"), {
  loading: () => <Box py={3}></Box>,
});
const DynamicUserTransferNFTs = dynamic(() => import("./UserTransferNFTs"), {
  loading: () => <Box py={3}></Box>,
});
const DynamicUserClaimOffer = dynamic(() => import("./UserClaimOffer"), {
  loading: () => <Box py={3}></Box>,
});

const UserItemContent = () => {
  const { account, signMessage } = useWallet();
  const { showAvatar } = useAppContext();
  const [backgroundImg, setBackgroundImg] = useState("/explore/defaultbackground.jpg");
  const [avatar, setAvatar] = useState("/user/background.png");
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [twitter, setTwitter] = useState("");
  const [discordName, setDiscordName] = useState("");
  const [numberOfPage, setNumberOfPage] = useState(1);

  const [tabIndex, setTabIndex] = useState(0);
  const perPage = 12;

  const { currentPage, setCurrentPage, pagesCount, pages } = usePagination({
    pagesCount: numberOfPage,
    initialState: { currentPage: 1 },
    limits: {
      outer: 1,
      inner: 2,
    },
  });

  useEffect(() => {
    if (showAvatar) {
      fetchData();
    }
  }, [showAvatar, account]);

  const fetchData = async () => {
    const accessToken = localStorage.getItem("AccessToken");
    if (accessToken && accessToken != "undefined") {
      const data = await getConnectedInstance(account, signMessage, accessToken).get(
        "/v1/user/profile"
      );
      const dataProfile = await data.data.data;
      setName(dataProfile?.username || formatAddress(account?.address, 10));
      if (
        dataProfile?.background &&
        (dataProfile?.background.startsWith("/") || dataProfile?.background.startsWith("http"))
      )
        setBackgroundImg(dataProfile.background);
      if (
        dataProfile?.avatar &&
        (dataProfile?.avatar.startsWith("/") || dataProfile?.avatar.startsWith("http"))
      )
        setAvatar(dataProfile.avatar);
      setDiscordName(dataProfile?.discord || "");
      setEmail(dataProfile?.email || "");
      setWebsite(dataProfile?.website || "");
      setBio(dataProfile?.bio || "");
      setTwitter(dataProfile?.twitter || "");
    }
  };

  return (
    <>
      <AnimatedPageWrapper animated="fadeIn">
        <Box position="relative">
          <Image
            src={backgroundImg}
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
          <Box position="absolute" left={0} right={0} bottom={"-70px"} textAlign="center">
            <Box
              width={["110px", "140px", "170px"]}
              height={["110px", "140px", "170px"]}
              margin="0 auto"
              bgColor={"background"}
              borderRadius="10px"
              position="relative"
            >
              <Image
                src={avatar}
                alt="avatar"
                fill
                style={{
                  borderRadius: "15px",
                  border: "9px solid",
                  objectFit: "cover",
                  objectPosition: "center",
                  borderColor: "background",
                  backgroundColor: "#c3c3c3",
                }}
              />
            </Box>
          </Box>
        </Box>
        <Box py={"40px"}></Box>
        <Container maxW="2100px" px={["20px", "50px", "80px"]}>
          <Tooltip
            label={!name.startsWith("0x") && formatAddress(account?.address, 10)}
            closeOnClick={false}
            hasArrow
            borderRadius={"10px"}
            padding="10px"
          >
            <Text fontSize={"x-large"} fontWeight="bold" whiteSpace={"nowrap"} textAlign="center">
              <Link href={`/pprofile/${account?.address}`}>
                {name ? name : formatAddress(account?.address, 6)}
              </Link>
            </Text>
          </Tooltip>
          <Box py="5px"></Box>
          <Box display={"flex"} gap="10px" justifyContent="center">
            <WrapperCopy
              text={discordName}
              label="discord"
              isRedirect={false}
              link=""
              IconTag={<TbBrandDiscord />}
            />
            <WrapperCopy
              text=""
              label="twitter"
              isRedirect={true}
              link={twitter}
              IconTag={<FiTwitter />}
            />
            <WrapperCopy
              text=""
              label="website"
              isRedirect={true}
              link={website}
              IconTag={<GiEarthAmerica />}
            />
            <WrapperCopy
              text={email}
              label="email"
              isRedirect={false}
              link=""
              IconTag={<CgMail />}
            />
            <Link href={"/userprofile"}>
              <IconButton size="md" aria-label={"Discord"} icon={<FiEdit />} />
            </Link>
          </Box>
          {bio.length > 0 && <Box py="5px"></Box>}
          <Text color={"bioText"} fontSize="small" textAlign={"center"} px="20px">
            {bio}
          </Text>
          <Box py={"20px"}></Box>
          <Box
            display="flex"
            alignItems={"center"}
            gap="20px"
            justifyContent="space-between"
            flexWrap={"wrap"}
          >
            <Box display={"flex"} gap="10px" flexGrow={1}>
              <RefetchButton />
              {tabIndex == 0 && <FilterPrice />}
            </Box>
          </Box>
          <Box py={2}></Box>
        </Container>
      </AnimatedPageWrapper>
      <Container maxW="2100px" px={["20px", "50px", "80px"]}>
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
            {UserItemTab.map((title) => (
              <Tab key={title}>{title}</Tab>
            ))}
          </TabList>
          <Box pt="20px"></Box>
          {tabIndex == 0 && (
            <UserNormalTab
              ItemTag={DelistCard}
              {...{ tabIndex, currentPage, perPage, setNumberOfPage, setCurrentPage }}
            />
          )}
          {tabIndex == 1 && <DynamicUserSellTab2 />}
          {tabIndex == 2 && (
            <UserNormalTab
              ItemTag={DynamicUserCreatedCard}
              {...{ tabIndex, currentPage, perPage, setNumberOfPage, setCurrentPage }}
            />
          )}
          {tabIndex == 3 && (
            <UserNormalTab
              ItemTag={DynamicUserCreatedCard}
              {...{ tabIndex, currentPage, perPage, setNumberOfPage, setCurrentPage }}
            />
          )}
          {tabIndex == 4 && (
            <UserNormalTab
              ItemTag={DynamicOnAuctionNormalCard}
              {...{ tabIndex, currentPage, perPage, setNumberOfPage, setCurrentPage }}
            />
          )}
          {tabIndex == 5 && (
            <DynamicUserTransferNFTs
              ItemTag={DynamicCancelOfferCard}
              {...{ tabIndex, currentPage, perPage, setNumberOfPage, setCurrentPage }}
            />
          )}
          {tabIndex == 6 && (
            <DynamicUserClaimOffer
              ItemTag={DynamicClaimOfferCard}
              {...{ tabIndex, currentPage, perPage, setNumberOfPage, setCurrentPage }}
            />
          )}
        </Tabs>
        {(tabIndex == 0 || tabIndex == 2 || tabIndex == 3 || tabIndex == 4) && (
          <>
            <Box py={3}></Box>
            <CustomPagination
              onPageChange={setCurrentPage}
              {...{ pagesCount, currentPage, pages }}
            />
          </>
        )}
        <Box py={3}></Box>
      </Container>
    </>
  );
};

export default UserItemContent;
