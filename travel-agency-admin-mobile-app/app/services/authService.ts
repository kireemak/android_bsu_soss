import api from "./api";
import { saveToken, deleteToken } from "../utils/secureStore";

export const signIn = async (credentials: { username: string; password: string }) => {
  console.log("Clearing old token...");
  await deleteToken(); // Удаление старого токена

  console.log("Sending request to:", `http://192.168.100.201:8084/api/v1/auth/sign-in`);
  console.log("With payload:", credentials);
  
  const response = await api.post("auth/sign-in", credentials);
  console.log("Response received:", response.data);
  if (response.data.token) {
    await saveToken(response.data.token);
  }
  return response.data;
};


export const signUp = async (userData: {
  username: string;
  email: string;
  password: string;
  name: string;
  phone: string;
}) => {
  const response = await api.post("auth/sign-up", userData);
  return response.data;
};

export const logout = async () => {
  await deleteToken();
};
