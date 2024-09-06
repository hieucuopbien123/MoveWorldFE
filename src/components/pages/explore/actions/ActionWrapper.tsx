import { Box, Button, Container, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { RiShoppingCartLine } from "react-icons/ri";
import FilterPrice from "../../FilterPrice";
import FilterCategory from "../../FilterCategory";
import RefetchButton from "@/components/RefetchButton";
import dynamic from "next/dynamic";

const DynamicViewCartDialog = dynamic(() => import("./ViewCartDialog"));

const ActionWrapper = ({ cartItems, setCartItems }: any) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <>
      <Box
        position={"sticky"}
        top={"88px"}
        py={"20px"}
        zIndex={3}
        bgColor={"header"}
        backdropFilter="blur(5px)"
      >
        <Container
          maxW="2100px"
          px={["20px", "50px", "70px"]}
          display="flex"
          justifyContent={"space-between"}
          flexWrap="wrap"
          gap="10px"
        >
          <Box display={"flex"} gap="10px" flexGrow={1} flexWrap="wrap">
            <FilterPrice />
            <FilterCategory />
            <RefetchButton />
          </Box>
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
      </Box>
      {isOpen && (
        <DynamicViewCartDialog
          cartItems={cartItems}
          setCartItems={setCartItems}
          isOpen={isOpen}
          onToggle={onToggle}
        />
      )}
    </>
  );
};

export default ActionWrapper;
