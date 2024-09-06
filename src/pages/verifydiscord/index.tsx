import getConnectedInstance from "@/utils/axiosConfig";
import { errorTopCenter } from "@/utils/toastutils";
import { Text, useToast } from "@chakra-ui/react";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import Error from "src/pages/404";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import AnimatedPageWrapper from "@/components/AnimatedPageWrapper";
import Head from "next/head";
import { NextSeo } from "next-seo";

// Liên kết discord

const VerifyDiscord = () => {
  const router = useRouter();
  const { account, signMessage } = useWallet();
  const { code } = router.query;
  const toast = useToast();
  const [verified, setVerified] = useState(false);
  const [notfound, setNotFound] = useState(false);

  useEffect(() => {
    if (window?.name == "Authorize discord") {
      if (code) {
        (async () => {
          const accessToken = localStorage.getItem("AccessToken");
          if (accessToken && accessToken != "undefined") {
            const data = await getConnectedInstance(account, signMessage, accessToken).post(
              "/v1/auth/kyc/discord",
              {
                code,
                redirectUri: `${process.env.NEXT_PUBLIC_FRONTURL}/verifydiscord`,
              }
            );
            if (data.data.err == true) {
              toast(
                errorTopCenter(
                  data.data.message ? JSON.stringify(data.data.message).slice(0, 140) : "Error!!"
                )
              );
              await new Promise((resolve) => setTimeout(resolve, 1500));
              window.close();
            } else {
              setVerified(true);
              localStorage.setItem("discordurl", data.data.data.username);
              await new Promise((resolve) => setTimeout(resolve, 1500));
              window.close();
            }
          }
        })();
      }
    } else {
      setNotFound(true);
    }
  }, [code]);

  if (notfound) {
    return <Error />;
  }

  return (
    <>
      <Head>
        <title>Verify discord - MoveWorld</title>
        <NextSeo
          useAppDir={true}
          description="MoveWorld is the world&#x27;s largest web3 defi marketplace for NFTs and crypto collectibles on Aptos blockchain. Browse, create, buy, sell, and auction NFTs today."
          openGraph={{
            url: `https://moveworld.io/verifydiscord`,
            title: `Verify discord - MoveWorld`,
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
          canonical="https://moveworld.io/verifydiscord"
        />
        <meta
          name="twitter:image"
          content="https://i.pinimg.com/564x/0b/5e/e0/0b5ee065375780bab4be09673f9e16e0.jpg"
        />
      </Head>
      <AnimatedPageWrapper animated="fadeIn">
        <Text fontSize="xx-large" textAlign="center" paddingTop="50px">
          {verified ? "Done verifying discord" : "Verifying discord . . ."}
        </Text>
      </AnimatedPageWrapper>
    </>
  );
};

export default VerifyDiscord;
