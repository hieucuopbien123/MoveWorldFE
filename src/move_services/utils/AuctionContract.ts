import { transactionFail, transactionPending, transactionSuccess } from "@/utils/toastutils";
import { AptosClient } from "aptos";
import AuctionPayload from "src/move_services/payload/AuctionPayload";
import { UserTransaction } from "aptos/src/generated";

const aptosClient = new AptosClient(
  process.env.NEXT_PUBLIC_NODE_URL || "https://fullnode.testnet.aptoslabs.com"
);

const createAuction = async ({
  tokenData,
  price,
  start,
  end,
  signAndSubmitTransaction,
  toast,
  toastIdRef,
}: any) => {
  const createNFTAuctionPayLoad = AuctionPayload.createNFTActionPayload(
    tokenData,
    price,
    start,
    end
  );
  const transactionRes = await signAndSubmitTransaction(createNFTAuctionPayLoad);

  if (toastIdRef.current) {
    toast.close(toastIdRef.current);
  }
  if (transactionRes?.hash) {
    toastIdRef.current = toast(transactionPending("Auction NFT", transactionRes.hash));

    const txnResult = (await aptosClient.waitForTransactionWithResult(transactionRes.hash, {
      timeoutSecs: 20,
      checkSuccess: true,
    })) as UserTransaction;

    if (txnResult.success) {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast(transactionSuccess(`Auction NFT ${tokenData.name} successfully`, transactionRes.hash));
    } else {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast(transactionFail(`Fail to start auctioning NFT ${tokenData.name}`, transactionRes.hash));
    }
  }
};
const cancelAuction = async ({ tokenData, signAndSubmitTransaction, toast, toastIdRef }: any) => {
  const cancelAuctionPayLoad = AuctionPayload.cancelNFTAuctionPayload(tokenData);
  const transactionRes = await signAndSubmitTransaction(cancelAuctionPayLoad);

  if (toastIdRef.current) {
    toast.close(toastIdRef.current);
  }
  if (transactionRes?.hash) {
    toastIdRef.current = toast(transactionPending("Cancel Auction", transactionRes.hash));

    const txnResult = (await aptosClient.waitForTransactionWithResult(transactionRes.hash, {
      timeoutSecs: 20,
      checkSuccess: true,
    })) as UserTransaction;

    if (txnResult.success) {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast(
        transactionSuccess(
          `Cancel auction of NFT ${tokenData.name} successfully`,
          transactionRes.hash
        )
      );
    } else {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast(
        transactionFail(`Fail to cancel auction of NFT ${tokenData.name}`, transactionRes.hash)
      );
    }
  }
};
const editPriceAuction = async ({
  tokenData,
  price,
  signAndSubmitTransaction,
  toast,
  toastIdRef,
}: any) => {
  const editPriceAuctionPayLoad = AuctionPayload.updateNFTPricePayload(tokenData, price);
  const transactionRes = await signAndSubmitTransaction(editPriceAuctionPayLoad);

  if (toastIdRef.current) {
    toast.close(toastIdRef.current);
  }
  if (transactionRes?.hash) {
    toastIdRef.current = toast(transactionPending("Edit Auction Price", transactionRes.hash));
    
    const txnResult = (await aptosClient.waitForTransactionWithResult(transactionRes.hash, {
      timeoutSecs: 20,
      checkSuccess: true,
    })) as UserTransaction;

    if (txnResult.success) {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast(
        transactionSuccess(
          `Edit auction price of NFT ${tokenData.name} successfully`,
          transactionRes.hash
        )
      );
    } else {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast(
        transactionFail(`Fail to edit auction price of NFT ${tokenData.name}`, transactionRes.hash)
      );
    }
  }
};
const placeBid = async ({
  sellerAddress,
  tokenData,
  price,
  signAndSubmitTransaction,
  toast,
  toastIdRef,
}: any) => {
  const placeBidPayLoad = AuctionPayload.makeNFTBidPayload(sellerAddress, tokenData, price);
  const transactionRes = await signAndSubmitTransaction(placeBidPayLoad);

  if (toastIdRef.current) {
    toast.close(toastIdRef.current);
  }
  if (transactionRes?.hash) {
    toastIdRef.current = toast(transactionPending("Place Bid", transactionRes.hash));

    const txnResult = (await aptosClient.waitForTransactionWithResult(transactionRes.hash, {
      timeoutSecs: 20,
      checkSuccess: true,
    })) as UserTransaction;

    if (txnResult.success) {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast(
        transactionSuccess(`Place Bid for NFT ${tokenData.name} successfully`, transactionRes.hash)
      );
    } else {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast(transactionFail(`Fail to Place bid for ${tokenData.name}`, transactionRes.hash));
    }
  }
};
const finalizeAuction = async ({
  sellerAddress,
  tokenData,
  signAndSubmitTransaction,
  toast,
  toastIdRef,
}: any) => {
  const finalizeAuctionPayLoad = AuctionPayload.finalizeNFTAuctionPayload(sellerAddress, tokenData);
  const transactionRes = await signAndSubmitTransaction(finalizeAuctionPayLoad);

  if (toastIdRef.current) {
    toast.close(toastIdRef.current);
  }
  if (transactionRes?.hash) {
    toastIdRef.current = toast(transactionPending("Place Bid", transactionRes.hash));

    const txnResult = (await aptosClient.waitForTransactionWithResult(transactionRes.hash, {
      timeoutSecs: 20,
      checkSuccess: true,
    })) as UserTransaction;

    if (txnResult.success) {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast(
        transactionSuccess(
          `Finalize auction for NFT ${tokenData.name} successfully`,
          transactionRes.hash
        )
      );
    } else {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast(transactionFail(`Fail to finalize auction for ${tokenData.name}`, transactionRes.hash));
    }
  }
};

export default {
  createAuction,
  cancelAuction,
  editPriceAuction,
  placeBid,
  finalizeAuction,
};
