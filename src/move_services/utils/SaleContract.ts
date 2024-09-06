import { transactionFail, transactionPending, transactionSuccess } from "@/utils/toastutils";
import { AptosClient } from "aptos";
import { UserTransaction } from "aptos/src/generated";
import SalePayload from "src/move_services/payload/SalePayload";

const aptosClient = new AptosClient(
  process.env.NEXT_PUBLIC_NODE_URL || "https://fullnode.testnet.aptoslabs.com"
);

const buyNFT = async ({
  sellerAddress,
  tokenData,
  signAndSubmitTransaction,
  toast,
  toastIdRef,
}: any) => {
  const buyNFTPayload = SalePayload.buyNFTPayload(sellerAddress, tokenData);
  const transactionRes = await signAndSubmitTransaction(buyNFTPayload);

  if (toastIdRef.current) {
    toast.close(toastIdRef.current);
  }
  if (transactionRes?.hash) {
    toastIdRef.current = toast(transactionPending("Buy NFT", transactionRes.hash));

    const txnResult = (await aptosClient.waitForTransactionWithResult(transactionRes.hash, {
      timeoutSecs: 20,
      checkSuccess: true,
    })) as UserTransaction;

    if (txnResult.success) {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast(transactionSuccess(`Buy NFT ${tokenData.name} successfully`, transactionRes.hash));
    } else {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast(transactionFail(`Fail to buy NFT ${tokenData.name}`, transactionRes.hash));
    }
  }
};

export const listNFT = async ({
  tokenData,
  price,
  signAndSubmitTransaction,
  toast,
  toastIdRef,
}: any) => {
  const listNFTPayload = SalePayload.listNFTPayload(tokenData, price);
  const transactionRes = await signAndSubmitTransaction(listNFTPayload);

  if (toastIdRef.current) {
    toast.close(toastIdRef.current);
  }
  if (transactionRes?.hash) {
    toastIdRef.current = toast(transactionPending("List NFT", transactionRes.hash));

    const txnResult = (await aptosClient.waitForTransactionWithResult(transactionRes.hash, {
      timeoutSecs: 20,
      checkSuccess: true,
    })) as UserTransaction;

    if (txnResult.success) {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast(transactionSuccess(`List NFT ${tokenData.name} successfully`, transactionRes.hash));
    } else {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast(transactionFail(`Fail to list NFT ${tokenData.name}`, transactionRes.hash));
    }
  }
  await aptosClient.waitForTransaction(transactionRes?.hash || "", {
    checkSuccess: true,
  });
};

export const bulkBuyNFT = async ({ orders, signAndSubmitTransaction, toast, toastIdRef }: any) => {
  const bulkBuyNFTPayload = SalePayload.buyBulkNFTPayload(orders);
  const transactionRes = await signAndSubmitTransaction(bulkBuyNFTPayload);

  if (toastIdRef.current) {
    toast.close(toastIdRef.current);
  }
  if (transactionRes?.hash) {
    toastIdRef.current = toast(transactionPending("Bulk Buy NFTs", transactionRes.hash));

    const txnResult = (await aptosClient.waitForTransactionWithResult(transactionRes.hash, {
      timeoutSecs: 20,
      checkSuccess: true,
    })) as UserTransaction;

    if (txnResult.success) {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast(transactionSuccess(`Buy NFTs successfully`, transactionRes.hash));
    } else {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast(transactionFail(`Fail to buy NFTs`, transactionRes.hash));
    }
  }
  await aptosClient.waitForTransaction(transactionRes?.hash || "", {
    checkSuccess: true,
  });
};

export const delistNFT = async ({
  tokenData,
  signAndSubmitTransaction,
  toast,
  toastIdRef,
}: any) => {
  const bulkBuyNFTPayload = SalePayload.delistNFTPayload(tokenData);
  const transactionRes = await signAndSubmitTransaction(bulkBuyNFTPayload);

  if (toastIdRef.current) {
    toast.close(toastIdRef.current);
  }
  if (transactionRes?.hash) {
    toastIdRef.current = toast(transactionPending("Delist NFTs", transactionRes.hash));

    const txnResult = (await aptosClient.waitForTransactionWithResult(transactionRes.hash, {
      timeoutSecs: 20,
      checkSuccess: true,
    })) as UserTransaction;

    if (txnResult.success) {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast(transactionSuccess(`Delist NFTs successfully`, transactionRes.hash));
    } else {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast(transactionFail(`Fail to delist NFTs`, transactionRes.hash));
    }
  }
  await aptosClient.waitForTransaction(transactionRes?.hash || "", {
    checkSuccess: true,
  });
};

const editPrice = async ({
  tokenData,
  price,
  signAndSubmitTransaction,
  toast,
  toastIdRef,
}: any) => {
  const editPricePayLoad = SalePayload.updateNFTPricePayload(tokenData, price);
  const transactionRes = await signAndSubmitTransaction(editPricePayLoad);

  if (toastIdRef.current) {
    toast.close(toastIdRef.current);
  }
  if (transactionRes?.hash) {
    toastIdRef.current = toast(transactionPending("Edit Sale Price", transactionRes.hash));

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
          `Edit sale price of NFT ${tokenData.name} successfully`,
          transactionRes.hash
        )
      );
    } else {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast(
        transactionFail(`Fail to edit sale price of NFT ${tokenData.name}`, transactionRes.hash)
      );
    }
  }
};

const listBulk = async ({ data, signAndSubmitTransaction, toast, toastIdRef }: any) => {
  const listBulkNFTPayload = SalePayload.listBulkNFTPayload(data);
  const transactionRes = await signAndSubmitTransaction(listBulkNFTPayload);

  if (toastIdRef.current) {
    toast.close(toastIdRef.current);
  }
  if (transactionRes?.hash) {
    toastIdRef.current = toast(transactionPending("Bulk List NFT", transactionRes.hash));

    const txnResult = (await aptosClient.waitForTransactionWithResult(transactionRes.hash, {
      timeoutSecs: 20,
      checkSuccess: true,
    })) as UserTransaction;

    if (txnResult.success) {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast(transactionSuccess(`List NFTs successfully!`, transactionRes.hash));
    } else {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toast(transactionFail("Fail to list NFTs", transactionRes.hash));
    }
  }
};

export default {
  buyNFT,
  listNFT,
  bulkBuyNFT,
  delistNFT,
  editPrice,
  listBulk,
};
