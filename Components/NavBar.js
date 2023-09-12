import { StyleSheet, Text, View, Image } from "react-native";
import { useFonts } from "expo-font";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function NavBar({ navigation }) {

  return (
    <View style={styles.fundo}>
      
      <Ionicons
        onPress={() => navigation.toggleDrawer()}
        name="menu"
        size={38}
        color="white"
      />
      <Image
        source={require("../assets/logo_novo.png")}
        style={{ width: 200, height: 60 }}
      />
      <Text> </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fundo: {
    marginTop: 40,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#152b69",
    padding: 15,
    height: 'auto'
  },
  text: {
    color: "white",
  },
});
