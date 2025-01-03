import api from "./api";

export const getBookings = async () => {
  const response = await api.get("bookings");
  return response.data;
};

export const updateBookingStatus = async (id: number, status: string) => {
  const response = await api.patch(`bookings/${id}/status?status=${status}`);
  return response.data;
};

