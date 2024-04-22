import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { format, parse } from "date-fns";
import { PaperProvider, Button, Searchbar, Portal, ActivityIndicator } from 'react-native-paper';
import { ButtonList } from '../components/CommonComponents/Common';
export default Home = ({ navigation }) => {
    const events = {
        '2024-04-20': [{ time: '09:00', title: 'Meeting 1' }, { time: '13:30', title: 'Meeting 2' }],
        '2024-04-24': [{ time: '09:00', title: 'Meeting 1' }, { time: '14:30', title: 'Meeting 2' }],
        '2024-04-25': [{ time: '09:00', title: 'Meeting 1' }, { time: '15:30', title: 'Meeting 2' }],
    };

    const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));

    const [searchQuery, setSearchQuery] = React.useState('');
    const [loading, setLoading] = useState(false);

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

    const getDate = (txt) => {
        const dateFormats = [
            'yyyy-MM-dd',
            'dd-MM-yyyy',
            'MM-dd-yyyy',
            'yyyy/MM/dd',
            'dd/MM/yyyy',
            'MM/dd/yyyy'
        ];

        for (let dateFormat of dateFormats) {
            const parsedDate = parse(txt, dateFormat, new Date());
            if (!isNaN(parsedDate.getTime())) {
                return parsedDate; // Return the parsed date if successful
            }
        }
        return null
    }

    const isYear = (txt) => {
        const regex = /^\d{4}$/;
        return regex.test(txt);
    }

    const addLoader = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }


    const handleSearch = () => {
        const date = getDate(searchQuery);
        if (date !== null) {
            addLoader();
            setSelectedDate(format(date, "yyyy-MM-dd"));
            return;
        } else if (isYear(searchQuery)) {
            addLoader();
            const year = Number(searchQuery);
            setSelectedDate(format(new Date(year, 0, 1), "yyyy-MM-dd"));
            return;
        } else {
            // do something else
        }
    }

    return (
        <PaperProvider>
            <View style={{ flex: 1 }}>
                {loading &&
                    <Portal>
                        <ActivityIndicator style={{ marginTop: '80%' }} size={"large"}></ActivityIndicator>
                    </Portal>}
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

            <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                <Button icon="calendar-plus" mode="outlined" style={{ marginHorizontal: 20 }} onPress={() => navigation.navigate("Add Event")}> Add</Button>
                <Searchbar
                    placeholder="Search"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    onIconPress={handleSearch}
                    style={{ margin: 20 }}

                />
            </View>
        </PaperProvider>
    );


}