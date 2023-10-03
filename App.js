import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import AbrirChamado from "./Components/AbrirChamado";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Triagem from "./Components/Triagem";
import Login from "./Components/Login";
import "./config/firebase";
import { useAuthentication } from "./utils/hooks/useAuthentication";
import { useEffect, useState } from "react";

const Drawer = createDrawerNavigator();

export default function App() {
  var user = useAuthentication();

  const [isUserLoggedIn, setUserLoggedIn] = useState(false);

  const updateUserLoggedIn = (loggedIn) => {
    setUserLoggedIn(loggedIn);
  };
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Drawer.Navigator
          screenOptions={{
            drawerStyle: {
              backgroundColor: "#FFFFFF",
              color: "white",
            },
            headerShown: false,
            headerStyle: { backgroundColor: "black" },
          }}
        >
          {!isUserLoggedIn ? (
            <Drawer.Screen name="Login" options={{ title: "Login" }}>
              {(props) => (
                <Login {...props} updateUserLoggedIn={updateUserLoggedIn} />
              )}
            </Drawer.Screen>
          ) : null}
          {isUserLoggedIn ? (
            <Drawer.Screen
              name="Abertura"
              component={AbrirChamado}
              options={{ title: "Abertura" }}
            />
          ) : null}
          {isUserLoggedIn ? (
            <Drawer.Screen
              name="Triagem"
              component={Triagem}
              options={{ title: "Triagem" }}
            />
          ) : null}
        </Drawer.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    minHeight: "100%",
  },
});
