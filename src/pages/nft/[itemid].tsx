import React, { useState, useEffect } from "react";
import AnimatedPageWrapper from "@/components/AnimatedPageWrapper";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import Error from "src/pages/404";
import { useAppContext } from "@/store";
import { Box, Spinner, Text } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useNFT } from "@/apis/nft";
import getOwnerOfNFT from "@/apis/getOwner";
import NFTSeo from "@/components/pages/nft/NFTSeo";
import dynamic from "next/dynamic";

// Dùng dynamic import trong nextjs
const DynamicNFTBuy = dynamic(() => import("@/components/pages/nft/NFTBuy"), {
  loading: () => (
    <Box textAlign={"center"}>
      <Spinner color="primary" thickness="4px" size={"lg"} />
    </Box>
  ),
});
const DynamicNFTList = dynamic(() => import("@/components/pages/nft/NFTList"), {
  loading: () => (
    <Box textAlign={"center"}>
      <Spinner color="primary" thickness="4px" size={"lg"} />
    </Box>
  ),
});
const DynamicNFTDelist = dynamic(() => import("@/components/pages/nft/NFTDelist"), {
  loading: () => (
    <Box textAlign={"center"}>
      <Spinner color="primary" thickness="4px" size={"lg"} />
    </Box>
  ),
});
const DynamicNFTAuction = dynamic(() => import("@/components/pages/nft/NFTAuction"), {
  loading: () => (
    <Box textAlign={"center"}>
      <Spinner color="primary" thickness="4px" size={"lg"} />
    </Box>
  ),
});
const DynamicNFTAuctionOwn = dynamic(() => import("@/components/pages/nft/NFTAuctionOwn"), {
  loading: () => (
    <Box textAlign={"center"}>
      <Spinner color="primary" thickness="4px" size={"lg"} />
    </Box>
  ),
});

const NFTItem = ({
  item,
}: // owner,
// , creatorIcon, creatorName
any) => {
  const { account } = useWallet();
  const { refetchData } = useAppContext();
  const [NFTData, setNFTData] = useState<any>(item);
  const [NFTowner, setNFTOwner] = useState("");
  const [status, setStatus] = useState(item.status);
  const [creatorIcon, setCreatorIcon] = useState("/user/background.png");
  const [creatorName, setCreatorName] = useState("");

  const { data, isLoading, isError } = useNFT({
    item,
    refetchData,
    // , creatorIcon, creatorName
  });

  useEffect(() => {
    if (data) setNFTData({ ...data, creatorIcon, creatorName });
  }, [data, creatorIcon, creatorName]);

  useEffect(() => {
    updateOwner();
  }, []);

  useEffect(() => {
    fetchCreatorData();
  }, []);

  const fetchCreatorData = async () => {
    try{
      const avatarData = await (
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/user/profile/public/${item.creator}`)
      ).json();
      setCreatorIcon(
        avatarData.data?.avatar &&
          (avatarData.data?.avatar.startsWith("/") || avatarData.data?.avatar.startsWith("http"))
          ? avatarData.data?.avatar
          : "/user/background.png"
      );
      setCreatorName(avatarData.data?.username);
    } catch(e){
      console.log(e);
      setCreatorIcon("/user/background.png");
      setCreatorName("Test creator name");
    }
  };

  const updateOwner = async () => {
    const owner = await getOwnerOfNFT(NFTData.collectionid, NFTData.creator, NFTData.name);
    setNFTOwner(owner);
  };

  if (isError) {
    return (
      <>
        <NFTSeo image={item.image} name={item.name} collection={item.collectionid} id={item.id} />
        <Box textAlign="center" py={5}>
          <CloseIcon color="red" />
          <Text color="red">Error fetching data</Text>
        </Box>
      </>
    );
  }

  if (isLoading || NFTowner == "") {
    return (
      <>
        <NFTSeo image={item.image} name={item.name} collection={item.collectionid} id={item.id} />
        <Box textAlign={"center"}>
          <Spinner color="primary" thickness="4px" size={"lg"} />
        </Box>
      </>
    );
  }

  if (account?.address != NFTowner && (status == 0 || status == 1)) {
    return (
      <>
        <NFTSeo image={item.image} name={item.name} collection={item.collectionid} id={item.id} />
        <AnimatedPageWrapper animated="fadeIn">
          <DynamicNFTBuy item={NFTData} updateOwner={updateOwner} setStatus={setStatus} />
        </AnimatedPageWrapper>
      </>
    );
  }

  if (account?.address == NFTowner && status == 1) {
    return (
      <>
        <NFTSeo image={item.image} name={item.name} collection={item.collectionid} id={item.id} />
        <AnimatedPageWrapper animated="fadeIn">
          <DynamicNFTList item={NFTData} setStatus={setStatus} />
        </AnimatedPageWrapper>
      </>
    );
  }

  if (account?.address == NFTowner && status == 0) {
    return (
      <>
        <NFTSeo image={item.image} name={item.name} collection={item.collectionid} id={item.id} />
        <AnimatedPageWrapper animated="fadeIn">
          <DynamicNFTDelist item={NFTData} setStatus={setStatus} />
        </AnimatedPageWrapper>
      </>
    );
  }

  if (account?.address != NFTowner && status == 2) {
    return (
      <>
        <NFTSeo image={item.image} name={item.name} collection={item.collectionid} id={item.id} />
        <AnimatedPageWrapper animated="fadeIn">
          <DynamicNFTAuction item={NFTData} setStatus={setStatus} updateOwner={updateOwner} />
        </AnimatedPageWrapper>
      </>
    );
  }

  if (account?.address == NFTowner && status == 2) {
    return (
      <>
        <NFTSeo image={item.image} name={item.name} collection={item.collectionid} id={item.id} />
        <AnimatedPageWrapper animated="fadeIn">
          <DynamicNFTAuctionOwn
            item={NFTData}
            updateOwner={updateOwner}
            setStatus={setStatus}
            NFTowner={NFTowner}
          />
        </AnimatedPageWrapper>
      </>
    );
  }

  return <Error />;
};

export default NFTItem;

export async function getServerSideProps(context: any) {
  try{
    const { query } = context;
    const { itemid } = query;
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/nft/${itemid}`);
    const data = await response.json();
    console.log(data);
    const tokenData = {
      collectionid: data.data.collection,
      name: data.data?.name || "",
      creator: data.data.creator,
    };
  
    const processedData = {
      ...tokenData,
      seller: data.data?.seller || "",
      image:
        data.data?.uri && (data.data?.uri.startsWith("/") || data.data?.uri.startsWith("http"))
          ? data.data.uri
          : "/user/background.png",
      price: (data.data?.price || 0) / Math.pow(10, 8),
      id: data.data.id,
      status: data.data.status,
      description: data.data?.description || "",
      histories: data.data?.histories || [],
      auctionHistories: data.data?.auctionHistories || [],
      heart: data.data?.likes || 0,
      properties: data.data?.properties || [],
      transactionFee: data.data?.transactionFee || 5.0,
      royalitiesFee: data.data?.royaltitiesFee || 0.0,
      isKyced: data.data?.isKyc || false,
      auctionOfferPrice: (data.data?.auctionOfferPrice || 0) / Math.pow(10, 8),
      auctionStartAt: data.data?.auctionStartAt || 0,
      auctionEndAt: data.data?.auctionEndAt || 0,
      auctionSeller: data.data?.auctionSeller || "",
      auctionCurrentBidPrice: (data.data?.auctionCurrentBidPrice || 0) / Math.pow(10, 8),
      auctionCurrentBidAddress: data.data?.auctionCurrentBidAddress || "",
      type: data.data?.type || [],
    };
  
    return {
      props: {
        item: processedData,
      },
    };
  } catch(e) {
    console.log(e);
    const tokenData = {
      collectionid: "0001",
      name: "Test Name Token Data",
      creator: "Hieu",
    };
    const processedData = {
      ...tokenData,
      seller: "0x00000000000000000001",
      image: "/user/background.png",
      price: 1000000000 / Math.pow(10, 8),
      id: "1",
      status: 0,
      description: "This is test description",
      histories: [],
      auctionHistories: [],
      heart: 1,
      properties: [],
      transactionFee: 5.0,
      royalitiesFee: 2.0,
      isKyced: true,
      auctionOfferPrice: 100000000 / Math.pow(10, 8),
      auctionStartAt: 0,
      auctionEndAt: 0,
      auctionSeller: "0x00000000000000002",
      auctionCurrentBidPrice: 0 / Math.pow(10, 8),
      auctionCurrentBidAddress: "0x0000000000000000002",
      type: [],
    };
    return {
      props: {
        item: processedData,
      },
    };
  }
}
