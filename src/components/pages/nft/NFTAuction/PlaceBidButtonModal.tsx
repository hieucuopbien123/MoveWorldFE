import AuctionContract from "@/move_services/utils/AuctionContract";
import { numberWithCommas } from "@/utils/format";
import React, { useState } from "react";
import { useAppContext } from "@/store";
import { errorTopCenter, infoTopCenter, successTopCenter, waitingInfo } from "@/utils/toastutils";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
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
} from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";

const PlaceBidButtonModal = ({ item, loading, setLoading, isOpen, onClose }: any) => {
  const { showAvatar, callEveryComponentFetchData, fetchBalance } = useAppContext();
  const toastIdRef: any = React.useRef(null);
  const toast = useToast();
  const { signAndSubmitTransaction } = useWallet();
  const [cost, setCost] = useState(1);
  const isError =
    Number(cost) <= 0.0 ||
    Number.isNaN(cost) ||
    Number(cost) <= Number((item.auctionCurrentBidPrice * 105) / 100) ||
    Number(cost) <= Number((item.auctionOfferPrice * 105) / 100);
  const placeBid = async () => {
    setLoading(true);
    const _cost = Math.floor(Number(cost) * Math.pow(10, 8));
    try {
      if (!showAvatar) {
        throw new Error("Please connect your wallet first! ");
      }
      toastIdRef.current = toast(infoTopCenter("Waiting..."));
      await AuctionContract.placeBid({
        sellerAddress: item.auctionSeller,
        tokenData: {
          creator: item.creator,
          collection: item.collectionid,
          name: item.name,
        },
        price: _cost,
        signAndSubmitTransaction,
        toast,
        toastIdRef,
      });
      toast(successTopCenter("Place Bid sucessfully"));
      callEveryComponentFetchData();
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
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Place Bid</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box pt={5}></Box>
            <FormControl isInvalid={isError}>
              <NumberInput defaultValue={1} min={0.01} focusBorderColor="teal.300">
                <InputGroup>
                  <NumberInputField
                    value={cost}
                    onChange={(e) => setCost(parseFloat(e.target.value))}
                    paddingRight="40px"
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
                  <Text fontSize={"small"}>Must greater 105% of current bid</Text>
                </FormErrorMessage>
              )}
              {}
            </FormControl>
            <Box pt={4}></Box>
            {/* <Box display={"flex"} justifyContent="space-between">
              <Text fontSize={"small"}>Transaction Fee</Text>
              <Text fontSize={"small"}>
                {"5%"}
              </Text>
            </Box>
            <Box display={"flex"} justifyContent="space-between">
              <Text fontSize={"small"}>Royalties Fee&nbsp;</Text>
              <Text fontSize={"small"}>
                {numberWithCommas(item.royalitiesFee, 2)}%
              </Text>
            </Box> */}
            <Box display={"flex"} justifyContent="space-between">
              <Text fontSize={"small"}>Bidder to bidder 5%</Text>
              <Text fontSize={"small"}>
                {"≈"}
                {numberWithCommas((Number(cost) * 5) / 100)}
              </Text>
            </Box>
            <Box pt={2}></Box>
            <Divider></Divider>
            <Box pt={2}></Box>
            <Box display={"flex"} justifyContent="space-between">
              <Text fontSize={"small"}>You will bid</Text>
              <Text fontSize={"small"}>
                {"≈"}
                {numberWithCommas(Number(cost))} APT
              </Text>
            </Box>
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
              onClick={placeBid}
              disabled={Boolean(isError) || loading}
            >
              {loading ? <BeatLoader size={8} color="white" /> : "Confirm"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default PlaceBidButtonModal;
