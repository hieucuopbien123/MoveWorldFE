import updateServer from "@/apis/updateServer";
import MoveServices from "@/move_services/utils/MoveServices";
import { useAppContext } from "@/store";
import { errorTopCenter, infoTopCenter, successTopCenter } from "@/utils/toastutils";
import { Box, Text, useColorMode, Button, useToast } from "@chakra-ui/react";
import Image from "next/image";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { BeatLoader } from "react-spinners";

const ReceivedOfferCard = ({
  name,
  image,
  id,
  creator,
  collection,
  fetchData,
  fromAddress,
}: any) => {
  const { colorMode } = useColorMode();
  const [loading, setLoading] = useState(false);
  const { showAvatar, fetchBalance } = useAppContext();
  const toastIdRef: any = React.useRef();
  const toast = useToast();
  const { signAndSubmitTransaction } = useWallet();
  const router = useRouter();

  const claimOffer = async () => {
    setLoading(true);
    try {
      if (!showAvatar) {
        throw new Error("Please connect your wallet first! ");
      }
      toastIdRef.current = toast(infoTopCenter("Waiting connect to server..."));
      await updateServer({ name, creator, collectionName: collection });
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toastIdRef.current = toast(infoTopCenter("Waiting..."));
      await MoveServices.claimNFT({
        data: {
          sender: fromAddress,
          creator,
          collectionName: collection,
          name,
        },
        signAndSubmitTransaction,
        toast,
        toastIdRef,
      });
      toast(successTopCenter("Claim NFT sucessfully"));
      await fetchData();
      fetchBalance();

      setLoading(false);
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

  const redirectToNFTDetail = async () => {
    try {
      toastIdRef.current = toast(infoTopCenter("Go to NFT Detail...."));
      const response = await updateServer({ name, creator, collectionName: collection });
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      router.push(`/nft/${response.id}`);
    } catch (e: any) {
      console.log(e);
      toast(errorTopCenter(e.message ? JSON.stringify(e.message).slice(0, 140) : "Error happen!!"));
    }
  };

  return (
    <>
      <Box
        borderRadius={"20px"}
        background="coveritem"
        position="relative"
        transition="0.5s"
        sx={{
          "&:hover .quick-list-button": {
            position: "absolute",
            top: "50%",
            transition: ".5s",
            opacity: 1,
            zIndex: 3,
          },
          "&:hover img": {
            transform: "scale(1.2)",
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
      >
        <Box onClick={redirectToNFTDetail}>
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
            <Text fontWeight="bold" fontSize="large">
              {name}
            </Text>
          </Box>
        </Box>
        <Button
          className="quick-list-button"
          borderRadius={"20px"}
          transition={"background 1s ease-out"}
          minWidth="fit-content"
          bgGradient="linear(to-br, teal.300, teal.600)"
          _hover={{
            bgGradient: "linear(to-br, teal.600, teal.300)",
          }}
          sx={{
            position: "absolute",
            top: "100%",
            transform: "translate(-50%,-50%)",
            left: "50%",
            opacity: "0",
            transition: ".5s ,opacity .5s",
            fontSize: "14px",
            padding: "0px 15%",
            zIndex: 5,
          }}
          onClick={claimOffer}
          disabled={loading}
        >
          {loading ? <BeatLoader size={8} color="white" /> : "Claim NFT"}
        </Button>
      </Box>
    </>
  );
};

export default ReceivedOfferCard;
