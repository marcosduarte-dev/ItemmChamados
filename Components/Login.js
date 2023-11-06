import "../config/firebase";
import { StyleSheet, View, Text, Pressable } from "react-native";
import NavBar from "./NavBar";
import { TextInput } from "react-native-gesture-handler";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

const auth = getAuth();

export default function Login({ navigation, updateUserLoggedIn }) {
  const [value, setValue] = useState({
    email: "",
    password: "",
    error: "",
  });

  const db = getFirestore();

  const fetchData = async () => {
    const ref = query(
      collection(db, "usuarios"),
      where("email", "==", value.email)
    );
    const querySnapshot = await getDocs(ref);
    const jsonData = {};

    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      const docId = doc.id;
      jsonData[docId] = docData;
    });
    const chave = Object.keys(jsonData)[0];
    const departamento =
      jsonData[chave].departamento !== undefined
        ? jsonData[chave].departamento
        : "";
    const permissao =
      jsonData[chave].permissao !== undefined ? jsonData[chave].permissao : "";
    await AsyncStorage.setItem("departamento", departamento);
    await AsyncStorage.setItem("permissao", permissao);
  };

  async function signIn() {
    if (value.email === "" || value.password === "") {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Erro",
        textBody: "Precisa preencher email e senha!",
      });
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, value.email, value.password);
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Successo",
        textBody: "Logado com sucesso!",
      });
      await AsyncStorage.setItem("email", value.email);
      await fetchData();
      const permissao = await AsyncStorage.getItem("permissao");
      updateUserLoggedIn(true, permissao);
      if (permissao == "analista") navigation.navigate("Triagem");
      else navigation.navigate("MeusChamados");
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Erro",
        textBody: "Erro ao fazer login!",
      });
    }
  }

  return (
    <AlertNotificationRoot>
      <View style={styles.bg_itemm}>
        <NavBar navigation={navigation} />
        <View
          style={[
            {
              padding: 15,
              marginTop: 15,
            },
            styles.bg_white,
          ]}
        >
          <Text style={styles.titulo}>Login</Text>
          <View style={styles.login_flex}>
            <Text>Usuário:</Text>
            <TextInput
              placeholder="user.name"
              style={styles.input}
              value={value.email}
              onChangeText={(text) => setValue({ ...value, email: text })}
            />
            <Text>Senha:</Text>
            <TextInput
              secureTextEntry={true}
              placeholder="******"
              style={styles.input}
              value={value.password}
              onChangeText={(text) => setValue({ ...value, password: text })}
            />

            <Pressable onPress={signIn} style={styles.btn_acessar}>
              <Text style={styles.btn_text_imagem}>Acessar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </AlertNotificationRoot>
  );
}
const styles = StyleSheet.create({
  bg_itemm: {
    backgroundColor: "#152b69",
    flex: 1,
  },
  view: {
    marginBottom: 15,
    borderColor: "#95CB63",
    borderWidth: 2,
    borderRadius: 18,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    padding: 12,
    elevation: 5,
  },
  bg_white: {
    backgroundColor: "white",
    minHeight: "100%",
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
  },
  titulo: {
    color: "#022562",
    fontSize: 28,
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    height: 50,
    width: 350,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    color: "black",
    marginBottom: 24,
    marginTop: 4,
  },
  btn_acessar: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#152C67",
    marginTop: 23,
  },
  btn_text_imagem: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  warning_message: {
    backgroundColor: "#8C2A0B",
    borderRadius: 8,
  },
  warning_text: {
    color: "#FFFFFFFF",
    fontSize: 16,
    textAlign: "center",
    margin: 24,
  },
  login_flex: {
    flex: 0.8,
  },
});
