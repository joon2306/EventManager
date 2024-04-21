import { Button, Snackbar } from "react-native-paper";
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
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'space-between',
        },
    });

    return (
        <View style={styles.container}>
            <Snackbar
                visible={isVisible}>
                {message}
            </Snackbar>
        </View>
    );
}




export { ButtonList, Banner };