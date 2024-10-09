import axios from "axios";

import type {
  CreateCustomizedBattery,
  DTO,
  GETCustomizedTask,
  GETTasks,
  IBattery,
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

async function getBattery(id: string) {
  const result = await axiosInstance.get<DTO<IBattery>>(`tasks/${id}`);
  return result.data;
}

async function createCustomTask(
  batteryId: string,
  name: string,
  studyId: string
) {
  const result = await axiosInstance.post<DTO<GETCustomizedTask>>(
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
  return await axiosInstance.put<DTO<GETCustomizedTask>>(
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

/* eslint-disable @typescript-eslint/no-explicit-any */
async function editBattery(id: string, data: Record<string, any>) {
  return await axiosInstance.put(`/admin/battery/${id}`, data);
}

export default {
  getAllTasks,
  getTask,
  getBattery,
  createCustomTask,
  saveTask,
  deleteTask,
  uploadBattery,
  editBattery,
};
