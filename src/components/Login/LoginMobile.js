import React, { useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import { useSetLoader } from "../../context/LoaderContext";
import { login } from "../../api/authApi";
import AuthContext from "../../store/auth-context";
import showToast from "../../utils/toast";

function Login() {
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [passwordError, setpasswordError] = useState("");
  const [mobileError, setmobileError] = useState("");
  const setLoader = useSetLoader();
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const handleValidation = (event) => {
    let formIsValid = true;

    if (!mobile.match(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/)) {
      formIsValid = false;
      setmobileError("Mobile Not Valid");
      return false;
    } else {
      setmobileError("");
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
        mobile,
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
                <label>Email mobile</label>
                <input
                  type="text"
                  className="form-control"
                  id="MobileInput"
                  name="MobileInput"
                  aria-describedby="mobileHelp"
                  placeholder="Enter mobile"
                  value={mobile}
                  onChange={(event) => setMobile(event.target.value)}
                  required
                />
                <small id="mobileHelp" className="text-danger form-text">
                  {mobileError}
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
                Switch to email <Link to="/login">login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
