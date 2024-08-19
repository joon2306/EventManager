import supabase from "../config/config";

let eventsInstance = null;
class EventsService {

    constructor() {
        if (eventsInstance === null) {
            eventsInstance = this;
        }
        return eventsInstance;
    }

    async fetchEvents() {
        return await supabase.from("event_test").select("*");
    }

    async saveEvent({ eventName, description, eventDate, dayType, eventId }) {
        if (eventId) {
            return await this.updateEvent({ eventId, eventName, description, eventDate, dayType });
        }

        return await supabase.from("event_test").insert([
            {
                title: eventName,
                description,
                startDate: eventDate,
                eventType: dayType
            }
        ]).select();
    }

    async updateEvent({ eventId, eventName, description, eventDate, dayType }) {
        return await supabase.from("event_test").update({
            title: eventName,
            description,
            startDate: eventDate,
            eventType: dayType
        }).eq('id', eventId).select();
    }

    async deleteEventById(eventId) {
        return await supabase.from("event_test").delete().eq('id', eventId).select();
    }


}

const eventsService = new EventsService();
export default eventsService;