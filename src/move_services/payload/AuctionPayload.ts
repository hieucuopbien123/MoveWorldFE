import { AptosClient, TokenTypes, Types } from "aptos";

const AUCTION_ADDRESS = process.env.NEXT_PUBLIC_AUCTION_ADDRESS;

const client = new AptosClient(
  process.env.NEXT_PUBLIC_NODE_URL || "https://fullnode.testnet.aptoslabs.com"
);

export const createNFTActionPayload = (
  tokenDataId: TokenTypes.TokenDataId,
  price: number,
  start: Date,
  end: Date
) => {
  const payload: Types.EntryFunctionPayload = {
    function: `${AUCTION_ADDRESS}::create_auction`,
    type_arguments: ["0x1::aptos_coin::AptosCoin"], // coin type to sell
    arguments: [
      tokenDataId.creator, // creators_address: address,
      tokenDataId.collection, // collection: String,
      tokenDataId.name, // name: String,
      0, // property_version: u64,
      1, // token_amount: u64, 1 for nft
      price, // price per token: u64,
      Math.ceil(start.valueOf() / 1000),
      Math.ceil(end.valueOf() / 1000),
    ],
  };
  return payload;
};

export const cancelNFTAuctionPayload = (tokenDataId: TokenTypes.TokenDataId) => {
  const payload: Types.EntryFunctionPayload = {
    function: `${AUCTION_ADDRESS}::cancel_auction`,
    type_arguments: ["0x1::aptos_coin::AptosCoin"],
    arguments: [
      tokenDataId.creator, // creators_address: address,
      tokenDataId.collection, // collection: String,
      tokenDataId.name, // name: String,
      0, // property_version: u64,
    ],
  };
  return payload;
};

export const updateNFTPricePayload = (tokenDataId: TokenTypes.TokenDataId, newPrice: number) => {
  const payload: Types.EntryFunctionPayload = {
    function: `${AUCTION_ADDRESS}::edit_auction_price`,
    type_arguments: ["0x1::aptos_coin::AptosCoin"],
    arguments: [
      tokenDataId.creator, // creators_address: address,
      tokenDataId.collection, // collection: String,
      tokenDataId.name, // name: String,
      0, // property_version: u64,
      newPrice, // price_per_token: u64 (new price)
    ],
  };
  return payload;
};

export const makeNFTBidPayload = (
  sellerAddress: string,
  tokenDataId: TokenTypes.TokenDataId,
  bidPrice: number
) => {
  const payload: Types.EntryFunctionPayload = {
    function: `${AUCTION_ADDRESS}::make_bid`,
    type_arguments: ["0x1::aptos_coin::AptosCoin"],
    arguments: [
      sellerAddress, // token_seller: address,
      tokenDataId.creator, // creators_address: address,
      tokenDataId.collection, // collection: String,
      tokenDataId.name, // name: String,
      0, //  property_version: u64,
      bidPrice,
    ],
  };
  return payload;
};

export const finalizeNFTAuctionPayload = (
  sellerAddress: string,
  tokenDataId: TokenTypes.TokenDataId
) => {
  const payload: Types.EntryFunctionPayload = {
    function: `${AUCTION_ADDRESS}::finalize_auction`,
    type_arguments: ["0x1::aptos_coin::AptosCoin"],
    arguments: [
      sellerAddress, // token_seller: address,
      tokenDataId.creator, // creators_address: address,
      tokenDataId.collection, // collection: String,
      tokenDataId.name, // name: String,
      0, //  property_version: u64,
    ],
  };
  return payload;
};

export const sellerClaimed = async (sellerAddress: string, tokenDataId: TokenTypes.TokenDataId) => {
  const resource = await client.getAccountResource(
    sellerAddress,
    `${AUCTION_ADDRESS}::BidListings<0x1::aptos_coin::AptosCoin>`
  );
  const data: any = resource.data;
  const handle = data.listings.handle;
  const res: any = await client.getTableItem(handle, {
    key_type: "0x3::token::TokenId",
    value_type: `${AUCTION_ADDRESS}::Bid<0x1::aptos_coin::AptosCoin>`,
    key: {
      token_data_id: tokenDataId,
      property_version: "0",
    },
  });
  return Number(res.end_sec) * 1000 < Date.now() && res.coin.value === "0";
};

export default {
  createNFTActionPayload,
  cancelNFTAuctionPayload,
  updateNFTPricePayload,
  makeNFTBidPayload,
  finalizeNFTAuctionPayload,
};
