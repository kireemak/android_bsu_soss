import api from "./api";

export const getAllTours = async () => {
  const response = await api.get("tours");
  return response.data;
};

export const createTour = async (tourData: {
  name: string;
  description: string;
  price: number;
  duration: number;
  availableSeats: number;
  available: boolean;
}) => {
  const response = await api.post("tours", tourData);
  return response.data;
};

export const updateTour = async (id: number, tourData: any) => {
  const response = await api.patch(`tours/${id}`, {
    ...tourData,
    available: Boolean(tourData.available), // Преобразуем в булевое значение
  });
  return response.data;
};


export const deleteTour = async (id: number) => {
  const response = await api.delete(`tours/${id}`);
  return response.data;
};
