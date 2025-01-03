import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, View } from "react-native";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import ToursScreen from "../screens/Tours/ToursScreen";
import CreateTourScreen from "../screens/Tours/CreateTourScreen";
import UpdateTourScreen from "../screens/Tours/UpdateTourScreen";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>(); 

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Проверяем токен при загрузке приложения
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error("Ошибка проверки аутентификации:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Логин
  const login = async (token: string) => {
    try {
      await SecureStore.setItemAsync("token", token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Ошибка сохранения токена:", error);
    }
  };

  // Логаут
  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Ошибка выхода:", error);
    }
  };

  // Если идет проверка токена, показываем индикатор загрузки
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Stack.Navigator>
          {/* Основные экраны */}
          <Stack.Screen
            name="Main"
            options={{ headerShown: false }}
            component={() => <MainNavigator logout={logout} />}
          />
          {/* Маршруты, специфичные для туров */}
          <Stack.Screen name="Tours" component={ToursScreen} />
          <Stack.Screen name="CreateTour" component={CreateTourScreen} />
          <Stack.Screen name="UpdateTour" component={UpdateTourScreen} />

        </Stack.Navigator>
      ) : (
        <AuthNavigator login={login} />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
