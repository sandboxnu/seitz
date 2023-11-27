import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

async function getStudies() {
  const response = await axiosInstance.get("/studies/");
  return response.data;
}

async function deleteStudy(id: string) {
  await axiosInstance.delete(`/studies/${id}`);
}

export default { getStudies, deleteStudy };
