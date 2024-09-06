import { clientAxios } from "@/utils/axiosConfig";

const INDEXER = "https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql";

const getAllNFT = async (walletAddress: any) => {
  let data = null;

  data = JSON.stringify({
    query: `query getAccountCurrentTokens($address: String) {
      current_token_ownerships(
        where: {owner_address: {_eq: $address}, amount: {_gt: 0}}
        order_by: [{last_transaction_version: desc}, {creator_address: asc}, {collection_name: asc}, {name: asc}]
      ) {
        amount
        current_token_data {
          ...TokenDataFields
        }
        current_collection_data {
          ...CollectionDataFields
        }
        property_version
        token_properties
      }
    }
    
    fragment TokenDataFields on current_token_datas {
      creator_address
      collection_name
      description
      metadata_uri
      name
    }
    fragment CollectionDataFields on current_collection_datas {
      metadata_uri
      supply
      description
      collection_name
      collection_data_id_hash
      creator_address
    }`,
    variables: { address: walletAddress },
  });
  try{
    const json = await clientAxios.post(INDEXER, data).catch((error) => error.response);
    return json;
  } catch(e){
    console.log(e);
    return {};
  }
};

export default getAllNFT;
