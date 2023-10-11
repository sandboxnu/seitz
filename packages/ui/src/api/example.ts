import axios from "axios";

export interface GetCarResponse {
  _id: string;
  make: string;
  model: string;
  year: number;
  miles: number;
}

interface CreateCarDto {
  make: string;
  model: string;
  year: number;
  miles: number;
}

async function getCars() {
  const response = await axios.get<GetCarResponse[]>(`${import.meta.env.VITE_API_URL}/example`);
  return response.data;
}

async function getCarByID(id: string) {
  const response = await axios.get<GetCarResponse>(`${import.meta.env.VITE_API_URL}/example/${id}`);
  return response.data;
}

async function createCar(car: CreateCarDto) {
  const response = await axios.post<GetCarResponse>(`${import.meta.env.VITE_API_URL}/example`, car);
  return response.data;
}

export default { getCars, getCarByID, createCar };
