import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Slide,
  Heading,
  IconButton,
  Text,
  Show,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";
import Empty from "@/components/Empty";
import { BiTrashAlt } from "react-icons/bi";
import { formatPrice, numberWithCommas } from "@/utils/format";
import { useAppContext } from "@/store";
import SaleContract from "@/move_services/utils/SaleContract";
import { errorTopCenter, infoTopCenter, successTopCenter } from "@/utils/toastutils";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import dynamic from "next/dynamic";
import { BeatLoader } from "react-spinners";

const DynamicBottomSheetCart = dynamic(() => import("./BottomSheetCart"));

const ViewCartDialog = ({ isOpen, onToggle, setCartItems, cartItems, fetchData }: any) => {
  const removeFromCart = (id: any) => {
    setCartItems(cartItems.filter((o: any) => o.id != id));
  };
  const toast = useToast();
  const toastIdRef: any = React.useRef();

  const { aptosToDollar, fetchBalance } = useAppContext();
  const totalPrice = cartItems.reduce(
    (accumulator: number, object: any) => accumulator + object.price,
    0
  );
  const dollarPrice = (aptosToDollar || 0) * totalPrice;
  const [loading, setLoading] = useState(false);
  const { showAvatar } = useAppContext();
  const { signAndSubmitTransaction } = useWallet();

  const completePurchase = async () => {
    setLoading(true);
    try {
      if (!showAvatar) {
        throw new Error("Please connect your wallet first! ");
      }
      toastIdRef.current = toast(infoTopCenter("Waiting..."));

      await SaleContract.listBulk({
        data: cartItems.map((item: any) => {
          return {
            price: Math.floor(Number(item.price) * Math.pow(10, 8)),
            tokenDataId: {
              creator: item.creator,
              collection: item.collection,
              name: item.name,
            },
          };
        }),
        signAndSubmitTransaction,
        toast,
        toastIdRef,
      });

      toast(successTopCenter("Sell sucessfully"));
      setCartItems([]);
      fetchBalance();
      await fetchData();
    } catch (e: any) {
      console.log(e);
      toast(errorTopCenter(e.message ? JSON.stringify(e.message).slice(0, 140) : "Error happen!!"));
    } finally {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      setLoading(false);
      onToggle();
    }
  };

  return (
    <>
      {isOpen && (
        <Box zIndex={11}>
          <Box className="max-[600px]:hidden">
            <Box
              position="fixed"
              top={0}
              right={0}
              left={0}
              bottom={0}
              bgColor="rgba(0, 0, 0, 0.6)"
              zIndex={999}
              onClick={onToggle}
            ></Box>
            <Slide direction="right" in={isOpen} style={{ zIndex: 999 }}>
              <Box
                position="fixed"
                top={0}
                right={0}
                left={0}
                bottom={0}
                zIndex={999}
                onClick={onToggle}
              ></Box>
              <Card
                position={"fixed"}
                zIndex={9999}
                right={50}
                top={45}
                bottom={45}
                width={"360px"}
                bgColor={"cover"}
                overflow="auto"
              >
                <CardHeader py="10px">
                  <Heading
                    size="md"
                    display="flex"
                    justifyContent={"space-between"}
                    alignItems="center"
                  >
                    <Text>Your cart</Text>
                    <IconButton
                      onClick={onToggle}
                      variant={"ghost"}
                      aria-label="close cart"
                      icon={<AiOutlineClose />}
                    />
                  </Heading>
                </CardHeader>
                <Divider></Divider>
                <CardBody padding={0}>
                  <Box
                    p={"20px"}
                    pb={"0px"}
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
                  <Box
                    py={"10px"}
                    px={"10px"}
                    display="flex"
                    flexDirection={"column"}
                    overflow="auto"
                    maxHeight="calc(100vh - 50px - 160px - 60px - 90px)"
                    minHeight="80px"
                  >
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
                              "& #viewcartdialog_iconbutton": {
                                display: "inline-block",
                              },
                              "& #viewcartdialog_text": {
                                display: "none",
                              },
                            },
                            "& #viewcartdialog_iconbutton": {
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
                                  borderWidth: "1px",
                                  width: "40px",
                                  height: "40px",
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
                            <Text fontWeight="bold" color="#3cc9c9" id="viewcartdialog_text">
                              {formatPrice(d.price)} APT
                            </Text>
                            <Box
                              aria-label="close cart"
                              id="viewcartdialog_iconbutton"
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
                      <Box py={3} textAlign="center">
                        <Empty title="No Item" />
                      </Box>
                    )}
                  </Box>
                  <Divider></Divider>
                  <Box p="20px" display="flex" flexDirection="column" gap="20px">
                    <Box>
                      <Box display="flex" justifyContent="space-between" fontSize="large">
                        <Text>Total price:</Text>
                        <Text fontWeight="bold">{numberWithCommas(totalPrice, 8)} APT</Text>
                      </Box>
                      <Text color="gray" fontSize="small" float="right">
                        ~ ${numberWithCommas(dollarPrice, 8)}
                      </Text>
                    </Box>
                    <Button
                      size="lg"
                      variant="solid"
                      colorScheme={"green"}
                      w="100%"
                      onClick={() => completePurchase()}
                      disabled={cartItems.length <= 0 || loading}
                    >
                      {loading ? <BeatLoader size={8} color="white" /> : "Confirm bulk sell"}
                    </Button>
                  </Box>
                </CardBody>
              </Card>
            </Slide>
          </Box>
          <Show breakpoint="(max-width: 600px)">
            <DynamicBottomSheetCart
              cartItems={cartItems}
              setCartItems={setCartItems}
              isOpen={isOpen}
              onToggle={onToggle}
              totalPrice={totalPrice}
              dollarPrice={dollarPrice}
              completePurchase={completePurchase}
              removeFromCart={removeFromCart}
              loading={loading}
            />
          </Show>
        </Box>
      )}
    </>
  );
};

export default ViewCartDialog;
