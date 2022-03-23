import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";

function PrivateRoute({ children }) {
  const auth = localStorage.getItem("token");
  return auth ? (
    children
  ) : (
    <p>
      You are not logged in. Please <Link to="/login">login</Link> to continue
    </p>
  );
}

export default PrivateRoute;
