const EventUtils = {

    buildEvents: (serverData) => {
        const events = {};
        serverData.forEach(({ title, description, startDate, eventType }) => {
            if(!events[startDate]) {
                events[startDate] = [];
                events[startDate].push({ title, description, eventType });

            } else {
                events[startDate].push({ title, description, eventType });
            } 

        });

        return events;

    }
}

export default EventUtils;