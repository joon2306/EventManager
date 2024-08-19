const EventUtils = {

    buildEvents: (serverData) => {
        const events = {};
        serverData.forEach(({ id, title, description, startDate, eventType }) => {
            if (!events[startDate]) {
                events[startDate] = [];
                events[startDate].push({ id, title, description, eventType });

            } else {
                events[startDate].push({ id, title, description, eventType });
            }

        });

        return events;

    },

    handleDateConversion: (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+04:00`;

    }
}

export default EventUtils;