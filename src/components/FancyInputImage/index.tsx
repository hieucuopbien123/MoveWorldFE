import { Box, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import { IoMdImage } from "react-icons/io";
import { useColorMode } from "@chakra-ui/color-mode";

const FancyInputImage = ({ title, required, description, onImageChange, logo, ...props }: any) => {
  const { colorMode } = useColorMode();

  return (
    <FormControl>
      {title && (
        <FormLabel margin={0}>
          {title}
          {required && <span style={{ color: "#fc8181" }}>*</span>}
        </FormLabel>
      )}
      {description && (
        <Text fontSize={"small"} color={"text"}>
          {description}
        </Text>
      )}
      <Box py={1}></Box>
      <Input accept="image/*" hidden type="file" onChange={onImageChange} />
      <Box>
        <Box>
          <FormLabel
            border="5px dashed"
            borderColor="bright"
            borderRadius={"5px"}
            position="relative"
            {...props}
          >
            {logo && (
              <Image
                width="0"
                height="0"
                sizes="100vw"
                alt="logo"
                style={{
                  borderRadius: "5px",
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
                src={logo}
              />
            )}
            {!logo && (
              <Box
                borderRadius={"5px"}
                _hover={{
                  bgColor: "rgba(0, 0, 0, 0.5)",
                  filter: "brightness(50%)",
                }}
                display={"flex"}
                alignItems="center"
                justifyContent={"center"}
                width="100%"
                height="100%"
              >
                <Box width="50%" height={"50%"}>
                  <IoMdImage color={colorMode == "dark" ? "" : "gray"} size={"large"} />
                </Box>
              </Box>
            )}
          </FormLabel>
        </Box>
      </Box>
    </FormControl>
  );
};

export default FancyInputImage;
