import React, { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/router";
import httpHandler from "@/stories/services/apiConfig";
import io from "socket.io-client";

const AuthContext = createContext<any>(undefined);

export const useAuthContext = () => {
  return useContext(AuthContext);
};
let socket: any;
const AuthProvider = ({ children }: any) => {
  //define constants
  const router = useRouter();
  const pageRouter = router.pathname.split("/")[1];
  const [isAuthenticator, setIsAuthenticator] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);
  const [refreshData, setRefreshData] = useState(0);
  const callData = async () => {
    return await httpHandler(`/auth/check-auth`, {}, "GET")
      .then((res: any) => {
        const auth = res;
        if (auth && !auth?.error) {
          setIsAuthenticator(true);
          // localStorage.setItem("userData", JSON.stringify(auth.user));
          auth.user && setUserData(auth.user);
        } else {
          logoutExpired();
        }
      })
      .catch((error) => {
        logoutExpired();
      });
  };

  //functions to create
  const logoutExpired = () => {
    setIsAuthenticator(false);
    setUserData(null);
    localStorage.removeItem("accessToken");
    // localStorage.removeItem("userData");
    if (router.route != "/auth/login") {
      window.location.href = "/auth/login";
    }
  };
  const socketInitializer = async () => {
    if (!socket) {
      try {
        socket = io(
          process.env.NEXT_PUBLIC_WS
            ? process.env.NEXT_PUBLIC_WS
            : "http://localhost:8000"
        );
        socket.on("connect", () => {
          console.log("Connected to WebSocket server");
          socket.emit("message", "test");
        });
      } catch (error) {
        console.error(error);
      }
    }
  };
  //functions to handle actions

  //functions to hook
  useEffect(() => {
    callData();
    socketInitializer();
  }, []);

  // useEffect(() => {
  //   socketInitializer();
  // }, [userData]);

  //MAIN RENDER
  return (
    <AuthContext.Provider
      value={{ isAuthenticator, userData, socket, setRefreshData, refreshData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
