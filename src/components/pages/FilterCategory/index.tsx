import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { addQueryParams } from "@/utils/searchParamsHandler";
import { Select } from "chakra-react-select";
import { Box } from "@chakra-ui/react";

const options = {
  "0": { value: "0", label: "Listed NFTs" },
  "1": { value: "1", label: "Unlisted NFTs" },
  "2": { value: "2", label: "On Auction" },
  "3": { value: "3", label: "All" },
};

const FilterCategory = (props: any) => {
  const router = useRouter();
  const { statusParams } = router.query;

  const setFilterParams = (e: any) => {
    addQueryParams(router, "statusParams", e.value);
  };
  useEffect(() => {
    if (!statusParams) addQueryParams(router, "statusParams", 0);
  }, []);

  return (
    <Box maxW={"300px"} {...props} minWidth="160px">
      <Select
        value={
          statusParams == "0" || statusParams == "1" || statusParams == "2" || statusParams == "3"
            ? options[statusParams]
            : options[0]
        }
        placeholder="Types of NFTs"
        useBasicStyles
        autoFocus={false}
        options={[
          { value: "0", label: "Listed NFTs" },
          { value: "1", label: "Unlisted NFTs" },
          { value: "2", label: "On Auction" },
          { value: "3", label: "All NFTs" },
        ]}
        onChange={setFilterParams}
        chakraStyles={{
          container: (provided) => ({
            ...provided,
            borderColor: "1px solid gray",
            maxW: "180px",
          }),
          placeholder: (defaultStyles) => {
            return {
              ...defaultStyles,
              color: "text",
            };
          },
          control: (provided, state) => ({
            ...provided,
            borderWidth: state.isFocused ? "2px !important" : "",
            border: state.isFocused ? "1px solid #3cc9c9 !important" : "1px solid gray !important",
            boxShadow: "none !important",
          }),
          menuList: (provided) => ({
            ...provided,
            padding: "5px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }),
          option: (provided, state) => ({
            ...provided,
            borderRadius: "10px",
            backgroundColor: state.isSelected ? "#3cc9c9" : "",
          }),
        }}
      />
    </Box>
  );
};

export default FilterCategory;
