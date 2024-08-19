import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { format, parse } from "date-fns";
import { PaperProvider, Button, Searchbar, Portal, ActivityIndicator } from 'react-native-paper';
import _ from 'lodash';
import { Banner, ModalAlert } from '../components/CommonComponents/Common';
import eventTypeEnum from '../utils/EventTypeEnum';
import eventsService from '../service/EventsService';
import { useFocusEffect } from '@react-navigation/native';
import EventUtils from '../utils/EventUtils';

export default Home = ({ navigation }) => {
    const [events, setEvents] = useState({});

    const [fetchError, setFetchError] = useState(false);

    const initEvents = () => {
        eventsService.fetchEvents().then(({ data, error }) => {
            if (error != null) {
                console.error("Error fetching events:", error);
                setFetchError(true);
                return;
            }
            const builtEvents = EventUtils.buildEvents(data);
            setEvents(builtEvents);
        });
    }

    const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));

    const [searchQuery, setSearchQuery] = React.useState('');
    const [loading, setLoading] = useState(false);

    const [isBannerVisible, setBannerVisible] = useState(false);

    const [bannerMsg, setBannerMsg] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleDayPress = (day) => {
        setActiveDate(day.dateString);
    };

    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    const setActiveDate = (date) => {
        const findMissingDate = (events) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set time to beginning of the day for accurate comparison

            let currentDate = new Date(today);

            while (true) {
                const dateString = currentDate.toISOString().split('T')[0]; // Get date string in YYYY-MM-DD format

                if (!(dateString in events)) {
                    return dateString;
                }

                currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
            }
        }

        const missingDate = findMissingDate(events);
        setSelectedDate(missingDate);
        setTimeout(() => setSelectedDate(date), 0);
    }

    const edit = (item) => {
        navigation.navigate('Add Event', { eventDate: selectedDate, eventName: item.title, eventType: item.eventType, eventDescription: item.description, eventId: item.id });
    }



    const handleRenderItem = (item) => {
        const { eventType, title } = item;

        const type = eventTypeEnum[eventType];


        return (
            <View style={{flex: 1, justifyContent: "center"}}>
                <TouchableOpacity onLongPress={() => edit(item)}>
                    <Text>{title.toUpperCase()}</Text>
                    <Text>{type.toLowerCase()}</Text>
                </TouchableOpacity>
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
        if (_.isEmpty(txt)) {
            return {};
        }
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
            setActiveDate(date);
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

        return (
            <View style={{ maxWidth: 200, maxHeight: 200 }}>
                <ScrollView style={{ flex: 1 }}>
                    {dateElements}
                </ScrollView>
            </View>
        );
    };


    const handleSearch = () => {
        const date = getDate(searchQuery);
        if (date !== null) {
            addLoader();
            setActiveDate(format(date, "yyyy-MM-dd"));
            return;
        } else if (isYear(searchQuery)) {
            addLoader();
            const year = Number(searchQuery);
            setActiveDate(format(new Date(year, 0, 1), "yyyy-MM-dd"));
            return;
        } else {
            const eventDates = findEventDates(searchQuery);
            if (!_.isEmpty(eventDates)) {
                const keys = Object.keys(eventDates);
                if (keys.length > 1) {
                    setModalMessage(buildDateList(eventDates));
                    setModalVisible(true);
                } else {
                    setActiveDate(keys[0]);
                }
            } else {
                notify("No event found");
            }
        }
    }

    useFocusEffect(
        useCallback(() => {
            initEvents();  // This will run every time the screen comes into focus

            return () => {
                // Cleanup if necessary
            };
        }, [])
    );



    return (
        <PaperProvider>
            {
                _.isEmpty(events) && !fetchError && (
                    <View style={styles.container}>
                        <Text style={styles.centeredText}>Loading events...</Text>
                    </View>
                )
            }

            {
                fetchError && (
                    <View style={styles.container}>
                        <Text style={styles.centeredText}>Connection Error... Try Later</Text>
                    </View>
                )
            }


            {
                !_.isEmpty(events) && !fetchError && (
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
                )
            }
            <ModalAlert modalVisible={modalVisible} setModalVisible={setModalVisible} modalMessage={modalMessage} hideBtn={true} ></ModalAlert>

            {
                !_.isEmpty(events) && !fetchError && (
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
                )
            }

        </PaperProvider>
    );


}