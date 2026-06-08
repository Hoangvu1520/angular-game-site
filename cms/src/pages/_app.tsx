import { Layout } from "@/stories";
import type { AppProps } from "next/app";
import manifest from "@/manifest";
import { RecoilRoot } from "recoil";
import i18n from "../i18n";
import "@/assets/Styles/index.scss";
import { AuthProvider } from "@/stories/components/Provider";
// highlight-end

// highlight-start

const App = ({ Component, pageProps }: AppProps) => {
  // const [messageApi, contextHolder] = Message.useMessage();
  // // Set Muti Languages
  // //Function to create

  // // //Function to hook

  return (
    <AuthProvider>
      <RecoilRoot>
        <Layout appList={manifest}>
          <Component i18n={i18n} {...pageProps} />
        </Layout>
      </RecoilRoot>
    </AuthProvider>
  );
};
export default App;
