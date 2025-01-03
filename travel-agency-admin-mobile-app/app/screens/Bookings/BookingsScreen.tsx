import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { getBookings, updateBookingStatus } from "../../services/bookingService";
import { getAllTours } from "../../services/tourService";
import { NavigationProp, useNavigation } from "@react-navigation/native";

type BookingStackParamList = {
  Bookings: undefined;
  CreateBooking: undefined;
};

interface Booking {
  id: number;
  tourName: string;
  clientName: string;
  date: string;
}

const BookingsScreen = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<NavigationProp<BookingStackParamList>>();

  const fetchBookings = async () => {
    try {
      // Получаем бронирования и список туров
      const bookingsResponse = await getBookings();
      const toursResponse = await getAllTours();

      if (bookingsResponse.bookings && toursResponse.tours) {
        // Сопоставляем `tourId` с названием тура
        const transformedBookings = bookingsResponse.bookings.map((booking: any) => {
          const tour = toursResponse.tours.find((tour: any) => tour.id === booking.tourId);
          return {
            id: booking.id,
            tourName: tour ? tour.name : `ID: ${booking.tourId}`, // Используем название тура, если доступно
            clientName: `User ID: ${booking.userId}`, // Можно заменить на имя пользователя, если доступно
            date: booking.status,
          };
        });
        setBookings(transformedBookings);
      } else {
        throw new Error("Некорректный формат ответа от сервера");
      }
    } catch (error: any) {
      Alert.alert("Ошибка", error.message || "Ошибка загрузки бронирований");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      await updateBookingStatus(id, newStatus);
      Alert.alert("Успех", `Статус изменён на ${newStatus}`);
      fetchBookings(); // Перезагружаем список бронирований
    } catch (error: any) {
      Alert.alert("Ошибка", error.message || "Ошибка при обновлении статуса бронирования");
    }
  };

  const renderBooking = ({ item }: { item: Booking }) => (
    <View style={styles.card}>
      <Text style={styles.tourName}>{item.tourName}</Text>
      <Text style={styles.clientName}>Клиент: {item.clientName}</Text>
      <Text style={styles.status}>Статус: {item.date}</Text>
      <View style={styles.buttonContainer}>
        {item.date === "PENDING" || item.date === "CANCELLED" ? (
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => handleUpdateStatus(item.id, "CONFIRMED")}
          >
            <Text style={styles.buttonText}>Подтвердить</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleUpdateStatus(item.id, "CANCELLED")}
          >
            <Text style={styles.buttonText}>Отменить</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderBooking}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    padding: 20,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tourName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  clientName: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  status: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 15,
    color: "#007bff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  confirmButton: {
    flex: 0.48,
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButton: {
    flex: 0.48,
    backgroundColor: "#ff4d4d",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default BookingsScreen;
