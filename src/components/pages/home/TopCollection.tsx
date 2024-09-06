import { Box, Text, Spinner } from "@chakra-ui/react";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import Aos from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { formatPrice2 } from "@/utils/format";
import PercentageChange from "@/components/pages/home/PercentageChange";
import { useAppContext } from "@/store";

const timeout = (ms, promise) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Request timed out"))
    }, ms)
    promise.then(resolve, reject)
  })
}

const TopCollection = ({}: // topCollectionData
any) => {
  // useEffect(() => {
  //   Aos.init();
  //   Aos.refresh();
  // }, []);
  const { aptosToDollar } = useAppContext();
  const [topCollectionData, setTopCollectionData] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      setLoading(true);
      // Custom dùng fetch của web api
      const response2 = await timeout(1000, fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/collection/ranking?fromTime=0&pageSize=10&page=1&sort=-currentVolume`));
      const data2 = await response2.json();
      setTopCollectionData(
        data2.data.map((d: any) => ({
          creator: d.creator,
          name: d.name,
          icon:
            d?.uri && (d?.uri.startsWith("/") || d?.uri.startsWith("http"))
              ? d?.uri
              : "/user/background.png",
          floorPrice: (d?.currentFloorPrice || 0) / Math.pow(10, 8),
          volume: (d?.currentVolume || 0) / Math.pow(10, 8),
          floorChange:
            d.previousFloorPrice == 0 && d.currentFloorPrice == 0
              ? 0.0
              : d.previousFloorPrice == 0
              ? (d.currentFloorPrice - d.previousFloorPrice) / Math.pow(10, 8)
              : ((d.currentFloorPrice - d.previousFloorPrice) * 100) / d.previousFloorPrice,
          volumeChange:
            d.previousVolume == 0 && d.currentVolume == 0
              ? 0.0
              : d.previousVolume == 0
              ? (d.currentVolume - d.previousVolume) / Math.pow(10, 8)
              : ((d.currentVolume - d.previousVolume) * 100) / d.previousVolume,
        }))
      );
    } catch (e) {
      console.log(e);
      // setError(true);
      setTopCollectionData([
        {
          creator: "0x000000000001",
          name: "Hieu",
          icon: "/user/background.png",
          floorPrice: 1000000 / Math.pow(10, 8),
          volume: 10000000 / Math.pow(10, 8),
          floorChange: 1,
          volumeChange: 1
        }
      ] as any);
    } finally {
      setLoading(false);
    }
  };

  // if (error) {
  //   return (
  //     <Box textAlign="center" py={5}>
  //       <CloseIcon color="red" />
  //       <Text color="red">Error fetching data</Text>
  //     </Box>
  //   );
  // }

  if (loading) {
    return (
      <Box textAlign="center" padding={"20px"}>
        <Spinner color="primary" />
      </Box>
    );
  }

  return (
    <>
      <Text fontSize={30} fontWeight="bold" marginLeft={"10px"}>
        Top Collections
      </Text>
      <Box mb={3}></Box>
      <Box className="grid min-[0px]:grid-cols-1 min-[850px]:grid-cols-2 min-[1200px]:grid-cols-3 gap-6 justify-items-center">
        {topCollectionData.map((el: any, index: any) => {
          return (
            <div
              key={index}
              data-aos="fade-right"
              data-aos-once="true"
              data-aos-duration="1500"
              style={{ width: "100%" }}
            >
              <Link href={`/explore/${el.creator}/${el.name}`}>
                <Box
                  width="100%"
                  display={"flex"}
                  alignItems={"center"}
                  padding={"20px"}
                  borderRadius="10px"
                  backgroundColor={"topCollectionCard"}
                  cursor="pointer"
                  _hover={{ bgColor: "hoverDark" }}
                  transition={".5s ease"}
                  sx={{
                    "&:hover img": {
                      transform: "scale(1.1)",
                      transition: "0.5s",
                    },
                  }}
                >
                  <Text marginRight={"10px"} fontWeight={"700"} fontSize={"4xl"} opacity={0.1}>
                    {index + 1}
                  </Text>
                  <Box flex={1} display={"flex"} alignItems="center">
                    {/* <Box overflow={"hidden"} style={{ borderRadius: "50%" }}> */}
                    <Image
                      src={el.icon}
                      width={64}
                      height={64}
                      style={{
                        width: "64px",
                        height: "64px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        backgroundColor: "#b9bec7",
                      }}
                      alt="collection"
                    ></Image>
                    {/* </Box> */}
                    <Box ml={"10px"} flex={1}>
                      <Text fontWeight={"semibold"}>{el.name}</Text>
                      <Box>
                        <Box
                          display={"flex"}
                          alignItems={"baseline"}
                          justifyContent={"space-between"}
                          flex={1}
                        >
                          <Box flex={3}>
                            <Text fontSize={"small"} color="gray">
                              Floor :
                            </Text>
                          </Box>
                          <Box display={"flex"} flex={7} justifyContent="space-between" mb={1}>
                            <Text fontWeight={"semibold"}>
                              $&nbsp;{formatPrice2(el.floorPrice * aptosToDollar)}
                            </Text>
                            <PercentageChange value={el.floorChange} />
                          </Box>
                        </Box>
                        <Box
                          display={"flex"}
                          alignItems={"baseline"}
                          justifyContent={"space-between"}
                          flex={1}
                        >
                          <Box flex={3}>
                            <Text fontSize={"smaller"} color={"gray"}>
                              Volume :
                            </Text>
                          </Box>
                          <Box display={"flex"} flex={7} justifyContent="space-between">
                            <Box>
                              <Text>$&nbsp;{formatPrice2(el.volume * aptosToDollar)}</Text>
                            </Box>
                            <PercentageChange value={el.volumeChange} />
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Link>
            </div>
          );
        })}
      </Box>
    </>
  );
};

export default TopCollection;
