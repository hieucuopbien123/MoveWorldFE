import React, { useState, useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";
import Empty from "@/components/Empty";
import { Spinner } from "@chakra-ui/react";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { CloseIcon } from "@chakra-ui/icons";
import getCurentTokensInOffer from "@/apis/useritemtransfertab";

const UserNormalTransferNFTs = ({ ItemTag }: any) => {
  const { account } = useWallet();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsError(false);
      if (account?.address) {
        setLoading(true);
        const response = await getCurentTokensInOffer(account?.address);
        setData(
          response.data.data.current_token_pending_claims.map((r: any) => ({
            name: r.current_token_data.name,
            image:
              r.current_token_data.metadata_uri.startsWith("/") |
              r.current_token_data.metadata_uri.startsWith("http")
                ? r.current_token_data.metadata_uri
                : "/user/background.png",
            creator: r.current_token_data.creator_address,
            collection: r.current_token_data.collection_name,
            toAddress: r.to_address,
          }))
        );
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
      setIsError(true);
    }
  };

  if (isError) {
    return (
      <Box textAlign="center" py={5}>
        <CloseIcon color="red" />
        <Text color="red">Error fetching data</Text>
      </Box>
    );
  }

  if (loading) {
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
            <ItemTag key={data.name} {...data} fetchData={fetchData} />
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

export default UserNormalTransferNFTs;
