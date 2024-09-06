import { Box, Text } from "@chakra-ui/react";

const Custom404 = () => {
  return (
    <Box minH="calc(100vh - 90px)" margin="0 auto">
      <Box py={3}></Box>
      <Text textAlign={"center"} fontSize="xx-large" fontWeight="bold">
        404 - Page Not Found
      </Text>
    </Box>
  );
};
export default Custom404;
