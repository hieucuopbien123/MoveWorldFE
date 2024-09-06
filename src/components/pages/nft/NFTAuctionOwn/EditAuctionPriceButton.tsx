import React from "react";
import { Button, useDisclosure } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { BeatLoader } from "react-spinners";

const DynamicEditPriceDialog = dynamic(() => import("./EditPriceDialog"));

const EditAuctionPriceButton = ({ item, loading, setLoading }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isDisable =
    item.auctionCurrentBidAddress && item.auctionCurrentBidAddress != item.auctionSeller;

  return (
    <>
      <Button
        variant="outline"
        colorScheme={"teal"}
        borderColor="primary"
        border="2px solid"
        onClick={onOpen}
        disabled={loading || isDisable}
      >
        {loading ? <BeatLoader size={8} color="white" /> : "EDIT PRICE"}
      </Button>
      {isOpen && <DynamicEditPriceDialog {...{ isOpen, onClose, item, loading, setLoading }} />}
    </>
  );
};
export default EditAuctionPriceButton;
