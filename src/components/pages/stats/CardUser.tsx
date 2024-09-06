import { formatPrice } from "@/utils/format";
import { Box, Text, useColorMode } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import Image from "next/image";

const CardUser = ({ item }: any) => {
  const { colorMode } = useColorMode();

  return (
    <Box width={"100%"}>
      <Link href={`/pprofile/${item.address}`}>
        <Box
          maxW={"400px"}
          margin="0 auto"
          borderRadius={"20px"}
          position={"relative"}
          overflow="hidden"
          sx={{
            "&:hover": {
              boxShadow:
                colorMode == "dark"
                  ? "rgb(255 255 255 / 50%) 0px 0px 25px"
                  : "rgb(0 0 0 / 50%) 0px 0px 25px",
            },
          }}
        >
          <Image
            src={item.bgImage}
            style={{
              minHeight: "250px",
              width: "100%",
              backgroundColor: "#b9bec7",
            }}
            width={"0"}
            height="0"
            sizes="100vw"
            alt="background"
          />
          <Box height="20px"></Box>
          <Box
            position={"absolute"}
            bottom={0}
            right={0}
            left={0}
            bgColor="pagination"
            zIndex={1}
            padding="2%"
          >
            <Box
              position={"relative"}
              display="flex"
              gap="20px"
              paddingLeft={"10px"}
              alignItems={"center"}
            >
              <Box
                overflow={"hidden"}
                borderRadius="50%"
                width={"15%"}
                sx={{ "&": { aspectRatio: "1/1" } }}
                backgroundColor="#b9bec7"
                position="relative"
              >
                <Image
                  src={item.userIcon}
                  width="0"
                  height="0"
                  sizes="100vw"
                  style={{
                    flexShrink: 0,
                    borderRadius: "50%",
                    border: "2px solid",
                    width: "100%",
                    height: "100%",
                    borderColor: colorMode == "dark" ? "#ffffffa8" : "#000",
                  }}
                  alt="user"
                />
              </Box>
              <Box>
                <Text
                  textAlign={"left"}
                  width="200px"
                  fontWeight="bold"
                  overflow={"hidden"}
                  fontSize={"medium"}
                  whiteSpace="nowrap"
                  textOverflow={"ellipsis"}
                >
                  {item.name}
                </Text>
                <Text textAlign={"left"} fontWeight="light" fontSize={"small"}>
                  {formatPrice(Number(item.price) || 0)} APT
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Link>
    </Box>
  );
};

export default CardUser;
