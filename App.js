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

const Drawer = createDrawerNavigator();

export default function App() {
  var user = useAuthentication();

  const [isUserLoggedIn, setUserLoggedIn] = useState(false);

  const updateUserLoggedIn = (loggedIn) => {
    setUserLoggedIn(loggedIn);
  };

  useEffect(() => {
    const emailUsuario = AsyncStorage.getItem("email");
    if (emailUsuario != null) {
      console.log(emailUsuario);
      updateUserLoggedIn(true);
    }
  }, []);

  function Logout({ updateUserLoggedIn, navigation }) {
    const auth = getAuth();
  
    const logout = () => {
      signOut(auth);
      updateUserLoggedIn(false);
      navigation.goBack();
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
          }}
        >
          {/* {!isUserLoggedIn ? (
            <Drawer.Screen name="Login" options={{ title: "Login" }}>
              {(props) => (
                <Login {...props} updateUserLoggedIn={updateUserLoggedIn} />
              )}
            </Drawer.Screen>
          ) : null} */}
          {isUserLoggedIn ? (
            <Drawer.Screen name="Abertura" options={{ title: "Abertura" }}>
              {(props) => <AbrirChamado {...props} user={user} />}
            </Drawer.Screen>
          ) : null}
          {isUserLoggedIn ? (
            <Drawer.Screen
              name="Triagem"
              component={Triagem}
              options={{ title: "Triagem" }}
            />
          ) : null}
          {isUserLoggedIn ? (
            <Drawer.Screen
              name="MeusChamados"
              options={{ title: "Meus Chamados" }}
            >
              {(props) => <MeusChamados {...props} user={user} />}
            </Drawer.Screen>
          ) : null}

          {isUserLoggedIn ? (
          <Drawer.Screen name="Logout">
            {(props) => (
              <Logout
                {...props}
                updateUserLoggedIn={updateUserLoggedIn}
              />
            )}
          </Drawer.Screen>
        ) : (
          <Drawer.Screen name="Login" options={{ title: "Login" }}>
            {(props) => (
              <Login {...props} updateUserLoggedIn={updateUserLoggedIn} />
            )}
          </Drawer.Screen>
        )}
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
