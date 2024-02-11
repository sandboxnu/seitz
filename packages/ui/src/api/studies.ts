import { useAuthStore } from "@/stores/auth";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO fix this to instantly cause redirect to login
    if (error.response.status === 401) {
      const authStore = useAuthStore();
      authStore.currentUser = null;
    } else {
      throw error;
    }
  }
);

export interface ITaskInstance {
  _id: string;
  task: string;
  quantity: number;
}

export interface ISession {
  _id: string;
  name: string;
  tasks: ITaskInstance[];
}

export interface IStudyVariant {
  name: string;
  sessions: ISession[];
}

export interface ICustomizedBattery {
  _id: string;
  battery: string;
  name: string;
}

export interface GetStudyResponse {
  _id: string;
  name: string;
  description: string;
  batteries: ICustomizedBattery[];
  serverCode: string;
  variants: IStudyVariant[];
}
async function getStudies() {
  const response = await axiosInstance.get<GetStudyResponse[]>("/studies/");
  return response.data;
}

async function getStudy(id: string) {
  const result = await axiosInstance.get<GetStudyResponse>(`studies/${id}`);
  return result.data;
}

async function createStudy() {
  const response = await axiosInstance.post<GetStudyResponse>("/studies/new");
  return response.data;
}

async function deleteStudy(id: string) {
  await axiosInstance.delete(`/studies/${id}`);
}

async function saveStudy(id: string, studyData: GetStudyResponse) {
  await axiosInstance.put(`/studies/${id}`, studyData);
}

export default { getStudies, deleteStudy, getStudy, saveStudy, createStudy };
