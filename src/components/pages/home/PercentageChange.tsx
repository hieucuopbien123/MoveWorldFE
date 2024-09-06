import { Box, Text } from "@chakra-ui/react";
import "aos/dist/aos.css";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

const PercentageChange = ({ value }: any) => {
  return (
    <>
      {value > 0 && (
        <Box
          display={"flex"}
          alignItems={"center"}
          overflow={"hidden"}
          backgroundColor="#00FFA11F"
          padding={"0px 5px"}
          borderRadius="24px"
        >
          <TriangleUpIcon color="green" fontSize={"x-small"}></TriangleUpIcon>
          <Text ml={1} color={"#00ffa1"} fontWeight="500">
            {parseFloat(Math.abs(value).toString()).toFixed(2)}%
          </Text>
        </Box>
      )}
      {value < 0 && (
        <Box
          display={"flex"}
          overflow={"hidden"}
          alignItems="center"
          backgroundColor="#ff42381f"
          padding={"0px 5px"}
          borderRadius="24px"
        >
          <TriangleDownIcon color="#FF4238" fontSize={"x-small"}></TriangleDownIcon>
          <Text ml={1} color={"#FF4238"}>
            {parseFloat(Math.abs(value).toString()).toFixed(2)}%
          </Text>
        </Box>
      )}
      {value == 0 && (
        <Box
          display={"flex"}
          overflow={"hidden"}
          alignItems="center"
          padding={"0px 5px"}
          borderRadius="24px"
        >
          <Text ml={1}>- %</Text>
        </Box>
      )}
    </>
  );
};

export default PercentageChange;
