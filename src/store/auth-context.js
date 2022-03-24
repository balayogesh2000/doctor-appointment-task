import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { getMe } from "../api/authApi";
import axios from "axios";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  user: {},
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState({});
  const userIsLoggedIn = !!token;

  useEffect(() => {
    (async () => {
      const user = await getMe();
      setUser(user);
    })();
  }, []);

  const loginHandler = async (token) => {
    localStorage.setItem("token", token);
    setToken(token);
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    const user = await getMe();
    setUser(user);
  };
  const logoutHandler = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };
  const contextValue = {
    token: token,
    user: user,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

export default AuthContext;
