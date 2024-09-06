import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  Textarea,
  useClipboard,
  Tooltip,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { GiEarthAmerica } from "react-icons/gi";
import { FiCopy } from "react-icons/fi";
import getConnectedInstance, { clientAxios } from "@/utils/axiosConfig";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { errorTopCenter, infoTopCenter, successTopCenter } from "@/utils/toastutils";
import { BeatLoader } from "react-spinners";
import { FaDiscord } from "react-icons/fa";

const PersonalInfo = () => {
  const [discordUrl, setDiscordUrl] = useState("");
  const { onCopy, setValue, hasCopied } = useClipboard("");
  const { account, signMessage } = useWallet();
  const [discordConnectedData, setDiscordConnectedData] = useState("");
  const [avatar, setAvatar] = useState<any>("");
  const [avatarSending, setAvatarSending] = useState<any>("");
  const [backgroundImage, setBackgroundImage] = useState<any>("");
  const [backgroundImageSending, setBackgroundImageSending] = useState<any>("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");

  const resetFields = () => {
    setAvatar("");
    setBackgroundImage("");
    setUserName("");
    setEmail("");
    setWebsite("");
    setBio("");
  };

  useEffect(() => {
    if (account?.address) {
      setValue(account?.address?.toString());
    }
  }, [account?.address]);

  useEffect(() => {
    (async () => {
      try{
        setLoadFirstTime(true);
        const accessToken = localStorage.getItem("AccessToken");
        if (accessToken && accessToken != "undefined") {
          const data = await Promise.all([
            clientAxios.get("/v1/auth/kyc/discord"),
            getConnectedInstance(account, signMessage, accessToken).get("/v1/user/profile"),
          ]);
          const url = await data[0].data.data?.url;
          setDiscordUrl(url);
  
          const dataProfile = await data[1].data.data;
          setDiscordConnectedData(dataProfile?.discord || "");
          setUserName(dataProfile?.username || "");
          setEmail(dataProfile?.email || "");
          setWebsite(dataProfile?.website || "");
          setBio(dataProfile?.bio || "");
          if (dataProfile?.avatar) setAvatar(dataProfile.avatar);
          if (dataProfile?.background) setBackgroundImage(dataProfile.background);
          setLoadFirstTime(false);
        }
      } catch(e){
        console.log(e);
      }
    })();
  }, []);

  const onImageChange = async (event: any) => {
    if (event.target.files && event.target.files[0]) {
      setAvatar(URL.createObjectURL(event.target.files[0]));
      setAvatarSending(event.target.files[0]);
    }
  };
  const onImageBackgroundChange = async (event: any) => {
    if (event.target.files && event.target.files[0]) {
      setBackgroundImage(URL.createObjectURL(event.target.files[0]));
      setBackgroundImageSending(event.target.files[0]);
    }
  };

  const invalidEmail =
    email != "" &&
    !email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

  const handleConnectDiscord = async () => {
    const child = window.open(discordUrl, "Authorize discord", "height=500,width=500");
    const timer = setInterval(checkChild, 500);
    function checkChild() {
      if (child) {
        if (child.closed) {
          clearInterval(timer);
          const urlConnected = localStorage.getItem("discordurl");
          if (urlConnected) {
            setDiscordConnectedData(urlConnected);
            toast(successTopCenter("Verify discord successfully"));
          } else {
            toast(errorTopCenter("Error while verifying"));
          }
        }
      } else {
        clearInterval(timer);
      }
    }
  };

  const [loadFirstTime, setLoadFirstTime] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const toastIdRef: any = React.useRef();
  const save = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const accessToken = localStorage.getItem("AccessToken");
    if (accessToken && accessToken != "undefined") {
      toastIdRef.current = toast(infoTopCenter("Updating data..."));
      try {
        let backgroundTemp = undefined;
        let avatarTemp = undefined;
        if (backgroundImageSending) {
          const uploadBackground = new FormData();
          uploadBackground.append("image", backgroundImageSending);
          const response = await getConnectedInstance(account, signMessage, accessToken).post(
            "/v1/upload/images",
            uploadBackground
          );
          if (response.data.err) {
            throw new Error(response.data.message);
          }
          backgroundTemp = response.data.data.url;
        }
        if (avatarSending) {
          const uploadAvatar = new FormData();
          uploadAvatar.append("image", avatarSending);
          const response = await getConnectedInstance(account, signMessage, accessToken).post(
            "/v1/upload/images",
            uploadAvatar
          );
          if (response.data.err) {
            throw new Error(response.data.message);
          }
          avatarTemp = response.data.data.url;
        }

        const body = {
          username,
          email,
          bio,
          website,
          avatar: avatarTemp ? `${process.env.NEXT_PUBLIC_SERVER_URL}${avatarTemp}` : undefined,
          background: backgroundTemp
            ? `${process.env.NEXT_PUBLIC_SERVER_URL}${backgroundTemp}`
            : undefined,
        };
        await getConnectedInstance(account, signMessage, accessToken).post(
          "/v1/user/profile",
          body
        );
        toast(successTopCenter("Update sucessfully"));
      } catch (e: any) {
        console.log(e);
        toast(
          errorTopCenter(
            e.message ? JSON.stringify(e.message).slice(0, 140) : "Error while update!!"
          )
        );
      } finally {
        if (toastIdRef.current) {
          toast.close(toastIdRef.current);
        }
      }
    }
    setLoading(false);
  };

  return (
    <>
      <form onSubmit={save}>
        <Box
          display={"flex"}
          gap="20px"
          flexWrap={"wrap"}
          sx={{
            "&:before": {
              content: '""',
              borderLeft: "1px dashed",
              borderColor: "dividerdash",
              alignSelf: "stretch",
            },
            "&:after": {
              content: '""',
              borderLeft: "1px dashed",
              borderColor: "dividerdash",
              alignSelf: "stretch",
            },
          }}
        >
          <Box order={-1} flex={"150px"}>
            <Text fontSize={"1.3rem"} fontWeight="bold">
              Change Your Profile Picture
            </Text>
            <Box py={2}></Box>
            <input
              accept="image/*"
              hidden
              id="personalinfo__inputavatar"
              type="file"
              onChange={onImageChange}
            />
            <Box>
              <label htmlFor="personalinfo__inputavatar">
                <Box
                  border="6px solid"
                  borderColor="dividerdash"
                  borderRadius={"5px"}
                  width="90%"
                  margin={"0 auto"}
                  position="relative"
                  style={{ aspectRatio: "1/1" }}
                >
                  <Image
                    alt="avatar"
                    width="0"
                    height="0"
                    sizes="100vw"
                    style={{
                      borderRadius: "5px",
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                    src={
                      avatar && (avatar.startsWith("/") || avatar.startsWith("http"))
                        ? avatar
                        : "/user/background.png"
                    }
                  />
                </Box>
              </label>
            </Box>
          </Box>
          <Box flex={"300px"}>
            <Text fontSize={"1.3rem"} fontWeight="bold">
              Change Your Cover Photo
            </Text>
            <Box py={2}></Box>
            <input
              accept="image/*"
              hidden
              id="personalinfo__inputbackground"
              type="file"
              onChange={onImageBackgroundChange}
            />
            <Box>
              <label htmlFor="personalinfo__inputbackground">
                <Box
                  border="6px solid"
                  borderColor="dividerdash"
                  borderRadius={"5px"}
                  width="100%"
                  margin={"0 auto"}
                  position="relative"
                  style={{ aspectRatio: "2/1" }}
                >
                  <Image
                    alt="background"
                    width="0"
                    height="0"
                    sizes="100vw"
                    style={{
                      borderRadius: "5px",
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                    src={
                      backgroundImage &&
                      (backgroundImage.startsWith("/") || backgroundImage.startsWith("http"))
                        ? backgroundImage
                        : "/user/background.png"
                    }
                  />
                </Box>
              </label>
            </Box>
          </Box>
        </Box>
        <Box py={4}></Box>
        <Box display={"flex"} gap="20px" flexWrap={"wrap"}>
          <Box flexGrow={1}>
            <FormControl>
              <FormLabel fontSize="large" paddingBottom={"5px"} margin={0} fontWeight={"normal"}>
                Username
              </FormLabel>
              <Input
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter username"
                size="lg"
                borderRadius={"10px"}
                borderWidth="2px"
                disabled={loadFirstTime}
              />
            </FormControl>
          </Box>
          <Box flexGrow={1}>
            <FormControl isInvalid={invalidEmail}>
              <FormLabel fontSize="large" fontWeight={"normal"} paddingBottom={"5px"} margin={0}>
                Email Address
              </FormLabel>
              <Input
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                size="lg"
                borderRadius={"10px"}
                borderWidth="2px"
                disabled={loadFirstTime}
              />
              {invalidEmail && <FormErrorMessage>Invalid email</FormErrorMessage>}
            </FormControl>
          </Box>
        </Box>
        <Box py={3}></Box>
        <FormControl>
          <FormLabel fontSize="large" paddingBottom={"5px"} margin={0} fontWeight={"normal"}>
            Bio
          </FormLabel>
          <Textarea
            borderRadius={"10px"}
            borderWidth="2px"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Here is a sample placeholder"
            size="lg"
            disabled={loadFirstTime}
          />
        </FormControl>
        <Box py={3}></Box>
        <Box>
          <FormControl>
            <FormLabel fontSize="large" paddingBottom={"5px"} margin={0} fontWeight={"normal"}>
              Website
            </FormLabel>
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none" height="100%">
                <GiEarthAmerica color="gray.300" />
              </InputLeftElement>
              <Input
                type="tel"
                height="50px"
                placeholder="yoursite.io"
                size="lg"
                borderRadius={"10px"}
                borderWidth="2px"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                disabled={loadFirstTime}
              />
            </InputGroup>
          </FormControl>
        </Box>
        <Box py={3}></Box>
        <Text fontSize="large" paddingBottom={"5px"}>
          Discord
        </Text>
        {discordConnectedData ? (
          <Tooltip
            label={"Change"}
            placement="left-start"
            hasArrow
            borderRadius={"10px"}
            padding="10px"
            closeOnClick={false}
            openDelay={800}
          >
            <Button
              borderRadius={"15px"}
              padding="5px"
              width={"100%"}
              variant="outline"
              justifyContent="flex-start"
              pl={"20px"}
              onClick={handleConnectDiscord}
            >
              <FaDiscord />
              <Box px="10px"></Box>
              <Text>{discordConnectedData}</Text>
            </Button>
          </Tooltip>
        ) : (
          <Button
            width={"100%"}
            size="md"
            bgColor={"primary"}
            borderRadius="20px"
            onClick={handleConnectDiscord}
          >
            Connect
          </Button>
        )}
        <Box py={3}></Box>
        <Text fontSize="large" paddingBottom={"5px"}>
          Wallet Address
        </Text>
        <InputGroup size="lg">
          <Input
            placeholder="Enter your email"
            size="lg"
            borderRadius={"10px"}
            borderWidth="2px"
            isReadOnly={true}
            value={account?.address?.toString()}
            overflowX="hidden"
            paddingRight={"60px"}
            textOverflow="ellipsis"
          />
          <Tooltip
            label={hasCopied ? "Copied" : "Copy"}
            placement="top"
            borderRadius={"10px"}
            padding="10px"
            closeOnClick={false}
          >
            <InputRightElement onClick={onCopy} height="100%">
              <FiCopy color="gray.300" />
            </InputRightElement>
          </Tooltip>
        </InputGroup>
        <Box py={4}></Box>
        <Button
          type="submit"
          size="md"
          minW={"100px"}
          bgColor={"primary"}
          borderRadius="5px"
          disabled={loading}
        >
          {loading ? <BeatLoader size={8} color="white" /> : "Save"}
        </Button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Button
          onClick={resetFields}
          size="md"
          minW={"100px"}
          borderRadius="5px"
          disabled={loading}
          variant="outline"
        >
          {loading ? <BeatLoader size={8} color="white" /> : ""}
        </Button>
        <Box py={1}></Box>
      </form>
    </>
  );
};

export default PersonalInfo;
