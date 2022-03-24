import axios from "axios";

let baseURL = "https://doctor-appointment-task.herokuapp.com/api/v1/booking/";

if (process.env.NODE_ENV === "development") {
  baseURL = "http://localhost:5000/api/v1/booking/";
}

export const createBooking = async (body) => {
  const res = await axios.post(baseURL, body);
  return res;
};

export const getAllBookings = async (params = {}) => {
  const { data } = await axios.get(baseURL, { params });
  console.log(params);
  return data;
};

export const getBooking = async (id) => {
  const data = await axios.get(baseURL + id);
  return data;
};

export const updateBooking = async (id, body) => {
  const data = await axios.patch(baseURL + id, body);
  return data;
};

export const deleteBooking = async (id) => {
  const data = await axios.delete(baseURL + id);
  return data;
};

export const sendMail = async (body) => {
  const res = await axios.post(baseURL + "sendmail", body);
  return res;
};
