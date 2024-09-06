import { Button, useToast } from "@chakra-ui/react";
import React from "react";
import { useAppContext } from "@/store";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { errorTopCenter, infoTopCenter, successTopCenter, waitingInfo } from "@/utils/toastutils";
import SaleContract from "@/move_services/utils/SaleContract";
import { BeatLoader } from "react-spinners";

const BuyButton = ({ item, loading, setLoading, updateOwner, setStatus }: any) => {
  const { showAvatar, callEveryComponentFetchData, fetchBalance } = useAppContext();

  const { signAndSubmitTransaction } = useWallet();
  const toast = useToast();
  const toastIdRef: any = React.useRef();

  const buyNow = async () => {
    setLoading(true);
    try {
      if (!showAvatar) {
        throw new Error("Please connect your wallet first! ");
      }
      toastIdRef.current = toast(infoTopCenter("Waiting..."));
      await SaleContract.buyNFT({
        sellerAddress: item.seller,
        tokenData: {
          creator: item.creator,
          collection: item.collectionid,
          name: item.name,
        },
        signAndSubmitTransaction,
        toast,
        toastIdRef,
      });
      toast(successTopCenter("Buy sucessfully"));
      callEveryComponentFetchData();
      await updateOwner();
      setStatus(1);
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
    <Button colorScheme={"teal"} variant="solid" onClick={buyNow} disabled={loading}>
      {loading ? <BeatLoader size={8} color="white" /> : "BUY NOW"}
    </Button>
  );
};

export default BuyButton;
