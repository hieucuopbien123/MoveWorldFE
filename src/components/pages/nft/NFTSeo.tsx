import Head from "next/head";
import React from "react";
import { NextSeo } from "next-seo";

const NFTSeo = ({ name, image, collection, id }: any) => {
  return (
    <Head>
      <title>{`NFT ${name} - ${collection} - MoveWorld`}</title>
      <NextSeo
        useAppDir={true}
        description={`Buy NFT ${name} on MoveWorld - The world&#x27;s largest web3 defi marketplace for NFTs and crypto collectibles on Aptos blockchain. Browse, create, buy, sell, and auction NFTs today.`}
        openGraph={{
          url: `https://moveworld.io/nft/${id}`,
          title: `NFT ${name} - ${collection} - MoveWorld`,
          images: [
            {
              url: image.startsWith("http") ? image : "/nft assets/collectionnft1.jpg",
              alt: "NFT Image",
            },
          ],
          type: "website",
          siteName: "MoveWorld",
        }}
        canonical={`https://moveworld.io/nft/${id}`}
      />
      <meta
        name="twitter:image"
        content={
          image.startsWith("http")
            ? image
            : "https://i.pinimg.com/564x/0b/5e/e0/0b5ee065375780bab4be09673f9e16e0.jpg"
        }
      />
    </Head>
  );
};

export default NFTSeo;
