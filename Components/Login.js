import {
    StyleSheet,
    View,
    Text,
    Pressable
} from "react-native";
import NavBar from "./NavBar";
import { TextInput } from "react-native-gesture-handler";

export default function Login({ navigation }) {

    return (
        <View style={styles.bg_itemm}>
            <NavBar navigation={navigation} />
            <View style={[{
                padding: 15, marginTop: 15
            },
            styles.bg_white]}>
                <Text style={styles.titulo}>Login</Text>
                <View>
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
                    <Pressable style={styles.btn_acessar} >
                        <Text style={styles.btn_text_imagem}>Acessar</Text>
                    </Pressable>

                </View>

            </View>

        </View>
    );
};
const styles = StyleSheet.create({
    bg_itemm: {
        backgroundColor: "#152b69"
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
        width: 350,
        marginTop: 23,
    },
    btn_text_imagem: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: "bold",
        letterSpacing: 0.25,
        color: "white",
    },

});

