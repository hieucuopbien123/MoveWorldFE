import { Box, Button, Text, useToast } from "@chakra-ui/react";
import React, { useState, useRef } from "react";
import { numberWithCommas } from "@/utils/format";
import { useAppContext } from "@/store";
import NFTPageWrapper from "../NFTPageWrapper";
import { errorTopCenter, infoTopCenter, successTopCenter } from "@/utils/toastutils";
import SaleContract from "@/move_services/utils/SaleContract";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import EditPriceButton from "./EditPriceButton";
import { BeatLoader } from "react-spinners";

const NFTDelist = ({ item, setStatus }: any) => {
  const { aptosToDollar } = useAppContext();
  const [loading, setLoading] = useState(false);
  const { showAvatar, callEveryComponentFetchData, fetchBalance } = useAppContext();
  const toast = useToast();
  const toastIdRef = useRef<any>(null);
  const { signAndSubmitTransaction } = useWallet();

  const delistItem = async () => {
    setLoading(true);
    try {
      if (!showAvatar) {
        throw new Error("Please connect your wallet first! ");
      }
      toastIdRef.current = toast(infoTopCenter("Waiting..."));
      await SaleContract.delistNFT({
        tokenData: {
          creator: item.creator,
          collection: item.collectionid,
          name: item.name,
        },
        signAndSubmitTransaction,
        toast,
        toastIdRef,
      });
      toast(successTopCenter("Delist sucessfully"));
      callEveryComponentFetchData();
      setStatus(1);
      fetchBalance();

      setTimeout(() => {
        setLoading(false);
      }, 10000);
    } catch (e: any) {
      console.log(e);
      toast(errorTopCenter(e.message ? JSON.stringify(e.message).slice(0, 140) : "Error happen!!"));
      setLoading(false);
    } finally {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
    }
  };

  return (
    <NFTPageWrapper item={item}>
      <Box
        padding="20px"
        borderRadius={"20px"}
        border={"2px solid"}
        borderColor="primary"
        display={"flex"}
        justifyContent="space-between"
        alignItems={"center"}
        gap={"10px"}
      >
        <Box>
          <Text fontSize="large">Price</Text>
          <Text fontSize={"xx-large"} color="primary" fontWeight="bold">
            {numberWithCommas(item.price, 4)} APT
          </Text>
          <Text color="text">~ ${numberWithCommas(item.price * (aptosToDollar || 0), 4)}</Text>
        </Box>
        <Box display={"flex"} flexDirection="column" gap="10px" width="30%" minW={"130px"}>
          <Button
            variant="solid"
            colorScheme={"teal"}
            borderColor="primary"
            border="2px solid"
            disabled={loading}
            onClick={delistItem}
          >
            {loading ? <BeatLoader size={8} color="white" /> : "DELIST ITEM"}
          </Button>
          <EditPriceButton item={item} loading={loading} setLoading={setLoading}></EditPriceButton>
        </Box>
      </Box>
    </NFTPageWrapper>
  );
};

export default NFTDelist;
