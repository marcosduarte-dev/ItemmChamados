import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import NavBar from "./NavBar";
import { Dropdown } from "react-native-element-dropdown";

export default function AbrirChamado({ navigation }) {
  // DropDown
  const items = [
    { label: "Pedagógico", value: "Pedagógico" },
    { label: "Seleção", value: "Seleção" },
    { label: "Social", value: "Social" },
    { label: "Departamento Pessoal", value: "Departamento Pessoal" },
    { label: "Comercial", value: "Comercial" },
  ];
  const [dado, setDado] = useState(null);

  // Validação Formulario
  const fieldsValidationSchema = yup.object().shape({
    titulo: yup.string().required("Esse campo não pode ser vazio"),
    descricao: yup.string().required("Esse campo não pode ser vazio"),
    departamento: yup.string().required("Esse campo não pode ser vazio"),
  });

  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(fieldsValidationSchema) });
  const [image, setImage] = useState(null);

  // DATA
  const dataAtual = new Date();
  const dataFormatada = `${dataAtual.getDate()}/${
    dataAtual.getMonth() + 1
  }/${dataAtual.getFullYear()}`;
  const tempoFormatado = `${dataAtual.getHours()}:${dataAtual.getMinutes()}`;

  // GERADOR DE ID
  const [itemId, setItemId] = useState("");

  const gerarID = () => {
    const randomDigits = Math.floor(Math.random() * 1000000);
    const paddedDigits = String(randomDigits).padStart(6, "0");
    const id = `ITEMM${paddedDigits}`;
    setItemId(id);
  };

  useEffect(() => {
    gerarID();
  }, []);

  // REALIZAR POST NO BANCO DE DADOS
  const onSubmit = (data) => {
    gerarID();
    const postData = {
      id: itemId,
      titulo: data.titulo,
      descricao: data.descricao,
      departamento: data.departamento,
      status: "Aberto",
      dataAbertura: `${dataFormatada} ${tempoFormatado}`,
    };

    fetch("https://itemmchamados-default-rtdb.firebaseio.com/Chamados/.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log("Chamado aberto com Sucesso!:", responseData);
        reset();
        setImage(null);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // INPUTS PADRONIZADOS
  const TextField = ({ error, label, ...inputProps }) => (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, !!error && styles.borderError]}
        {...inputProps}
      />
      {!!error && <Text style={styles.errorText}>{error.message}</Text>}
    </View>
  );

  useEffect(() => {
    register("titulo");
    register("descricao");
    register("departamento");
  }, [register]);

  return (
    <View style={styles.mainContainer}>
      <NavBar navigation={navigation}></NavBar>
      <View style={styles.viewPrincipal}>
        <ScrollView style={{ padding: 15 }}>
          <Text style={styles.titulo}>Abertura</Text>
          <Text style={styles.label}>Departamento</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            data={items}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Selecione um departamento"
            searchPlaceholder="Search..."
            value={dado}
            onChange={(item) => {
              setDado(item.value);
              setValue("departamento", item.value);
            }}
          />
          <TextField
            label={"Titulo"}
            error={errors.titulo}
            placeholder={"Digite o titulo do chamado"}
            placeholderTextColor="grey"
            onChangeText={(text) => setValue("titulo", text)}
          />
          <TextField
            label={"Descrição"}
            error={errors.descricao}
            placeholder={"Descreva o seu problema"}
            placeholderTextColor="grey"
            onChangeText={(text) => setValue("descricao", text)}
          />
          <Pressable
            style={styles.button_cadastrar}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.btn_text_imagem}>Abrir Chamado</Text>
          </Pressable>
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
  container: {
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "black",
  },
  input: {
    height: 50,
    width: 350,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    color: "black",
  },
  errorText: {
    color: "red",
    fontSize: 12,
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
  dropdown: {
    height: 50,
    width: 350,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  placeholderStyle: {
    fontSize: 14,
    color: "gray",
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
