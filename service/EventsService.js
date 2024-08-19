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
        const { data, error } = await supabase.from("event_test").select("*");

        if (error != null) {
            console.error("error fetching events", error);
            return [];
        }
        return data;
    }


}

const eventsService = new EventsService();
export default eventsService;