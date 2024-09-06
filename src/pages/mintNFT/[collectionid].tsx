import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Input,
  Text,
  Textarea,
  Button,
  InputGroup,
  InputLeftElement,
  useToast,
  HStack,
  useNumberInput,
  InputRightElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useColorMode } from "@chakra-ui/color-mode";
import { GiEarthAmerica } from "react-icons/gi";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import MoveServices from "@/move_services/utils/MoveServices";
import AnimatedPageWrapper from "@/components/AnimatedPageWrapper";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useAppContext } from "@/store";
import { errorTopCenter, infoTopCenter, successTopCenter } from "@/utils/toastutils";
import getConnectedInstance from "@/utils/axiosConfig";
import { useRouter } from "next/router";
import FancyInputImage from "@/components/FancyInputImage";
import Head from "next/head";
import { NextSeo } from "next-seo";
import { BeatLoader } from "react-spinners";

const MintNFT = () => {
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imageNFT, setImageNFT] = useState<any>(null);
  const [imageNFTSending, setImageNFTSending] = useState<any>(null);
  const { showAvatar, callEveryComponentFetchData, fetchBalance } = useAppContext();
  const [properties, setProperties] = useState<Array<{ name: string; value: string }>>([]);
  const [dialogProperties, setDialogProperties] = useState<Array<{ name: string; value: string }>>(
    []
  );
  const { getInputProps, valueAsNumber } = useNumberInput({
    defaultValue: 1,
    min: 0.0,
    max: 99.0,
    precision: 1,
  });
  const input = getInputProps();
  const { account, signMessage } = useWallet();
  const router = useRouter();
  const { collectionid } = router.query;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");

  const closeDialog = () => {
    setDialogProperties(properties);
    onClose();
  };

  const onImageChange = async (event: any) => {
    if (event.target.files && event.target.files[0]) {
      setImageNFT(URL.createObjectURL(event.target.files[0]));
      setImageNFTSending(event.target.files[0]);
    }
  };

  const toast = useToast();
  const { signAndSubmitTransaction } = useWallet();
  const toastIdRef: any = React.useRef(null);
  const [loading, setLoading] = useState(false);

  const mintNFT = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    // console.log(valueAsNumber); // post nó lên server nữa

    try {
      if (!showAvatar) {
        throw new Error("Please connect your wallet first! ");
      }
      if (name.length <= 0 || imageNFT.length <= 0) {
        throw new Error("Wrong input");
      }
      let royDenum = 0;
      let royNum = 0;
      if (!Number.isNaN(valueAsNumber) && valueAsNumber > 0) {
        royNum = valueAsNumber * 100;
        royDenum = 10000;
      }
      toastIdRef.current = toast(infoTopCenter("Waiting connect to server..."));
      // console.log({
      //   creator: account?.address,
      //   collectionName: collectionid,
      //   name,
      //   description,
      //   avatar: imageNFT,
      //   uri: "https://picsum.photos/200",
      //   website: website,
      //   properties: properties,
      // })
      const accessToken = localStorage.getItem("AccessToken");
      if (accessToken && accessToken != "undefined" && account?.address) {
        let NftUrl = undefined;
        if (imageNFTSending) {
          const uploadNft = new FormData();
          uploadNft.append("image", imageNFTSending);
          const response = await getConnectedInstance(account, signMessage, accessToken).post(
            "/v1/upload/images",
            uploadNft
          );
          if (response.data.err) {
            throw new Error(response.data.message);
          }
          NftUrl = response.data.data.url;
        }
        // call chờ server là xong
        const response = await getConnectedInstance(account, signMessage, accessToken).post(
          "/v1/nft",
          {
            royaltitiesFee: !Number.isNaN(valueAsNumber) && valueAsNumber > 0 ? valueAsNumber : 0,
            creator: account.address,
            collectionName: collectionid,
            name,
            description,
            avatar: NftUrl.startsWith("/public/")
              ? `${process.env.NEXT_PUBLIC_SERVER_URL}${NftUrl}`
              : NftUrl,
            uri: NftUrl.startsWith("/public/")
              ? `${process.env.NEXT_PUBLIC_SERVER_URL}${NftUrl}`
              : NftUrl,
            website: website,
            properties: properties,
          }
        );
        if (response.data.err == true) {
          throw new Error(response.data.message);
        }
        if (toastIdRef.current) {
          toast.close(toastIdRef.current);
        }
        toastIdRef.current = toast(infoTopCenter("Waiting mint NFT..."));
        await MoveServices.mintNFT({
          NFTData: {
            collectionName: collectionid,
            name,
            description,
            uri: website,
          },
          address: account?.address,
          royNum,
          royDenum,
          signAndSubmitTransaction,
          toast,
          toastIdRef,
        });
        toast(successTopCenter("Mint NFT sucessfully"));
        callEveryComponentFetchData();
        fetchBalance();

        clear();
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      } else {
        throw new Error("Please connect your wallet first");
      }
    } catch (e: any) {
      console.log(e);
      toast(errorTopCenter(e.message ? JSON.stringify(e.message).slice(0, 140) : "Error happen!!"));
      setLoading(false);
    } finally {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
    }
  };

  const clear = () => {
    setDialogProperties([]);
    setProperties([]);
    setName("");
    setDescription("");
    setWebsite("");
    setImageNFT("");
  };

  const saveProperties = () => {
    const temp = dialogProperties.filter((d) => {
      return d.name.trim().length != 0 || d.value.trim().length != 0;
    });
    if (temp.length <= 8) {
      setProperties(temp);
    } else {
      toast(errorTopCenter("Maximum 8 properties"));
    }
    onClose();
  };

  const addProperties = () => {
    if (dialogProperties.length == 0) {
      setDialogProperties([{ name: "", value: "" }]);
    }
    onOpen();
  };

  if (!showAvatar) {
    return (
      <Box height="calc(100vh - 82px)" display="flex" justifyContent="center" alignItems="center">
        <Text style={{ fontSize: "x-large" }}>Please connect your wallet and try again!</Text>
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>Mint NFT - MoveWorld</title>
        <NextSeo
          useAppDir={true}
          description="Create your own collection on MoveWorld - The world&#x27;s largest web3 defi marketplace for NFTs and crypto collectibles on Aptos blockchain. Browse, create, buy, sell, and auction NFTs today."
          openGraph={{
            url: "https://moveworld.io/mintNFT",
            title: "Mint NFT - MoveWorld",
            type: "website",
            images: [
              {
                url: "/nft assets/collectionnft1.jpg",
                alt: "Collection Image",
                type: "image/jpg",
              },
            ],
            siteName: "MoveWorld",
          }}
          canonical="https://moveworld.io/mintNFT"
        />
        <meta
          name="twitter:image"
          content="https://i.pinimg.com/564x/0b/5e/e0/0b5ee065375780bab4be09673f9e16e0.jpg"
        />
      </Head>
      <AnimatedPageWrapper animated="fadeIn">
        <Container maxW="900px" px={["20px", "50px", "80px"]} py={2}>
          <Text fontSize={"xx-large"} fontWeight="bold">
            Create a new NFT for &quot;{collectionid}&quot;
          </Text>
          <Box py={3}></Box>
          <form onSubmit={mintNFT}>
            <FancyInputImage
              title="Image, GIf, or SVG"
              required={true}
              description={"File types supported: JPG, PNG, GIF, SVG. Max size: 100 MB"}
              onImageChange={onImageChange}
              logo={imageNFT}
              width="300px"
              style={{ aspectRatio: "343/201" }}
            />
            <Box py={2}></Box>
            <FormControl>
              <FormLabel margin={0}>
                Item Name <span style={{ color: "#fc8181" }}>*</span>
              </FormLabel>
              <Box py={1}></Box>
              <Input
                placeholder="Item Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                width={"80%"}
              />
            </FormControl>
            <Box py={2}></Box>
            <FormControl display="flex" alignItems={"center"} gap="10px" flexWrap="wrap">
              <FormLabel margin={0}>Royaltities fee</FormLabel>
              <HStack maxW="100px">
                <InputGroup size="sm">
                  <Input {...input} paddingRight="35px" borderRadius={"15px"} />
                  <InputRightElement fontSize={"small"} paddingRight={2} color="text" zIndex={0}>
                    %
                  </InputRightElement>
                </InputGroup>
              </HStack>
            </FormControl>
            <Box py={2}></Box>
            <FormControl>
              <FormLabel margin={0}>Description</FormLabel>
              <Text fontSize={"small"} color="text">
                The description will be included on the item&apos;s detail page underneath its image
              </Text>
              <Box py={1}></Box>
              <Textarea
                borderRadius={"10px"}
                borderWidth="2px"
                minHeight={"120px"}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
            <Box py={2}></Box>
            <Text fontWeight="500">External Links</Text>
            <Text fontSize={"small"} color="text">
              MoveWorld will include a link to this URL on this item&apos;s detail page, so that
              users can click to learn more about it. You are welcome to link to your own webpage
              with more details.
            </Text>
            <Box py={1}></Box>
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none" height="100%" zIndex={0}>
                <GiEarthAmerica color="gray.300" />
              </InputLeftElement>
              <Input
                type="text"
                height="40px"
                placeholder="yoursite.io"
                borderWidth="2px"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </InputGroup>
            <Box py={2}></Box>
            <FormControl>
              <FormLabel margin={0}>Collection</FormLabel>
              <Box display={"flex"} pt={2} justifyContent={"space-between"}>
                <Box display={"flex"} alignItems="start">
                  <HamburgerIcon style={{ position: "relative", top: "4px" }} />
                  <Box pl={4}>
                    <Text fontWeight={"bold"}>Properties</Text>
                    <Text>Textual traits that show up as rectangles</Text>
                  </Box>
                </Box>
                <Button colorScheme="teal" onClick={addProperties}>
                  Add
                </Button>
                <Modal
                  size={["xs", "md", "xl"]}
                  isOpen={isOpen}
                  onClose={closeDialog}
                  blockScrollOnMount={false}
                  scrollBehavior={"inside"}
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Add Properties</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody py={0} overflow="auto">
                      <TableContainer pl={1}>
                        <Table variant="simple">
                          <Thead>
                            <Tr>
                              <Th border={0} pl={0} pr={2} pt={0}>
                                Name
                              </Th>
                              <Th border={0} pl={0} pr={2} pt={0}>
                                Value
                              </Th>
                              <Th border={0} pl={0} pr={0} pt={0}></Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {dialogProperties.map((p: any, index: any) => {
                              return (
                                <Tr key={index}>
                                  <Td border={0} pl={0} pt={0} pr={2}>
                                    <Input
                                      value={p.name}
                                      onChange={(e) => {
                                        setDialogProperties(
                                          dialogProperties.map((d, i) => {
                                            if (i == index) {
                                              return {
                                                name: e.target.value,
                                                value: d.value,
                                              };
                                            } else return d;
                                          })
                                        );
                                      }}
                                    />
                                  </Td>
                                  <Td border={0} pl={0} pt={0} pr={2}>
                                    <Input
                                      value={p.value}
                                      onChange={(e) => {
                                        setDialogProperties(
                                          dialogProperties.map((d, i) => {
                                            if (i == index) {
                                              return {
                                                name: d.name,
                                                value: e.target.value,
                                              };
                                            } else return d;
                                          })
                                        );
                                      }}
                                    />
                                  </Td>
                                  <Td border={0} pl={0} pt={0} pr={0}>
                                    <Button
                                      onClick={() => {
                                        if (dialogProperties.length == 1) {
                                          setDialogProperties([{ name: "", value: "" }]);
                                        } else {
                                          setDialogProperties(
                                            dialogProperties.filter((d, i) => i != index)
                                          );
                                        }
                                      }}
                                    >
                                      X
                                    </Button>
                                  </Td>
                                </Tr>
                              );
                            })}
                          </Tbody>
                        </Table>
                      </TableContainer>
                      <Button
                        onClick={() => {
                          if (dialogProperties.length >= 8) {
                            toast(errorTopCenter("Maximum 8 properties"));
                          } else {
                            setDialogProperties([...dialogProperties, { name: "", value: "" }]);
                          }
                        }}
                      >
                        Add more
                      </Button>
                    </ModalBody>

                    <ModalFooter>
                      <Button
                        size={"sm"}
                        variant="outline"
                        mr={3}
                        onClick={closeDialog}
                        borderRadius="20px"
                      >
                        Cancel
                      </Button>
                      <Button
                        size={"sm"}
                        bg="primary"
                        _hover={{ backgroundColor: "#179b9b", opacity: 0.8 }}
                        borderRadius="20px"
                        onClick={saveProperties}
                      >
                        Save
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </Box>
            </FormControl>
            <Box padding={"10px"} display="flex" gap="10px">
              {properties.length > 0 &&
                properties.map((prop: any) => (
                  <Box
                    key={"id"}
                    border="1px solid"
                    borderRadius={"15px"}
                    borderColor={"primary"}
                    py="15px"
                    px="20px"
                    textAlign="center"
                    minW="150px"
                    maxW="170px"
                    overflow={"hidden"}
                  >
                    <Box
                      color="primary"
                      fontWeight="bold"
                      fontSize="small"
                      filter={colorMode == "dark" ? "brightness(120%)" : "brightness(90%)"}
                      overflow="hidden"
                    >
                      {prop.name || "_"}
                    </Box>
                    <Box pt={1}></Box>
                    <Box
                      fontWeight="bold"
                      fontSize="large"
                      overflow="hidden"
                      whiteSpace={"nowrap"}
                      textOverflow="ellipsis"
                    >
                      {prop.value || "_"}
                    </Box>
                    <Box pt={1}></Box>
                  </Box>
                ))}
            </Box>
            <Box py={3}></Box>
            <Box display={"flex"} gap="20px">
              <Button size="lg" colorScheme="teal" type="submit" disabled={loading}>
                {loading ? <BeatLoader size={8} color="white" /> : "Create"}
              </Button>
              <Button
                size="lg"
                colorScheme="teal"
                onClick={clear}
                variant={"outline"}
                disabled={loading}
              >
                Clear
              </Button>
            </Box>
            <Box py={2}></Box>
          </form>
        </Container>
      </AnimatedPageWrapper>
    </>
  );
};

export default MintNFT;
