import { Button, useDisclosure } from "@chakra-ui/react";
import React from "react";
import dynamic from "next/dynamic";

const DynamicListItemDialog = dynamic(() => import("./ListItemDialog"));

const ListItemButton = ({ item, loading, setLoading, setStatus }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button colorScheme={"teal"} variant="solid" flexGrow={1} onClick={onOpen} disabled={loading}>
        List This NFT
      </Button>
      {isOpen && (
        <DynamicListItemDialog {...{ item, loading, setLoading, setStatus, onClose, isOpen }} />
      )}
    </>
  );
};

export default ListItemButton;
