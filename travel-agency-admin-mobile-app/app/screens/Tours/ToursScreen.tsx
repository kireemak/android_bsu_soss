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
import { getAllTours, deleteTour } from "../../services/tourService";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, Tour } from "../../navigation/types";

const ToursScreen = () => {
  const [tours, setTours] = useState<Tour[]>([]); // Указываем тип массива
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fetchTours = async () => {
    try {
      const response = await getAllTours(); // Ответ от API
      if (response.tours) {
        setTours(response.tours); // Устанавливаем массив из ключа `tours`
      } else {
        throw new Error("Некорректный формат ответа от сервера");
      }
    } catch (error: any) {
      Alert.alert("Ошибка", error.message || "Ошибка загрузки туров");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchTours();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteTour(id);
      Alert.alert("Успех", "Тур успешно удалён");
      fetchTours();
    } catch (error: any) {
      Alert.alert("Ошибка", error.message || "Ошибка при удалении тура");
    }
  };

  const renderTour = ({ item }: { item: Tour }) => (
    <View style={styles.card}>
      <Text style={styles.tourName}>{item.name}</Text>
      <Text style={styles.tourDescription}>{item.description}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Цена: ${item.price}</Text>
        <Text style={styles.infoText}>Длительность: {item.duration} дней</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => navigation.navigate("UpdateTour", { tour: item })}
        >
          <Text style={styles.buttonText}>Обновить</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.buttonText}>Удалить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={tours}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTour}
          contentContainerStyle={styles.list}
        />
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("CreateTour")}
      >
        <Text style={styles.addButtonText}>Создать новый тур</Text>
      </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  tourDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  updateButton: {
    flex: 0.48,
    backgroundColor: "#007bff",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButton: {
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
  addButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ToursScreen;
