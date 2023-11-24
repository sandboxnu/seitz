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

export interface ITaskInstance {
  _id: string;
  task: string;
  quantity: number;
}

export interface ISession {
  _id: string;
  name: string;
  activities: ITaskInstance[];
}

export interface ICustomizedBattery {
  _id: string;
  name: string;
}

export interface GetStudyResponse {
  name: string;
  description: string;
  batteries: ICustomizedBattery[];
  sessions: ISession[];
}

async function getStudy(id: string) {
  const result = await axiosInstance.get<GetStudyResponse>(`studies/${id}`);
  return result.data;
}

export default { getStudies, deleteStudy, getStudy };
