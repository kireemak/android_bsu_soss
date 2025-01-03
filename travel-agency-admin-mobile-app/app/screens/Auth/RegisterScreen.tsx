import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { signUp } from "../../services/authService";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { AuthStackParamList } from "../../navigation/AuthNavigator";

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Ошибка", "Пароли не совпадают");
      return;
    }
    setLoading(true);
    try {
      await signUp(formData);
      Alert.alert("Успех", "Регистрация успешна");
      navigation.navigate("Login"); // Теперь типы маршрутов корректны
    } catch (error: any) {
      Alert.alert("Ошибка", error.message || "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>Travel Agency Admin</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.title}>Создайте аккаунт</Text>
        {[
          { placeholder: "Имя пользователя", name: "username" },
          { placeholder: "Email", name: "email" },
          { placeholder: "Имя", name: "name" },
          { placeholder: "Телефон", name: "phone" },
        ].map((input) => (
          <TextInput
            key={input.name}
            style={styles.input}
            placeholder={input.placeholder}
            placeholderTextColor="#aaa"
            onChangeText={(value) => handleChange(input.name, value)}
            value={formData[input.name as keyof typeof formData]}
          />
        ))}
        <TextInput
          style={styles.input}
          placeholder="Пароль"
          placeholderTextColor="#aaa"
          secureTextEntry
          onChangeText={(value) => handleChange("password", value)}
          value={formData.password}
        />
        <TextInput
          style={styles.input}
          placeholder="Подтверждение пароля"
          placeholderTextColor="#aaa"
          secureTextEntry
          onChangeText={(value) => handleChange("confirmPassword", value)}
          value={formData.confirmPassword}
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Зарегистрироваться</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={styles.link}
        >
          <Text style={styles.linkText}>Уже есть аккаунт? Войти</Text>
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
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007bff",
  },
  form: {
    padding: 20,
    backgroundColor: "#fff",
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
  disabledButton: {
    backgroundColor: "#aaa",
  },
  link: {
    marginTop: 15,
    alignItems: "center",
  },
  linkText: {
    color: "#007bff",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});

export default RegisterScreen;
