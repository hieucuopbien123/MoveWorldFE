import { Box, Button, Divider, Heading, IconButton, Text, useColorMode } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BottomSheet } from "react-spring-bottom-sheet";
import Empty from "@/components/Empty";
import { formatPrice, numberWithCommas } from "@/utils/format";
import { BiTrashAlt } from "react-icons/bi";
import { BeatLoader } from "react-spinners";

const BottomSheetCart = ({
  isOpen,
  onToggle,
  setCartItems,
  cartItems,
  totalPrice,
  dollarPrice,
  completePurchase,
  removeFromCart,
  loading,
}: any) => {
  const { colorMode } = useColorMode();

  return (
    <>
      <BottomSheet
        scrollLocking={false}
        open={isOpen}
        onDismiss={onToggle}
        style={{
          // @ts-ignore
          "--rsbs-bg": colorMode == "dark" ? "#161d2c" : "#f6f7f9",
        }}
      >
        <Box p={"20px"}>
          <Heading size="md" display="flex" justifyContent={"space-between"} alignItems="center">
            <Text>Your cart</Text>
            <IconButton
              onClick={onToggle}
              variant={"ghost"}
              aria-label="close cart"
              icon={<AiOutlineClose />}
            />
          </Heading>
          <Divider></Divider>
          <Box
            p={"20px"}
            pb={"10px"}
            display="flex"
            justifyContent={"space-between"}
            alignItems="center"
          >
            <Text fontWeight={"bold"} fontSize="large">
              {cartItems.length} items
            </Text>
            <Button size="sm" variant={"outline"} onClick={() => setCartItems([])}>
              Clear All
            </Button>
          </Box>
          {cartItems && cartItems.length > 0 ? (
            cartItems.map((d: any) => (
              <Box
                px={"10px"}
                py={"10px"}
                key={d.id}
                display="flex"
                gap="10px"
                alignItems={"center"}
                justifyContent="space-between"
                sx={{
                  "&:hover": {
                    backgroundColor: "hoverCover",
                    transition: "all 0.2s linear",
                    borderRadius: "10px",
                    "& #viewcartbottomsheet_iconbutton": {
                      display: "inline-block",
                    },
                    "& #viewcartbottomsheet_text": {
                      display: "none",
                    },
                  },
                  "& #viewcartbottomsheet_iconbutton": {
                    display: "none",
                  },
                }}
              >
                <Box display="flex" gap="10px" alignItems={"center"}>
                  <Box borderRadius="10px" overflow={"hidden"}>
                    <Image
                      className="border-solid"
                      src={d.image}
                      width="40"
                      height="40"
                      style={{
                        borderRadius: "10px",
                        width: "40px",
                        height: "40px",
                        borderWidth: "1px",
                        objectFit: "cover",
                        backgroundColor: "#b9bec7",
                      }}
                      alt="nft"
                    />
                  </Box>
                  <Box>
                    <Text>{d.name}</Text>
                  </Box>
                </Box>
                <Box pt={"5px"}>
                  <Text fontWeight="bold" color="#3cc9c9" id="viewcartbottomsheet_text">
                    {formatPrice(d.price)} APT
                  </Text>
                  <Box
                    aria-label="close cart"
                    id="viewcartbottomsheet_iconbutton"
                    paddingRight="10px"
                    cursor={"pointer"}
                    opacity={0.8}
                    sx={{
                      "&:hover": {
                        opacity: 1,
                      },
                    }}
                    onClick={() => removeFromCart(d.id)}
                  >
                    <BiTrashAlt />
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <>
              <Box pt={3} textAlign="center">
                <Empty title="No Item" />
              </Box>
            </>
          )}
          <Box pt={3}></Box>
          <Divider></Divider>
          <Box p="20px" display="flex" flexDirection="column" gap="20px">
            <Box>
              <Box display="flex" justifyContent="space-between" fontSize="large">
                <Text>Total price:</Text>
                <Text fontWeight="bold">{numberWithCommas(totalPrice, 9)} APT</Text>
              </Box>
              <Text color="gray" fontSize="small" float="right">
                ${numberWithCommas(dollarPrice, 9)}
              </Text>
            </Box>
            <Button
              size="lg"
              variant="solid"
              colorScheme={"green"}
              w="100%"
              disabled={cartItems.length <= 0}
              onClick={completePurchase}
            >
              {loading ? <BeatLoader size={8} color="white" /> : "Confirm bulk sell"}
            </Button>
          </Box>
        </Box>
      </BottomSheet>
    </>
  );
};

export default BottomSheetCart;
