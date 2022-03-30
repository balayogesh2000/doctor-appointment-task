import React, { useContext, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../api/authApi";
import { useSetLoader } from "../../context/LoaderContext";
import AuthContext from "../../store/auth-context";
import toast from "../../utils/toast";

function Signup() {
  const setLoader = useSetLoader();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [passwordError, setpasswordError] = useState("");
  const [mobileError, setmobileError] = useState("");
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const handleValidation = (event) => {
    let formIsValid = true;

    if (!mobile.match(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/)) {
      formIsValid = false;
      setmobileError("Mobile number Not Valid");
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
      const isValid = handleValidation();
      if (!isValid) return;
      setLoader(true);
      const res = await signup({
        name,
        mobile,
        password,
        passwordConfirm: password,
      });
      setLoader(false);
      authCtx.login(res.data.token);
      navigate("/");
    } catch (err) {
      setLoader(false);
      toast(err.response.data.message, true);
    }
  };

  return (
    <div className="App" style={{ marginTop: "50px" }}>
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-md-4">
            <form id="loginform" onSubmit={loginSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="NameInput"
                  name="NameInput"
                  aria-describedby="nameHelp"
                  placeholder="Enter name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="text"
                  className="form-control"
                  id="MobileInput"
                  name="MobileInput"
                  aria-describedby="mobileHelp"
                  placeholder="Enter mobile number"
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
                Signup
              </button>
              <p style={{ marginTop: "5px" }}>
                already a user? <Link to="/login">login</Link> instead
              </p>
              <p style={{ marginTop: "5px" }}>
                Switch to email<Link to="/signup"> signup</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Signup;
