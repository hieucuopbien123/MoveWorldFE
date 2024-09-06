import { formatPrice } from "@/utils/format";
import SaleContract from "@/move_services/utils/SaleContract";
import { Box, Button, Text, useColorMode, useToast } from "@chakra-ui/react";
import Image from "next/image";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import Link from "next/link";
import React, { useState } from "react";
import { errorTopCenter, infoTopCenter, successTopCenter } from "@/utils/toastutils";
import { useAppContext } from "@/store";
import HeartButton from "@/components/HeartButton";
import { BeatLoader } from "react-spinners";

const DelistCard = ({
  name,
  price,
  lastSale,
  image,
  id,
  liked,
  heart,
  creator,
  collection,
}: any) => {
  const { colorMode } = useColorMode();

  const [loading, setLoading] = useState(false);
  const toastIdRef: any = React.useRef();
  const { signAndSubmitTransaction } = useWallet();
  const { showAvatar } = useAppContext();
  const { callEveryComponentFetchData, fetchBalance } = useAppContext();

  const toast = useToast();

  const delistItem = async () => {
    setLoading(true);
    try {
      if (!showAvatar) {
        throw new Error("Please connect your wallet first! ");
      }
      toastIdRef.current = toast(infoTopCenter("Waiting..."));
      await SaleContract.delistNFT({
        tokenData: {
          creator,
          collection,
          name,
        },
        signAndSubmitTransaction,
        toast,
        toastIdRef,
      });
      toast(successTopCenter("Delist sucessfully"));
      callEveryComponentFetchData();
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
    <>
      <Box
        borderRadius={"20px"}
        background="coveritem"
        position="relative"
        sx={{
          "&:hover img": {
            transform: "scale(1.1)",
            opacity: 0.5,
            transition: "0.5s",
          },
          "&:hover .quick-list-button": {
            opacity: 1,
            transition: "0.5s",
          },
          "&:hover": {
            boxShadow:
              colorMode == "dark"
                ? "rgb(255 255 255 / 50%) 0px 0px 25px"
                : "rgb(0 0 0 / 50%) 0px 0px 25px",
          },
        }}
        maxW="490px"
        width="100%"
        height="100%"
      >
        <Link href={`/nft/${id}`}>
          <Box overflow={"hidden"} style={{ borderRadius: "20px" }} position="relative">
            <Image
              src={image}
              width="0"
              height="0"
              sizes="100vw"
              style={{
                width: "100%",
                objectFit: "cover",
                aspectRatio: "1/1",
                transition: "0.5s",
                backgroundColor: "#b9bec7",
              }}
              alt="nft"
            />
          </Box>
          <Box p={4} display="flex" flexDirection="column" gap="10px">
            <Text fontWeight="bold" fontSize="small">
              {name}
            </Text>
            <Text fontWeight="bold" fontSize="large">
              {formatPrice(price)} APT
            </Text>
            <Text transition="0.1s">Last sale: {formatPrice(lastSale)} APT</Text>
          </Box>
        </Link>
        <Button
          className="quick-list-button"
          borderRadius={"20px"}
          onClick={() => {
            delistItem();
          }}
          bgGradient="linear(to-br, teal.300, teal.600)"
          _hover={{
            bgGradient: "linear(to-br, teal.600, teal.300)",
          }}
          position="absolute"
          opacity={0}
          transition="all 0.5s"
          left="50%"
          top="50%"
          transform="translate(-50%,-50%)"
          disabled={loading}
        >
          {loading ? <BeatLoader size={8} color="white" /> : "Delist Now"}
        </Button>
        <HeartButton {...{ id, heart, liked }} />
      </Box>
    </>
  );
};

export default DelistCard;
