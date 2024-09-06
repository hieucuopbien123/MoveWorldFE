import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import React, { Fragment } from "react";
import { MENU } from "@/constance/configmenu";
import Image from "next/image";
import Link from "next/link";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import Notification from "./Notification";

const CustomDrawer = ({ isOpen, onClose }: any) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Drawer placement={"right"} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <Link href="/">
              <Box display={"flex"} alignItems="center">
                <Image src="/logo.svg" alt="logo" width={50} height={50} />
                <Box px={1}></Box>
                <Text>Move World</Text>
              </Box>
            </Link>
            <Box py={2}></Box>
            {/* <ConnectButton />
            <Box py={2}></Box> */}
            <Flex gap={2}>
              <IconButton
                aria-label="Toggle Mode"
                onClick={toggleColorMode}
                variant={"outline"}
                borderRadius="50%"
              >
                {colorMode === "light" ? <MoonIcon boxSize={"1em"} /> : <SunIcon boxSize={"1em"} />}
              </IconButton>
              <Notification />
            </Flex>
          </DrawerHeader>
          <DrawerBody p={0}>
            <Box px={"24px"} py={"8px"}>
              <Box pt={2}></Box>
              {MENU.map((item) => (
                <Fragment key={item.title}>
                  {!item.subMenu && (
                    <Link href={item.link} style={{ textDecoration: "none" }}>
                      <Text
                        cursor="pointer"
                        bgColor={"transparent"}
                        fontSize="larger"
                        fontWeight="bold"
                      >
                        {item.title}
                      </Text>
                    </Link>
                  )}
                  {item.subMenu && (
                    <>
                      <Accordion allowToggle>
                        <AccordionItem border={"none"}>
                          <h2>
                            <AccordionButton padding="0">
                              <Box flex="1" textAlign="left">
                                <Text cursor="pointer" fontSize="larger" fontWeight="bold">
                                  {item.title}
                                </Text>
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel paddingTop={0} paddingBottom={1}>
                            {item.subMenu.map((item) => (
                              <Link
                                href={item.link}
                                style={{ textDecoration: "none" }}
                                key={item.title}
                              >
                                <Text cursor="pointer" bgColor={"transparent"}>
                                  {item.title}
                                </Text>
                              </Link>
                            ))}
                          </AccordionPanel>
                        </AccordionItem>
                      </Accordion>
                    </>
                  )}
                  <Box p={0.5}></Box>
                </Fragment>
              ))}
            </Box>
            <Divider />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CustomDrawer;
