import React from "react";
import { Box, Menu, Text, MenuDivider, MenuItem, Link, Spinner } from "@chakra-ui/react";
import Image from "next/image";
import { formatAddress } from "@/utils/format";

const SearchGlobalContent = ({ loading, isOpen, collectionData, nftData, userData }: any) => {
  return (
    <>
      <Box
        position={"absolute"}
        zIndex={10}
        mt={3}
        borderRadius="5px"
        py="10px"
        pb="20px"
        backgroundColor={"coveritem"}
        boxShadow={"rgb(0 0 0 / 50%) 0px 0px 25px"}
        width={"100%"}
        maxHeight={isOpen ? "60vh" : "0px"}
        overflow={"auto"}
        opacity={isOpen ? 1 : 0}
        transition="0.5s"
        sx={{
          "&::-webkit-scrollbar-track": {
            backgroundColor: "background",
          },
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            borderRadius: "10px",
            backgroundColor: "primary",
          },
        }}
        maxWidth="400px"
      >
        {loading && (
          <Box textAlign="center" padding={"20px"}>
            <Spinner color="primary" />
          </Box>
        )}
        {!loading && (
          <Menu isOpen={false}>
            <Text fontSize="large" fontWeight={"bold"} paddingLeft={2} mt={1}>
              Collection
            </Text>
            <MenuDivider></MenuDivider>
            {collectionData.length <= 0 && (
              <Text textAlign={"center"} color="text">
                No items
              </Text>
            )}
            {collectionData.length > 0 &&
              collectionData.map((item: any, idx: any) => (
                <Box
                  key={idx}
                  width="100%"
                  borderRadius="5px"
                  sx={{
                    "&:hover": {
                      bgColor: "hoverCover",
                    },
                  }}
                >
                  <MenuItem width="100%">
                    <Link
                      href={`/explore/${item.creator}/${item.name}`}
                      style={{
                        width: "100%",
                        textDecoration: "none",
                      }}
                    >
                      <Box display={"flex"} alignItems={"center"} flex={1} gap={1}>
                        <Image
                          src={
                            item?.icon &&
                            (item?.icon.startsWith("/") || item?.icon.startsWith("http"))
                              ? item.icon
                              : "/user/background.png"
                          }
                          width={30}
                          height={30}
                          alt=""
                          style={{
                            width: "30px",
                            height: "30px",
                            backgroundColor: "#c3c3c3",
                          }}
                        />
                        <Box flexGrow={1}>
                          <Box display={"flex"} alignItems="center">
                            <Text
                              fontSize={"small"}
                              fontWeight="bold"
                              paddingRight={1}
                              textOverflow="ellipsis"
                              whiteSpace="nowrap"
                              overflow="hidden"
                              maxW={"95%"}
                            >
                              {item.name}
                            </Text>
                            {item?.isKyc && (
                              <div className="w-3 h-3 flex">
                                <svg viewBox="0 0 30 30" className="w-full">
                                  <path
                                    d="M13.474 2.801a2 2 0 0 1 3.052 0l.963 1.136a2 2 0 0 0 2 .65l1.447-.353a2 2 0 0 1 2.469 1.794l.11 1.485a2 2 0 0 0 1.237 1.702l1.378.564a2 2 0 0 1 .943 2.903l-.783 1.266a2 2 0 0 0 0 2.104l.783 1.266a2 2 0 0 1-.943 2.903l-1.378.564a2 2 0 0 0-1.236 1.702l-.111 1.485a2 2 0 0 1-2.47 1.794l-1.446-.353a2 2 0 0 0-2 .65l-.963 1.136a2 2 0 0 1-3.052 0l-.963-1.136a2 2 0 0 0-2-.65l-1.447.353a2 2 0 0 1-2.469-1.794l-.11-1.485a2 2 0 0 0-1.237-1.702l-1.378-.564a2 2 0 0 1-.943-2.903l.783-1.266a2 2 0 0 0 0-2.104l-.783-1.266a2 2 0 0 1 .943-2.903l1.378-.564a2 2 0 0 0 1.236-1.702l.111-1.485a2 2 0 0 1 2.47-1.794l1.446.353a2 2 0 0 0 2-.65l.963-1.136Z"
                                    fill="#2081e2"
                                  />
                                  <path
                                    d="M13.5 17.625 10.875 15l-.875.875 3.5 3.5 7.5-7.5-.875-.875-6.625 6.625Z"
                                    fill="#fff"
                                    stroke="#fff"
                                  />
                                </svg>
                              </div>
                            )}
                          </Box>
                          <Box
                            display={"flex"}
                            alignItems="flex-end"
                            justifyContent={"space-between"}
                            flexGrow="1"
                          >
                            <Text fontSize={"x-small"} color="gray">
                              {item?.numNft || 0} items
                            </Text>
                            <Text
                              fontSize={"small"}
                              textOverflow="ellipsis"
                              whiteSpace="nowrap"
                              overflow="hidden"
                            >
                              {(item?.totalVolume / Math.pow(10, 8)).toFixed(1) || 0} APT
                            </Text>
                          </Box>
                        </Box>
                      </Box>
                    </Link>
                  </MenuItem>
                </Box>
              ))}
            <Text fontSize="large" fontWeight={"bold"} paddingLeft={2} mt={3}>
              NFTs
            </Text>
            <MenuDivider></MenuDivider>
            {nftData.length <= 0 && (
              <Text textAlign={"center"} color="text">
                No items
              </Text>
            )}
            {nftData.map((item: any, idx: number) => (
              <Box
                key={idx}
                width="100%"
                borderRadius="5px"
                sx={{
                  "&:hover": {
                    bgColor: "hoverCover",
                  },
                }}
              >
                <MenuItem width="100%">
                  <Box
                    width="100%"
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent="space-between"
                  >
                    <Link
                      href={`/nft/${item.id}`}
                      style={{
                        display: "flex",
                        width: "100%",
                        alignItems: "flex-end",
                        textDecoration: "none",
                      }}
                    >
                      <Box display={"flex"} alignItems={"center"} flex={1}>
                        <Image
                          src={
                            item?.uri && (item?.uri.startsWith("/") || item?.uri.startsWith("http"))
                              ? item?.uri
                              : "/user/background.png"
                          }
                          width={30}
                          height={30}
                          alt=""
                          style={{
                            width: "30px",
                            height: "30px",
                            backgroundColor: "#c3c3c3",
                          }}
                        />
                        <Box paddingLeft={"5px"}>
                          <Box display={"flex"} alignItems="center">
                            <Text
                              fontWeight="bold"
                              paddingRight={1}
                              textOverflow="ellipsis"
                              whiteSpace="nowrap"
                              overflow="hidden"
                            >
                              {item?.name}
                            </Text>
                          </Box>
                        </Box>
                      </Box>
                    </Link>
                  </Box>
                </MenuItem>
              </Box>
            ))}
            <Text fontSize="large" fontWeight={"bold"} paddingLeft={2} mt={2}>
              User
            </Text>
            <MenuDivider></MenuDivider>
            {userData.length <= 0 && (
              <Text textAlign={"center"} color="text">
                No users
              </Text>
            )}
            {userData.map((item: any, idx: number) => (
              <Box
                key={idx}
                width="100%"
                borderRadius="5px"
                sx={{
                  "&:hover": {
                    bgColor: "hoverCover",
                  },
                }}
              >
                <MenuItem width="100%">
                  <Box
                    width="100%"
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent="space-between"
                  >
                    <Link
                      href={`/pprofile/${item.address}`}
                      style={{
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                        textDecoration: "none",
                      }}
                    >
                      <Box display={"flex"} alignItems={"center"} flex={1}>
                        <Box>
                          <Image
                            src={
                              item?.avatar &&
                              (item?.avatar.startsWith("/") || item?.avatar.startsWith("http"))
                                ? item?.avatar
                                : "/user/background.png"
                            }
                            width={30}
                            height={30}
                            alt=""
                            style={{
                              width: "30px",
                              height: "30px",
                              backgroundColor: "#c3c3c3",
                            }}
                          />
                        </Box>
                        <Box paddingLeft={"5px"}>
                          <Box display={"flex"} alignItems="center">
                            <Text fontWeight="bold" paddingRight={1}>
                              {formatAddress(item?.address, 8)}
                            </Text>
                          </Box>
                        </Box>
                      </Box>
                    </Link>
                  </Box>
                </MenuItem>
              </Box>
            ))}
          </Menu>
        )}
      </Box>
    </>
  );
};
export default SearchGlobalContent;
