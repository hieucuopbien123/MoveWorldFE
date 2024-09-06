import { clientAxios } from "@/utils/axiosConfig";

const INDEXER = "https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql";

const getCurentTokensPendingClaim = async (address: any) => {
  let data = null;

  data = JSON.stringify({
    query: `
    query MyQuery($address: String)
      {
      current_token_pending_claims(
        where: {to_address: {_eq: $address}, amount: {_gt: "0"}}
        order_by: {last_transaction_timestamp: desc}) { 
        ...CurrentTokenPendingClaims
        }
      }
      fragment CurrentTokenPendingClaims on current_token_pending_claims {
        amount
        from_address
        to_address
        current_token_data {
          ...TokenDataFields  
        }
        current_collection_data {
          ...CollectionDataFields 
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
        description
        collection_name
        creator_address
      }
    `,
    variables: {
      address: address,
    },
  });
  try{
    const json = await clientAxios.post(INDEXER, data).catch((error) => error.response);
    return json; 
  } catch(e){
    console.log(e);
    return {};
  }
};

export default getCurentTokensPendingClaim;
