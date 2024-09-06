import { Box, Button, Text, useColorMode, useToast, useDisclosure } from "@chakra-ui/react";
import Image from "next/image";
import React, { useState } from "react";
import { errorTopCenter, infoTopCenter } from "@/utils/toastutils";
import BulkSellButton from "./BulkSellButton";
import TransferButton from "./TransferButton";
import updateServer from "@/apis/updateServer";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const DynamicSellCard2Dialog = dynamic(() => import("./SellCard2Dialog"));

const SellCard2 = ({
  name,
  image,
  creator,
  collection,
  removeNFTById,
  cartItems,
  setCartItems,
  fetchData,
}: any) => {
  const { colorMode } = useColorMode();
  const [id, setID] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const toastIdRef: any = React.useRef();
  const router = useRouter();

  const toast = useToast();

  const redirectToNFTDetail = async () => {
    try {
      let tempID = id;
      if (!id) {
        toastIdRef.current = toast(infoTopCenter("Go to NFT Detail...."));
        const response = await updateServer({ name, creator, collectionName: collection });
        tempID = response.id;
        setID(response.id);
        if (toastIdRef.current) {
          toast.close(toastIdRef.current);
        }
      }
      router.push(`/nft/${tempID}`);
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
        sx={{
          "&:hover #collectionitem__lastsaletext": {
            opacity: 0,
          },
          "&:hover #collectionitem__buybutton": {
            opacity: 1,
          },
          "&:hover img": {
            transform: "scale(1.1)",
            opacity: 0.5,
            transition: "0.5s",
          },
          "&:hover .quick-list-button": {
            position: "absolute",
            top: "50%",
            transition: ".5s",
            opacity: 1,
            zIndex: 3,
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
            <Button
              className="quick-list-button"
              borderRadius={"20px"}
              onMouseDown={(e) => {
                e.stopPropagation();
                onOpen();
              }}
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
            >
              Quick list
            </Button>
          </Box>
          <Box p={4} display="flex" flexDirection="column" gap="10px">
            <Text fontWeight="bold" fontSize="large">
              {name}
            </Text>
          </Box>
        </Box>
        <Box
          position="absolute"
          bottom={0}
          right={0}
          left={0}
          display="flex"
          zIndex={2}
          opacity={0}
          id="collectionitem__buybutton"
          transition="0.5s"
        >
          <TransferButton
            {...{
              setID,
              name,
              id,
              creator,
              collection,
              removeNFTById,
              loading,
              setLoading,
              fetchData,
            }}
          />
          <BulkSellButton
            {...{
              name,
              image,
              id,
              creator,
              collection,
              cartItems,
              setCartItems,
              removeNFTById,
              setID,
            }}
          />
        </Box>
      </Box>
      {isOpen && (
        <DynamicSellCard2Dialog
          {...{
            name,
            creator,
            collection,
            removeNFTById,
            fetchData,
            onClose,
            isOpen,
            id,
            setID,
            loading,
            setLoading,
          }}
        />
      )}
    </>
  );
};

export default SellCard2;
