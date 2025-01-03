import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";


import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { signIn } from "../../services/authService";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import { NavigationProp, useNavigation } from "@react-navigation/native";

interface DecodedToken {
    sub: string; // Имя пользователя
    roles: string[]; // Роли пользователя
  }

const LoginScreen = ({ login }: { login: (token: string) => void }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      console.log("Logging in with:", formData); // Для отладки
      const response = await signIn(formData);

      const decodedToken: DecodedToken = jwtDecode(response.token);

      // Проверка роли
      if (decodedToken.roles.includes("ROLE_GUEST")) {
        Alert.alert(
          "Доступ запрещён",
          "У вас нет прав для входа в систему."
        );
        navigation.navigate("Login"); // Перенаправляем на страницу входа
        return;
      }

      login(response.token); // Передаем токен в `AppNavigator`
      Alert.alert("Успех", "Вы вошли в систему");
    } catch (error: any) {
      console.error("Login error:", error.message); // Для отладки
      Alert.alert("Ошибка", error.message || "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>Travel Agency Admin</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.title}>Добро пожаловать</Text>
        <TextInput
          style={styles.input}
          placeholder="Имя пользователя"
          placeholderTextColor="#aaa"
          onChangeText={(value) => handleChange("username", value)}
          value={formData.username}
        />
        <TextInput
          style={styles.input}
          placeholder="Пароль"
          placeholderTextColor="#aaa"
          secureTextEntry
          onChangeText={(value) => handleChange("password", value)}
          value={formData.password}
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Войти</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          style={styles.link}
        >
          <Text style={styles.linkText}>Нет аккаунта? Зарегистрироваться</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f0f4f8",
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
    marginHorizontal: 20,
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


export default LoginScreen;
