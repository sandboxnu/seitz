import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export interface GetTaskResponse {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
}

async function getAllTasks() {
  const result = await axiosInstance.get<GetTaskResponse[]>(`tasks`);
  return result.data;
}

export default { getAllTasks };
