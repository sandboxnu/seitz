import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

interface GetUserResponse {
  email: string;
  password: string;
  isAdmin: boolean;
  activitiesCreated: string[];
  studies: string[];
}

async function getCurrentUser() {
  const result = await axiosInstance.get<GetUserResponse>("auth/user");
  return result.data;
}

async function getStudies() {
  const response = await axiosInstance.get("/studies/");
  return response.data;
}

export default { getCurrentUser, getStudies };
