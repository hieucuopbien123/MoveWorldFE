import getConnectedInstance from "@/utils/axiosConfig";
import { errorTopCenter } from "@/utils/toastutils";
import { Button, Text, useToast } from "@chakra-ui/react";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import React, { useState, useEffect, useCallback } from "react";
import { BsSuitHeart, BsSuitHeartFill } from "react-icons/bs";
import debounce from "lodash/debounce";
import { useAppContext } from "@/store";

const HeartButton = ({ id, liked, heart }: any) => {
  const { showAvatar } = useAppContext();

  const [heartNum, setHeartNum] = useState(heart);
  const [likedThis, setLikedThis] = useState(liked);
  const toast = useToast();
  useEffect(() => {
    setHeartNum(heart);
  }, [heart]);
  useEffect(() => {
    setLikedThis(liked);
  }, [liked]);
  const { account, signMessage } = useWallet();
  const love = async () => {
    try {
      if (!showAvatar) throw new Error("You must connect wallet first");
      if (!likedThis) {
        setHeartNum(heartNum + 1);
        setLikedThis(true);
        debounceUpdateHeart(true);
      } else {
        setHeartNum(heartNum - 1);
        setLikedThis(false);
        debounceUpdateHeart(false);
      }
    } catch (e: any) {
      console.log(e);
      toast(errorTopCenter(e?.message ? JSON.stringify(e.message).slice(0, 140) : "Error!"));
    }
  };

  const updateHeart = async (currentState: boolean) => {
    const accessToken = localStorage.getItem("AccessToken");
    if (accessToken && accessToken != "undefined") {
      if (currentState) {
        await getConnectedInstance(account, signMessage, accessToken).post(
          `/v1/user/interactive/${id}/like`
        );
      } else {
        await getConnectedInstance(account, signMessage, accessToken).post(
          `/v1/user/interactive/${id}/dislike`
        );
      }
    }
  };
  const debounceUpdateHeart = useCallback(debounce(updateHeart, 600), []);

  return (
    <>
      <Button
        px={"10px"}
        pt={"5px"}
        pb={"4px"}
        fontSize="larger"
        textAlign={"center"}
        width="fit-content"
        cursor="pointer"
        bgColor={"#00000080"}
        borderRadius={"20px"}
        position="absolute"
        right="10px"
        top="10px"
        zIndex={2}
        onClick={love}
        sx={{
          "&:hover": {
            bgColor: "#000000",
            opacity: 0.9,
          },
        }}
      >
        {likedThis ? (
          <BsSuitHeartFill
            style={{
              margin: 0,
              display: "inline-block",
              color: "#e73838",
              marginRight: "5px",
            }}
          />
        ) : (
          <BsSuitHeart
            style={{
              margin: 0,
              display: "inline-block",
              color: "white",
              marginRight: "5px",
            }}
          />
        )}
        <Text style={{ display: "inline-block", color: "white" }}>{heartNum}</Text>
      </Button>
    </>
  );
};

export default HeartButton;
