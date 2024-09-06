import { Box, IconButton, Popover, PopoverTrigger, Button } from "@chakra-ui/react";
import React from "react";
import { BellIcon } from "@chakra-ui/icons";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import getConnectedInstance from "@/utils/axiosConfig";
import { useAppContext } from "@/store";
import { useNotification } from "@/apis/notification";
import dynamic from "next/dynamic";

const DynamicNotificationContent = dynamic(() => import("./NotificationContent"));

const Notification = () => {
  const { account, signMessage } = useWallet();
  const { showAvatar, disableNotis } = useAppContext();

  const { data, isLoading, isError, refetch } = useNotification({
    account,
    showAvatar,
    disableNotis,
    signMessage,
  });

  const markReadAll = async () => {
    const accessToken = localStorage.getItem("AccessToken");
    try {
      if (accessToken && accessToken != "undefined" && ((data as any)?.unread?.length || 0) > 0) {
        await getConnectedInstance(account, signMessage, accessToken).post(
          "/v1/user/notification/markAll"
        );
        refetch();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Popover placement="bottom-start" onClose={markReadAll} closeOnBlur={false}>
      {({ isOpen, onClose }) => (
        <>
          <PopoverTrigger>
            <Box position="relative">
              <IconButton
                aria-label="Notification"
                borderColor={"divider"}
                borderRadius="50%"
                variant={"outline"}
              >
                <BellIcon boxSize={"1em"} />
              </IconButton>
              {(data?.lengthUnread || 0) > 0 && (
                <Button
                  position={"absolute"}
                  padding={0}
                  borderRadius="50%"
                  size={"xs"}
                  bgColor="primary"
                  right={"-5px"}
                  top="-10px"
                  sx={{
                    "&:hover": {
                      bgColor: "primary",
                    },
                  }}
                >
                  {data?.lengthUnread}
                </Button>
              )}
            </Box>
          </PopoverTrigger>
          {isOpen && (
            <DynamicNotificationContent isLoading={isLoading} isError={isError} data={data} />
          )}
        </>
      )}
    </Popover>
  );
};

export default Notification;
