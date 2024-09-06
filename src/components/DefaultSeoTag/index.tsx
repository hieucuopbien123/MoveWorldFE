import Head from "next/head";
import React from "react";
import { DefaultSeo } from "next-seo";

// Setup SEO
const DefaultSeoTag = () => {
  return (
    <>
      <Head>
        <meta
          name="keywords"
          content="NFT, NFT Marketplace, Blockchain, DeFi, Aptos, Crypto, Web3"
        />
      </Head>
      <DefaultSeo
        title="MoveWorld NFT"
        additionalMetaTags={[
          {
            name: "application-name",
            content: "MoveWorld NFT Collection Creation",
          },
        ]}
        additionalLinkTags={[
          {
            rel: "icon",
            href: "/logo.svg",
          },
          {
            rel: "apple-touch-icon",
            href: "/logo.svg",
          },
        ]}
        twitter={{
          handle: "@moveworld.nft",
          site: "@moveworld.nft", // bịa ra chứ chưa có tk twitter này
          cardType: "summary_large_image",
        }}
      />
    </>
  );
};

export default DefaultSeoTag;
