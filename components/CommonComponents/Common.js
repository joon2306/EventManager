import { Button, Snackbar, Modal, Portal, Button as PaperButton} from "react-native-paper";
import { View, StyleSheet, Text } from "react-native";
import React from "react";

const ButtonList = ({ btns }) => {
    const calculateBtnMargin = () => {
        if (btns.length === 2) {
            return 15;
        } else if (btns.length === 3) {
            return 10;
        } else {
            return 5;
        }
    }

    const btnStyles = StyleSheet.create({
        container: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: "center",
            backgroundColor: "#f2f4f5"
        },
        btn: {
            marginVertical: 20,
            marginHorizontal: calculateBtnMargin()
        },
    });

    return (
        <View style={btnStyles.container}>
            {
                btns.map((btn, index) => {
                    return <Button key={index} style={btnStyles.btn} icon={btn.icon} mode={btn.mode} onPress={btn.callback}>{btn.label}</Button>
                })
            }
        </View>
    )
}


const Banner = ({ message, isVisible }) => {
    return (
        <Portal>
            <Snackbar
                visible={isVisible}>
                {message}
            </Snackbar>
        </Portal>
    );
}

const ModalAlert = ({modalVisible, setModalVisible, modalMessage}) => {
    const styles = StyleSheet.create({
        modalContainer: {
            backgroundColor: 'white',
            padding: 20,
            margin: 50,
            borderRadius: 10,
            alignItems: 'center',
        },
        modalMessage: {
            marginBottom: 20,
            textAlign: 'center',
        },
    });
    return (
        <Portal>
            <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalMessage}>{modalMessage}</Text>
                    <PaperButton onPress={() => setModalVisible(false)}>OK</PaperButton>
                </View>
            </Modal>
        </Portal>
    )
}




export { ButtonList, Banner, ModalAlert };