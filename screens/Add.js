import EventForm from "../components/FormComponents/AddEvent"
import { parseISO } from 'date-fns'
import { useRoute } from '@react-navigation/native';


export default Add = ({ navigation }) => {

    let eventName;
    let eventDate;
    let eventTime;
    let eventDescription;
    let eventType;

    const route = useRoute();

    let isEdit = false;

    if (route && route.params) {
        eventName = route.params.eventName;
        eventDate = parseISO(route.params.eventDate);
        eventType = route.params.eventType;
        eventDescription = route.params.eventDescription;
        isEdit = true;
    }


    return (
        <EventForm navigation={navigation} eventDate={eventDate} eventName={eventName} eventTime={eventTime} eventDescription={eventDescription} isEdit={isEdit} initialEventType={eventType} />
    )
}