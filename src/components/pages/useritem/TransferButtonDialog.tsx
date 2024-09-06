import {
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import React, { useState } from "react";
import { errorTopCenter, infoTopCenter, successTopCenter } from "@/utils/toastutils";
import { useAppContext } from "@/store";
import MoveServices from "@/move_services/utils/MoveServices";
import updateServer from "@/apis/updateServer";
import { BeatLoader } from "react-spinners";

const TransferButtonDialog = ({
  name,
  id,
  creator,
  collection,
  removeNFTById,
  loading,
  setLoading,
  fetchData,
  setID,
  onClose,
  isOpen,
}: any) => {
  const [addressToTransfer, setAddressToTransfer] = useState("");
  const initialRef = React.useRef(null);

  const { signAndSubmitTransaction } = useWallet();
  const { showAvatar } = useAppContext();
  const { fetchBalance } = useAppContext();
  const toastIdRef: any = React.useRef();

  const toast = useToast();

  const transferToken = async () => {
    setLoading(true);
    try {
      if (!showAvatar) {
        throw new Error("Please connect your wallet first! ");
      }
      if (addressToTransfer.length <= 0) {
        throw new Error("Wrong input");
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
      await MoveServices.offerNFT({
        data: {
          creator,
          collectionName: collection,
          name,
          receiver: addressToTransfer,
        },
        signAndSubmitTransaction,
        toast,
        toastIdRef,
      });
      removeNFTById(id);
      toast(successTopCenter("Transfer token sucessfully"));
      fetchBalance();

      await fetchData();
    } catch (e: any) {
      console.log(e);
      toast(errorTopCenter(e.message ? JSON.stringify(e.message).slice(0, 140) : "Error happen!!"));
    } finally {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      setLoading(false);
      onClose();
    }
  };

  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        isCentered
        blockScrollOnMount={false}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transfer &quot;{name}&quot; to ...</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Receiver address</FormLabel>
              <Input
                value={addressToTransfer}
                onChange={(e) => setAddressToTransfer(e.target.value)}
                ref={initialRef}
                placeholder="Input address"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} disabled={loading} onClick={transferToken}>
              {loading ? <BeatLoader size={8} color="white" /> : "Offer"}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TransferButtonDialog;
