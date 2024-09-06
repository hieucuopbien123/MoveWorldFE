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
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Select } from "chakra-react-select";
import { GiEarthAmerica } from "react-icons/gi";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import MoveServices from "@/move_services/utils/MoveServices";
import AnimatedPageWrapper from "@/components/AnimatedPageWrapper";
import getConnectedInstance from "@/utils/axiosConfig";
import { useAppContext } from "@/store";
import { FaFacebookF } from "react-icons/fa";
import { FiTwitter } from "react-icons/fi";
import { TbBrandDiscord } from "react-icons/tb";
import { errorTopCenter, infoTopCenter, successTopCenter } from "@/utils/toastutils";
import { isNumeric } from "@/utils/index";
import FancyInputImage from "@/components/FancyInputImage";
import Head from "next/head";
import { NextSeo } from "next-seo";
import { BeatLoader } from "react-spinners";

const cateOptions = [
  {
    label: "Art",
    value: "Art",
  },
  {
    label: "Collectibles",
    value: "Collectibles",
  },
  {
    label: "Domain Names",
    value: "DomainNames",
  },
  {
    label: "Gaming",
    value: "Gaming",
  },
  {
    label: "Photography",
    value: "Photography",
  },
  {
    label: "Sport",
    value: "Sport",
  },
  {
    label: "Utility",
    value: "Utility",
  },
  {
    label: "Virtual Worlds",
    value: "VirtualWorlds",
  },
];

const CreateCollection = () => {
  const [logo, setLogo] = useState<any>("");
  const [logoSending, setLogoSending] = useState<any>("");
  const [bgImage, setBgImage] = useState<any>("");
  const [bgSending, setBgSending] = useState<any>("");
  const [bannerImg, setBannerImg] = useState<any>("");
  const [bannerImgSending, setBannerSending] = useState<any>("");
  const { account, signMessage, signAndSubmitTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const toastIdRef: any = React.useRef(null);
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [discord, setDiscord] = useState("");
  const { showAvatar, callEveryComponentFetchData, fetchBalance } = useAppContext();
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps, valueAsNumber } =
    useNumberInput({
      step: 10,
      defaultValue: 999,
      min: 1,
      max: 100000,
      precision: 0,
    });
  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  const onImageChange = async (event: any) => {
    if (event.target.files && event.target.files[0]) {
      setLogo(URL.createObjectURL(event.target.files[0]));
      setLogoSending(event.target.files[0]);
    }
  };
  const onImageBgChange = async (event: any) => {
    if (event.target.files && event.target.files[0]) {
      setBgImage(URL.createObjectURL(event.target.files[0]));
      setBgSending(event.target.files[0]);
    }
  };
  const onImageBannerChange = async (event: any) => {
    if (event.target.files && event.target.files[0]) {
      setBannerImg(URL.createObjectURL(event.target.files[0]));
      setBannerSending(event.target.files[0]);
    }
  };
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cate, setCate] = useState<Array<{ value: string; label: string }>>([]);
  const changeSelect = (e: any) => {
    setCate(e);
  };
  const [website, setWebsite] = useState("");
  const toast = useToast();

  const reset = () => {
    setCate([]);
    setDescription("");
    setWebsite("");
    setDiscord("");
    setTwitter("");
    setFacebook("");
    setLogo("");
    setBannerImg("");
    setBgImage("");
    setLogoSending("");
    setBannerSending("");
    setBgSending("");
    setName("");
  };

  const createCollectionFromClient = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!showAvatar) {
        throw new Error("Please connect your wallet first! ");
      }
      if (!isNumeric(valueAsNumber) || valueAsNumber <= 0 || name.length <= 0 || logo.length <= 0) {
        throw new Error("Wrong input");
      }
      toastIdRef.current = toast(infoTopCenter("Waiting connect to server..."));

      const accessToken = localStorage.getItem("AccessToken");
      if (accessToken && accessToken != "undefined" && account?.address) {
        let bgUrl = undefined;
        let logoUrl = undefined;
        let bannerUrl = undefined;
        if (logoSending) {
          const uploadLogo = new FormData();
          uploadLogo.append("image", logoSending);
          const response = await getConnectedInstance(account, signMessage, accessToken).post(
            "/v1/upload/images",
            uploadLogo
          );
          if (response.data.err) {
            throw new Error(response.data.message);
          }
          logoUrl = response.data.data.url;
        }
        if (bannerImgSending) {
          const uploadBanner = new FormData();
          uploadBanner.append("image", bannerImgSending);
          const response = await getConnectedInstance(account, signMessage, accessToken).post(
            "/v1/upload/images",
            uploadBanner
          );
          if (response.data.err) {
            throw new Error(response.data.message);
          }
          bannerUrl = response.data.data.url;
        }
        if (bgSending) {
          const uploadBg = new FormData();
          uploadBg.append("image", bgSending);
          const response = await getConnectedInstance(account, signMessage, accessToken).post(
            "/v1/upload/images",
            uploadBg
          );
          if (response.data.err) {
            throw new Error(response.data.message);
          }
          bgUrl = response.data.data.url;
        }

        const response = await getConnectedInstance(account, signMessage, accessToken).post(
          "/v1/collection",
          {
            category: cate.map((c: any) => c.value),
            discord,
            facebook,
            twitter,
            logoImage: logoUrl.startsWith("/public/")
              ? `${process.env.NEXT_PUBLIC_SERVER_URL}${logoUrl}`
              : logoUrl,
            featuredImage: bgUrl ? `${process.env.NEXT_PUBLIC_SERVER_URL}${bgUrl}` : undefined,
            bannerImage: bannerUrl
              ? `${process.env.NEXT_PUBLIC_SERVER_URL}${bannerUrl}`
              : undefined,
            creator: account.address,
            description: description,
            maxAmount: valueAsNumber,
            name,
            uri: logoUrl.startsWith("/public/")
              ? `${process.env.NEXT_PUBLIC_SERVER_URL}${logoUrl}`
              : logoUrl,
            website: website,
          }
        );
        if (response.data.err == true) {
          throw new Error(response.data.message);
        }
        if (toastIdRef.current) {
          toast.close(toastIdRef.current);
        }
        toastIdRef.current = toast(infoTopCenter("Waiting create collection..."));
        await MoveServices.createCollection({
          collectionData: {
            name: name,
            description,
            uri: logoUrl.startsWith("/public/")
              ? `${process.env.NEXT_PUBLIC_SERVER_URL}${logoUrl}`
              : logoUrl,
            maxAmount: valueAsNumber,
          },
          signAndSubmitTransaction,
          toast,
          toastIdRef,
        });
        toast(successTopCenter("Create new collection sucessfully"));
        callEveryComponentFetchData();
        fetchBalance();

        reset();
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

  if (!showAvatar) {
    return (
      <>
        <Head>
          <title>Create collection - MoveWorld</title>
          <NextSeo
            useAppDir={true}
            description="Create your own collection on MoveWorld. MoveWorld is the world&#x27;s largest web3 defi marketplace for NFTs and crypto collectibles on Aptos blockchain. Browse, create, buy, sell, and auction NFTs today."
            openGraph={{
              url: "https://moveworld.io/createcollection",
              title: "MoveWorld Create collection",
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
            canonical="https://moveworld.io/createcollection"
          />
          <meta
            name="twitter:image"
            content="https://i.pinimg.com/564x/0b/5e/e0/0b5ee065375780bab4be09673f9e16e0.jpg"
          />
        </Head>
        <Box height="calc(100vh - 82px)" display="flex" justifyContent="center" alignItems="center">
          <Text style={{ fontSize: "x-large" }}>Please connect your wallet and try again!</Text>
        </Box>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Create collection - MoveWorld</title>
        <NextSeo
          useAppDir={true}
          description="Create your own collection on MoveWorld - The world&#x27;s largest web3 defi marketplace for NFTs and crypto collectibles on Aptos blockchain. Browse, create, buy, sell, and auction NFTs today."
          openGraph={{
            url: "https://moveworld.io/createcollection",
            title: "MoveWorld Create collection",
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
          canonical="https://moveworld.io/createcollection"
        />
        <meta
          name="twitter:image"
          content="https://i.pinimg.com/564x/0b/5e/e0/0b5ee065375780bab4be09673f9e16e0.jpg"
        />
      </Head>
      <AnimatedPageWrapper animated="fadeIn">
        <Container maxW="900px" px={["20px", "50px", "80px"]} py={2}>
          <Text fontSize={"xx-large"} fontWeight="bold">
            Create a new collection
          </Text>
          <Box py={1}></Box>
          <form onSubmit={createCollectionFromClient}>
            <FancyInputImage
              title="Logo Image"
              required={true}
              description={"This image will also be used for navigation. 350 x 350 recommended."}
              onImageChange={onImageChange}
              logo={logo}
              style={{ aspectRatio: "1/1" }}
              width="200px"
            />
            <Box py={2}></Box>
            <FancyInputImage
              title="Featured image"
              required={false}
              description={
                "This image will be used for featuring your collection on the homepage, category pages, or other promotional areas of OpenSea. 600 x 400 recommended."
              }
              onImageChange={onImageBgChange}
              logo={bgImage}
              style={{ aspectRatio: "6/4" }}
              width="300px"
            />
            <Box py={2}></Box>
            <FancyInputImage
              title="Banner image"
              required={false}
              description={
                "This image will appear at the top of your collection page. Avoid including too much text in this banner image, as the dimensions change on different devices. 1400 x 350 recommended."
              }
              onImageChange={onImageBannerChange}
              logo={bannerImg}
              style={{ aspectRatio: "140/35" }}
              width="100%"
            />
            <Box py={2}></Box>
            <Text fontWeight="500">Add category</Text>
            <Text>
              Adding a category will help make your item discoverable on OpenSea (Maximum 3 types)
            </Text>
            <Box py={1}></Box>
            <Select
              isMulti
              useBasicStyles
              autoFocus={false}
              placeholder="Select Category"
              options={cateOptions}
              value={cate}
              isOptionDisabled={() => cate.length >= 3}
              onChange={changeSelect}
              chakraStyles={{
                container: (provided) => ({
                  ...provided,
                  borderColor: "1px solid gray",
                  zIndex: 1,
                }),
                control: (provided, state) => ({
                  ...provided,
                  borderWidth: state.isFocused ? "2px !important" : "",
                  border: state.isFocused
                    ? "1px solid #3cc9c9 !important"
                    : "1px solid gray !important",
                  boxShadow: "none !important",
                }),
                menuList: (provided) => ({
                  ...provided,
                  padding: "5px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }),
                option: (provided, state) => ({
                  ...provided,
                  borderRadius: "10px",
                  backgroundColor: state.isSelected ? "#3cc9c9" : "",
                }),
                placeholder: (defaultStyles) => {
                  return {
                    ...defaultStyles,
                    color: "text",
                  };
                },
              }}
            />
            <Box py={2}></Box>
            <FormControl>
              <FormLabel margin={0}>
                Collection Name <span style={{ color: "#fc8181" }}>*</span>
              </FormLabel>
              <Box py={1}></Box>
              <Input
                placeholder="Example: Treasure of the Sun"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <Box py={2}></Box>
            <FormControl display="flex" alignItems={"center"} gap="10px" flexWrap="wrap">
              <FormLabel margin={0}>Maximum number of NFTs in collection:</FormLabel>
              <HStack maxW="320px">
                <Button size="sm" variant="outline" colorScheme="blue" {...dec}>
                  -
                </Button>
                <InputGroup size="sm">
                  <Input {...input} paddingRight="35px" borderRadius={"15px"} />
                  <InputRightElement fontSize={"small"} paddingRight={2} color="text" zIndex={0}>
                    NFTs
                  </InputRightElement>
                </InputGroup>
                <Button size="sm" colorScheme="blue" variant="outline" {...inc}>
                  +
                </Button>
              </HStack>
            </FormControl>
            <Box py={2}></Box>
            <FormControl>
              <FormLabel margin={0}>Description</FormLabel>
              <Box py={1}></Box>
              <Textarea
                borderRadius={"10px"}
                borderWidth="2px"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
            <Box py={2}></Box>
            <Text fontWeight="500">Links</Text>
            <Box py={1}></Box>
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none" height="100%" zIndex={0}>
                <GiEarthAmerica color="gray.300" />
              </InputLeftElement>
              <Input
                type="text"
                height="40px"
                placeholder="website"
                borderWidth="2px"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </InputGroup>
            <Box py={2}></Box>
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none" height="100%" zIndex={0}>
                <FaFacebookF color="gray.300" />
              </InputLeftElement>
              <Input
                type="text"
                height="40px"
                placeholder="facebook"
                borderWidth="2px"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
              />
            </InputGroup>
            <Box py={2}></Box>
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none" height="100%" zIndex={0}>
                <FiTwitter color="gray.300" />
              </InputLeftElement>
              <Input
                type="text"
                height="40px"
                placeholder="twitter"
                borderWidth="2px"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
              />
            </InputGroup>
            <Box py={2}></Box>
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none" height="100%" zIndex={0}>
                <TbBrandDiscord color="gray.300" />
              </InputLeftElement>
              <Input
                type="text"
                height="40px"
                placeholder="discord"
                borderWidth="2px"
                value={discord}
                onChange={(e) => setDiscord(e.target.value)}
              />
            </InputGroup>
            <Box py={3}></Box>
            <Box display={"flex"} gap="20px">
              <Button size="lg" variant={"outline"} colorScheme="teal" onClick={reset}>
                Reset
              </Button>
              <Button size="lg" colorScheme="teal" type="submit" disabled={loading}>
                {loading ? <BeatLoader size={8} color="white" /> : "Create"}
              </Button>
            </Box>
            <Box py={2}></Box>
          </form>
        </Container>
      </AnimatedPageWrapper>
    </>
  );
};

export default CreateCollection;
