import React from "react";
import dynamic from "next/dynamic";

const DynamicListedNormalCard = dynamic(() => import("@/components/NormalCard/ListedNormalCard"));
const DynamicOnAuctionNormalCard = dynamic(
  () => import("@/components/NormalCard/OnAuctionNormalCard")
);
const DynamicUnlistedNormalCard = dynamic(
  () => import("@/components/NormalCard/UnlistedNormalCard")
);

const CheckCardPProfile = ({ status, ...rest }: any) => {
  if (status == 0) {
    return <DynamicListedNormalCard {...rest} />;
  } else if (status == 2) {
    return <DynamicOnAuctionNormalCard {...rest} />;
  } else if (status == 1) {
    return <DynamicUnlistedNormalCard {...rest} />;
  }
  return <></>;
};

export default CheckCardPProfile;
