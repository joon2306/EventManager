import supabase, { databaseName } from "../config/config";

let eventsInstance = null;
class EventsService {

    constructor() {
        if (eventsInstance === null) {
            eventsInstance = this;
        }
        return eventsInstance;
    }

    async fetchEvents() {
        return await supabase.from(databaseName).select("*");
    }

    async saveEvent({ eventName, description, eventDate, dayType, eventId }) {
        if (eventId) {
            return await this.updateEvent({ eventId, eventName, description, eventDate, dayType });
        }

        return await supabase.from(databaseName).insert([
            {
                title: eventName,
                description,
                startDate: eventDate,
                eventType: dayType
            }
        ]).select();
    }

    async updateEvent({ eventId, eventName, description, eventDate, dayType }) {
        return await supabase.from(databaseName).update({
            title: eventName,
            description,
            startDate: eventDate,
            eventType: dayType
        }).eq('id', eventId).select();
    }

    async deleteEventById(eventId) {
        return await supabase.from(databaseName).delete().eq('id', eventId).select();
    }


}

const eventsService = new EventsService();
export default eventsService;