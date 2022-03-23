import React, { useContext, useEffect, useState } from "react";
import { getMe } from "../api/authApi";

export const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  useEffect(() => {
    (async () => {
      const user = await getMe();
      setUser(user);
    })();
  }, []);
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};
