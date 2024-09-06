import { TokenTypes, Types } from "aptos";

const SALE_ADDRESS = process.env.NEXT_PUBLIC_SALE_ADDRESS;

export type OrderType = {
  sellerAddress: string;
  tokenDataId: TokenTypes.TokenDataId;
};

export type SaleType = {
  tokenDataId: TokenTypes.TokenDataId;
  price: number;
};

const listNFTPayload = (tokenDataId: TokenTypes.TokenDataId, price: number) => {
  const payload: Types.EntryFunctionPayload = {
    function: `${SALE_ADDRESS}::create_sale`,
    type_arguments: ["0x1::aptos_coin::AptosCoin"], // coin type to sell
    arguments: [
      tokenDataId.creator, // creators_address: address,
      tokenDataId.collection, // collection: String,
      tokenDataId.name, // name: String,
      0, // property_version: u64,
      1, // token_amount: u64, 1 for nft
      price, // price per token: u64,
      0, // locked_until_secs: u64 (0 for nolock)
    ],
  };
  return payload;
};

const delistNFTPayload = (tokenDataId: TokenTypes.TokenDataId) => {
  const payload: Types.EntryFunctionPayload = {
    function: `${SALE_ADDRESS}::cancel_sale`,
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

const updateNFTPricePayload = (tokenDataId: TokenTypes.TokenDataId, newPrice: number) => {
  const payload: Types.EntryFunctionPayload = {
    function: `${SALE_ADDRESS}::edit_price`,
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

const buyNFTPayload = (sellerAddress: string, tokenDataId: TokenTypes.TokenDataId) => {
  const payload: Types.EntryFunctionPayload = {
    function: `${SALE_ADDRESS}::make_order`,
    type_arguments: ["0x1::aptos_coin::AptosCoin"],
    arguments: [
      sellerAddress, // token_seller: address,
      tokenDataId.creator, // creators_address: address,
      tokenDataId.collection, // collection: String,
      tokenDataId.name, // name: String,
      0, //  property_version: u64,
      1, // token_amount: u64,
    ],
  };
  return payload;
};

export const buyBulkNFTPayload = (orders: OrderType[]) => {
  const payload: Types.EntryFunctionPayload = {
    function: `${SALE_ADDRESS}::make_bulk_order`,
    type_arguments: ["0x1::aptos_coin::AptosCoin"],
    arguments: [
      orders.map((o) => o.sellerAddress),
      orders.map((o) => o.tokenDataId.creator),
      orders.map((o) => o.tokenDataId.collection),
      orders.map((o) => o.tokenDataId.name),
      orders.map(() => 0),
      orders.map(() => 1),
    ],
  };
  return payload;
};

export const listBulkNFTPayload = (sales: SaleType[]) => {
  const payload: Types.EntryFunctionPayload = {
    function: `${SALE_ADDRESS}::create_bulk_sale`,
    type_arguments: ["0x1::aptos_coin::AptosCoin"],
    arguments: [
      sales.map((o) => o.tokenDataId.creator),
      sales.map((o) => o.tokenDataId.collection),
      sales.map((o) => o.tokenDataId.name),
      sales.map(() => 0),
      sales.map(() => 1),
      sales.map((o) => o.price),
      sales.map(() => 0),
    ],
  };
  return payload;
};

export default {
  listNFTPayload,
  delistNFTPayload,
  updateNFTPricePayload,
  buyNFTPayload,
  buyBulkNFTPayload,
  listBulkNFTPayload,
};
