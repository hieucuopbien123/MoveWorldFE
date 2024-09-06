import {
  Box,
  Text,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  Spinner,
  Tab,
  TabList,
  Tabs,
  TabPanels,
  TabPanel,
  PopoverCloseButton,
} from "@chakra-ui/react";
import React from "react";
import { CloseIcon } from "@chakra-ui/icons";
import { useAppContext } from "@/store";
import ItemNoti from "./ItemNoti";

const NotificationConent = ({ isLoading, isError, data }: any) => {
  const { showAvatar, disableNotis, setDisableNotis } = useAppContext();

  return (
    <PopoverContent
      border={"none"}
      boxShadow={"rgb(0 0 0 / 35%) 0px 0px 10px"}
      minWidth="390px"
      padding="5px"
    >
      <PopoverHeader fontSize="x-large" fontWeight="bold" boxSizing="border-box">
        <Text>Notifications</Text>
        <PopoverCloseButton size={"normal"} pt="10px" />
      </PopoverHeader>
      {!showAvatar ? (
        <>
          <Text padding={"10px"} textAlign="center" color={"text"}>
            No notis
          </Text>
        </>
      ) : isError ? (
        <Box textAlign="center" py={2}>
          <CloseIcon color="red" />
          <Text color="red">Error fetching data</Text>
        </Box>
      ) : (
        <PopoverBody
          maxHeight="calc(90vh - 130px)"
          overflowY="auto"
          px="0px !important"
          display="flex"
          flexDir={"column"}
          gap="5px"
          sx={{
            "&::-webkit-scrollbar-track": {
              backgroundColor: "background",
            },
            "&::-webkit-scrollbar": {
              width: "5px",
            },
            "&::-webkit-scrollbar-thumb": {
              borderRadius: "10px",
              backgroundColor: "primary",
            },
          }}
        >
          {disableNotis && (
            <Tabs variant="soft-rounded" isFitted>
              <TabList>
                <Tab>All {data && <span>&nbsp;({data?.all.length})</span>}</Tab>
                <Tab>Unread {data && <span>&nbsp;({data?.unread.length})</span>}</Tab>
              </TabList>
              <TabPanels>
                <TabPanel px={0}>
                  {
                    <Text
                      padding={"10px"}
                      textAlign="center"
                      color={"text"}
                      onClick={() => {
                        localStorage.setItem("disnotis", "false");
                        setDisableNotis(false);
                      }}
                      cursor="pointer"
                      sx={{
                        "&:hover": {
                          opacity: 0.7,
                        },
                      }}
                    >
                      Click to enable notifications
                    </Text>
                  }
                </TabPanel>
                <TabPanel px={0}>
                  {
                    <Text
                      padding={"10px"}
                      textAlign="center"
                      color={"text"}
                      onClick={() => {
                        localStorage.setItem("disnotis", "false");
                        setDisableNotis(false);
                      }}
                      cursor="pointer"
                      sx={{
                        "&:hover": {
                          opacity: 0.7,
                        },
                      }}
                    >
                      Click to enable notifications
                    </Text>
                  }
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
          {!disableNotis && isLoading && (
            <Tabs variant="soft-rounded" isFitted>
              <TabList>
                <Tab>All {data && <span>&nbsp;({0})</span>}</Tab>
                <Tab>Unread {data && <span>&nbsp;({0})</span>}</Tab>
              </TabList>
              <TabPanels>
                <TabPanel px={0}>
                  <Box textAlign={"center"}>
                    <Spinner color="primary" thickness="4px" size={"lg"} />
                  </Box>
                </TabPanel>
                <TabPanel px={0}>
                  <Box textAlign={"center"}>
                    <Spinner color="primary" thickness="4px" size={"lg"} />
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
          {!disableNotis && !isLoading && ((data as any)?.all?.length || 0) <= 0 && (
            <Tabs variant="soft-rounded" isFitted>
              <TabList>
                <Tab>All {data && <span>&nbsp;({data?.all.length})</span>}</Tab>
                <Tab>Unread {data && <span>&nbsp;({data?.unread.length})</span>}</Tab>
              </TabList>
              <TabPanels>
                <TabPanel px={0} pb={0}>
                  <Text padding={"10px"} textAlign="center" color={"text"}>
                    No notis
                  </Text>
                </TabPanel>
                <TabPanel px={0} pb={0}>
                  <Text padding={"10px"} textAlign="center" color={"text"}>
                    No notis
                  </Text>
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
          {!disableNotis && !isLoading && ((data as any)?.all?.length || 0) > 0 && (
            <Tabs variant="soft-rounded" isFitted>
              <TabList>
                <Tab>All {data && <span>&nbsp;({data?.all.length})</span>}</Tab>
                <Tab>Unread {data && <span>&nbsp;({data?.unread.length})</span>}</Tab>
              </TabList>
              <TabPanels>
                <TabPanel px={0} pb={0}>
                  {(data as any).all.map((noti: any, i: number) => (
                    <ItemNoti key={i} noti={noti} />
                  ))}
                </TabPanel>
                <TabPanel px={0} pb={0}>
                  {(data as any).unread.length <= 0 && (
                    <Text padding={"10px"} textAlign="center" color={"text"}>
                      No notis
                    </Text>
                  )}
                  {(data as any).unread.map((noti: any, i: number) => (
                    <ItemNoti key={i} noti={noti} />
                  ))}
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
        </PopoverBody>
      )}
    </PopoverContent>
  );
};

export default NotificationConent;
