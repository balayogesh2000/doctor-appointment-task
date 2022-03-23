import React, { useContext, useState } from "react";
import LoaderComp from "../components/Loader/Loader";

export const LoaderContext = React.createContext();

export const useSetLoader = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  return (
    <LoaderContext.Provider value={setLoading}>
      {loading && <LoaderComp />}
      {children}
    </LoaderContext.Provider>
  );
};
