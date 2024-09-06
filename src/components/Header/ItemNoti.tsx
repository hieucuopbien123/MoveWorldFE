import getConnectedInstance from "@/utils/axiosConfig";
import {
  Box,
  Text,
  Modal,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalOverlay,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import Image from "next/image";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const ItemNoti = ({ noti }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dayLeft, setDayLeft] = useState(0);
  const [hourLeft, setHourLeft] = useState(0);
  const { account, signMessage } = useWallet();
  const [isReadInternal, setIsReadInternal] = useState(false);

  useEffect(() => {
    const secondLeft = (new Date().getTime() - noti.time / 1000) / 1000;
    setDayLeft(Math.floor(secondLeft / (24 * 60 * 60)));
    setHourLeft(Math.floor(secondLeft / (60 * 60)) - Math.floor(secondLeft / (24 * 60 * 60)) * 24);
  }, [noti.time]);

  const handleClick = async () => {
    onOpen();
    setIsReadInternal(true);
    const accessToken = localStorage.getItem("AccessToken");
    try {
      if (accessToken && accessToken != "undefined") {
        await getConnectedInstance(account, signMessage, accessToken).post(
          `/v1/user/notification/${noti.id}`
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Box px="5px">
        <Box
          _hover={{ backgroundColor: "hoverCover" }}
          borderRadius={"5px"}
          transition="all 0.15s linear"
          px="10px"
          py="10px"
          display="flex"
          gap={"10px"}
          alignItems="flex-start"
          cursor={"pointer"}
          onClick={() => handleClick()}
          position="relative"
        >
          <Image src={"/logo.svg"} width="50" height="50" alt="logo" />
          {noti.isRead == false && isReadInternal == false && (
            <Text
              display={"inline-block"}
              position="absolute"
              color={"orange"}
              top="55px"
              left="15px"
              fontStyle={"italic"}
            >
              new
            </Text>
          )}
          <Box>
            <Text fontWeight="bold">{noti.title}</Text>
            <Text color="text" className="overflow-1line" wordBreak={"break-all"}>
              {noti.content}
            </Text>
            <Text opacity={0.6} color="text" fontSize="small">
              {dayLeft > 0 ? `${dayLeft} days` : ""} {`${hourLeft} hours`} ago
            </Text>
          </Box>
        </Box>
        <Modal isOpen={isOpen} onClose={onClose} isCentered blockScrollOnMount={false}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{noti.title}</ModalHeader>
            <ModalBody pb={0}>
              <Text>{noti.content}</Text>
              <Box py={1}></Box>
              <Link href={"/useritem"}>
                <Text color={"blue"} onClick={() => onClose()}>
                  Go to your item
                </Text>
              </Link>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};

export default ItemNoti;
