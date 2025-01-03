import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Switch,
  KeyboardTypeOptions,
} from "react-native";
import { updateTour } from "../../services/tourService";

interface FormData {
  name: string;
  description: string;
  duration: string;
  price: string;
  availableSeats: string;
  available: boolean; // Булевое значение
}

const UpdateTourScreen = ({ route, navigation }: any) => {
  const { tour } = route.params;
  const [formData, setFormData] = useState<FormData>({
    name: tour.name,
    description: tour.description,
    duration: tour.duration.toString(),
    price: tour.price.toString(),
    availableSeats: tour.availableSeats.toString(),
    available: tour.available, // Инициализируем значение
  });

  const handleChange = (name: keyof FormData, value: string | boolean) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const updatedData = {
        ...formData,
        duration: parseInt(formData.duration, 10),
        price: parseFloat(formData.price),
        availableSeats: parseInt(formData.availableSeats, 10),
        available: formData.available,
      };

      await updateTour(tour.id, updatedData);
      Alert.alert("Успех", "Тур успешно обновлён");
      navigation.navigate("Main", { screen: "Tours" });
    } catch (error: any) {
      Alert.alert("Ошибка", error.message || "Ошибка обновления тура");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Обновить тур</Text>
        {[
          {
            placeholder: "Название тура",
            name: "name" as keyof FormData,
          },
          {
            placeholder: "Описание тура",
            name: "description" as keyof FormData,
          },
          {
            placeholder: "Длительность (дни)",
            name: "duration" as keyof FormData,
            keyboardType: "numeric" as KeyboardTypeOptions,
          },
          {
            placeholder: "Цена ($)",
            name: "price" as keyof FormData,
            keyboardType: "numeric" as KeyboardTypeOptions,
          },
          {
            placeholder: "Доступные места",
            name: "availableSeats" as keyof FormData,
            keyboardType: "numeric" as KeyboardTypeOptions,
          },
        ].map((field) => (
          <TextInput
            key={field.name}
            style={styles.input}
            placeholder={field.placeholder}
            placeholderTextColor="#aaa"
            value={formData[field.name]?.toString()}
            onChangeText={(value) => handleChange(field.name, value)}
            keyboardType={field.keyboardType || "default"}
          />
        ))}
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Доступен:</Text>
          <Switch
            value={formData.available}
            onValueChange={(value) => handleChange("available", value)}
            trackColor={{ false: "#ddd", true: "#007bff" }}
            thumbColor={formData.available ? "#fff" : "#fff"}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Сохранить</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#f0f4f8",
    padding: 20,
  },
  form: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    backgroundColor: "#f7f9fc",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: "#333",
    marginRight: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default UpdateTourScreen;
