import { Box, Text, useColorMode } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";
import React, { useMemo } from "react";
// import moment from "moment";
import useCountdownHook from "src/utils/use-count-down";
import HeartButton from "../HeartButton";

const OnAuctionNormalCard = ({
  name,
  image,
  id,
  liked,
  heart,
  auctionCurrentBidPrice,
  auctionOfferPrice,
  auctionEndAt,
}: any) => {
  const { colorMode } = useColorMode();

  const [isTimesup, countdown] = useCountdownHook(auctionEndAt * 1000);
  const [hourCountdown, minuteCountdown, secondCountdown] = useMemo(() => {
    if (countdown) {
      // const duration = moment.duration(Number(countdown));
      // const h = duration.hours() + duration.days() * 24;
      // const m = duration.minutes();
      // const s = duration.seconds();

      let h = Number(countdown) / 1000 / 3600;
      let m = ((Number(countdown) / 1000) % 3600) / 60;
      let s = (m * 60) % 60;

      h = Math.trunc(h);
      m = Math.trunc(m);
      s = Math.trunc(s);
      // console.log(Number(countdown));
      // console.log(`${hours} and ${h}`);
      // console.log(`${mins} and ${m}`);
      // console.log(`${secs} and ${s}`);
      return [h < 10 ? "0" + h : h, m < 10 ? "0" + m : m, s < 10 ? "0" + s : s];
    }
    return ["00", "00", "00"];
  }, [countdown]);

  return (
    <>
      <Box
        borderRadius={"20px"}
        background="coveritem"
        position="relative"
        transition="0.5s"
        sx={{
          "&:hover img": {
            transform: "scale(1.2)",
            transition: "0.5s",
          },
          "&:hover": {
            boxShadow:
              colorMode == "dark"
                ? "rgb(255 255 255 / 50%) 0px 0px 25px"
                : "rgb(0 0 0 / 50%) 0px 0px 25px",
          },
        }}
        maxW="490px"
        width="100%"
        height="100%"
      >
        <Link href={`/nft/${id}`}>
          <Box overflow={"hidden"} style={{ borderRadius: "20px" }} position="relative">
            <Image
              src={image}
              width="0"
              height="0"
              sizes="100vw"
              style={{
                borderRadius: "20px",
                width: "100%",
                aspectRatio: "1/1",
                objectFit: "cover",
                backgroundColor: "#c3c3c3",
              }}
              alt="nft"
            />
            <Box
              position={"absolute"}
              background="coveritem"
              opacity={0.9}
              borderRadius={"20px"}
              py="5px"
              px="15px"
              fontSize={"small"}
              left={0}
              bottom={0}
            >
              {isTimesup ? "ENDED" : `${hourCountdown}:${minuteCountdown}:${secondCountdown}`}
            </Box>
          </Box>
          <Box p={4} display="flex" flexDirection="column" gap="10px">
            <Text fontWeight="bold" fontSize="large">
              {name}
            </Text>
            <Text color={"text"}>
              Highest bid: {auctionCurrentBidPrice || auctionOfferPrice || "___"} APT
            </Text>
          </Box>
        </Link>
        <HeartButton {...{ id, liked, heart }} />
      </Box>
    </>
  );
};

export default OnAuctionNormalCard;
