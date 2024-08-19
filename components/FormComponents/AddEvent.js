import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Platform, TouchableOpacity, Text, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Banner, ModalAlert } from '../CommonComponents/Common';
import { Provider, Button as PaperButton, Button, Menu } from 'react-native-paper'; // Import Menu
import eventsService from '../../service/EventsService';
import EventUtils from '../../utils/EventUtils';

const EventForm = ({ eventName: initialEventName = '', eventDate: initialEventDate = new Date(),
    eventDescription: initialEventDescription = '', initialEventType = 1, navigation, isEdit, eventId }) => {
    const [eventName, setEventName] = useState(initialEventName);
    const [eventDate, setEventDate] = useState(initialEventDate);
    const [description, setDescription] = useState(initialEventDescription);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [bannerVisible, setBannerVisible] = useState(false);
    const [bannerMsg, setBannerMsg] = useState("");
    const [modalCb, setModalCb] = useState(undefined);
    const [dayType, setDayType] = useState(initialEventType); // State to manage the selected option

    // Menu state
    const [visible, setVisible] = useState(false);

    const handleEventDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || eventDate;
        setShowDatePicker(Platform.OS === 'ios');
        setEventDate(currentDate);
    };

    const showDatePickerModal = () => {
        setShowDatePicker(true);
    };


    const handleError = (error) => {
        setBannerMsg("Connection error...");
        setBannerVisible(true);
    }

    const handleSave = ({ error }) => {
        if (error !== null) {
            handleError(error);
            return;
        }
        const msg = isEdit ? 'Event edited' : 'Event saved';
        setBannerMsg(msg);
        completeAndRedirect();
    }

    const completeAndRedirect = () => {
        setBannerVisible(true);
        setTimeout(() => {
            navigation.navigate("Events")
            setBannerVisible(false);
        }, 1000);
    }

    const handleSubmit = () => {
        if (!eventName || !eventDate || !description) {
            setModalMessage('All fields are required.');
            setModalVisible(true);
            setModalCb(undefined);
            return;
        }

        if (eventDate < new Date()) {
            setModalMessage('Date cannot be in the past.');
            setModalVisible(true);
            setModalCb(undefined);
            return;
        }
        eventsService.saveEvent({ eventName, description, eventDate: EventUtils.handleDateConversion(eventDate), dayType, eventId })
            .then(handleSave);
    };

    const handleDelete = () => {
        const deleteCb = () => {
            eventsService.deleteEventById(eventId).then(({ data, error }) => {
                if (error !== null) {
                    handleError();
                    return;
                }

                setBannerMsg("Event deleted");
                completeAndRedirect();
            })
        }

        setModalCb(() => deleteCb);

        setModalMessage("Are you sure you want to delete this event?")
        setModalVisible(true);

    }

    const displayBtn = () => {
        if (!isEdit) {
            return <Button icon="calendar-plus" mode="outlined" style={{ marginHorizontal: 20 }} onPress={handleSubmit}> Add</Button>
        }
        return (
            <View>
                <Button icon="calendar-plus" mode="outlined" style={{ marginVertical: 10 }} onPress={handleSubmit}> Edit</Button>
                <Button icon="calendar-plus" mode="outlined" onPress={handleDelete}> Delete</Button>
            </View>
        )
    }

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
                    <Menu
                        visible={visible}
                        onDismiss={() => setVisible(false)}
                        anchor={
                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => setVisible(true)}
                            >
                                <Text>{dayType === 1 ? 'Full Day' : 'Half Day'}</Text>
                            </TouchableOpacity>
                        }
                    >
                        <Menu.Item
                            onPress={() => {
                                setDayType(1);
                                setVisible(false);
                            }}
                            title="Full Day"
                        />
                        <Menu.Item
                            onPress={() => {
                                setDayType(2);
                                setVisible(false);
                            }}
                            title="Half Day"
                        />
                    </Menu>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Description"
                        multiline
                        numberOfLines={4}
                        onChangeText={(text) => setDescription(text)}
                        value={description}
                    />
                </ScrollView>
                <ModalAlert modalVisible={modalVisible} setModalVisible={setModalVisible} modalMessage={modalMessage} callback={modalCb} ></ModalAlert>
                <View style={styles.footer}>
                    {displayBtn()}
                    <Banner message={bannerMsg} isVisible={bannerVisible} />
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
        marginVertical: 10
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
