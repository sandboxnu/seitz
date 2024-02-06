import axios from "axios";

const API_PREFIX =
  import.meta.env.VITE_SECURE === "true" ? "https://" : "http://";
const API_URL = API_PREFIX + import.meta.env.VITE_API_URL;

export default axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
