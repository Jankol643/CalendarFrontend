import { CalendarEvent } from 'angular-calendar';
import { EventModel } from '../model/models';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';

export class EventFactory {
    /**
     * Creates an empty CalendarEvent.
     */
    public static empty(): CalendarEvent {
        return {
            title: '',
            start: new Date(),
            end: new Date(),
            allDay: false,
            draggable: true,
            meta: {
                id: 0,
                location: '',
                description: '',
                calendarId: 0,
                timezone: 'UTC' // Default timezone
            }
        };
    }

    /**
     * Converts a raw event object to a CalendarEvent.
     * @param rawEvent The raw event object from the backend.
     */
    public static fromRawEvent(rawEvent: any): CalendarEvent {
        const timezone = rawEvent.timezone || 'UTC'; // Fallback to UTC if timezone is not provided.

        return {
            title: rawEvent.title,
            start: toZonedTime(new Date(rawEvent.start_date), timezone),
            end: toZonedTime(new Date(rawEvent.end_date), timezone),
            allDay: Boolean(rawEvent.all_day),
            draggable: true,
            meta: {
                id: rawEvent.id,
                location: rawEvent.location,
                description: rawEvent.description,
                calendarId: rawEvent.calendar_id,
                timezone
            }
        };
    }

    /**
     * Converts a CalendarEvent to a raw event object for the backend.
     * @param calendarEvent The CalendarEvent to be converted.
     */
    public static calendarEventToRawEvent(calendarEvent: CalendarEvent): any {
        const timezone = calendarEvent.meta?.timezone || 'UTC'; // Fallback to UTC if timezone is not provided.

        return {
            title: calendarEvent.title,
            start_time: formatInTimeZone(calendarEvent.start, timezone, "yyyy-MM-dd'T'HH:mm:ssXXX"), // Format to ISO string
            end_time: calendarEvent.end ? formatInTimeZone(calendarEvent.end, timezone, "yyyy-MM-dd'T'HH:mm:ssXXX") : null,
            all_day: calendarEvent.allDay,
            location: calendarEvent.meta?.location,
            description: calendarEvent.meta?.description,
            calendar_id: calendarEvent.meta?.calendarId,
            timezone
        };
    }

    /** 
     * Converts EventModel to a backend-compatible event format.
     * @param event 
     * @returns 
     */
    public static eventToBackendEvent(event: EventModel) {
        // Adjust the start and end time to the selected timezone
        const timezone = event.timezone || 'UTC'; // Fallback to UTC if timezone is not provided.

        const startTime = formatInTimeZone(event.startTime, timezone, "yyyy-MM-dd'T'HH:mm:ssXXX");
        const endTime = formatInTimeZone(event.endTime, timezone, "yyyy-MM-dd'T'HH:mm:ssXXX");

        return {
            title: event.title,
            description: event.description,
            start_date: startTime,
            end_date: endTime,
            timezone,
            all_day: event.isAllDay,
            location: event.location,
            calendar_id: event.calendarId,
        };
    }
}