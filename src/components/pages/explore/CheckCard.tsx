import React from "react";
import dynamic from "next/dynamic";

// Dùng dynamic import trong nextjs

const DynamicBuyCard = dynamic(() => import("./BuyCard"));
const DynamicOnAuctionNormalCard = dynamic(
  () => import("@/components/NormalCard/UnlistedNormalCard")
);
const DynamicUnlistedNormalCard = dynamic(
  () => import("@/components/NormalCard/OnAuctionNormalCard")
);

const CheckCard = ({ status, ...rest }: any) => {
  if (status == 0) {
    return <DynamicBuyCard {...rest} />;
  } else if (status == 2) {
    return <DynamicOnAuctionNormalCard {...rest} />;
  } else if (status == 1) {
    return <DynamicUnlistedNormalCard {...rest} />;
  }
  return <></>;
};

export default CheckCard;
