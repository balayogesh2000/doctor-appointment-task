import React, { useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import { useSetLoader } from "../../context/LoaderContext";
import { login } from "../../api/authApi";
import AuthContext from "../../store/auth-context";
import showToast from "../../utils/toast";

function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passwordError, setpasswordError] = useState("");
  const [emailError, setemailError] = useState("");
  const setLoader = useSetLoader();
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const handleValidation = (event) => {
    let formIsValid = true;

    if (!email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
      formIsValid = false;
      setemailError("Email Not Valid");
      return false;
    } else {
      setemailError("");
      formIsValid = true;
    }

    if (!password.match(/^[a-zA-Z]{8,22}$/)) {
      formIsValid = false;
      setpasswordError(
        "Only Letters and length must best min 8 Chracters and Max 22 Chracters"
      );
      return false;
    } else {
      setpasswordError("");
      formIsValid = true;
    }

    return formIsValid;
  };

  const loginSubmit = async (e) => {
    try {
      e.preventDefault();
      handleValidation();
      setLoader(true);
      const res = await login({
        email,
        password,
      });
      setLoader(false);
      authCtx.login(res.data.token);
      if (res.data.user.role === "admin") return navigate("/admin");
      if (res.data.user.role === "doctor") return navigate("/profile");
      navigate("/");
    } catch (err) {
      setLoader(false);
      showToast(err.response.data.message, true);
    }
  };

  return (
    <div className="App" style={{ marginTop: "50px" }}>
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-md-4">
            <form id="loginform" onSubmit={loginSubmit}>
              <div className="form-group">
                <label>Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="EmailInput"
                  name="EmailInput"
                  aria-describedby="emailHelp"
                  placeholder="Enter email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <small id="emailHelp" className="text-danger form-text">
                  {emailError}
                </small>
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <small id="passworderror" className="text-danger form-text">
                  {passwordError}
                </small>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginTop: "10px" }}
              >
                Login
              </button>
              <p style={{ marginTop: "5px" }}>
                Don't have an account? <Link to="/signup">Signup</Link> here
              </p>
              <p style={{ marginTop: "5px" }}>
                Don't have an email? switch to mobile{" "}
                <Link to="/login-mobile">login</Link> instead
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
