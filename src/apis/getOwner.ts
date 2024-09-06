import { clientAxios } from "@/utils/axiosConfig";

const INDEXER = "https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql";

// Dùng axios query graphql
const getOwnerOfNFT = async (collectionName: any, creator: any, nftName: any) => {
  let data = null;

  data = JSON.stringify({
    query: `query MyQuery($collectionName : String,$creator :String ,$nftName :String) {
      token_ownerships(
        where: {collection_name: {_eq: $collectionName}, creator_address: {_eq: $creator}, name: {_eq: $nftName}, amount: {_gt: "0"}}
        order_by: {transaction_timestamp: desc}
        limit : 1
      ) {
        owner_address
      }
    }
    `,
    variables: {
      collectionName: collectionName,
      creator: creator,
      nftName: nftName,
    },
  });
  try{
    const json = await clientAxios.post(INDEXER, data).catch((error: any) => error.response);
    return json.data.data.token_ownerships[0]?.owner_address;
  } catch(e){
    console.log(e);
  }
};

export default getOwnerOfNFT;
