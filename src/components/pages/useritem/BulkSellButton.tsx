import { Button, useDisclosure } from "@chakra-ui/react";
import React from "react";
import dynamic from "next/dynamic";

const DynamicBulkSellButtonDialog = dynamic(() => import("./BulkSellButtonDialog"));

const BulkSellButton = ({
  name,
  image,
  id,
  creator,
  collection,
  seller,
  cartItems,
  setCartItems,
  removeNFTById,
  setID,
}: any) => {
  const isInCart = cartItems.find((o: any) => o.id === id);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const clickBulkSellButton = () => {
    if (isInCart) {
      removeNFTById(id);
    } else {
      onOpen();
    }
  };

  return (
    <>
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
        onClick={clickBulkSellButton}
      >
        {isInCart !== undefined ? "Remove from cart" : "Bulk Sell"}
      </Button>
      {isOpen && (
        <DynamicBulkSellButtonDialog
          {...{
            name,
            image,
            id,
            creator,
            collection,
            seller,
            cartItems,
            setCartItems,
            removeNFTById,
            setID,
            onClose,
            isOpen,
            isInCart,
          }}
        />
      )}
    </>
  );
};

export default BulkSellButton;
