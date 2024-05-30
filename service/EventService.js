
let eventInstance = null;
class EventService {

    event = null;
    constructor() {
        if (eventInstance === null) {
            eventInstance = this;
        }
        return eventInstance;
    }

    set event(value) {
        this.event = value;
    }

    get event() {
        return this.event;
    }

    reset() {
        this.event = null;
    }
}

const eventService = new EventService();

export default eventService;