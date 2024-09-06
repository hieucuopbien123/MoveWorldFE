import React from "react";
import { Button, useDisclosure } from "@chakra-ui/react";
import dynamic from "next/dynamic";

const DynamicEditPriceDialog = dynamic(() => import("./EditPriceDialog"));

const EditPriceButton = ({ item, loading, setLoading }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        variant="outline"
        colorScheme={"teal"}
        borderColor="primary"
        border="2px solid"
        onClick={onOpen}
        disabled={loading}
      >
        EDIT PRICE
      </Button>
      {isOpen && <DynamicEditPriceDialog {...{ item, loading, setLoading, onClose, isOpen }} />}
    </>
  );
};
export default EditPriceButton;
