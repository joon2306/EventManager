import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { format, parse } from "date-fns";
import { PaperProvider, Button, Searchbar, Portal, ActivityIndicator } from 'react-native-paper';
import _ from 'lodash';
import { Banner, ModalAlert } from '../components/CommonComponents/Common';

export default Home = ({ navigation }) => {
    const events = {
        '2024-04-20': [{ time: '09:00', title: 'Meeting 1' }, { time: '13:30', title: 'Meeting 2' }],
        '2024-04-24': [{ time: '09:00', title: 'Meeting 3' }, { time: '14:30', title: 'Meeting 3' }],
        '2024-04-25': [{ time: '09:00', title: 'event 4' }, { time: '15:30', title: 'event 5' }],
    };

    const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));

    const [searchQuery, setSearchQuery] = React.useState('');
    const [loading, setLoading] = useState(false);

    const [isBannerVisible, setBannerVisible] = useState(false);

    const [bannerMsg, setBannerMsg] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

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

    const findEventDates = (txt) => {
        txt = txt.toLowerCase();
        const eventDates = [];
        _.forOwn(events, (event, date) => {
            const eventFound = event.some(e => e.title && e.title.toLowerCase().indexOf(txt) > -1);
            if (eventFound) {
                eventDates.push(date);
            }
        })
        return eventDates;
    }

    const notify = msg => {
        setBannerMsg(msg);
        setBannerVisible(true);
        setTimeout(() => setBannerVisible(false), 1000);
    }

    const buildDateList = (eventDates) => {
        const handleDateClick = (date) => {
            // Do something when a date is clicked
            console.log('Date clicked:', date);
        };

        return (
            <View>
                {eventDates.map((date, index) => (
                    <TouchableOpacity key={index} onPress={() => handleDateClick(date)}>
                        <Text style={{ marginVertical: 5 }}>{date}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };


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
            const eventDates = findEventDates(searchQuery);
            if (eventDates.length) {
                if (eventDates.length > 1) {
                    setModalMessage(buildDateList(eventDates));
                    setModalVisible(true);
                } else {
                    setSelectedDate(eventDates[0]);
                }
            } else {
                notify("No event found");
            }
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
            <ModalAlert modalVisible={modalVisible} setModalVisible={setModalVisible} modalMessage={modalMessage} ></ModalAlert>

            <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                <Banner message={bannerMsg} isVisible={isBannerVisible} />
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