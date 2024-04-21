import { View, Text, StyleSheet, Dimensions } from "react-native"
import EventForm from "../components/FormComponents/AddEvent"
import { parseISO } from 'date-fns'


export default Add = ({ navigation }) => {



    const dateString = '2024-01-12';
    const dateObject = parseISO(dateString);


    return (
        <EventForm navigation={navigation} />  
    )
}