import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Platform, TouchableOpacity, Text, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ButtonList, Banner, ModalAlert } from '../CommonComponents/Common';
import { Modal, Portal, Provider, Button as PaperButton, Button } from 'react-native-paper';

const EventForm = ({ eventName: initialEventName = '', eventDate: initialEventDate = new Date(), eventTime: initialEventTime = new Date(), eventDescription: initialEventDescription = '', navigation }) => {
    const [eventName, setEventName] = useState(initialEventName);
    const [eventDate, setEventDate] = useState(initialEventDate);
    const [description, setDescription] = useState(initialEventDescription);
    const [time, setTime] = useState(initialEventTime);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const [bannerVisible, setBannerVisible] = useState(false);

    const btnList = [
        {
            label: "Add",
            icon: "calendar-plus",
            mode: "outlined",
            callback: () => handleSubmit()
        }
    ]

    const handleEventDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || eventDate;
        setShowDatePicker(Platform.OS === 'ios');
        setEventDate(currentDate);
    };

    const handleTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime || time;
        console.log("currentTime: ", currentTime);
        setShowTimePicker(Platform.OS === 'ios');
        setTime(currentTime);
    };

    const showDatePickerModal = () => {
        setShowDatePicker(true);
    };

    const showTimePickerModal = () => {
        setShowTimePicker(true);
    };

    const handleSubmit = () => {
        if (!eventName || !eventDate || !description) {
            setModalMessage('All fields are required.');
            setModalVisible(true);
            return;
        }

        if (eventDate < new Date()) {
            setModalMessage('Date cannot be in the past.');
            setModalVisible(true);
            return;
        }

        setBannerVisible(true);
        console.log('Event Name:', eventName);
        console.log('Event Date:', eventDate.toDateString());
        console.log('Time:', time.toLocaleTimeString());
        console.log('Description:', description);
        console.log("banner visible: ", bannerVisible);
        setTimeout(() => {
            navigation.navigate("Events")
            setBannerVisible(false);
        }, 1000)

    };

    return (
        <Provider>
            <View style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.container}>
                    <TextInput
                        style={styles.input}
                        placeholder="Event Name"
                        onChangeText={(text) => setEventName(text)}
                        value={eventName}
                    />
                    <TouchableOpacity style={styles.input} onPress={showDatePickerModal}>
                        <Text>{eventDate.toDateString()}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={eventDate}
                            mode="date"
                            is24Hour={true}
                            display="default"
                            onChange={handleEventDateChange}
                        />
                    )}
                    <TouchableOpacity style={styles.input} onPress={showTimePickerModal}>
                        <Text>{time.toLocaleTimeString()}</Text>
                    </TouchableOpacity>
                    {showTimePicker && (
                        <DateTimePicker
                            testID="timePicker"
                            value={time}
                            mode="time"
                            is24Hour={true}
                            display="default"
                            onChange={handleTimeChange}
                        />
                    )}
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Description"
                        multiline
                        numberOfLines={4}
                        onChangeText={(text) => setDescription(text)}
                        value={description}
                    />
                </ScrollView>
                <ModalAlert modalVisible={modalVisible} setModalVisible={setModalVisible} modalMessage={modalMessage} ></ModalAlert>
                <View style={styles.footer}>
                <Button icon="calendar-plus" mode="outlined" style={{marginHorizontal: 20}} onPress={handleSubmit}> Add</Button>
                    <Banner message={"Event Added"} isVisible={bannerVisible} />
                </View>
            </View>

        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical: 40,
        backgroundColor: "#f2f4f5"

    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        justifyContent: 'center',
        marginVertical:10
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    }
});

export default EventForm;
