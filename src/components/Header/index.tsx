import {
  Flex,
  Button,
  useDisclosure,
  Container,
  Menu,
  MenuButton,
  MenuList,
  Box,
  MenuItem,
  Divider,
  Center,
  IconButton,
} from "@chakra-ui/react";
import Image from "next/image";
import React, { Fragment } from "react";
import { SunIcon, MoonIcon, ChevronDownIcon } from "@chakra-ui/icons";
import SearchGlobal from "@/components/Header/SearchGlobal";
import { MENU } from "@/constance/configmenu";
import { useRouter } from "next/router";
import { TMenuItem } from "@/@types/menu";
import { useColorMode } from "@chakra-ui/color-mode";
import Link from "next/link";
import ConnectButton from "./ConnectButton";
import MenuDrawer from "./MenuDrawer";
import Notification from "./Notification";

const MenuDesktop = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      id="header"
      bg="header"
      backdropFilter="blur(15px)"
      position={"sticky"}
      top={0}
      zIndex={100}
    >
      <Container maxW="2100px" px={["20px", "50px", "80px"]}>
        <Flex w="100%" py="3" alignItems="center" justifyContent="space-between">
          <Flex alignItems="center">
            <Link href="/" style={{ width: "65px" }}>
              <Image src="/logo.svg" alt="logo" width={65} height="65" />
            </Link>
            <Box px={3}></Box>
            <Center height="50px">
              <Divider orientation="vertical" borderColor={"divider"} />
            </Center>
            <Box px={2}></Box>
            <Box className="flex max-[990px]:hidden">
              {MENU.map((item) => (
                <Fragment key={item.title}>
                  <MenuItems
                    title={item.title}
                    subMenu={item.subMenu}
                    link={item.link ? item.link : ""}
                  />
                  <Box px={0.5}></Box>
                </Fragment>
              ))}
            </Box>
          </Flex>
          <Box className="flex max-[990px]:hidden" width="50%" minWidth={"240px"} flexGrow={1}>
            <Box px={4}></Box>
            <Box position={"relative"} width={"100%"}>
              <SearchGlobal />
            </Box>
            <Box px={5}></Box>
          </Box>
          <Flex alignItems="center" justifyContent={"flex-end"}>
            <ConnectButton />
            <Box px={2}></Box>
            <Box className="hidden max-[950px]:flex">
              <MenuDrawer />
            </Box>
            <Box className="flex max-[950px]:hidden">
              <Notification />
              <Box px={2}></Box>
              <IconButton
                aria-label="Toggle Mode"
                borderColor={"divider"}
                onClick={toggleColorMode}
                variant={"outline"}
                borderRadius="50%"
              >
                {colorMode === "light" ? <MoonIcon boxSize={"1em"} /> : <SunIcon boxSize={"1em"} />}
              </IconButton>
            </Box>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default MenuDesktop;

const MenuItems = ({ title, subMenu, link }: TMenuItem) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const checkPath = (link: string) => {
    const { asPath } = useRouter();
    let listPath = asPath.split("/");
    listPath = listPath.filter((path) => path);
    const currentRoute = link.split("/").filter((path) => path);

    if (listPath.includes(currentRoute[0])) return true;
    else return false;
  };

  return (
    <Menu>
      {!subMenu && (
        <Link href={link} style={{ textDecoration: "none" }}>
          <Button
            bgColor={checkPath(link) ? "" : "transparent"}
            fontSize="larger"
            fontWeight="bold"
            borderRadius="20px"
          >
            {title}
          </Button>
        </Link>
      )}
      {subMenu && (
        <>
          <MenuButton
            as={Button}
            bgColor={checkPath(subMenu[0]?.link || "") ? "" : "transparent"}
            fontSize="larger"
            fontWeight="bold"
            borderRadius="20px"
            onClick={isOpen ? onClose : onOpen}
            paddingRight="8px"
            rightIcon={<ChevronDownIcon />}
          >
            {title}
          </MenuButton>
          <MenuList style={{ border: "1px solid #2d37481f", padding: "10px" }}>
            <MenuItem padding="0px !important"></MenuItem>
            {subMenu?.map((subItem) => (
              <Link href={subItem.link} style={{ textDecoration: "none" }} key={subItem.title}>
                <MenuItem borderRadius={"10px"}>{subItem.title}</MenuItem>
              </Link>
            ))}
          </MenuList>
        </>
      )}
    </Menu>
  );
};
