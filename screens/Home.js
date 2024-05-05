import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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

    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }



    const handleRenderItem = (item) => {
        console.log("item rendered: ", item);
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
        const eventMap = {};
        _.forOwn(events, (event, date) => {
            const eventFound = event.some(e => e.title && e.title.toLowerCase().indexOf(txt) > -1);
            if (eventFound) {
                eventMap[date] = event;
            }
        });
        return eventMap;
    }

    const notify = msg => {
        setBannerMsg(msg);
        setBannerVisible(true);
        setTimeout(() => setBannerVisible(false), 1000);
    }

    const buildDateList = (eventMap) => {
        const handleDateClick = (date) => {
            // Do something when a date is clicked
            setModalVisible(false);
            setSelectedDate(date);
        };
    
        // Convert the eventMap object into an array of React elements
        const dateElements = [];
        for (const date in eventMap) {
            const events = eventMap[date];
            events.forEach(({ title }) => {
                dateElements.push(
                    <TouchableOpacity key={generateUUID()} onPress={() => handleDateClick(date)}>
                        <Text style={{ marginVertical: 5 }}>{title}</Text>
                    </TouchableOpacity>
                );
            });
        }
    
        return <ScrollView>{dateElements}</ScrollView>;
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
            if (!_.isEmpty(eventDates)) {
                const keys = Object.keys(eventDates);
                if (keys.length > 1) {
                    setModalMessage(buildDateList(eventDates));
                    setModalVisible(true);
                } else {
                    setSelectedDate(keys[0]);
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
            <ModalAlert modalVisible={modalVisible} setModalVisible={setModalVisible} modalMessage={modalMessage} hideBtn={true} ></ModalAlert>

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