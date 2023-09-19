import {
    StyleSheet,
    View,
    Text,
    Pressable
} from "react-native";
import NavBar from "./NavBar";
import { TextInput } from "react-native-gesture-handler";
import * as yup from "yup";


export default function Login({ navigation }) {

    const loginValidationShema = yup.object().shape({
        usuário: yup
            .string()
            .required("Informe o seu usuário"),
        senha: yup
            .string()
            .min(6, ({ min }) => 'A senha deve ter no mínimo 6 caracteres')
            .required("Informe a sua senha"),
    })

    return (

        <View style={styles.bg_itemm}>
            <NavBar navigation={navigation} />
            <View style={[{
                padding: 15, marginTop: 15
            },
            styles.bg_white]}>
                <Text style={styles.titulo}>Login</Text>

                {/* Login fields */}
                <View style={styles.login_flex}>
                    <Text>Usuário:</Text>
                    <TextInput
                        placeholder="user.name"
                        style={styles.input}
                    />
                    <Text>Senha:</Text>
                    <TextInput
                        secureTextEntry={true}
                        placeholder="******"
                        style={styles.input}
                    />

                    <Pressable
                        style={styles.btn_acessar} >
                        <Text style={styles.btn_text_imagem}>Acessar</Text>
                    </Pressable>
                </View>
                {/* Warning message for incorrect login */}
                <View style={styles.warning_message}>
                    <Text style={styles.warning_text}>Usuário ou senha incoretos.</Text>

                </View>

            </View>

        </View>
    );
};
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
        color: "#022562",
        fontSize: 16,
        textAlign: "center",
        margin: 24,
    },
    login_flex: {
        flex: 0.8
    },
});

