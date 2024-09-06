import { Box, Button, Flex, Heading, LinkBox, Text, useColorMode } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { RiHeartsLine } from "react-icons/ri";
import React from "react";
import KycIcon from "@/components/KycIcon";

const Item = ({ item }: any) => {
  const mode = useColorMode();

  return (
    <Box textAlign={"center"}>
      <Box position="relative" maxWidth="500px" margin={"0 auto"}>
        <LinkBox as="article">
          <Link href={`/explore/${item.creator}/${item.name}`}>
            <Box
              bg="cover"
              borderRadius={"10px"}
              className="relative hover:text-green-500 shadow-lg"
              sx={{
                "&:hover #explore__item": {
                  transform: "scale(106%)",
                },
              }}
              padding="2px"
              position={"relative"}
            >
              <Box className="relative shadow-sm rounded-xl hover:text-green-500">
                <Box className="relative rounded-b-none rounded-xl hover:opacity-90">
                  <Box
                    height={"200px"}
                    position="relative"
                    width="100%"
                    overflow={"hidden"}
                    borderRadius="10px"
                  >
                    <Image
                      src={
                        item.featuredImage.startsWith("/") || item.featuredImage.startsWith("http")
                          ? item.featuredImage
                          : "/explore/defaultbackground.jpg"
                      }
                      fill
                      style={{
                        borderRadius: "10px",
                        objectFit: "cover",
                        objectPosition: "center",
                        backgroundColor: "#c3c3c3",
                      }}
                      alt=""
                    />
                  </Box>
                </Box>
              </Box>
              <Flex
                maxWidth="500px"
                transform={"translateY(-10px)"}
                flexDirection="row"
                className="overflow-hidden px-4"
                alignItems={"center"}
                pb={3}
              >
                <Box
                  className="shadow-md"
                  style={{
                    background: mode.colorMode == "dark" ? "black" : "#f6f7f9",
                    borderRadius: "15px",
                    height: 70,
                    width: 70,
                    padding: "5px",
                  }}
                >
                  <Box
                    overflow={"hidden"}
                    position="relative"
                    width="100%"
                    height={"100%"}
                    borderRadius="15px"
                  >
                    <Image
                      src={
                        item.icon.startsWith("/") || item.icon.startsWith("http")
                          ? item.icon
                          : "/user/background.png"
                      }
                      className="border-solid"
                      style={{
                        borderRadius: "15px",
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#c3c3c3",
                      }}
                      width="0"
                      height="0"
                      sizes="100vw"
                      alt=""
                    />
                  </Box>
                </Box>
                <Box px={1}></Box>
                <Heading
                  as="p"
                  style={{
                    fontSize: "medium",
                    top: "10px",
                    position: "relative",
                  }}
                  className="block overflow-hidden break-words break-all text-ellipsis whitespace-nowrap "
                >
                  {item.name}
                </Heading>
                {item.isKYCed && (
                  <>
                    <Box pl={1}></Box>
                    <KycIcon size="5" top="10px" />
                  </>
                )}
              </Flex>
            </Box>
          </Link>
        </LinkBox>
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
          <Text style={{ display: "inline-block", color: "white" }}>{item.heart}</Text>
        </Button>
      </Box>
    </Box>
  );
};

export default Item;
