import React from "react";
import { Box, Text } from "@chakra-ui/react";
import Empty from "@/components/Empty";
import { Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { useAppContext } from "@/store";
import { usePProfile } from "@/apis/pprofile";
import { CloseIcon } from "@chakra-ui/icons";
import CheckCardPProfile from "./CheckCardPProfile";

const PProfileTab = ({ tabIndex, currentPage, perPage, setNumberOfPage, setCurrentPage }: any) => {
  const { account, signMessage } = useWallet();
  const { refetchData } = useAppContext();
  const router = useRouter();
  const { sortParams, userid } = router.query;

  const { data, isLoading, isError } = usePProfile({
    sortParams,
    account,
    signMessage,
    currentPage,
    perPage,
    setNumberOfPage,
    setCurrentPage,
    tabIndex,
    userid,
    refetchData,
  });

  if (isError) {
    return (
      <Box textAlign="center" py={5}>
        <CloseIcon color="red" />
        <Text color="red">Error fetching data</Text>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <>
        <Box textAlign={"center"}>
          <Spinner color="primary" thickness="4px" size={"lg"} />
        </Box>
      </>
    );
  }

  return (
    <>
      {data.length > 0 && (
        <Box className="grid min-[0px]:grid-cols-1 min-[500px]:grid-cols-2 min-[800px]:grid-cols-3 min-[1200px]:grid-cols-4 min-[1500px]:grid-cols-5 min-[1775px]:grid-cols-6 gap-4 justify-items-center">
          {data.map((data: any) => (
            <CheckCardPProfile key={data.name} {...data} />
          ))}
        </Box>
      )}
      {data.length <= 0 && (
        <Box pt={3} textAlign="center">
          <Empty title="No Item" />
        </Box>
      )}
    </>
  );
};

export default PProfileTab;
