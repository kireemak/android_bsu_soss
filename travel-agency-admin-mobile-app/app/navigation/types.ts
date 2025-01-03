export type RootStackParamList = {
    Main: undefined; // Основной навигатор
    Tours: undefined; // Список туров
    CreateTour: undefined; // Создание тура
    UpdateTour: { tour: Tour }; // Обновление тура
    CreateBooking: undefined;
  };
  
  export interface Tour {
    id: number;
    name: string;
    description: string;
    price: number;
    duration: number;
  }
  