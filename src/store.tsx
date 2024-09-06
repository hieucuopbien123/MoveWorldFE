import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { AptosClient } from "aptos";
import debounce from "lodash/debounce";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

interface AppContextInterface {
  aptosToDollar: number;
  showAvatar: boolean;
  refetchData: boolean;
  callEveryComponentFetchData: () => void;
  disableNotis: boolean;
  setDisableNotis: (state: boolean) => void;
  balance: number | undefined;
  fetchBalance: () => void;
}

// Setup React Context

const AppContext = createContext<AppContextInterface>({
  aptosToDollar: 0,
  showAvatar: false,
  refetchData: false,
  callEveryComponentFetchData: function foo() {
    // do nothing.
  },
  disableNotis: false,
  setDisableNotis: (state: boolean) => {
    //
  },
  fetchBalance: function foo() {
    // do nothing.
  },
  balance: undefined,
});

export function useAppContext() {
  return useContext(AppContext);
}

interface ProviderProps {
  children: React.ReactNode;
  // setLoadFirstTime: (a: boolean) => void;
  // loadFirstTime: boolean;
}

const AppProvider = ({
  children,
}: // , setLoadFirstTime, loadFirstTime
ProviderProps) => {
  const [aptosToDollar, setAptosToDollar] = useState(0);
  const { account } = useWallet();

  const [disableNotis, setDisableNotis] = useState(false);
  useEffect(() => {
    const disnotis = localStorage.getItem("disnotis");
    if (!disnotis || disnotis == "false") {
      setDisableNotis(false);
    } else if (disnotis == "true") {
      setDisableNotis(true);
    }
  }, []);

  useEffect(() => {
    checkAccessToken();
    fetchAptosPrice();
    checkAccessToken();
  }, []);
  const fetchAptosPrice = async () => {
    const response = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=APTUSDT");
    const data = await response.json();
    setAptosToDollar(data.price);
  };

  const [showAvatar, setShowAvatar] = useState(false);
  const [refetchData, setRefetchData] = useState(true);
  const [balance, setBalance] = useState<number | undefined>(undefined);
  const debounceCallRefetchData = useCallback(
    debounce(() => {
      setRefetchData(false);
    }, 11000),
    []
  );

  useEffect(() => {
    fetchBalance();
  }, [account]);
  const fetchBalance = async () => {
    try {
      if (account?.address) {
        const client = new AptosClient(`${process.env.NEXT_PUBLIC_NODE_URL}`);
        setBalance(
          (
            (await client.getAccountResource(
              account.address,
              "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
            )) as any
          ).data.coin.value / Math.pow(10, 8)
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const checkAccessToken = () => {
    const accessToken = localStorage.getItem("AccessToken");
    if (account?.address && accessToken && accessToken != "undefined") {
      setShowAvatar(true);
    }
    // setTimeout(() => setLoadFirstTime(false), 1000);
  };

  useEffect(() => {
    // Check càng nhanh càng tốt giá trị đầu tiên => chuyển lên trên r
    // if (loadFirstTime) checkAccessToken();
    const id = setInterval(function () {
      const accessToken = localStorage.getItem("AccessToken");
      if (account?.address && accessToken && accessToken != "undefined" && showAvatar == false) {
        setShowAvatar(true);
      } else if (
        (!accessToken || !account?.address || accessToken == "undefined") &&
        showAvatar == true
      ) {
        setShowAvatar(false);
        localStorage.removeItem("AccessToken");
      }
    }, 500);
    return () => clearInterval(id);
  }, [showAvatar, account]);

  useEffect(() => {
    debounceCallRefetchData();
  }, []);

  const callEveryComponentFetchData = () => {
    setRefetchData(true);
    debounceCallRefetchData();
  };

  return (
    <AppContext.Provider
      value={{
        aptosToDollar,
        showAvatar,
        refetchData,
        callEveryComponentFetchData,
        disableNotis,
        setDisableNotis,
        balance,
        fetchBalance,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
