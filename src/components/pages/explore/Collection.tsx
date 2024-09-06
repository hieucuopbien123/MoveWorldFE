import { Box, Container, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import ActionWrapper from "./actions/ActionWrapper";
import { usePagination } from "@ajna/pagination";
import { useRouter } from "next/router";
import SkeletonItemCollection from "@/components/SkeletonItemCollection";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { useAppContext } from "@/store";
import { useListCollection } from "@/apis/collection";
import Empty from "@/components/Empty";
import { CloseIcon } from "@chakra-ui/icons";
import CheckCard from "./CheckCard";
import CustomPagination from "@/components/CustomPagination";

const Collection = () => {
  const [cartItems, setCartItems] = useState([]);
  const removeNFTById = (id: any) => {
    setCartItems(cartItems.filter((o: any) => o.id != id));
  };
  const { account, signMessage } = useWallet();
  const { refetchData } = useAppContext();

  const router = useRouter();
  const { sortParams, collectionid, statusParams } = router.query;
  const perPage = 20;
  const [numberOfPages, setNumberOfPages] = useState(1);

  const { currentPage, setCurrentPage, pagesCount, pages } = usePagination({
    pagesCount: numberOfPages,
    initialState: { currentPage: 1 },
    limits: {
      outer: 1,
      inner: 1,
    },
  });

  const { data, isLoading, isError } = useListCollection({
    currentPage,
    perPage,
    sortParams,
    statusParams,
    collectionid,
    account,
    signMessage,
    refetchData,
    setNumberOfPages,
    setCurrentPage,
  });

  if (isError) {
    return (
      <Box textAlign="center" py={5}>
        <CloseIcon color="red" />
        <Text color="red">Error fetching data</Text>
      </Box>
    );
  }

  return (
    <>
      <ActionWrapper cartItems={cartItems} setCartItems={setCartItems} />
      {isLoading && (
        <Container maxW="2100px" px={["20px", "50px", "70px"]}>
          <Box py={3}></Box>
          <Box className="grid min-[0px]:grid-cols-1 min-[655px]:grid-cols-2 min-[965px]:grid-cols-3 min-[1240px]:grid-cols-4 min-[1500px]:grid-cols-5 min-[1775px]:grid-cols-6 gap-4 justify-items-center">
            {Array(perPage)
              .fill(0)
              .map((_: any, i: any) => (
                <SkeletonItemCollection key={i} />
              ))}
          </Box>
        </Container>
      )}
      {!isLoading && (!data || (Array.isArray(data) && data.length <= 0)) && (
        <Box textAlign="center">
          <Empty title="No Item" />
        </Box>
      )}
      {!isLoading && (
        <Container maxW="2100px" px={["20px", "50px", "70px"]}>
          <Box py={3}></Box>
          <Box className="grid min-[0px]:grid-cols-1 min-[655px]:grid-cols-2 min-[965px]:grid-cols-3 min-[1240px]:grid-cols-4 min-[1500px]:grid-cols-5 min-[1775px]:grid-cols-6 gap-4 justify-items-center">
            {data?.map((data: any) => (
              <CheckCard
                removeNFTById={removeNFTById}
                setCartItems={setCartItems}
                cartItems={cartItems}
                key={data.id}
                {...data}
              />
            ))}
          </Box>
          <Box py={3}></Box>
          <CustomPagination onPageChange={setCurrentPage} {...{ pagesCount, currentPage, pages }} />
        </Container>
      )}
    </>
  );
};

export default Collection;
