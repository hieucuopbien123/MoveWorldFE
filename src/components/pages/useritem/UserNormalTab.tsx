import React from "react";
import { Box, Text } from "@chakra-ui/react";
import Empty from "@/components/Empty";
import { Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useAppContext } from "@/store";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { useUserTab } from "@/apis/usertab";
import { CloseIcon } from "@chakra-ui/icons";

const UserTab = ({
  tabIndex,
  currentPage,
  perPage,
  setNumberOfPage,
  setCurrentPage,
  ItemTag,
}: any) => {
  const router = useRouter();
  const { refetchData } = useAppContext();
  const { account, signMessage } = useWallet();
  const { sortParams } = router.query;
  const { data, isLoading, isError } = useUserTab({
    tabIndex,
    currentPage,
    account,
    sortParams,
    refetchData,
    signMessage,
    perPage,
    setNumberOfPage,
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
            <ItemTag key={data.name} {...data} />
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

export default UserTab;
