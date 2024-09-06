import { Spinner, UseToastOptions } from "@chakra-ui/react";
import { MaybeHexString } from "aptos";
import { IoCheckmarkSharp, IoWarning, IoInformationCircleSharp } from "react-icons/io5";
import { formatAddress } from "./format";

export const successTopCenter = (title: string): UseToastOptions => ({
  title: <p style={{ color: "white", overflow: "hidden" }}>{title}</p>,
  status: "success",
  icon: <IoCheckmarkSharp style={{ color: "white", width: "23px", height: "23px" }} />,
  duration: 1500,
  isClosable: false,
  position: "top",
  variant: "outline",
  containerStyle: {
    backgroundColor: "#38a169",
    borderRadius: "10px",
  },
});

export const fastSuccessTopCenter = (title: string): UseToastOptions => ({
  title: <p style={{ color: "white", overflow: "hidden" }}>{title}</p>,
  status: "success",
  icon: <IoCheckmarkSharp style={{ color: "white", width: "23px", height: "23px" }} />,
  duration: 1000,
  isClosable: false,
  position: "top",
  variant: "outline",
  containerStyle: {
    backgroundColor: "#38a169",
    borderRadius: "10px",
  },
});

export const errorTopCenter = (title: string): UseToastOptions => ({
  title: <p style={{ color: "white", overflow: "hidden" }}>{title}</p>,
  status: "error",
  icon: <IoWarning style={{ color: "white", width: "23px", height: "23px" }} />,
  duration: 3000,
  isClosable: false,
  position: "top",
  variant: "outline",
  containerStyle: {
    backgroundColor: "#e53e3e",
    borderRadius: "10px",
    top: "20px",
  },
});

export const infoTopCenter = (title: string): UseToastOptions => ({
  title: <p style={{ color: "white", overflow: "hidden" }}>{title}</p>,
  status: "info",
  icon: <Spinner style={{ color: "white", width: "20px", height: "20px" }} />,
  duration: 20000,
  isClosable: false,
  position: "top",
  variant: "outline",
  containerStyle: {
    backgroundColor: "#3182ce",
    borderRadius: "10px",
  },
});

export const waitingInfo = (title: string): UseToastOptions => ({
  title: <p style={{ color: "white", overflow: "hidden" }}>{title}</p>,
  status: "info",
  icon: <IoInformationCircleSharp style={{ color: "white", width: "23px", height: "23px" }} />,
  duration: 3000,
  isClosable: false,
  position: "top",
  variant: "outline",
  containerStyle: {
    backgroundColor: "#3182ce",
    borderRadius: "10px",
  },
});

export const transactionPending = (description: string, hash: MaybeHexString): UseToastOptions => ({
  title: <p className="toast_transaction_title">Pending Transaction...</p>,
  description: (
    <>
      <div className="toast_transaction_description">{description}</div>
      <a
        target="_blank"
        rel="noreferrer"
        href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/transaction/${hash}`}
      >
        View transaction: {formatAddress(hash.toString())}
      </a>
    </>
  ),
  status: "info",
  icon: <Spinner size={"sm"} marginTop="5px" />,
  duration: 10000,
  isClosable: true,
  position: "bottom-left",
  variant: "top-accent",
  containerStyle: {
    background: "#3182ce !important",
    borderRadius: "10px",
    maxW: "350px",
  },
});

export const transactionSuccess = (description: string, hash: MaybeHexString): UseToastOptions => ({
  description: (
    <>
      <div className="toast_transaction_description" style={{ fontWeight: "bold" }}>
        {description}
      </div>
      <a
        target="_blank"
        rel="noreferrer"
        href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/transaction/${hash}`}
      >
        View transaction: {formatAddress(hash.toString())}
      </a>
    </>
  ),
  status: "success",
  icon: <IoCheckmarkSharp style={{ width: "23px", height: "23px" }} />,
  duration: 7000,
  isClosable: true,
  position: "bottom-left",
  variant: "top-accent",
  containerStyle: {
    backgroundColor: "#38a169",
    borderRadius: "10px",
    maxW: "350px",
  },
});

export const transactionFail = (description: string, hash: MaybeHexString): UseToastOptions => ({
  description: (
    <>
      <div className="toast_transaction_description" style={{ fontWeight: "bold" }}>
        {description}
      </div>
      <a
        target="_blank"
        rel="noreferrer"
        href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/transaction/${hash}`}
      >
        View transaction: {formatAddress(hash.toString())}
      </a>
    </>
  ),
  status: "error",
  icon: <IoWarning style={{ width: "23px", height: "23px" }} />,
  duration: 6000,
  isClosable: true,
  position: "bottom-left",
  variant: "top-accent",
  containerStyle: {
    backgroundColor: "#e53e3e",
    borderRadius: "10px",
    maxW: "350px",
  },
});
