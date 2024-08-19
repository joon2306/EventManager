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
        let events = [];
        try {
            events = await supabase.from("test").select("*");
        } catch (err) {
            console.error("Error fetching events:", err);
        }
        return events;

    }


}

const eventsService = new EventsService();
export default eventsService;