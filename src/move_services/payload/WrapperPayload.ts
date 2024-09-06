import { Types } from "aptos";

const WRAPPER_ADDRESS = process.env.NEXT_PUBLIC_WRAPPER_ADDRESS;

export type CollectionData = {
  maxAmount: number;
  name: string;
  description: string;
  uri: string;
};

const createCollectionPayload = (collectionData: CollectionData) => {
  const payload: Types.EntryFunctionPayload = {
    function: `${WRAPPER_ADDRESS}::create_collection_script`,
    type_arguments: [],
    arguments: [
      collectionData.name,
      collectionData.description,
      collectionData.uri,
      collectionData.maxAmount,
      [false, false, false],
    ],
  };
  return payload;
};

const mintNFTPayload = (NFTData: any, address: any, royalNum: any, royDenum: any) => {
  const payload: Types.EntryFunctionPayload = {
    function: `${WRAPPER_ADDRESS}::create_token_script`,
    type_arguments: [],
    arguments: [
      NFTData.collectionName,
      NFTData.name,
      NFTData.description,
      1,
      1,
      NFTData.uri,
      address,
      royDenum,
      royalNum,
      [false, false, false, false, false],
      [],
      [],
      [],
    ],
  };
  return payload;
};

export const offerNFTPayload = ({ receiver, creator, collectionName, name }: any) => {
  const payload: Types.EntryFunctionPayload = {
    function: `${WRAPPER_ADDRESS}::offer_script`,
    type_arguments: [],
    arguments: [receiver, creator, collectionName, name, 0, 1],
  };
  return payload;
};

export const claimNFTPayload = ({ sender, creator, collectionName, name }: any) => {
  const payload: Types.EntryFunctionPayload = {
    function: `${WRAPPER_ADDRESS}::claim_script`,
    type_arguments: [],
    arguments: [sender, creator, collectionName, name, 0],
  };
  return payload;
};

export const cancelOfferPayload = ({ receiver, creator, collectionName, name }: any) => {
  const payload: Types.EntryFunctionPayload = {
    function: `${WRAPPER_ADDRESS}::cancel_offer_script`,
    type_arguments: [],
    arguments: [receiver, creator, collectionName, name, 0],
  };
  return payload;
};

export default {
  createCollectionPayload,
  mintNFTPayload,
  offerNFTPayload,
  claimNFTPayload,
  cancelOfferPayload,
};
