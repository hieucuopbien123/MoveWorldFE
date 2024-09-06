import { Button, useDisclosure } from "@chakra-ui/react";
import React from "react";
import dynamic from "next/dynamic";

const DynamicAuctionListDialog = dynamic(() => import("./AuctionListDialog"));

const AuctionButton = ({ item, loading, setLoading, setStatus }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        variant="outline"
        colorScheme={"teal"}
        borderColor="primary"
        border="2px solid"
        disabled={loading}
        flexGrow={1}
        onClick={onOpen}
      >
        Make Auction
      </Button>
      {isOpen && (
        <DynamicAuctionListDialog {...{ item, loading, setLoading, setStatus, onClose, isOpen }} />
      )}
    </>
  );
};
export default AuctionButton;
