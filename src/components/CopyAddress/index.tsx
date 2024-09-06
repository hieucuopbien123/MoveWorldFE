import { IconButton, Tooltip, useClipboard } from "@chakra-ui/react";
import React from "react";
import { MdContentCopy } from "react-icons/md";

// Dùng @chakra-ui / useClipboard
const CopyAddress = ({ address }: any) => {
  const { onCopy, hasCopied } = useClipboard(address);

  return (
    <Tooltip
      label={hasCopied ? "Copied" : "Copy address"}
      borderRadius={"10px"}
      padding="10px"
      closeOnClick={false}
    >
      <IconButton
        size={"sm"}
        aria-label="address"
        borderColor={"divider"}
        onClick={onCopy}
        variant={"ghost"}
        borderRadius="50%"
      >
        <MdContentCopy />
      </IconButton>
    </Tooltip>
  );
};

export default CopyAddress;
