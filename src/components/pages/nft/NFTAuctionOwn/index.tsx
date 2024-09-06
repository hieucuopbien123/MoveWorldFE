import { Box, Text } from "@chakra-ui/react";
import React, { useState, useMemo, useEffect } from "react";
import { numberWithCommas } from "@/utils/format";
import { useAppContext } from "@/store";
import NFTPageWrapper from "../NFTPageWrapper";
import useCountdownHook from "src/utils/use-count-down";
// import moment from "moment";
import { sellerClaimed } from "@/move_services/payload/AuctionPayload";
import dynamic from "next/dynamic";

const DynamicCancelAuctionButton = dynamic(() => import("./CancelAuctionButton"));

const DynamicEditAuctionPriceButton = dynamic(() => import("./EditAuctionPriceButton"));

const DynamicFinalizeButtonOfSeller = dynamic(() => import("./FinalizeButtonOfSeller"));

const NFTAuctionOwn = ({ item, updateOwner, setStatus }: any) => {
  const { aptosToDollar } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [isTimesup, countdown] = useCountdownHook(item.auctionEndAt * 1000);

  const [finalize, setFinalize] = useState(false);

  useEffect(() => {
    updateFinalize();
  }, []);
  const updateFinalize = async () => {
    setLoading(true);
    try {
      const response = await sellerClaimed(item.auctionSeller, {
        creator: item.creator,
        name: item.name,
        collection: item.collectionid,
      });
      setFinalize(response);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const [dayCountdown, hourCountdown, minuteCountdown, secondCountdown] = useMemo(() => {
    if (countdown) {
      // const duration = moment.duration(Number(countdown));
      // const d = duration.days();
      // const h = duration.hours();
      // const m = duration.minutes();
      // const s = duration.seconds();
      let d = Number(countdown) / 1000 / (24 * 3600);
      let h = ((Number(countdown) / 1000) % (3600 * 24)) / 3600;
      let m = ((Number(countdown) / 1000) % 3600) / 60;
      let s = (m * 60) % 60;

      d = Math.trunc(d);
      h = Math.trunc(h);
      m = Math.trunc(m);
      s = Math.trunc(s);
      return ["0" + d, h < 10 ? "0" + h : h, m < 10 ? "0" + m : m, s < 10 ? "0" + s : s];
    }
    return ["00", "00", "00", "00"];
  }, [countdown]);

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
          <Text fontSize="large">Starting Bid</Text>
          <Text fontSize={"xx-large"} color="primary" fontWeight="bold">
            {numberWithCommas(item.auctionOfferPrice, 4)} APT
          </Text>
          <Text color="text">
            ~ ${numberWithCommas(item.auctionOfferPrice * (aptosToDollar || 0), 4)}
          </Text>
        </Box>
        <Box display={"flex"} flexDirection="column" gap="10px" width="30%" minW={"130px"}>
          {isTimesup && item.auctionSeller == item.auctionCurrentBidAddress && (
            <DynamicCancelAuctionButton
              setStatus={setStatus}
              item={item}
              loading={loading}
              setLoading={setLoading}
            ></DynamicCancelAuctionButton>
          )}
          {finalize == false && !isTimesup && (
            <>
              <DynamicCancelAuctionButton
                setStatus={setStatus}
                item={item}
                loading={loading}
                setLoading={setLoading}
              ></DynamicCancelAuctionButton>
              <DynamicEditAuctionPriceButton
                item={item}
                loading={loading}
                setLoading={setLoading}
              ></DynamicEditAuctionPriceButton>
            </>
          )}
          {isTimesup && item.auctionSeller != item.auctionCurrentBidAddress && (
            <DynamicFinalizeButtonOfSeller
              finalize={finalize}
              setFinalize={setFinalize}
              item={item}
              loading={loading}
              setLoading={setLoading}
              updateOwner={updateOwner}
            ></DynamicFinalizeButtonOfSeller>
          )}
        </Box>
      </Box>
      <Box display={"flex"} justifyContent={"space-evenly"} flexWrap={"wrap"} pt={10}>
        <Box minWidth={"200px"} textAlign="center">
          <Text color={"gray"} pb={4}>
            Highest Bid{" "}
          </Text>
          <Text color={"primary"} fontWeight="bold" fontSize={"2xl"} pb={4}>
            {item.auctionCurrentBidPrice || item.auctionOfferPrice} APT
          </Text>
        </Box>
        <Box display={"flex"} flexDirection="column" alignItems={"center"} minWidth={"270px"}>
          <Text color={"gray"} pb={4}>
            Auction End in
          </Text>
          <Box display={"flex"} justifyContent="space-between" width={"100%"}>
            <Box style={{ textAlign: "center", marginRight: "20px" }}>
              <Text fontWeight={"bold"} fontSize="2xl" color={"primary"}>
                {dayCountdown}
              </Text>
              <Text color={"gray"}>Days</Text>
            </Box>
            <Box style={{ textAlign: "center", marginRight: "20px" }}>
              <Text fontWeight={"bold"} fontSize="2xl" color={"primary"}>
                {hourCountdown}
              </Text>
              <Text color={"gray"}>Hours</Text>
            </Box>
            <Box style={{ textAlign: "center", marginRight: "20px" }}>
              <Text fontWeight={"bold"} fontSize="2xl" color={"primary"}>
                {minuteCountdown}
              </Text>
              <Text color={"gray"}>Minutes</Text>
            </Box>
            <Box style={{ textAlign: "center" }}>
              <Text fontWeight={"bold"} fontSize="2xl" color={"primary"}>
                {secondCountdown}
              </Text>
              <Text color={"gray"}>Seconds</Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </NFTPageWrapper>
  );
};

export default NFTAuctionOwn;
