import type { AppProps } from "next/app";
import styles from "../styles/index.scss";
import { Layout } from "../components";
import { AuthProvider } from "../components";
import { NhostProvider, NhostClient } from "@nhost/nextjs";
import constant from "./constant";
import { RecoilRoot } from "recoil";

const menu: any = [];
const navigation: any = [
  { label: "Giao dịch mua vàng", link: "" },
  { label: "Giao dịch bán vàng", link: "" },
  { label: "Rút vàng", link: "" },
];
const App = ({ Component, pageProps }: any) => {
  const isLayoutVisible = Component.hideLayout;
  const nhost = new NhostClient({
    functionsUrl: constant.BACKEND_URL,
    graphqlUrl: constant.BACKEND_URL,
    authUrl: constant.BACKEND_AUTH_URL,
    storageUrl: constant.BACKEND_S3_URL,
  });
  return (
    
    <NhostProvider nhost={nhost} initial={pageProps.nhostSession}>
      <RecoilRoot>
      <Layout
        menu={menu}
        navigation={navigation}
        offVisble={isLayoutVisible}
      >
        <Component classNames={styles.global} {...pageProps} />
      </Layout>
      </RecoilRoot>
      </NhostProvider>
    
  );
};

export default App;
