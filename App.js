import "react-native-gesture-handler";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AbrirChamado from './Components/AbrirChamado';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from "@react-navigation/native";

const Drawer = createDrawerNavigator();

export default function App() {

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
      <StatusBar style="auto" />
    </View>
  );
}

function DrawerNavigator() {
  return (
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
      <Drawer.Screen name="Abertura" component={AbrirChamado} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    minHeight: "100%",
  },
});
