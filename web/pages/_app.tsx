import type { AppProps } from "next/app";
import styles from "../styles/index.scss";
import { Layout } from "../components";
import { AuthProvider } from "../components";

const menu: any = [];
const navigation: any = [
  { label: "Giao dịch mua vàng", link: "" },
  { label: "Giao dịch bán vàng", link: "" },
  { label: "Rút vàng", link: "" },
];
const App = ({ Component, pageProps }: any) => {
  const isLayoutVisible = Component.hideLayout;
  return (
    <AuthProvider>
      <Layout
        menu={menu}
        navigation={navigation}
        offVisble={isLayoutVisible}
      >
        <Component classNames={styles.global} {...pageProps} />
      </Layout>
    </AuthProvider>
  );
};

export default App;
