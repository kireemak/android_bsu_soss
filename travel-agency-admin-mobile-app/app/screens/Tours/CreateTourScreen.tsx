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
import { createTour } from "../../services/tourService";

const CreateTourScreen = ({ navigation }: any) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
    availableSeats: "",
    available: true,
  });

  const handleChange = (name: string, value: string | boolean) => {
    setFormData({ ...formData, [name]: value });
  };
  

  const handleSubmit = async () => {
    try {
      // Преобразуем duration, price, и availableSeats в числа
      const data = {
        ...formData,
        duration: Number(formData.duration),
        price: Number(formData.price),
        availableSeats: Number(formData.availableSeats),
        available: formData.available,
      };

      await createTour(data);
      Alert.alert("Успех", "Тур успешно создан");
      navigation.navigate("Main", { screen: "Tours" });
    } catch (error: any) {
      Alert.alert("Ошибка", error.message || "Ошибка создания тура");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Создать новый тур</Text>
        {[
          { placeholder: "Название тура", name: "name", keyboardType: "default" as KeyboardTypeOptions },
          { placeholder: "Описание тура", name: "description", keyboardType: "default" as KeyboardTypeOptions },
          { placeholder: "Длительность (дни)", name: "duration", keyboardType: "numeric" as KeyboardTypeOptions },
          { placeholder: "Цена ($)", name: "price", keyboardType: "numeric" as KeyboardTypeOptions },
          { placeholder: "Доступные места", name: "availableSeats", keyboardType: "numeric" as KeyboardTypeOptions },
        ].map((field) => (
          <TextInput
            key={field.name}
            style={styles.input}
            placeholder={field.placeholder}
            placeholderTextColor="#aaa"
            value={formData[field.name as keyof typeof formData]?.toString()}
            onChangeText={(value) => handleChange(field.name, value)}
            keyboardType={field.keyboardType}
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
          <Text style={styles.buttonText}>Создать</Text>
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

export default CreateTourScreen;
