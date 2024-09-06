import { transactionFail, transactionPending, transactionSuccess } from "@/utils/toastutils";
import { AptosClient } from "aptos";
import { UserTransaction } from "aptos/src/generated";
import WrapperPayload from "src/move_services/payload/WrapperPayload";

const aptosClient = new AptosClient(
  process.env.NEXT_PUBLIC_NODE_URL || "https://fullnode.testnet.aptoslabs.com"
);

const createCollection = async ({
  collectionData,
  signAndSubmitTransaction,
  toast,
  toastIdRef,
}: any) => {
  const createCollectionPayload = WrapperPayload.createCollectionPayload(collectionData);
  const transactionRes = await signAndSubmitTransaction(createCollectionPayload);

  if (toastIdRef.current) {
    toast.close(toastIdRef.current);
  }

  if (transactionRes?.hash) {
    toastIdRef.current = toast(transactionPending("Create A New Collection", transactionRes.hash));

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
          `Create collection ${collectionData.name} successfully`,
          transactionRes.hash
        )
      );
    } else {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast(
        transactionFail(`Fail to create collection ${collectionData.name}`, transactionRes.hash)
      );
    }
  }
};

const mintNFT = async ({
  NFTData,
  address,
  royNum,
  royDenum,
  signAndSubmitTransaction,
  toast,
  toastIdRef,
}: any) => {
  const mintNFTPayload = WrapperPayload.mintNFTPayload(NFTData, address, royNum, royDenum);
  const transactionRes = await signAndSubmitTransaction(mintNFTPayload);

  if (toastIdRef.current) {
    toast.close(toastIdRef.current);
  }

  if (transactionRes?.hash) {
    toastIdRef.current = toast(transactionPending("Mint NFT", transactionRes.hash));

    const txnResult = (await aptosClient.waitForTransactionWithResult(transactionRes.hash, {
      timeoutSecs: 20,
      checkSuccess: true,
    })) as UserTransaction;

    if (txnResult.success) {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast(transactionSuccess(`Mint NFT ${NFTData.name} successfully`, transactionRes.hash));
    } else {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast(transactionFail(`Fail to mint NFT ${NFTData.name}`, transactionRes.hash));
    }
  }
};

const offerNFT = async ({ data, signAndSubmitTransaction, toast, toastIdRef }: any) => {
  const offerNFTPayload = WrapperPayload.offerNFTPayload(data);
  const transactionRes = await signAndSubmitTransaction(offerNFTPayload);

  if (toastIdRef.current) {
    toast.close(toastIdRef.current);
  }
  if (transactionRes?.hash) {
    toastIdRef.current = toast(transactionPending("Offer NFT", transactionRes.hash));

    const txnResult = (await aptosClient.waitForTransactionWithResult(transactionRes.hash, {
      timeoutSecs: 20,
      checkSuccess: true,
    })) as UserTransaction;

    if (txnResult.success) {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast(transactionSuccess(`Offer NFT ${data.name} successfully`, transactionRes.hash));
    } else {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast(transactionFail(`Fail to offer NFT ${data.name}`, transactionRes.hash));
    }
  }
};

const claimNFT = async ({ data, signAndSubmitTransaction, toast, toastIdRef }: any) => {
  const claimNFTPayload = WrapperPayload.claimNFTPayload(data);
  const transactionRes = await signAndSubmitTransaction(claimNFTPayload);

  if (toastIdRef.current) {
    toast.close(toastIdRef.current);
  }
  if (transactionRes?.hash) {
    toastIdRef.current = toast(transactionPending("Claim NFT", transactionRes.hash));

    const txnResult = (await aptosClient.waitForTransactionWithResult(transactionRes.hash, {
      timeoutSecs: 20,
      checkSuccess: true,
    })) as UserTransaction;

    if (txnResult.success) {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast(transactionSuccess(`Claim NFT ${data.name} successfully`, transactionRes.hash));
    } else {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast(transactionFail(`Fail to claim NFT ${data.name}`, transactionRes.hash));
    }
  }
};

const cancelOffer = async ({ data, signAndSubmitTransaction, toast, toastIdRef }: any) => {
  const cancelOfferPayload = WrapperPayload.cancelOfferPayload(data);
  const transactionRes = await signAndSubmitTransaction(cancelOfferPayload);

  if (toastIdRef.current) {
    toast.close(toastIdRef.current);
  }
  if (transactionRes?.hash) {
    toastIdRef.current = toast(transactionPending("Cancel Offer", transactionRes.hash));

    const txnResult = (await aptosClient.waitForTransactionWithResult(transactionRes.hash, {
      timeoutSecs: 20,
      checkSuccess: true,
    })) as UserTransaction;

    if (txnResult.success) {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast(transactionSuccess(`Cancel Offer successfully`, transactionRes.hash));
    } else {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast(transactionFail(`Fail to cancel offer`, transactionRes.hash));
    }
  }
};

export default {
  createCollection,
  mintNFT,
  offerNFT,
  claimNFT,
  cancelOffer,
};
