import { IconButton, keyframes } from "@chakra-ui/react";
import React from "react";
import { IoReloadSharp } from "react-icons/io5";
import { useAppContext } from "@/store";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const RefetchButton = () => {
  const { callEveryComponentFetchData, refetchData } = useAppContext();

  return (
    <>
      <IconButton
        variant={"solid"}
        borderRadius="50%"
        aria-label="Refetch"
        onClick={() => callEveryComponentFetchData()}
        animation={refetchData ? `${spin} infinite 0.8s linear` : ""}
        icon={<IoReloadSharp />}
      />
    </>
  );
};

export default RefetchButton;
