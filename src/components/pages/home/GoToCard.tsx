import { formatPrice } from "@/utils/format";
import { Box, Button, Text, useColorMode } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { RiHeartsLine } from "react-icons/ri";

const GoToCard = ({ name, price, image, heart, collection, creator }: any) => {
  const { colorMode } = useColorMode();

  const [heartNum, setHeartNum] = useState(heart);
  useEffect(() => {
    setHeartNum(heart);
  }, [heart]);

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
      >
        <Link href={`/explore/${creator}/${collection}`}>
          <Box overflow={"hidden"} position="relative" style={{ borderRadius: "20px" }}>
            <Image
              src={image}
              width="0"
              height="0"
              sizes="100vw"
              style={{
                width: "100%",
                objectFit: "cover",
                aspectRatio: "1/1",
                transition: "0.5s",
                backgroundColor: "#b9bec7",
              }}
              alt="collection"
            />
          </Box>
          <Box p={4} display="flex" flexDirection="column" gap="10px">
            <Text fontWeight="bold" fontSize="medium">
              {name}
            </Text>
            <Text fontWeight="bold" fontSize="large">
              <span style={{ fontWeight: "lighter", fontSize: "medium" }}>Price:</span>{" "}
              {formatPrice(price)} APT
            </Text>
          </Box>
        </Link>
        <Button
          px={"10px"}
          pt={"5px"}
          pb={"4px"}
          fontSize="larger"
          textAlign={"center"}
          width="fit-content"
          cursor="pointer"
          bgColor={"#00000080"}
          borderRadius={"20px"}
          position="absolute"
          right="10px"
          top="10px"
          zIndex={2}
          sx={{
            "&:hover": {
              bgColor: "#000000",
              opacity: 0.9,
            },
          }}
        >
          <RiHeartsLine
            style={{
              margin: 0,
              display: "inline-block",
              color: "white",
              marginRight: "5px",
            }}
          />
          <Text style={{ display: "inline-block", color: "white" }}>{heartNum}</Text>
        </Button>
      </Box>
    </>
  );
};

export default GoToCard;
