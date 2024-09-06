import { useAppContext } from "@/store";
import { Box, Switch, Text } from "@chakra-ui/react";
import React from "react";

const NotificationSettings = () => {
  const { disableNotis, setDisableNotis } = useAppContext();
  const toggleNoti = (noti: any) => {
    localStorage.setItem("disnotis", noti);
    setDisableNotis(noti);
  };
  return (
    <>
      <Text fontSize={"1.3rem"} fontWeight="bold" paddingBottom={"5px"}>
        Information settings
      </Text>
      <Box py={2}></Box>
      <Box display="flex" gap="20px" alignItems={"center"}>
        <Text>Disable notification</Text>
        <Switch
          onChange={() => toggleNoti(!disableNotis)}
          isChecked={disableNotis}
          size="lg"
          colorScheme="green"
        />
      </Box>
    </>
  );
};

export default NotificationSettings;
