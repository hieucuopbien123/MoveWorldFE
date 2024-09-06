import { numberWithCommas } from "@/utils/format";
import AuctionContract from "@/move_services/utils/AuctionContract";
import {
  Box,
  Button,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  ModalBody,
  FormControl,
  Divider,
  NumberInput,
  NumberInputField,
  InputRightElement,
  InputGroup,
  FormErrorMessage,
  Select,
} from "@chakra-ui/react";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import React, { useState } from "react";
import { useAppContext } from "@/store";
import { errorTopCenter, infoTopCenter, successTopCenter, waitingInfo } from "@/utils/toastutils";
import { BeatLoader } from "react-spinners";

const AuctionListDialog = ({ item, loading, setLoading, setStatus, onClose, isOpen }: any) => {
  const initialRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const { showAvatar, callEveryComponentFetchData, fetchBalance } = useAppContext();

  const [cost, setCost] = useState(1);
  const [time, setTime] = useState(1);
  const [timeUnit, setTimeUnit] = useState(3600);

  const isError = Number(cost) <= 0.0 || Number.isNaN(cost);
  const isTimeError = timeUnit * time > 7 * 24 * 3600;
  const toastIdRef: any = React.useRef(null);
  const toast = useToast();
  const { signAndSubmitTransaction } = useWallet();
  const createAuction = async () => {
    setLoading(true);
    const _cost = Math.floor(Number(cost) * Math.pow(10, 8));
    const safeExtraTime = 30 * 1000;
    const start = new Date(new Date().getTime() + safeExtraTime);
    const end = new Date(Math.floor(new Date().getTime() + safeExtraTime + timeUnit * time * 1000));
    try {
      if (!showAvatar) {
        throw new Error("Please connect your wallet first! ");
      }
      toastIdRef.current = toast(infoTopCenter("Waiting..."));
      await AuctionContract.createAuction({
        tokenData: {
          creator: item.creator,
          collection: item.collectionid,
          name: item.name,
        },
        price: _cost,
        start,
        end,
        signAndSubmitTransaction,
        toast,
        toastIdRef,
      });
      toast(successTopCenter("Auction sucessfully"));
      callEveryComponentFetchData();
      setStatus(2);
      fetchBalance();

      setTimeout(() => {
        setLoading(false);
      }, 10000);
      toast(waitingInfo("Waiting for data to update"));
    } catch (e: any) {
      console.log(e);
      toast(errorTopCenter(e.message ? JSON.stringify(e.message).slice(0, 140) : "Error happen!!"));
      setLoading(false);
    } finally {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      onClose();
    }
  };

  return (
    <>
      <Modal
        size={["xs", "md"]}
        isOpen={isOpen}
        onClose={onClose}
        blockScrollOnMount={false}
        initialFocusRef={initialRef}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Auction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box pt={0}></Box>
            <Text fontSize={"small"}>Starting price</Text>
            <Box pt={1}></Box>
            <FormControl isInvalid={isError}>
              <NumberInput defaultValue={1} min={0.01} focusBorderColor="teal.300">
                <InputGroup>
                  <NumberInputField
                    value={cost}
                    onChange={(e) => setCost(parseFloat(e.target.value))}
                    paddingRight="40px"
                    ref={initialRef}
                  ></NumberInputField>
                  <InputRightElement>
                    <Text fontSize={"small"} paddingRight={2}>
                      APT
                    </Text>
                  </InputRightElement>
                </InputGroup>
              </NumberInput>
              {isError && (
                <FormErrorMessage>
                  <Text fontSize={"small"}>Must greater than 0 and not blank</Text>
                </FormErrorMessage>
              )}
              {}
            </FormControl>
            <Box pt={3}></Box>
            <Text fontSize={"small"}>Expires after</Text>
            <Box pt={1}></Box>
            <FormControl isInvalid={isTimeError}>
              <Box display={"flex"}>
                <Box flex={2} marginRight={"20px"}>
                  <NumberInput defaultValue={1} min={1} focusBorderColor="teal.300">
                    <NumberInputField
                      value={time}
                      onChange={(e) => setTime(parseFloat(e.target.value))}
                      paddingRight="40px"
                    ></NumberInputField>
                  </NumberInput>
                </Box>
                <Box flex={1}>
                  <Select
                    defaultValue={3600}
                    onChange={(e) => setTimeUnit(parseInt(e.target.value))}
                    focusBorderColor="teal.300"
                  >
                    <option value={60}>Mins</option>
                    <option value={3600}>Hours</option>
                    <option value={3600 * 24}>Days</option>
                  </Select>
                </Box>
              </Box>
              {isTimeError && (
                <FormErrorMessage>
                  <Text fontSize={"small"}>
                    The auction duration must not be greater than 7 days
                  </Text>
                </FormErrorMessage>
              )}
              {}
            </FormControl>
            <FormControl>
              {/* <Box pt={2}></Box>
                  <Text fontSize={"small"}>Start at</Text>
                  <Input 
                        placeholder="Select Date and Time"
                          size="md"
                          type="datetime-local"
                          focusBorderColor="teal.300"
                          onChange={(e)=>setStartTimeValue(e.target.value)
                          }
                          defaultValue={new Date().toISOString().slice(0, 16) 
                          }
                          min={new Date().toISOString().slice(0, 16)}
                          > 
                  </Input>
                  <Box pt={2}></Box>
                  <Text fontSize={"small"}>End at</Text>
                  <Input placeholder="Select Date and Time"
                          size="md"
                          type="datetime-local"
                          focusBorderColor="teal.300"
                          onChange={(e)=>setStartTimeValue(e.target.value)
                          }
                          defaultValue={new Date(new Date().getTime()+3600*1000).toISOString().slice(0, 16)}
                          min={new Date(new Date().getTime()+3600*1000).toISOString().slice(0, 16)}
                          max={new Date(new Date().getTime()+3600*7*24*1000).toISOString().slice(0, 16)}
                  > 
                  </Input> */}
            </FormControl>
            <Box pt={4}></Box>
            <Box display={"flex"} justifyContent="space-between">
              <Text fontSize={"small"}>Transaction Fee</Text>
              <Text fontSize={"small"}>{"5%"}</Text>
            </Box>
            <Box display={"flex"} justifyContent="space-between">
              <Text fontSize={"small"}>Royalties Fee&nbsp;</Text>
              <Text fontSize={"small"}>{numberWithCommas(item.royalitiesFee, 2)}%</Text>
            </Box>
            <Box display={"flex"} justifyContent="space-between">
              <Text fontSize={"small"}>Bidder to bidder</Text>
              <Text fontSize={"small"}>{"5%"}</Text>
            </Box>
            <Box pt={2}></Box>
            <Divider></Divider>
            <Box pt={2}></Box>
            {/* <Box display={"flex"} justifyContent="space-between">
              <Text fontSize={"small"}>You will receive</Text>
              <Text fontSize={"small"}>
                {"≈"}
                {numberWithCommas(Number(cost) - (Number(cost) * 10) / 100 - (Number(cost) * Number(item.royalitiesFee)) / 100)}
              </Text>
            </Box> */}
          </ModalBody>

          <ModalFooter>
            <Button size={"sm"} variant="outline" mr={3} onClick={onClose} borderRadius="20px">
              Cancel
            </Button>
            <Button
              size={"sm"}
              bg="primary"
              _hover={{ backgroundColor: "#179b9b", opacity: 0.8 }}
              borderRadius="20px"
              onClick={createAuction}
              disabled={Boolean(isError) || Boolean(isTimeError) || loading}
            >
              {loading ? <BeatLoader size={8} color="white" /> : "Confirm"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default AuctionListDialog;
