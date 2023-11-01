import "react-native-gesture-handler";
import "./config/firebase";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import AbrirChamado from "./Components/AbrirChamado";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import Triagem from "./Components/Triagem";
import Login from "./Components/Login";
import { useAuthentication } from "./utils/hooks/useAuthentication";
import { useEffect, useState } from "react";
import MeusChamados from "./Components/Meus Chamados";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, signOut } from "firebase/auth";
import DetalhesChamado from "./Components/DetalhesChamado";
import Dashboard from "./Components/Dashboard";

const Drawer = createDrawerNavigator();

export default function App() {
  var user = useAuthentication();

  const [isUserLoggedIn, setUserLoggedIn] = useState(false);
  const [isAnalista, setAnalista] = useState(false);
  const [isSolicitante, setSolicitante] = useState(false);
  const [abrirDetalhes, setAbrirDetalhes] = useState(false);

  const updateUserLoggedIn = (loggedIn, permissao) => {
    setUserLoggedIn(loggedIn);

    if (permissao == "analista") {
      setAnalista(true);
      setSolicitante(false);
    } else if (permissao == "solicitante") {
      setSolicitante(true);
      setAnalista(false);
    }
  };

  const updateDetalhes = async (bool) => {
    setAbrirDetalhes(bool);
  };

  function Logout({ updateUserLoggedIn, navigation }) {
    const auth = getAuth();

    const logout = async () => {
      signOut(auth);
      updateUserLoggedIn(false);
      navigation.goBack();
      await AsyncStorage.clear();
    };

    useEffect(() => {
      logout();
    }, []);

    return null;
  }

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
            drawerActiveBackgroundColor: "white",
          }}
        >
          {isAnalista && isUserLoggedIn ? (
            <Drawer.Screen
              name="Dashboard"
              component={Dashboard}
              options={{ title: "Dashboard" }}
            />
          ) : null}
          {isUserLoggedIn ? (
            <Drawer.Screen name="Abertura" options={{ title: "Abertura" }}>
              {(props) => <AbrirChamado {...props} user={user} />}
            </Drawer.Screen>
          ) : null}
          {isAnalista && isUserLoggedIn ? (
            <Drawer.Screen name="Triagem" options={{ title: "Triagem" }}>
              {(props) => (
                <Triagem {...props} updateDetalhes={updateDetalhes} />
              )}
            </Drawer.Screen>
          ) : null}
          {isUserLoggedIn ? (
            <Drawer.Screen
              name="MeusChamados"
              options={{ title: "Meus Chamados" }}
            >
              {(props) => (
                <MeusChamados
                  {...props}
                  updateDetalhes={updateDetalhes}
                  user={user}
                />
              )}
            </Drawer.Screen>
          ) : null}

          {isUserLoggedIn ? (
            <Drawer.Screen name="Logout">
              {(props) => (
                <Logout {...props} updateUserLoggedIn={updateUserLoggedIn} />
              )}
            </Drawer.Screen>
          ) : (
            <Drawer.Screen name="Login" options={{ title: "Login" }}>
              {(props) => (
                <Login {...props} updateUserLoggedIn={updateUserLoggedIn} />
              )}
            </Drawer.Screen>
          )}
          {isUserLoggedIn && abrirDetalhes ? (
            <Drawer.Screen
              name="DetalhesChamado"
              options={{ title: " ", unmountOnBlur: true }}
            >
              {(props) => <DetalhesChamado {...props} />}
            </Drawer.Screen>
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
