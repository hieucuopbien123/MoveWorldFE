import React from "react";
import { Box, IconButton, Tooltip } from "@chakra-ui/react";
import { FaFacebookF } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import { SiDiscord } from "react-icons/si";
import { BsTwitter } from "react-icons/bs";

interface IWebsite<TValue> {
  [id: string]: TValue;
}

const staticData: IWebsite<any> = {
  facebook: {
    icon: <FaFacebookF />,
  },
  website: {
    icon: <CgWebsite />,
  },
  discord: {
    icon: <SiDiscord />,
  },
  twitter: {
    icon: <BsTwitter />,
  },
};

const SocialList = ({ social }: any) => {
  return (
    <>
      {social &&
        Object.keys(social).map((w: string) => {
          if (social[w])
            return (
              <Box key={w} title={w}>
                <a target="_blank" rel="noreferrer" href={social[w]}>
                  <Tooltip
                    label={w.charAt(0).toUpperCase() + w.slice(1)}
                    hasArrow
                    borderRadius={"10px"}
                    padding="10px"
                  >
                    <IconButton
                      size="lg"
                      bgColor={"transparent"}
                      aria-label={w}
                      icon={staticData[w].icon}
                      borderRadius="50%"
                    />
                  </Tooltip>
                </a>
              </Box>
            );
          else {
            return (
              <Box key={w} title={w}>
                <Tooltip label={`No ${w}`} hasArrow borderRadius={"10px"} padding="10px">
                  <IconButton
                    size="lg"
                    bgColor={"transparent"}
                    aria-label={w}
                    icon={staticData[w].icon}
                    borderRadius="50%"
                  />
                </Tooltip>
              </Box>
            );
          }
        })}
    </>
  );
};

export default SocialList;
