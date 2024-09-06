import { Box, Text, useColorMode } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import HeartButton from "../HeartButton";

const UnlistedNormalCard = ({ name, image, id, liked, heart }: any) => {
  const { colorMode } = useColorMode();

  return (
    <>
      <Box
        borderRadius={"20px"}
        background="coveritem"
        position="relative"
        transition="0.5s"
        sx={{
          "&:hover img": {
            transform: "scale(1.2)",
            transition: "0.5s",
          },
          "&:hover": {
            boxShadow:
              colorMode == "dark"
                ? "rgb(255 255 255 / 50%) 0px 0px 25px"
                : "rgb(0 0 0 / 50%) 0px 0px 25px",
          },
        }}
        maxW="490px"
        width="100%"
        height="100%"
      >
        <Link href={`/nft/${id}`}>
          <Box overflow={"hidden"} position="relative" style={{ borderRadius: "20px" }}>
            <Image
              src={image}
              width="0"
              height="0"
              sizes="100vw"
              style={{
                borderRadius: "20px",
                width: "100%",
                aspectRatio: "1/1",
                objectFit: "cover",
                backgroundColor: "#c3c3c3",
              }}
              alt="nft"
            />
          </Box>
          <Box p={4} display="flex" flexDirection="column" gap="10px">
            <Text fontWeight="bold" fontSize="large">
              {name}
            </Text>
            <Text color={"text"}>Unlisted Item</Text>
          </Box>
        </Link>
        <HeartButton {...{ id, liked, heart }} />
      </Box>
    </>
  );
};

export default UnlistedNormalCard;
