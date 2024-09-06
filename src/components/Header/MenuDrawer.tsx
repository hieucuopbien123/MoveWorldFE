import { AiOutlineMenu } from "react-icons/ai";
import { IconButton, useDisclosure } from "@chakra-ui/react";
import React from "react";
import dynamic from "next/dynamic";

const DynamicCustomDrawer = dynamic(() => import("./CustomDrawer"));
const MenuDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        aria-label="Open drawer"
        bg="transparent"
        variant="outline"
        onClick={onOpen}
        icon={<AiOutlineMenu />}
      />
      {isOpen && <DynamicCustomDrawer {...{ isOpen, onClose }} />}
    </>
  );
};

export default MenuDrawer;
