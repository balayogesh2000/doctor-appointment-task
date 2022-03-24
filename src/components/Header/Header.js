import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

import classes from "./Header.module.css";
import { useAuthContext } from "../../store/auth-context";

const Header = () => {
  const navigate = useNavigate();
  const authCtx = useAuthContext();
  const logout = () => {
    authCtx.logout();
    navigate("/login");
  };
  return (
    <div className={classes.Header}>
      {authCtx.isLoggedIn && (
        <div className={classes.container}>
          <Link to="/profile">{authCtx.user?.name}</Link>
          <Button onClick={logout}>Logout</Button>
        </div>
      )}
    </div>
  );
};

export default Header;
