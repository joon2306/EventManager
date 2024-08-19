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


}

const eventsService = new EventsService();
export default eventsService;