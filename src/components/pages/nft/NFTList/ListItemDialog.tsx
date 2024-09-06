import {
  Box,
  Button,
  Divider,
  Text,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  NumberInput,
  InputGroup,
  NumberInputField,
  InputRightElement,
  FormErrorMessage,
  ModalFooter,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { numberWithCommas } from "@/utils/format";
import { useAppContext } from "@/store";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { errorTopCenter, infoTopCenter, successTopCenter, waitingInfo } from "@/utils/toastutils";
import SaleContract from "@/move_services/utils/SaleContract";
import { BeatLoader } from "react-spinners";

const ListItemDialog = ({ item, loading, setLoading, setStatus, onClose, isOpen }: any) => {
  const { showAvatar, callEveryComponentFetchData, fetchBalance } = useAppContext();
  const toastIdRef: any = React.useRef(null);
  const toast = useToast();
  const { signAndSubmitTransaction } = useWallet();
  const [cost, setCost] = useState(1);
  const isError = Number(cost) <= 0.0 || Number.isNaN(cost);

  const quickSell = async () => {
    setLoading(true);
    const _cost = Number(cost) * Math.pow(10, 8);
    try {
      if (!showAvatar) {
        throw new Error("Please connect your wallet first! ");
      }
      toastIdRef.current = toast(infoTopCenter("Waiting..."));
      await SaleContract.listNFT({
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
      toast(successTopCenter("List sucessfully"));
      callEveryComponentFetchData();
      setStatus(0);
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
          <ModalHeader>Set Price</ModalHeader>
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
                  <Text fontSize={"small"}>Must greater than 0 and not blank</Text>
                </FormErrorMessage>
              )}
              {}
            </FormControl>
            <Box pt={4}></Box>
            <Box display={"flex"} justifyContent="space-between">
              <Text fontSize={"small"}>Transaction Fee 5%</Text>
              <Text fontSize={"small"}>
                {"≈"}
                {numberWithCommas((Number(cost) * 5) / 100)}
              </Text>
            </Box>
            <Box display={"flex"} justifyContent="space-between">
              <Text fontSize={"small"}>
                Royalties Fee {numberWithCommas(item.royalitiesFee, 2)}%
              </Text>
              <Text fontSize={"small"}>
                {"≈"}
                {numberWithCommas((Number(cost) * Number(item.royalitiesFee)) / 100)}
              </Text>
            </Box>
            <Box pt={2}></Box>
            <Divider></Divider>
            <Box pt={2}></Box>
            <Box display={"flex"} justifyContent="space-between">
              <Text fontSize={"small"}>You will receive</Text>
              <Text fontSize={"small"}>
                {"≈"}
                {numberWithCommas(
                  Number(cost) -
                    (Number(cost) * 5) / 100 -
                    (Number(cost) * Number(item.royalitiesFee)) / 100
                )}
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
              onClick={quickSell}
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

export default ListItemDialog;
