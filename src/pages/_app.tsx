import "@/styles/globals.css";
import "@/styles/nprogress.css";
import "@/styles/bottomsheet.css";
import "@/styles/toast.css";
import "@/styles/reactslick.css";
import type { AppProps } from "next/app";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import theme from "@/theme";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useMemo } from "react";
import Router from "next/router";
import {
  WalletProvider,
  AptosWalletAdapter,
  MartianWalletAdapter,
  PontemWalletAdapter,
  FewchaWalletAdapter,
} from "@manahippo/aptos-wallet-adapter";
import NProgress from "nprogress";
import AppProvider from "@/store";
import { Rubik } from "@next/font/google";
import DefaultSeoTag from "@/components/DefaultSeoTag";

const queryClient = new QueryClient();

// Dùng @next/font
export const title = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const App = ({ Component, pageProps }: AppProps) => {
  const wallets = useMemo(
    () => [
      new AptosWalletAdapter(),
      new MartianWalletAdapter(),
      new PontemWalletAdapter(),
      new FewchaWalletAdapter(),
    ],
    []
  );
  // const [loadFirstTime, setLoadFirstTime] = useState(true);

  useEffect(() => {
    // Dùng thư viện
    NProgress.configure({ easing: "ease", speed: 500, showSpinner: true });
    const handleStart = () => {
      NProgress.start();
    };
    const handleStop = () => {
      NProgress.done();
    };
    Router.events.on("routeChangeStart", handleStart);
    Router.events.on("routeChangeComplete", handleStop);
    Router.events.on("routeChangeError", handleStop);
    return () => {
      Router.events.off("routeChangeStart", handleStart);
      Router.events.off("routeChangeComplete", handleStop);
      Router.events.off("routeChangeError", handleStop);
    };
  }, []);

  return (
    <>
      <ChakraProvider theme={theme}>
        {/* Dùng aptos */}
        <WalletProvider
          wallets={wallets}
          autoConnect={true}
          onError={(error: Error) => {
            console.log("Handle Error Message", error);
          }}
        >
          <QueryClientProvider client={queryClient}>
            <AppProvider
            // setLoadFirstTime={setLoadFirstTime} loadFirstTime={loadFirstTime}
            >
              <Box bg="background" style={{ width: "100%", minHeight: "100vh" }}>
                {/* {loadFirstTime && (
                  <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
                    <HashLoader color="#10a3a3" size={"70px"} />
                  </Box>
                )} */}
                {/* {!loadFirstTime && ( */}
                <>
                  <DefaultSeoTag />
                  <Header />
                  <Box minH="calc(100vh - 89px - 20px)" margin="0 auto">
                    <Component {...pageProps} />
                  </Box>
                  <Footer />
                </>
                {/* )} */}
              </Box>
            </AppProvider>
          </QueryClientProvider>
        </WalletProvider>
      </ChakraProvider>
    </>
  );
};

export default App;
