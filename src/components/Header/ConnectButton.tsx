import { errorTopCenter, successTopCenter } from "@/utils/toastutils";
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Divider,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Text,
  Tooltip,
  useClipboard,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import getConnectedInstance, { clientAxios } from "@/utils/axiosConfig";
import { formatAddress, formatPrice } from "@/utils/format";
import { useAppContext } from "@/store";
import { MdOutlineCollections } from "react-icons/md";

const optionImage = [
  "/wallet/petra.png",
  "/wallet/martian.png",
  "/wallet/pontem.png",
  "/wallet/fewcha.png",
];

const ConnectButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { account, connect, wallets, connected, signMessage } = useWallet();
  const toast = useToast();
  const { onCopy, setValue, hasCopied } = useClipboard("");
  const { showAvatar, callEveryComponentFetchData, balance } = useAppContext();

  const login = async (notify = true) => {
    try {
      // localStorage.removeItem("AccessToken"); // khi login thì đăng xuất cái cũ. Bị kẹp nút 2 lần
      // thì tự dưng lỗi ra
      const resNonce = await clientAxios
        .post("/v1/auth/nonce", { address: account?.address })
        .then((res) => res.data);
      const dataSigned = await signMessage({
        message: resNonce.data.message,
        nonce: resNonce.data.nonce,
        address: true,
      });
      const bodyLogin = {
        address: account?.address,
        pubKey: account?.publicKey,
        fullMessage: (dataSigned as any).fullMessage,
        signature: (dataSigned as any).signature,
      };
      const resLogin = await clientAxios.post("/v1/auth/login", bodyLogin).then((res) => res.data);
      if (resLogin.err) {
        throw new Error(resLogin.message);
      }
      const accessToken = JSON.stringify((resLogin as any).data);
      localStorage.setItem("AccessToken", accessToken);
      const checkFirstTime = await (
        await clientAxios.get(`/v1/user/profile/public/${account?.address}`)
      ).data.data.createAt;
      if (checkFirstTime == 0) {
        try {
          const body = {
            username: "",
            email: "",
            bio: "",
            website: "",
            avatar: "",
            background: "",
          };
          await getConnectedInstance(account, signMessage, accessToken).post(
            "/v1/user/profile",
            body
          );
        } catch (e: any) {
          console.log(e);
          toast(
            errorTopCenter(
              e.message ? JSON.stringify(e.message).slice(0, 140) : "Error while update data!!"
            )
          );
        }
      }
      if (notify) toast(successTopCenter("Login successfully"));
    } catch (e: any) {
      console.log(e);
      toast(errorTopCenter(e?.message ? JSON.stringify(e.message).slice(0, 140) : "Cannot login!"));
      localStorage.removeItem("AccessToken");
      localStorage.setItem("AccessToken", '{"name": "Test"}'); // K cần server
    } finally {
      onClose();
    }
  };

  useEffect(() => {
    if (account?.address) {
      setValue(account?.address?.toString());
      const accessToken = localStorage.getItem("AccessToken");
      if (!accessToken || accessToken == "undefined") {
        localStorage.removeItem("AccessToken");
      } else {
        const objectAccessToken = JSON.parse(accessToken);
        if (
          objectAccessToken?.address != account?.address ||
          parseInt(objectAccessToken?.exp) <= new Date().getTime() / 1000 + 300
        ) {
          localStorage.removeItem("AccessToken");
        }
      }
    }
  }, [account?.address]);

  const handleConnect = async (option: any) => {
    try {
      if (!connected) {
        // Nếu thêm !connecting thì bị 1 số lỗi rất dị khi connecting nhưng éo có pop up
        await connect(option.name);
        onClose();
        toast(successTopCenter("Connect successfully."));
      } else if (account?.address) {
        login();
      }
      callEveryComponentFetchData();
    } catch (e: any) {
      console.log(e);
      toast(
        errorTopCenter(e.message ? JSON.stringify(e.message).slice(0, 140) : "Cannot connect!!")
      );
    } finally {
      onClose();
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem("AccessToken");
    toast(errorTopCenter("Disconnected!"));
    callEveryComponentFetchData();
  };

  const renderWalletConnectorGroup = () => {
    return wallets.map((wallet, i) => {
      const option = wallet.adapter;
      return (
        <Box
          borderRadius={"5px"}
          onClick={() => handleConnect(option)}
          id={option.name.split(" ").join("_")}
          key={option.name}
        >
          <Box
            display="flex"
            flexDirection={"column"}
            alignItems="center"
            gap="5px"
            px="15px"
            py={"20px"}
            _hover={{ backgroundColor: "primary" }}
            borderRadius={"5px"}
            transition="all 0.2s linear"
          >
            <Image width={40} height={40} src={optionImage[i]} alt={"wallet"} />
            <Text fontWeight="bold" fontSize="x-large">
              {option.name}
            </Text>
            <Text color="gray" fontWeight={"bold"}>
              Click to connect to {option.name} wallet
            </Text>
          </Box>
        </Box>
      );
    });
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <>
        <Spinner color="primary" thickness="4px" size={"lg"} />
      </>
    );
  }

  return (
    <>
      {showAvatar ? (
        <Menu>
          <MenuButton>
            <Avatar
              onClick={onOpen}
              bg="primary"
              size="md"
              className="cursor-pointer"
              icon={<AiOutlineUser fontSize="2rem" />}
            >
              <AvatarBadge bg={account ? "green.600" : "tomato"} boxSize="1.25em" />
            </Avatar>
          </MenuButton>
          <MenuList border="1px solid #2d37481f" padding="10px">
            <MenuItem padding="0px !important"></MenuItem>
            <Tooltip
              label={hasCopied ? "Copied" : "Copy"}
              placement="left-start"
              hasArrow
              borderRadius={"10px"}
              padding="10px"
              closeOnClick={false}
            >
              <MenuItem
                px={"10px"}
                py={"3px"}
                cursor="pointer"
                borderRadius={"10px"}
                onClick={onCopy}
                closeOnSelect={false}
              >
                <Text>Address: {formatAddress(account?.address?.toString(), 6)}</Text>
              </MenuItem>
            </Tooltip>
            {balance && (
              <MenuItem px={"10px"} py={"3px"} borderRadius={"10px"} closeOnSelect={false}>
                <Text>Balance: {formatPrice(balance)} APT</Text>
              </MenuItem>
            )}
            <Box paddingTop="10px"></Box>
            <Divider />
            <Box paddingTop="10px"></Box>
            <Link href={"/useritem"}>
              <MenuItem borderRadius={"10px"}>
                <Icon width="6" height="6" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M2.67004 18.9501L7.60004 15.6401C8.39004 15.1101 9.53004 15.1701 10.24 15.7801L10.57 16.0701C11.35 16.7401 12.61 16.7401 13.39 16.0701L17.55 12.5001C18.33 11.8301 19.59 11.8301 20.37 12.5001L22 13.9001"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </Icon>
                <Text paddingLeft={"15px"}>My Item</Text>
              </MenuItem>
            </Link>
            <Link href={"/userprofile"}>
              <MenuItem borderRadius={"10px"}>
                <Icon width="6" height="6" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12.1601 10.87C12.0601 10.86 11.9401 10.86 11.8301 10.87C9.45006 10.79 7.56006 8.84 7.56006 6.44C7.56006 3.99 9.54006 2 12.0001 2C14.4501 2 16.4401 3.99 16.4401 6.44C16.4301 8.84 14.5401 10.79 12.1601 10.87Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M7.15997 14.56C4.73997 16.18 4.73997 18.82 7.15997 20.43C9.90997 22.27 14.42 22.27 17.17 20.43C19.59 18.81 19.59 16.17 17.17 14.56C14.43 12.73 9.91997 12.73 7.15997 14.56Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </Icon>
                <Text paddingLeft={"15px"}>My Profile</Text>
              </MenuItem>
            </Link>
            <Link href={"/usercollection"}>
              <MenuItem borderRadius={"10px"}>
                <Icon width="6" height="6" viewBox="0 0 24 24">
                  <MdOutlineCollections size={22} />
                </Icon>
                <Text paddingLeft={"15px"}>My Collection</Text>
              </MenuItem>
            </Link>
            <Box paddingTop="10px"></Box>
            <Divider />
            <Box paddingTop="10px"></Box>
            <MenuItem borderRadius={"10px"} onClick={() => handleDisconnect()}>
              <Icon width="6" height="6" viewBox="0 0 24 24" fill="none">
                <path
                  d="M8.90002 7.55999C9.21002 3.95999 11.06 2.48999 15.11 2.48999H15.24C19.71 2.48999 21.5 4.27999 21.5 8.74999V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24002 20.08 8.91002 16.54"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M15 12H3.62"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M5.85 8.6499L2.5 11.9999L5.85 15.3499"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </Icon>
              <Text paddingLeft="15px">Logout</Text>
            </MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <Button
          borderRadius={"20px"}
          style={{ outline: "2px solid #179b9b" }}
          minWidth="fit-content"
          onClick={onOpen}
          bg="primary"
          _hover={{ backgroundColor: "#179b9b" }}
        >
          <Text>Connect Wallet</Text>
        </Button>
      )}
      <Modal size={["xs", "md", "3xl"]} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent overflowY={"auto"} maxHeight="95vh">
          <ModalBody padding={0}>
            <SimpleGrid minChildWidth={"300px"}>{renderWalletConnectorGroup()}</SimpleGrid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConnectButton;
