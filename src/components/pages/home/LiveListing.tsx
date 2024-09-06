import { Box, Button, Text, Spinner, useColorMode } from "@chakra-ui/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import Aos from "aos";
import "aos/dist/aos.css";
import Slider from "react-slick";
import React, { useState, useEffect } from "react";
import GoToCard from "@/components/pages/home/GoToCard";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import Image from "next/image";

const settings = {
  dots: false,
  draggable: true,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 4,
  initialSlide: 0,
  autoplaySpeed: 8000,
  autoplay: true,

  prevArrow: (
    <Button position={"absolute"} zIndex={1} variant="ghost" borderRadius={"50%"}>
      <MdArrowBackIos />
    </Button>
  ),
  nextArrow: (
    <Button position={"absolute"} variant="ghost" borderRadius={"50%"}>
      <MdArrowForwardIos />
    </Button>
  ),
  responsive: [
    {
      breakpoint: 1250,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
      },
    },
    {
      breakpoint: 1100,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 800,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 540,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const timeout = (ms, promise) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Request timed out"))
    }, ms)
    promise.then(resolve, reject)
  })
}

const LiveListing = ({}: // liveListingData
any) => {
  const { colorMode } = useColorMode();
  const [liveListingData, setLiveListingData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await timeout(1000, fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/nft?status=0&pageSize=20&page=1`));
      const data = await response.json();

      setLiveListingData(
        data.data.map((d: any) => ({
          collection: d.collection,
          creator: d.creator,
          name: d.name || "",
          price: (d?.price || 0) / Math.pow(10, 8),
          image:
            d?.uri && (d?.uri.startsWith("/") || d?.uri.startsWith("http"))
              ? d?.uri
              : "/user/background.png",
          heart: d.likes,
        }))
      );
    } catch (e) {
      console.log(e);
      // React slick đang bị lỗi => bỏ k dùng
      setLiveListingData([
        {
          collection: "0001",
          creator: "0x00000000001",
          name: "Hieu1",
          price: 1000000000 / Math.pow(10, 8),
          image: "/user/background.png",
          heart: 1,
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
      <div data-aos="fade-up" data-aos-duration="2000" data-aos-once="true">
        <Box display={"flex"} alignItems="center" mt={"20px"}>
          <div className="flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full opacity-75 bg-green-400"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
          </div>
          <Text fontSize={30} fontWeight="bold" marginLeft={"10px"}>
            Live Listing
          </Text>
        </Box>
        {/* Testimage nextjs */}
        {
          new Array(50).fill(null).map((x, index) => (
            <Image 
              key={index} 
              src={"https://arweave.net/A26IYT-SVJDEIkKuQ9S5Rf3_E1cP-IAOuFhZUYM7WJ0"}
              alt=""
              width={200}
              height={200}
            />
          ))
        }
        <Slider
          {...settings}
          className={
            colorMode == "dark" ? "react-slick-customslide-dark" : "react-slick-customslide"
          }
        >
          {liveListingData.map((el: any, index: any) => {
            console.log(index);
            return (
              <Box key={index} px="15px" py="25px">
                <GoToCard {...el}></GoToCard>
              </Box>
            );
          })}
        </Slider>
      </div>
    </>
  );
};

export default LiveListing;
