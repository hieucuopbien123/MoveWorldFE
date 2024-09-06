import React, { useState, useCallback } from "react";
import { InputGroup, InputLeftElement, Input, useDisclosure } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import debounce from "lodash/debounce";
import { clientAxios } from "@/utils/axiosConfig";
import dynamic from "next/dynamic";

const DynamicSearchGlobalContent = dynamic(() => import("./SearchGlobalContent"));

const SearchGlobal = () => {
  const [textSearch, setTextSearch] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [collectionData, setCollectionData] = useState<any>([]);
  const [nftData, setNFTData] = useState([]);
  const [userData, setUserData] = useState([]);

  const fetchData = async (data: any) => {
    try {
      const fetchData = data || "a";
      const response = await Promise.all([
        clientAxios.get(`/v1/collection?search=${fetchData}`),
        clientAxios.get(`/v1/nft?search=${fetchData}`),
        clientAxios.get(`/v1/user/profile/public?search=${fetchData}`),
      ]);
      if (response[0].data?.data) {
        setCollectionData(response[0].data?.data);
      } else {
        setCollectionData([]);
      }
      if (response[1].data?.data) {
        setNFTData(response[1].data?.data);
      } else {
        setNFTData([]);
      }
      if (response[2].data?.data) {
        setUserData(response[2].data?.data);
      } else {
        setUserData([]);
      }
    } catch (e) {
      console.log(e);
      setUserData([]);
      setCollectionData([]);
      setNFTData([]);
    } finally {
      setLoading(false);
    }
  };

  const debounceFetchData = useCallback(debounce(fetchData, 600), []);
  const handleChangeText = (e: any) => {
    setLoading(true);
    setTextSearch(e.target.value);
    debounceFetchData(e.target.value);
  };

  return (
    <>
      <InputGroup size="md" borderColor="primary" maxW="400px">
        <InputLeftElement pointerEvents="none" height="100%">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          type="tel"
          border={"2px solid #10a3a3"}
          height="50px"
          placeholder="Search here"
          value={textSearch}
          onChange={(e) => handleChangeText(e)}
          onFocus={() => {
            onOpen();
            if (nftData.length == 0 && collectionData.length == 0 && userData.length == 0) {
              setLoading(true);
              debounceFetchData(textSearch);
            }
          }}
          onBlur={() => onClose()}
        />
      </InputGroup>
      {isOpen && (
        <DynamicSearchGlobalContent {...{ loading, isOpen, collectionData, nftData, userData }} />
      )}
    </>
  );
};
export default SearchGlobal;
