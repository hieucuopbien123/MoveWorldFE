import React, { useState, useEffect } from "react";
import { Box, Button, Container, Text, useDisclosure } from "@chakra-ui/react";
import Empty from "@/components/Empty";
import { Spinner } from "@chakra-ui/react";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import ViewCartDialog from "./ViewCardDialog";
import { RiShoppingCartLine } from "react-icons/ri";
import { CloseIcon } from "@chakra-ui/icons";
import getAllNFT from "@/apis/useritemownedtab";
import SellCard2 from "./SellCard2";

const UserSellTab2 = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { account } = useWallet();
  const [cartItems, setCartItems] = useState([]);
  const removeNFTById = (id: any) => {
    setCartItems(cartItems.filter((o: any) => o.id != id));
  };
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsError(false);
      if (account?.address) {
        setLoading(true);
        const response = await getAllNFT(account?.address);
        setData(
          response.data.data.current_token_ownerships.map((r: any) => ({
            name: r.current_token_data.name,
            image:
              r.current_token_data.metadata_uri.startsWith("/") ||
              r.current_token_data.metadata_uri.startsWith("http")
                ? r.current_token_data.metadata_uri
                : "/user/background.png",
            creator: r.current_token_data.creator_address,
            collection: r.current_token_data.collection_name,
          }))
        );
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
      setIsError(true);
    }
  };

  if (isError) {
    return (
      <Box textAlign="center" py={5}>
        <CloseIcon color="red" />
        <Text color="red">Error fetching data</Text>
      </Box>
    );
  }

  if (loading) {
    return (
      <>
        <Box textAlign={"center"}>
          <Spinner color="primary" thickness="4px" size={"lg"} />
        </Box>
      </>
    );
  }

  return (
    <>
      <Container
        maxW="2100px"
        pb="20px"
        display="flex"
        justifyContent={"end"}
        flexWrap="wrap"
        px="0"
      >
        <Box>
          {
            <Box position="relative">
              <Button variant={"solid"} colorScheme="green" onClick={onToggle}>
                <RiShoppingCartLine />
                &nbsp;View Cart
              </Button>
              {cartItems.length > 0 && (
                <Button
                  onClick={onToggle}
                  size="xs"
                  variant={"solid"}
                  sx={{ "&:hover": { bgColor: "primary" } }}
                  position={"absolute"}
                  right={"-5px"}
                  top={"-10px"}
                  backgroundColor="primary"
                  borderRadius={"50%"}
                >
                  {cartItems.length}
                </Button>
              )}
            </Box>
          }
        </Box>
      </Container>
      <ViewCartDialog
        cartItems={cartItems}
        setCartItems={setCartItems}
        isOpen={isOpen}
        onToggle={onToggle}
        fetchData={fetchData}
      />
      {data.length > 0 && (
        <Box className="grid min-[0px]:grid-cols-1 min-[400px]:grid-cols-2 min-[700px]:grid-cols-3 min-[1000px]:grid-cols-4 min-[1200px]:grid-cols-5 min-[1575px]:grid-cols-6 min-[1875px]:grid-cols-7 gap-4 justify-items-center">
          {data.map((d: any) => (
            <SellCard2
              key={d.name}
              {...d}
              {...{ removeNFTById, cartItems, setCartItems }}
              fetchData={fetchData}
            />
          ))}
        </Box>
      )}
      {data.length <= 0 && (
        <Box pt={3} textAlign="center">
          <Empty title="No Item" />
        </Box>
      )}
    </>
  );
};

export default UserSellTab2;
