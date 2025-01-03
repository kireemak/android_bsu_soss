import { getToken } from "./secureStore";

export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getToken();
  return !!token;
};
