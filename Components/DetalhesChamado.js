import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Pressable
} from "react-native";
import { useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import NavBar from "./NavBar";

//navifation added to test page - remove before implementation

export default function DetalhesChamado({ navigation }) {
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

    const analistas = [
        { label: "Analista 1", value: "Analista1" },
        { label: "Analista 2", value: "Analista2" },
        { label: "Analista 3", value: "Anslista3" },
    ];
    const [dado, setDado] = useState(null);


    return (
        <View style={styles.bg_itemm}>
            <NavBar navigation={navigation} />
            <View style={[{
                padding: 15,
                marginTop: 15
            },
            styles.bg_white
            ]}>
                <Text style={styles.titulo}>ID do Chamado</Text>
            </View>

            {/* Campos de detalhes do chamado */}
            <View>

                <Text>Titulo</Text>
                <TextInput></TextInput>

                <Text>Data de abertura</Text>
                <TextInput></TextInput>

                <Text>Status</Text>
                <TextInput></TextInput>

                <Text>Analista</Text>
                <TextInput></TextInput>

                <Text>Descrição</Text>
                <TextInput></TextInput>

                <Pressable
                    style={styles.button_cadastrar}
                // onPress={handleSubmit(onSubmit)}
                >
                    <Text>Enviar mensagem</Text>
                </Pressable>

                <Text>Histórico</Text>
                <TextInput></TextInput>

            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    bg_itemm: {
        backgroundColor: "#152b69",
        flex: 1,
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
        fontWeight: 'bold',
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

    btn_text_imagem: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: "bold",
        letterSpacing: 0.25,
        color: "white",
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

