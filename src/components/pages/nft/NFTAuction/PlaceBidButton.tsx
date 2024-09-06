import React from "react";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { Button, useDisclosure } from "@chakra-ui/react";
import dynamic from "next/dynamic";

const DynamicPlaceBidButtonModal = dynamic(() => import("./PlaceBidButtonModal"));

const PlaceBidButton = ({ item, loading, setLoading }: any) => {
  const { account } = useWallet();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isDisable =
    loading ||
    Math.floor(new Date().valueOf() / 1000) < item.auctionStartAt ||
    item.auctionStartAt == 0 ||
    item.auctionCurrentBidAddress == account?.address ||
    item.auctionEndAt < Math.floor(new Date().valueOf() / 1000);
  return (
    <>
      <Button
        variant="outline"
        colorScheme={"teal"}
        borderColor="primary"
        border="2px solid"
        onClick={onOpen}
        disabled={isDisable}
      >
        PLACE BID
      </Button>
      {isOpen && <DynamicPlaceBidButtonModal {...{ isOpen, onClose, item, loading, setLoading }} />}
    </>
  );
};
export default PlaceBidButton;
