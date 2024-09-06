import React from "react";
import { useRouter } from "next/router";
import { addQueryParams } from "@/utils/searchParamsHandler";
import { Select } from "chakra-react-select";
import { Box } from "@chakra-ui/react";

const options = {
  low_to_high: { value: "low_to_high", label: "Price low to high" },
  high_to_low: { value: "high_to_low", label: "Price high to low" },
};

const FilterPrice = (props: any) => {
  const router = useRouter();
  const { sortParams } = router.query;

  const setFilterParams = (e: any) => {
    addQueryParams(router, "sortParams", e.value);
  };

  return (
    <Box maxW={"250px"} flexGrow={1} {...props} minWidth="160px">
      <Select
        value={
          sortParams == "high_to_low" || sortParams == "low_to_high"
            ? options[sortParams]
            : undefined
        }
        placeholder="Sort by price"
        useBasicStyles
        autoFocus={false}
        options={[
          {
            label: "Price low to high",
            value: "low_to_high",
          },
          {
            label: "Price high to low",
            value: "high_to_low",
          },
        ]}
        onChange={setFilterParams}
        chakraStyles={{
          container: (provided) => ({
            ...provided,
            borderColor: "1px solid gray",
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

export default FilterPrice;
