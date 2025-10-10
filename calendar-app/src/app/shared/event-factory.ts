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
     * Handles timezone conversion to display in user's local timezone.
     */
    public static fromRawEvent(rawEvent: any): CalendarEvent {
        const eventTimezone = rawEvent.timezone || 'UTC';

        // Convert stored UTC times to local times considering the event's timezone
        const start = toZonedTime(new Date(rawEvent.start_date), eventTimezone);
        const end = rawEvent.end_date ? toZonedTime(new Date(rawEvent.end_date), eventTimezone) : undefined;

        return {
            id: rawEvent.id,
            title: rawEvent.title,
            start: start,
            end: end,
            allDay: Boolean(rawEvent.all_day),
            draggable: true,
            meta: {
                location: rawEvent.location,
                description: rawEvent.description,
                calendarId: rawEvent.calendar_id,
                timezone: eventTimezone
            }
        };
    }

    /**
     * Converts a CalendarEvent to a raw event object for the backend.
     * Converts event times to UTC based on the event's timezone.
     */
    //TODO: Timezone changes automatically to UTC when not set, should be read from the browser
    public static calendarEventToRawEvent(calendarEvent: CalendarEvent): any {
        const timezone = calendarEvent.meta?.timezone || 'UTC';

        // Convert local times to UTC ISO strings
        const startUTC = formatInTimeZone(calendarEvent.start, 'UTC', "yyyy-MM-dd'T'HH:mm:ssXXX");
        const endUTC = calendarEvent.end ? formatInTimeZone(calendarEvent.end, 'UTC', "yyyy-MM-dd'T'HH:mm:ssXXX") : null;

        return {
            title: calendarEvent.title,
            description: calendarEvent.meta?.description,
            start_datetime: startUTC,
            end_datetime: endUTC,
            timezone: timezone,
            all_day: calendarEvent.allDay,
            location: calendarEvent.meta?.location,
            calendar_id: calendarEvent.meta?.calendarId,
        };
    }

    /**
     * Converts an EventModel to backend format, ensuring times are stored in UTC.
     * Uses the event's original timezone for accurate conversion.
     */
    public static eventToBackendEvent(event: EventModel) {
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const timezone = event.timezone || userTimezone || 'UTC';

        // Convert the event's start and end to UTC strings based on its timezone
        const startUTC = formatInTimeZone(event.startDate, timezone, "yyyy-MM-dd'T'HH:mm:ssXXX");
        const endUTC = formatInTimeZone(event.endDate, timezone, "yyyy-MM-dd'T'HH:mm:ssXXX");

        return {
            title: event.title,
            description: event.description,
            start_datetime: startUTC,
            end_datetime: endUTC,
            timezone: timezone,
            all_day: event.isAllDay,
            location: event.location,
            calendar_id: event.calendarId,
        };
    }
}