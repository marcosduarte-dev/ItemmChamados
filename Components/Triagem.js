import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import NavBar from "./NavBar";
import "../config/firebase";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

export default function Triagem({ navigation, updateDetalhes }) {
  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const db = getFirestore();

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    const ref = query(
      collection(db, "chamados"),
      where("status", "==", "Aberto")
    );
    const querySnapshot = await getDocs(ref);
    const jsonData = {};

    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      const docId = doc.id;
      jsonData[docId] = docData;
    });
    setData(jsonData);
  };

  const abrirDetalhes = async (chamado, idKey) => {
    await updateDetalhes(true);
    navigation.navigate("DetalhesChamado", {
      chamado: chamado,
      idKey: idKey,
      updateDetalhes: () => updateDetalhes(),
    });
  };

  return (
    <View style={styles.bg_itemm}>
      <ScrollView>
        <NavBar navigation={navigation} />
        <View style={[{ padding: 15, marginTop: 15 }, styles.bg_white]}>
          <Text style={styles.titulo}>Triagem</Text>
          {Object.keys(data).map((idKey) => {
            const {
              dataAbertura,
              departamento,
              descricao,
              ID,
              status,
              titulo,
            } = data[idKey];
            const isSelected = idKey === selectedId;
            if (status === "Aberto") {
              return (
                <Pressable
                  onPress={() => abrirDetalhes(data[idKey], idKey)}
                  key={idKey}
                  style={styles.view}
                >
                  <View style={styles.viewID}>
                    <Text style={styles.id}>{ID}</Text>
                  </View>
                  <View style={styles.line} />
                  <Text style={styles.mt5}>
                    <Text style={styles.label}>Titulo:</Text> {titulo}
                  </Text>
                  <Text style={styles.mt5}>
                    <Text style={styles.label}>Data da Abertura:</Text>{" "}
                    {dataAbertura}
                  </Text>
                  <Text style={styles.mt5}>
                    <Text style={styles.label}>Departamento:</Text>{" "}
                    {departamento}
                  </Text>
                  <Text style={styles.mt5}>
                    <Text style={styles.label}>Status:</Text> {status}
                  </Text>
                </Pressable>
              );
            }

            return null;
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg_itemm: {
    backgroundColor: "#152b69",
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
  id: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  mt5: {
    marginTop: 5,
    fontSize: 14.5,
  },
  viewID: {
    marginBottom: 12,
    textAlign: "center",
  },
  line: {
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    marginBottom: 5,
  },
  titulo: {
    color: "#022562",
    fontSize: 28,
    textAlign: "center",
    marginBottom: 15,
  },
});
