import React from "react";
import { Tooltip, IconButton, useClipboard } from "@chakra-ui/react";

const WrapperCopy = ({ text, label, isRedirect, link, IconTag }: any) => {
  const { hasCopied, onCopy } = useClipboard(text);

  if (isRedirect == true) {
    return (
      <>
        {link ? (
          <Tooltip
            label={label.charAt(0).toUpperCase() + label.slice(1)}
            closeOnClick={false}
            hasArrow
            borderRadius={"10px"}
            padding="10px"
          >
            <a target="_blank" href={link} rel="noreferrer">
              <IconButton size="md" aria-label={label} icon={IconTag} borderRadius="50%" />
            </a>
          </Tooltip>
        ) : (
          <Tooltip
            label={`No ${label}`}
            closeOnClick={false}
            hasArrow
            borderRadius={"10px"}
            padding="10px"
          >
            <IconButton size="md" aria-label={label} icon={IconTag} borderRadius="50%" />
          </Tooltip>
        )}
      </>
    );
  }

  return (
    <>
      {text ? (
        <Tooltip
          label={hasCopied ? "Copied" : label.charAt(0).toUpperCase() + label.slice(1)}
          closeOnClick={false}
          hasArrow
          borderRadius={"10px"}
          padding="10px"
        >
          <IconButton
            size="md"
            onClick={onCopy}
            aria-label={label}
            icon={IconTag}
            borderRadius="50%"
          />
        </Tooltip>
      ) : (
        <Tooltip
          label={`No ${label}`}
          closeOnClick={false}
          hasArrow
          borderRadius={"10px"}
          padding="10px"
        >
          <IconButton size="md" aria-label={label} icon={IconTag} borderRadius="50%" />
        </Tooltip>
      )}
    </>
  );
};

export default WrapperCopy;
