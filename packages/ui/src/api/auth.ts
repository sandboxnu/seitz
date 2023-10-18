import axios from "axios";

interface LogInDto {
  email: string;
  password: string;
}

async function logIn(credentials: LogInDto) {
  await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, credentials);
}

async function signUp(credentials: LogInDto) {
  await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, credentials);
}

async function logOut() {
  await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`);
}

export default { logIn, signUp, logOut };
