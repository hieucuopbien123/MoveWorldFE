import { Box } from "@chakra-ui/react";
import React from "react";

const AnimatedPageWrapper = ({ children, animated }: any) => {
  return (
    <>
      <Box className={`animate__animated animate__${animated}`}>{children}</Box>
    </>
  );
};

export default AnimatedPageWrapper;
