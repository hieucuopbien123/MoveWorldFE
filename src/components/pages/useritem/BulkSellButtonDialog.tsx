import { numberWithCommas } from "@/utils/format";
import {
  Box,
  Button,
  Text,
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
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import updateServer from "@/apis/updateServer";
import { errorTopCenter, fastSuccessTopCenter, infoTopCenter } from "@/utils/toastutils";
import { BeatLoader } from "react-spinners";

const BulkSellButtonDialog = ({
  name,
  image,
  id,
  creator,
  collection,
  seller,
  cartItems,
  setCartItems,
  removeNFTById,
  setID,
  onClose,
  isOpen,
  isInCart,
}: any) => {
  const [cost, setCost] = useState(1);
  const isError = Number(cost) <= 0.0 || Number.isNaN(cost);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const toastIdRef: any = React.useRef();

  const addToCart = async () => {
    if (isInCart) {
      removeNFTById(id);
    } else {
      try {
        setLoading(true);
        let tempID = id;
        if (!id) {
          toastIdRef.current = toast(infoTopCenter("Waiting connect to server..."));
          const response = await updateServer({ name, creator, collectionName: collection });
          if (toastIdRef.current) {
            toast.close(toastIdRef.current);
          }
          setID(response.id);
          tempID = response.id;
          toast(fastSuccessTopCenter("Item added!"));
        }
        setCartItems([
          ...cartItems,
          {
            id: tempID,
            name,
            image,
            price: cost,
            creator,
            collection,
            seller,
          },
        ]);
      } catch (e: any) {
        console.log(e);
        toast(
          errorTopCenter(
            e?.message ? JSON.stringify(e.message).slice(0, 140) : "Cannot fetch this NFT!"
          )
        );
      } finally {
        setLoading(false);
      }
    }
    onClose();
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
              onClick={addToCart}
              disabled={Boolean(isError) || loading}
            >
              {loading ? <BeatLoader size={8} color="white" /> : "Add to cart"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BulkSellButtonDialog;
