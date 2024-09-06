import { numberWithCommas } from "@/utils/format";
import SaleContract from "@/move_services/utils/SaleContract";
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
  NumberInput,
  NumberInputField,
  InputRightElement,
  InputGroup,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import React, { useState } from "react";
import { errorTopCenter, infoTopCenter, successTopCenter } from "@/utils/toastutils";
import { useAppContext } from "@/store";
import updateServer from "@/apis/updateServer";
import { BeatLoader } from "react-spinners";

const SellCard2Dialog = ({
  name,
  creator,
  collection,
  removeNFTById,
  fetchData,
  onClose,
  isOpen,
  id,
  setID,
  loading,
  setLoading,
}: any) => {
  const toastIdRef: any = React.useRef();
  const { signAndSubmitTransaction } = useWallet();
  const { showAvatar } = useAppContext();
  const { fetchBalance } = useAppContext();

  const toast = useToast();
  const [cost, setCost] = useState(1);
  const isError = Number(cost) <= 0.0 || Number.isNaN(cost);

  const quickSell = async () => {
    setLoading(true);
    const _cost = Math.floor(Number(cost) * Math.pow(10, 8));
    try {
      if (!showAvatar) {
        throw new Error("Please connect your wallet first! ");
      }
      if (!id) {
        toastIdRef.current = toast(infoTopCenter("Waiting connect to server..."));
        const response = await updateServer({ name, creator, collectionName: collection });
        if (toastIdRef.current) {
          toast.close(toastIdRef.current);
        }
        setID(response.id);
      }
      toastIdRef.current = toast(infoTopCenter("Waiting..."));
      await SaleContract.listNFT({
        tokenData: {
          creator,
          collection,
          name,
        },
        price: _cost,
        signAndSubmitTransaction,
        toast,
        toastIdRef,
      });
      removeNFTById(id);
      onClose();
      toast(successTopCenter("List sucessfully"));
      await fetchData();
      fetchBalance();

      setLoading(false);
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
                {numberWithCommas((Number(cost) * 2) / 100)}
              </Text>
            </Box>
            <Box pt={2}></Box>
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

export default SellCard2Dialog;
