import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { format } from "date-fns";
import { PaperProvider } from 'react-native-paper';
import { ButtonList } from '../components/CommonComponents/Common';
export default Home = ({navigation}) => {
    const events = {
        '2024-04-20': [{ time: '09:00', title: 'Meeting 1' }, { time: '13:30', title: 'Meeting 2' }],
        '2024-04-24': [{ time: '09:00', title: 'Meeting 1' }, { time: '14:30', title: 'Meeting 2' }],
        '2024-04-25': [{ time: '09:00', title: 'Meeting 1' }, { time: '15:30', title: 'Meeting 2' }],
    };

    const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));

    const handleDayPress = (day) => {
        setSelectedDate(day.dateString);
    };


    const handleRenderItem = (item) => {
        const { time, title } = item;
        return (
            <View style={{ padding: 10 }}>
                <Text>{time}</Text>
                <Text>{title}</Text>
            </View>
        )
    }

    const btnList = [
        {
            label: "Add",
            icon: "calendar-plus",
            mode: "outlined",
            callback: () => navigation.navigate("Add Event")
        },
        {
            label: "Search",
            icon: "magnify",
            mode: "contained",
            callback: () => console.log('Pressed')
        }
    ]

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        centeredText: {
            textAlign: 'center',
        }
    });

    return (
        <PaperProvider>
            <View style={{ flex: 1 }}>
                {(
                    <Agenda
                        items={events}
                        renderItem={handleRenderItem}
                        selected={selectedDate}
                        onDayPress={handleDayPress}
                        showOnlySelectedDayItems={true}
                        showClosingKnob={true}
                        renderEmptyData={() => {
                            return (
                                <View style={styles.container}>
                                    <Text style={styles.centeredText}>No Events</Text>
                                </View>
                            )
                        }}
                    />
                )}
            </View>
         <ButtonList btns={btnList} />
        </PaperProvider>
    );

    
}