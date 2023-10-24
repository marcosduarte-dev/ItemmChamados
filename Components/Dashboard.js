import { StyleSheet, View, ScrollView, Text as RnText } from "react-native";
import NavBar from "./NavBar";
import { PieChart } from "react-native-svg-charts";
import { Text as SvgText } from "react-native-svg";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  collection,
  getDocs,
  getFirestore,
  or,
  query,
  where,
} from "firebase/firestore";

export default function Dashboard({ navigation, user }) {
  const [data, setData] = useState([
    {
      key: 1,
      amount: 50,
      svg: { fill: "#ED7D31" },
    },
    {
      key: 2,
      amount: 50,
      svg: { fill: "#A5A5A5" },
    },
    {
      key: 3,
      amount: 40,
      svg: { fill: "#4472C4" },
    },
  ]);

  /*var data = [
    {
      key: 1,
      amount: 50,
      svg: { fill: "#ED7D31" },
    },
    {
      key: 2,
      amount: 50,
      svg: { fill: "#A5A5A5" },
    },
    {
      key: 3,
      amount: 40,
      svg: { fill: "#4472C4" },
    },
  ];*/

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
      var status = doc.data().status;
      console.log(status);
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

    setData(newData); // Atualiza o array data com os novos valores
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
            style={{ height: 350, width: 350 }}
            valueAccessor={({ item }) => item.amount}
            data={data}
            spacing={0}
            outerRadius={"100%"}
          >
            <Labels />
          </PieChart>

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
});
