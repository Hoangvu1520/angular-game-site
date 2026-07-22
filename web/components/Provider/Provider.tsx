import React, {
  useState,
  useEffect,
  createContext,
  useContext,
} from "react";
import httpHandler from "../../services/apiConfig";
import { Loading } from "..";

const AuthContext = createContext<any>(undefined);

export const useAuthContext = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }: any) => {
  //define constants
  const [isAuthenticator, setIsAuthenticator] =
    useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const calLData = async () => {
    return await httpHandler(`/auth/check-auth`, {}, "GET").then(
      (res: any) => {
        const auth = res;
        if (auth && !auth?.error) {
          setIsAuthenticator(true);
          auth.user && setUserData(auth.user);
        } else {
          setIsAuthenticator(false);
          setUserData(null)
        }
      }
    );
  };

  //functions to create

  //functions to handle actions
  const isLoading = (loading: boolean) => {
    setLoading(loading);
  };

  //functions to hook
  useEffect(() => {
    calLData();
  }, [loading]);

  //MAIN RENDER
  return (
    <AuthContext.Provider
      value={{ isAuthenticator, userData, isLoading }}
    >
      {children}
      <Loading isLoading={loading} />
    </AuthContext.Provider>
  );
};

export { AuthProvider };
