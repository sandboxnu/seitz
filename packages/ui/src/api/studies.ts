import axios from "axios";
import { useAuthStore } from "@/stores/auth";

import type {
  DTO,
  GETStudies,
  GETStudy,
  PUTStudy,
  IStudyVariant,
} from "@seitz/shared";

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

async function getStudies() {
  const response = await axiosInstance.get<DTO<GETStudies>>("/studies/");
  return response.data;
}

async function fetchRecentStudies() {
  const studies = await axiosInstance.get<DTO<GETStudies>>("/studies/recent");
  return studies.data;
}

async function getStudy(id: string) {
  const result = await axiosInstance.get<DTO<GETStudy>>(`studies/${id}`);
  return result.data;
}

async function getStudyPreview(id: string) {
  const result = await axiosInstance.get<DTO<GETStudy>>(
    `studies/${id}/preview`
  );
  return result.data;
}

async function createStudy() {
  const response = await axiosInstance.post<DTO<string>>("/studies/new");
  return response.data;
}

async function deleteStudy(id: string) {
  await axiosInstance.delete(`/studies/${id}`);
}

async function saveStudy(id: string, studyData: DTO<PUTStudy>) {
  await axiosInstance.put(`/studies/${id}`, studyData);
}

async function updateVariant(
  studyId: string,
  variantId: string,
  variantData: DTO<IStudyVariant>
) {
  await axiosInstance.put(
    `/studies/${studyId}/variants/${variantId}`,
    variantData
  );
}

export interface VariantFromQuery {
  _id: string;
  name: string;
  sessions: SessionFromQuery[];
  serverCode: string;
}

interface SessionFromQuery {
  _id: string;
  name: string;
  tasks: TaskFromQuery[];
}

interface TaskFromQuery {
  _id: string;
  task: string;
  quantity: number;
}

export default {
  getStudies,
  deleteStudy,
  getStudy,
  getStudyPreview,
  saveStudy,
  createStudy,
  updateVariant,
  fetchRecentStudies,
};
