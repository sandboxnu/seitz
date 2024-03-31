import axios from "axios";

import type {
  CreateCustomizedBattery,
  DTO,
  GETCustomizedTask,
  GETTasks,
  ICustomizedBattery,
} from "@seitz/shared";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

async function getAllTasks() {
  const result = await axiosInstance.get<DTO<GETTasks>>(`tasks`);
  return result.data;
}

async function getTask(id: string) {
  const result = await axiosInstance.get<DTO<GETCustomizedTask>>(
    `tasks/custom/${id}`
  );
  return result.data;
}

async function createCustomTask(
  batteryId: string,
  name: string,
  studyId: string
) {
  const result = await axiosInstance.post<DTO<ICustomizedBattery>>(
    `tasks/${batteryId}/custom`,
    {
      name,
    },
    { params: { studyId } }
  );
  return result.data;
}

async function saveTask(
  studyId: string,
  taskId: string,
  taskData: DTO<CreateCustomizedBattery>
) {
  return await axiosInstance.put<DTO<ICustomizedBattery>>(
    `/studies/${studyId}/tasks/${taskId}`,
    taskData
  );
}

async function deleteTask(id: string) {
  return await axiosInstance.delete(`/tasks/${id}`);
}

async function uploadBattery(data: object) {
  return await axiosInstance.post(`/admin/battery`, data);
}

export default {
  getAllTasks,
  getTask,
  createCustomTask,
  saveTask,
  deleteTask,
  uploadBattery,
};
