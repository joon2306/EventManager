import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Button, Platform, TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ButtonList } from '../CommonComponents/Common';

const EventForm = ({ eventName: initialEventName = '', eventDate: initialEventDate = new Date(), eventTime: initialEventTime = new Date(), eventDescription: initialEventDescription = '' }) => {
  const [eventName, setEventName] = useState(initialEventName);
  const [eventDate, setEventDate] = useState(initialEventDate);
  const [description, setDescription] = useState(initialEventDescription);
  const [time, setTime] = useState(initialEventTime);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

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
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    if(eventDate < new Date()) {
        Alert.alert('Validation Error', 'Date cannot be in the past.');
    }

    console.log('Event Name:', eventName);
    console.log('Event Date:', eventDate.toDateString());
    console.log('Time:', time.toLocaleTimeString());
    console.log('Description:', description);
  };

  return (
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
      <ButtonList btns={btnList} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    justifyContent: 'center',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default EventForm;
