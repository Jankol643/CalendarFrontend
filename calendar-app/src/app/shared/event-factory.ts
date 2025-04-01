import { CalendarEvent } from 'angular-calendar';
import { Event } from './models/event.model';

export class EventFactory {
    /**
     * Creates an empty CalendarEvent.
     */
    static empty(): CalendarEvent {
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
                calendar: 0
            }
        };
    }

    /**
     * Converts a raw event object to a CalendarEvent.
     * @param rawEvent The raw event object from the backend.
     */
    static fromRawEvent(rawEvent: any): CalendarEvent {
        return {
            title: rawEvent.title,
            start: new Date(rawEvent.start_date),
            end: new Date(rawEvent.end_date),
            allDay: Boolean(rawEvent.all_day),
            draggable: true,
            meta: {
                id: rawEvent.id,
                location: rawEvent.location,
                description: rawEvent.description,
                calendar: rawEvent.calendar_id
            }
        };
    }

    /**
     * Converts a CalendarEvent to a raw event object for the backend.
     * @param calendarEvent The CalendarEvent to be converted.
     */
    static calendarEventToRawEvent(calendarEvent: CalendarEvent): any {
        return {
            id: calendarEvent.meta?.id,
            title: calendarEvent.title,
            start_date: new Date(calendarEvent.start).toISOString(),
            end_date: calendarEvent.end ? new Date(calendarEvent.end).toISOString() : null,
            timezone: calendarEvent.meta?.timezone,
            all_day: calendarEvent.allDay,
            location: calendarEvent.meta?.location,
            description: calendarEvent.meta?.description,
            calendar_id: calendarEvent.meta?.calendar
        };
    }

    static eventToRawEvent(calendarEvent: Event): any {
        return {
            title: calendarEvent.title,
            start_date: new Date(calendarEvent.start).toISOString(),
            end_date: calendarEvent.end ? new Date(calendarEvent.end).toISOString() : null,
            all_day: calendarEvent.allDay,
            location: calendarEvent.location,
            description: calendarEvent.description,
            calendar_id: calendarEvent.calendar
        };
    }
}