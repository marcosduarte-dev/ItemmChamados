import { StyleSheet, View, Text, TextInput, Pressable } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import NavBar from "./NavBar";
import { ScrollView } from "react-native-gesture-handler";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

export default function DetalhesChamado({ navigation, route }) {
  var { chamado, idKey, updateDetalhes } = route.params;
  const [listaAnalista, setListaAnalista] = useState([]);
  const [listaMensagens, setListaMensagens] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [permissaoAnalista, setPermissaoAnalista] = useState(false);
  const db = getFirestore();

  var email = "";

  // DATA
  const dataAtual = new Date();
  const dataFormatada = `${dataAtual.getDate()}/${
    dataAtual.getMonth() + 1
  }/${dataAtual.getFullYear()}`;
  const tempoFormatado = `${dataAtual.getHours()}:${dataAtual.getMinutes()}`;

  // DropDown
  const status = [
    { label: "Aberto", value: "Aberto" },
    { label: "Andamento", value: "Andamento" },
    { label: "Finalizado", value: "Finalizado" },
    { label: "Reaberto", value: "Reaberto" },
    { label: "Pausado", value: "Pausado" },
  ];

  const departamento = [
    { label: "Pedagógico", value: "Pedagógico" },
    { label: "Seleção", value: "Seleção" },
    { label: "Social", value: "Social" },
    { label: "Departamento Pessoal", value: "Departamento Pessoal" },
    { label: "Comercial", value: "Comercial" },
  ];

  const fetchData = async () => {
    const ref = query(
      collection(db, "usuarios"),
      where("permissao", "==", "analista")
    );
    const querySnapshot = await getDocs(ref);
    const analistas = [];
    const permissao = await AsyncStorage.getItem("permissao");

    if (permissao == "analista") {
      setPermissaoAnalista(true);
    } else {
      setPermissaoAnalista(false);
    }

    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      const email = docData.email;
      analistas.push({ label: email, value: email });
    });
    setListaAnalista(analistas);
  };

  const fetchMensagens = async () => {
    const ref = query(
      collection(db, "mensagens"),
      where("idChamado", "==", chamado.ID)
    );
    const querySnapshot = await getDocs(ref);
    const mensagens = [];

    await querySnapshot.forEach((doc) => {
      const docData = doc.data();
      mensagens.push({
        mensagem: docData.mensagem,
        dataMensagem: docData.dataMensagem,
        enviadoPor: docData.enviadoPor,
      });
    });
    setListaMensagens(mensagens);
  };

  useEffect(() => {
    fetchData();
    fetchMensagens();
    return () => {
      updateDetalhes(false);
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
      fetchMensagens();
    }, [chamado])
  );

  // INPUTS PADRONIZADOS
  const TextField = ({ error, label, ...inputProps }) => (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, !!error && styles.borderError]}
        {...inputProps}
        editable={false}
      />
      {!!error && <Text style={styles.errorText}>{error.message}</Text>}
    </View>
  );

  const atualizarChamado = () => {
    updateDoc(doc(db, "chamados", idKey), chamado)
      .then(() => {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Sucesso",
          textBody: `Chamado ${chamado.ID} atualizado com sucesso!`,
        });
      })
      .catch((error) => {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Erro",
          textBody: `Deu um erro ao tentar atualizar o chamado!`,
        });
      });
  };

  const enviarMensagem = async () => {
    email = await AsyncStorage.getItem("email");

    const docRef = addDoc(collection(db, "mensagens"), {
      idChamado: chamado.ID,
      mensagem: mensagem,
      dataMensagem: `${dataFormatada} ${tempoFormatado}`,
      enviadoPor: email,
    })
      .then(() => {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Sucesso",
          textBody: `Mensagem enviada com sucesso!`,
        });
        fetchMensagens();
      })
      .catch(() => {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Erro",
          textBody: `Deu um erro ao tentar enviar uma nova mensagem!`,
        });
      });
  };

  return (
    <AlertNotificationRoot>
      <ScrollView style={styles.bg_itemm}>
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
          <Text style={styles.titulo}>{chamado.ID}</Text>

          <TextField
            label={"Titulo"}
            placeholder={"Titulo do chamado"}
            placeholderTextColor="grey"
            value={chamado.titulo}
          />
          <TextField
            label={"Data de Abertura"}
            placeholder={"Data de Abertura"}
            placeholderTextColor="grey"
            value={chamado.dataAbertura}
          />
          <Text style={styles.label}>Status</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={status}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Selecione um status"
            value={chamado.status}
            onChange={(item) => {
              chamado.status = item.value;
            }}
            disable={!permissaoAnalista}
          />
          <TextField
            label={"Solicitante"}
            placeholder={"Não encontrado o solicitante desse chamado"}
            placeholderTextColor="grey"
            value={chamado.solicitante}
          />
          <Text style={styles.label}>Departamento</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={departamento}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Selecione um departamento"
            value={chamado.departamento}
            onChange={(item) => {
              chamado.departamento = item.value;
            }}
            disable={!permissaoAnalista}
          />
          <Text style={styles.label}>Analista</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={listaAnalista}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Selecione um analista"
            value={chamado.analista}
            onChange={(item) => {
              chamado.analista = item.value;
            }}
            disable={!permissaoAnalista}
          />
          <View style={styles.container}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input]}
              multiline
              editable={false}
              value={chamado.descricao}
            />
          </View>

          {permissaoAnalista ? (
            <Pressable
              style={styles.button_cadastrar}
              onPress={() => atualizarChamado()}
            >
              <Text style={styles.btn_text_imagem}>Salvar</Text>
            </Pressable>
          ) : null}

          <View style={styles.container}>
            <Text style={styles.label}>Mensagens</Text>
            <TextInput
              style={[styles.input]}
              multiline
              editable={true}
              placeholder="Digite uma mensagem para enviar!"
              onChangeText={(item) => setMensagem(item)}
            />
          </View>

          <Pressable
            style={styles.button_cadastrar}
            onPress={() => enviarMensagem()}
          >
            <Text style={styles.btn_text_imagem}>Enviar Mensagem</Text>
          </Pressable>

          <View style={styles.container}>
            <Text style={styles.label}>Histórico</Text>
            <>
              {listaMensagens.map((item, index) => (
                <View key={index} style={styles.historico}>
                  <Text style={{ fontWeight: "bold" }}>Mensagem: </Text>
                  <Text>{item.mensagem} </Text>
                  <Text style={{ fontWeight: "bold" }}>Data: </Text>
                  <Text>{item.dataMensagem} </Text>
                  <Text style={{ fontWeight: "bold" }}>Enviado por: </Text>
                  <Text>{item.enviadoPor}</Text>
                </View>
              ))}
            </>
          </View>
        </View>
      </ScrollView>
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
    minHeight: 50,
    minWidth: 350,
    // height: 50,
    // width: 350,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    color: "black",
    marginBottom: 24,
    marginTop: 4,
  },

  btn_text_imagem: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  dropdown: {
    height: 50,
    width: 365,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 24,
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
    marginTop: 4,
    marginBottom: 24,
  },
  placeholderStyle: {
    fontSize: 14,
    color: "gray",
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  historico: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 12,
  },
});
