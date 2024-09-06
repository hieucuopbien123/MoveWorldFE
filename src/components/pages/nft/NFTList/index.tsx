import { Box } from "@chakra-ui/react";
import React, { useState } from "react";
import ListItemButton from "./ListItemButton";
import AuctionButton from "./AuctionButton";
import NFTPageWrapper from "../NFTPageWrapper";

const NFTList = ({ item, setStatus }: any) => {
  const [loading, setLoading] = useState(false);

  return (
    <NFTPageWrapper item={item}>
      <Box display="flex" gap="20px" flexWrap={"wrap"}>
        <ListItemButton
          item={item}
          loading={loading}
          setLoading={setLoading}
          setStatus={setStatus}
        />
        <AuctionButton
          item={item}
          loading={loading}
          setLoading={setLoading}
          setStatus={setStatus}
        />
      </Box>
    </NFTPageWrapper>
  );
};

export default NFTList;
