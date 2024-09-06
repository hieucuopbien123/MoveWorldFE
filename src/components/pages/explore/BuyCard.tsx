import { useAppContext } from "@/store";
import Image from "next/image";
import SaleContract from "@/move_services/utils/SaleContract";
import { formatPrice } from "@/utils/format";
import { errorTopCenter, infoTopCenter, successTopCenter } from "@/utils/toastutils";
import { Box, Button, Text, useColorMode, useToast } from "@chakra-ui/react";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import HeartButton from "@/components/HeartButton";
import { BeatLoader } from "react-spinners";

const BuyCard = ({
  name,
  price,
  lastSale,
  image,
  id,
  liked,
  heart,
  cartItems,
  setCartItems,
  seller,
  creator,
  collection,
  removeNFTById,
}: any) => {
  const { colorMode } = useColorMode();

  const { aptosToDollar, showAvatar, callEveryComponentFetchData, fetchBalance } = useAppContext();
  const isInCart = cartItems.find((o: any) => o.id === id);

  const { signAndSubmitTransaction } = useWallet();
  const toast = useToast();

  const router = useRouter();
  const { collectionid } = router.query;
  const toastIdRef: any = React.useRef(null);

  const addToCart = () => {
    if (isInCart) {
      setCartItems(
        cartItems.filter(function (obj: any) {
          return obj.id !== id;
        })
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          id,
          name,
          image,
          price,
          creator,
          collection,
          seller,
        },
      ]);
    }
  };

  const [loading, setLoading] = useState(false);
  const quickBuy = async () => {
    try {
      setLoading(true);
      if (!showAvatar) {
        throw new Error("Please connect your wallet first! ");
      }
      toastIdRef.current = toast(infoTopCenter("Waiting..."));
      await SaleContract.buyNFT({
        sellerAddress: seller,
        tokenData: {
          creator,
          collection: collectionid,
          name: name,
        },
        signAndSubmitTransaction,
        toast,
        toastIdRef,
      });
      toast(successTopCenter("Buy sucessfully"));
      removeNFTById(id);
      callEveryComponentFetchData();
      fetchBalance();

      // Thẻ sau khi update xong thì k được thực hiện tiếp và server update trễ vài giây, ta nên khóa
      // button đó thêm vài giây như này. Thực chất button này kbh nên được bấm có thể set time vô hạn
      // Nếu quan trọng có thể hiện thêm thông báo
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
        transition="0.5s"
        sx={{
          "&:hover #collectionitem__buybutton": {
            opacity: 1,
          },
          "&:hover #collectionitem__lastsaletext": {
            opacity: 0,
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
        maxW="400px"
        width="100%"
        height="100%"
      >
        <Link href={`/nft/${id}`}>
          <Box overflow={"hidden"} position="relative" style={{ borderRadius: "20px" }}>
            <Image
              src={image}
              width="0"
              height="0"
              sizes="100vw"
              style={{
                borderRadius: "20px",
                width: "100%",
                aspectRatio: "1/1",
                objectFit: "cover",
                backgroundColor: "#c3c3c3",
              }}
              alt="nft"
            />
          </Box>
          <Box p={4} display="flex" flexDirection="column" gap="10px">
            <Text fontWeight="bold" fontSize="small">
              {name}
            </Text>
            <Box display="flex" gap="10px">
              <Text fontWeight="bold" fontSize="large" alignItems={"baseline"}>
                {formatPrice(price)} APT
              </Text>
              <Text opacity={0.8} fontSize="small" lineHeight="25px">
                ~ ${formatPrice(price * (aptosToDollar || 0))}
              </Text>
            </Box>
            <Text id="collectionitem__lastsaletext" transition="0.1s">
              Last sale: {formatPrice(lastSale)} APT
            </Text>
          </Box>
        </Link>
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
          <Button
            borderRadius={0}
            borderRight="1px solid"
            borderColor="divider"
            borderBottomLeftRadius={"20px"}
            flexGrow={1}
            backgroundColor="primary"
            opacity={0.9}
            sx={{
              "&:hover": {
                opacity: 1,
                backgroundColor: "#34b1b1",
                filter: "brightness(110%)",
              },
            }}
            onClick={addToCart}
            disabled={loading}
          >
            {isInCart !== undefined ? "Remove from cart" : "Add to cart"}
          </Button>
          <Button
            borderRadius={0}
            borderBottomRightRadius={"20px"}
            flexGrow={1}
            backgroundColor="primary"
            opacity={0.9}
            sx={{
              "&:hover": {
                opacity: 1,
                backgroundColor: "#34b1b1",
                filter: "brightness(110%)",
              },
            }}
            onClick={quickBuy}
            disabled={loading}
          >
            {loading ? <BeatLoader size={8} color="white" /> : "Quick Buy"}
          </Button>
        </Box>
        <HeartButton {...{ id, liked, heart }} />
      </Box>
    </>
  );
};

export default BuyCard;
