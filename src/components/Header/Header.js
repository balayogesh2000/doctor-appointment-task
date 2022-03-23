import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";

import classes from "./Header.module.css";

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = () => {
    localStorage.removeItem("token");
    setUser({});
    navigate("/login");
  };
  return (
    <div className={classes.Header}>
      {location.pathname !== "/login" &&
        location.pathname !== "/signup" &&
        user.name && (
          <div className={classes.container}>
            <Link to="/profile">{user.name}</Link>
            <Button onClick={logout}>Logout</Button>
          </div>
        )}
    </div>
  );
};

export default Header;
