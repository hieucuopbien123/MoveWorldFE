import { clientAxios } from "@/utils/axiosConfig";

const updateServer = async ({ name, creator, collectionName }: any) => {
  try{
    await clientAxios.post("/v1/collection/requestInfo", {
      name: collectionName,
      creator,
    });
  
    const response = await clientAxios.post("/v1/nft/requestInfo", {
      name,
      creator,
      collectionName,
    });
  
    const nftData = {
      id: response.data.data.id,
    };
    return nftData;
  } catch(e){
    return {
      id: "0001"
    }
  }
};

export default updateServer;
