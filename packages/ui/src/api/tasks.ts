import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

interface IGenericOption<T> {
  _id: string;
  name: string;
  default: T;
}

interface INumberOption extends IGenericOption<number> {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
}

interface ITextOption extends IGenericOption<string> {
  type: "text";
  maxLength?: number;
}

interface IDropdownOption extends IGenericOption<number> {
  type: "dropdown";
  options: string[];
}

interface ICheckboxOption extends IGenericOption<boolean> {
  type: "checkbox";
}

export interface IOptionGroup {
  _id: string;
  type: "group";
  name: string;
  options: IOption[];
}

type IOption =
  | INumberOption
  | ITextOption
  | IDropdownOption
  | ICheckboxOption
  | IOptionGroup;

interface IBatteryStage {
  _id: string;
  type: string;
  stageLabel: string;
  options: IOptionGroup;
}

export interface GetTaskResponse {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  deleted: boolean;
}

export interface GetSingularTaskResponse extends GetTaskResponse {
  stages: IBatteryStage[];
}

interface IOptionValue {
  _id: string;
  option: string;
  value: unknown;
}

interface GetCustomTaskResponse {
  _id: string;
  battery: string;
  name: string;
  values: IOptionValue[];
}

export interface GetSingleCustomTaskResponse
  extends Omit<GetCustomTaskResponse, "battery"> {
  battery: GetSingularTaskResponse;
}

export interface EditTaskDTO {
  name: string;
  battery: string;
  values: IOptionValue[];
}

async function getAllTasks() {
  const result = await axiosInstance.get<GetTaskResponse[]>(`tasks`);
  return result.data;
}

async function getTask(id: string) {
  const result = await axiosInstance.get<GetSingleCustomTaskResponse>(
    `tasks/custom/${id}`
  );
  return result.data;
}

async function createCustomTask(
  batteryId: string,
  name: string,
  studyId: string
) {
  const result = await axiosInstance.post<GetCustomTaskResponse>(
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
  taskData: EditTaskDTO
) {
  return await axiosInstance.put<GetCustomTaskResponse>(
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
