import { Box } from "@chakra-ui/react";
import React from "react";
import { Skeleton } from "@chakra-ui/react";

const SkeletonItemCollection = () => {
  return (
    <>
      <Box
        borderRadius={"20px"}
        background="coveritem"
        position="relative"
        maxW="490px"
        width="100%"
      >
        <Box style={{ borderRadius: "20px" }}>
          <Skeleton style={{ borderRadius: "20px", height: "300px" }} />
        </Box>
        <Box p={4} display="flex" flexDirection="column" gap="10px">
          <Skeleton style={{ borderRadius: "20px", height: "20px" }} />
          <Skeleton style={{ borderRadius: "20px", height: "10px", width: "30%" }} />
          <Skeleton style={{ borderRadius: "20px", height: "15px", width: "50%" }} />
        </Box>
      </Box>
    </>
  );
};

export default SkeletonItemCollection;
