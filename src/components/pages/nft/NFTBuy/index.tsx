import { Box, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { numberWithCommas } from "@/utils/format";
import { useAppContext } from "@/store";
import BuyButton from "./BuyButton";
import NFTPageWrapper from "../NFTPageWrapper";

const NFTBuy = ({ item, updateOwner, setStatus }: any) => {
  const { aptosToDollar } = useAppContext();
  const [loading, setLoading] = useState(false);

  return (
    <NFTPageWrapper item={item}>
      <Box
        padding="20px"
        borderRadius={"20px"}
        border={"2px solid"}
        borderColor="primary"
        display={"flex"}
        justifyContent="space-between"
        alignItems={"center"}
        gap={"10px"}
      >
        <Box>
          <Text fontSize="large">Price</Text>
          <Text fontSize={"xx-large"} color="primary" fontWeight="bold">
            {numberWithCommas(item.price, 4)} APT
          </Text>
          <Text color="text">~ ${numberWithCommas(item.price * (aptosToDollar || 0), 4)}</Text>
        </Box>
        <Box display={"flex"} flexDirection="column" gap="10px" width="30%" minW={"130px"}>
          {item.status == 0 && (
            <BuyButton
              {...{ loading, setLoading, item }}
              updateOwner={updateOwner}
              setStatus={setStatus}
            />
          )}
          {/* <Tooltip label={"Coming Soon"} hasArrow borderRadius={"10px"} padding="10px">
            <Button
              variant="outline"
              colorScheme={"teal"}
              borderColor="primary"
              border="2px solid"
              disabled={loading}
            >
              MAKE OFFER
            </Button>
          </Tooltip> */}
        </Box>
      </Box>
    </NFTPageWrapper>
  );
};

export default NFTBuy;
