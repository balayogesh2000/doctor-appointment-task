import axios from "axios";

let baseURL = "https://doctor-appointment-task.herokuapp.com/api/v1/users/";

if (process.env.NODE_ENV === "development") {
  baseURL = "http://localhost:5000/api/v1/users/";
}

export const login = async (body) => {
  const res = await axios.post(baseURL + "login", body);
  return res;
};

export const signup = async (body) => {
  const res = await axios.post(baseURL + "signup", body);
  return res;
};

export const getMe = async () => {
  const res = await axios.get(baseURL + "me");
  return res.data.data.data;
};
