import React from "react";
import Loader from "react-loader-spinner";

import classes from "./Loader.module.css";

const LoaderComp = () => {
  return (
    <div className={classes.Loader}>
      <Loader type="Oval" color="#00BFFF" height={100} width={100} />
    </div>
  );
};

export default LoaderComp;
