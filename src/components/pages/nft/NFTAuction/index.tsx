import { Box, Text } from "@chakra-ui/react";
import React, { useState, useMemo } from "react";
import { numberWithCommas } from "@/utils/format";
import { useAppContext } from "@/store";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import NFTPageWrapper from "../NFTPageWrapper";
import useCountdownHook from "src/utils/use-count-down";
// import moment from "moment";
import dynamic from "next/dynamic";

const DynamicPlaceBidButton = dynamic(() => import("./PlaceBidButton"));

const DynamicFinalizeAuctionButton = dynamic(
  () => import("src/components/pages/nft/NFTAuctionOwn/FinalizeAuctionButton")
);

const NFTAuction = ({ item, updateOwner, setStatus }: any) => {
  const { aptosToDollar } = useAppContext();
  const { account } = useWallet();
  const [loading, setLoading] = useState(false);
  const [isTimesup, countdown] = useCountdownHook(item.auctionEndAt * 1000);

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
      <>
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
            <Text>~ ${numberWithCommas(item.auctionOfferPrice * (aptosToDollar || 0), 4)}</Text>
          </Box>
          <Box display={"flex"} flexDirection="column" gap="10px" minW={"130px"}>
            {!isTimesup && (
              <DynamicPlaceBidButton
                loading={loading}
                item={item}
                setLoading={setLoading}
              ></DynamicPlaceBidButton>
            )}
            {isTimesup && item.auctionCurrentBidAddress == account?.address && (
              <DynamicFinalizeAuctionButton
                updateOwner={updateOwner}
                setStatus={setStatus}
                loading={loading}
                item={item}
                setLoading={setLoading}
              ></DynamicFinalizeAuctionButton>
            )}
            {isTimesup && item.auctionCurrentBidAddress != account?.address && (
              <>
                <Text>Auction Ended</Text>
              </>
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
      </>
      {/* {
        (!isTimesup) && (
          <PlaceBidButton
            loading={loading}
            item={item}
            setLoading={setLoading}
          ></PlaceBidButton>
        )
      }
      {
        (isTimesup && item.auctionCurrentBidAddress == account?.address) && (
          <FinalizeAuctionButton 
            updateOwner={updateOwner}
            setStatus={setStatus}
            loading={loading}
            item={item}
            setLoading={setLoading}
          ></FinalizeAuctionButton>
        )
      }
      {
        (isTimesup && item.auctionCurrentBidAddress != account?.address) && (
          <></>
        )
      } */}
      {/* {account?.address != NFTowner ? (
        <>
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
              <Text>~ ${numberWithCommas(item.auctionOfferPrice * (aptosToDollar || 0), 4)}</Text>
            </Box>
            <Box display={"flex"} flexDirection="column" gap="10px" minW={"130px"}>
              {(!isTimesup || (isTimesup && item.auctionCurrentBidAddress != account?.address)) && (
                <PlaceBidButton
                  loading={loading}
                  item={item}
                  setLoading={setLoading}
                ></PlaceBidButton>
              )}
              {isTimesup && item.auctionCurrentBidAddress == account?.address && (
                <FinalizeAuctionButton 
                  updateOwner={updateOwner}
                  setStatus={setStatus}
                  loading={loading}
                  item={item}
                  setLoading={setLoading}
                ></FinalizeAuctionButton>
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
        </>
      ) : (
        <>
          <Box fontSize={"xx-large"} color="primary" fontWeight="bold">
            <Text display="inline">Price:</Text>&nbsp;{numberWithCommas(item.price, 4)} APT
            <Text display="inline" fontSize="medium" color="text" fontWeight="light">
              ~ ${numberWithCommas(item.price * (aptosToDollar || 0), 4)}
            </Text>
          </Box>
          <Box display={"flex"} flexDirection="column" gap="10px" width="30%" minW={"130px"}>
            <CancelAuctionButton {...{item, loading, setLoading, setStatus}}/>
          </Box>
        </>
      )} */}
    </NFTPageWrapper>
  );
};

export default NFTAuction;
