import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ToursScreen from "../screens/Tours/ToursScreen";
import BookingsScreen from "../screens/Bookings/BookingsScreen";
import { Button } from "react-native";

const Tab = createBottomTabNavigator();

const MainNavigator = ({ logout }: { logout: () => void }) => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Tours" component={ToursScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen
        name="Logout"
        component={() => null}
        options={{
          tabBarButton: () => (
            <Button title="Выйти" onPress={logout} color="#007bff" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
