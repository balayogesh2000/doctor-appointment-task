import axios from "axios";

let baseURL = "https://doctor-appointment-task.herokuapp.com/api/v1/doctor/";

if (process.env.NODE_ENV === "development") {
  baseURL = "http://localhost:5000/api/v1/doctor/";
}

export const createDoctor = async (body) => {
  await axios.post(baseURL, body);
};

export const getAllDoctors = async (params = {}) => {
  const { data } = await axios.get(baseURL, { params });
  return data;
};

export const getDoctor = async (id) => {
  const data = await axios.get(baseURL + id);
  return data;
};

export const updateDoctor = async (id, body) => {
  const data = await axios.patch(baseURL + id, body);
  return data;
};

export const deleteDoctor = async (id) => {
  const data = await axios.delete(baseURL + id);
  return data;
};
