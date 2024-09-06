import { Button, useDisclosure } from "@chakra-ui/react";
import React from "react";
import dynamic from "next/dynamic";

const DynamicTransferButtonDialog = dynamic(() => import("./TransferButtonDialog"));

const TransferButton = ({
  name,
  id,
  creator,
  collection,
  removeNFTById,
  loading,
  setLoading,
  fetchData,
  setID,
}: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
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
        disabled={loading}
        onClick={onOpen}
      >
        {"Transfer"}
      </Button>
      {isOpen && (
        <DynamicTransferButtonDialog
          {...{
            name,
            id,
            creator,
            collection,
            removeNFTById,
            loading,
            setLoading,
            fetchData,
            setID,
            onClose,
            isOpen,
          }}
        />
      )}
    </>
  );
};

export default TransferButton;
