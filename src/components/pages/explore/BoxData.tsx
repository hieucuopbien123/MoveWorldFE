import React from "react";
import { Box, Text } from "@chakra-ui/react";

const BoxData = ({ title, content, ...props }: any) => {
  return (
    <>
      <Box
        py={"30px"}
        px="20px"
        flexGrow={1}
        maxW={"180px"}
        {...props}
        borderRadius="20px"
        border="1px solid"
        className="shadow-lg"
        borderColor="divider"
        backgroundColor="cover"
        textAlign={"center"}
      >
        <Text fontWeight={"bold"} fontSize={"x-large"}>
          {content}
        </Text>
        <Box py={1}></Box>
        <Text color={"gray"}>{title}</Text>
      </Box>
    </>
  );
};

export default BoxData;
