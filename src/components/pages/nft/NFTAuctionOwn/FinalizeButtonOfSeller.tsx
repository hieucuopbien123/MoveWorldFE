import AuctionContract from "@/move_services/utils/AuctionContract";
import { Button, Text, useToast } from "@chakra-ui/react";
import React from "react";
import { useAppContext } from "@/store";
import { errorTopCenter, infoTopCenter, successTopCenter, waitingInfo } from "@/utils/toastutils";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { BeatLoader } from "react-spinners";

const FinalizeButtonOfSeller = ({
  item,
  loading,
  setLoading,
  updateOwner,
  setFinalize,
  finalize,
}: any) => {
  const { showAvatar, callEveryComponentFetchData, fetchBalance } = useAppContext();
  const toastIdRef: any = React.useRef(null);
  const toast = useToast();
  const { signAndSubmitTransaction } = useWallet();
  const finalizeAuction = async () => {
    setLoading(true);
    try {
      if (!showAvatar) {
        throw new Error("Please connect your wallet first! ");
      }
      toastIdRef.current = toast(infoTopCenter("Waiting..."));
      await AuctionContract.finalizeAuction({
        sellerAddress: item.auctionSeller,
        tokenData: {
          creator: item.creator,
          collection: item.collectionid,
          name: item.name,
        },
        signAndSubmitTransaction,
        toast,
        toastIdRef,
      });
      toast(successTopCenter("Finalize auction sucessfully"));
      callEveryComponentFetchData();
      setFinalize(true);
      await updateOwner();
      fetchBalance();

      setTimeout(() => {
        setLoading(false);
      }, 10000);
      toast(waitingInfo("Waiting for data to update"));
    } catch (e: any) {
      console.log(e);
      toast(errorTopCenter(e.message ? JSON.stringify(e.message).slice(0, 140) : "Error happen!!"));
      setLoading(false);
    } finally {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
    }
  };

  return (
    <>
      {finalize == false && (
        <Button
          variant="solid"
          colorScheme={"teal"}
          borderColor="primary"
          border="2px solid"
          onClick={finalizeAuction}
          disabled={loading}
        >
          {loading ? <BeatLoader size={8} color="white" /> : "FINALIZE"}
        </Button>
      )}
      {finalize == true && (
        <Text borderRadius={"20px"} bgColor="primary" py="10px" px="5px" textAlign={"center"}>
          You finalized
        </Text>
      )}
    </>
  );
};
export default FinalizeButtonOfSeller;
