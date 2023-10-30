import {
  StyleSheet,
  View,
  ScrollView,
  Text as RnText,
  Pressable,
} from "react-native";
import NavBar from "./NavBar";
import { PieChart } from "react-native-svg-charts";
import { Text as SvgText } from "react-native-svg";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export default function Dashboard({ navigation, user }) {
  const [json, setJson] = useState([]);
  const [data, setData] = useState([
    {
      key: 1,
      amount: 0,
      svg: { fill: "#ED7D31" },
    },
    {
      key: 2,
      amount: 0,
      svg: { fill: "#A5A5A5" },
    },
    {
      key: 3,
      amount: 0,
      svg: { fill: "#4472C4" },
    },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const db = getFirestore();

  const fetchData = async () => {
    const ref = query(collection(db, "chamados"));
    const querySnapshot = await getDocs(ref);
    const jsonData = {};
    var intNaoAtendidos = 0;
    var intAtendidos = 0;
    var intProrrogados = 0;

    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      const docId = doc.id;
      jsonData[docId] = docData;
      var status = doc.data().status;
      if (status == "Aberto") {
        intNaoAtendidos++;
      }
      if (status == "Andamento" || status == "Finalizado") {
        intAtendidos++;
      }
      if (status == "Reaberto" || status == "Pausado") {
        intProrrogados++;
      }
    });

    const newData = data.map((item) => {
      if (item.key === 1) {
        return {
          ...item,
          amount: intNaoAtendidos,
        };
      }
      if (item.key === 2) {
        return {
          ...item,
          amount: intProrrogados,
        };
      }
      if (item.key === 3) {
        return {
          ...item,
          amount: intAtendidos,
        };
      }
      return item;
    });
    setJson(jsonData);
    setData(newData);
  };

  const gerarExcel = async () => {
    console.log("********* Gerando excel ***********");
    const jsonArray = Object.values(json);
    var ws = XLSX.utils.json_to_sheet(jsonArray);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Chamados");
    const wbout = XLSX.write(wb, {
      type: "base64",
      bookType: "xlsx",
    });
    const uri = FileSystem.cacheDirectory + "chamados.xlsx";
    await FileSystem.writeAsStringAsync(uri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Sharing.shareAsync(uri, {
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      dialogTitle: "Relatorio Chamados",
      UTI: "com.microsoft.excel.xlsx",
    });
  };

  const Labels = ({ slices, height, width }) => {
    return slices.map((slice, index) => {
      const { labelCentroid, pieCentroid, data } = slice;
      return (
        <SvgText
          key={index}
          x={pieCentroid[0]}
          y={pieCentroid[1]}
          fill={"white"}
          textAnchor={"middle"}
          alignmentBaseline={"middle"}
          fontSize={24}
          stroke={"black"}
          strokeWidth={0.2}
        >
          {data.amount}
        </SvgText>
      );
    });
  };

  return (
    <View style={styles.mainContainer}>
      <NavBar navigation={navigation}></NavBar>
      <View style={styles.viewPrincipal}>
        <ScrollView style={{ padding: 15 }}>
          <RnText style={styles.titulo}>Dashboard</RnText>
          <PieChart
            style={{ height: 350, width: 350, marginTop: 15 }}
            valueAccessor={({ item }) => item.amount}
            data={data}
            spacing={0}
            outerRadius={"100%"}
          >
            <Labels />
          </PieChart>
          <View style={{ marginTop: 15 }}>
            <View style={styles.legendaFlex}>
              <View
                style={[styles.legenda, { backgroundColor: "#4472C4" }]}
              ></View>
              <RnText style={styles.txtLegenda}>Atendidos</RnText>
            </View>
            <View style={styles.legendaFlex}>
              <View
                style={[styles.legenda, { backgroundColor: "#ED7D31" }]}
              ></View>
              <RnText style={styles.txtLegenda}>Não Atendidos</RnText>
            </View>
            <View style={styles.legendaFlex}>
              <View
                style={[styles.legenda, { backgroundColor: "#A5A5A5" }]}
              ></View>
              <RnText style={styles.txtLegenda}>Prorrogados</RnText>
            </View>
            <View style={{ marginTop: 15 }}>
              <Pressable
                style={styles.button_cadastrar}
                onPress={() => gerarExcel()}
              >
                <RnText style={styles.btn_text_imagem}>Gerar Relatorio</RnText>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: {
    color: "#022562",
    fontSize: 28,
    textAlign: "center",
    marginBottom: 15,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#152b69",
  },
  viewPrincipal: {
    alignItems: "center",
    marginTop: 15,
    backgroundColor: "white",
    height: "100%",
  },
  legendaFlex: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  legenda: {
    backgroundColor: "red",
    height: 30,
    width: 30,
    borderRadius: 6,
  },
  txtLegenda: {
    marginLeft: 12,
    fontSize: 16,
  },
  button_cadastrar: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#95CB63",
    width: 350,
    marginTop: 15,
  },
  btn_text_imagem: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
