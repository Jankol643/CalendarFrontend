import { CalendarEvent } from 'angular-calendar';
import { EventModel, ScheduledTaskModel } from '../model/models';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';
import { parseISO } from 'date-fns';  // Import parseISO from date-fns

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

        // Parse the ISO strings first, then convert to the event's timezone
        const start = toZonedTime(parseISO(rawEvent.start_datetime), eventTimezone);
        const end = rawEvent.end_datetime ?
            toZonedTime(parseISO(rawEvent.end_datetime), eventTimezone) :
            undefined;

        return {
            id: rawEvent.id,
            title: rawEvent.title,
            start: start,
            end: end,
            allDay: Boolean(rawEvent.all_day),
            draggable: true,
            meta: {
                id: rawEvent.id,
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
    public static calendarEventToRawEvent(calendarEvent: CalendarEvent): any {
        const timezone = calendarEvent.meta?.timezone || 'UTC';

        // Convert local times to UTC ISO strings
        const startUTC = formatInTimeZone(calendarEvent.start, timezone, "yyyy-MM-dd'T'HH:mm:ssXXX");
        const endUTC = calendarEvent.end ?
            formatInTimeZone(calendarEvent.end, timezone, "yyyy-MM-dd'T'HH:mm:ssXXX") :
            null;

        return {
            id: calendarEvent.meta?.id,
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

    /**
     * Converts a ScheduledTaskModel to a CalendarEvent.
     * Scheduled tasks should be visually distinct from regular events.
     */
    public static fromScheduledTask(scheduledTask: ScheduledTaskModel): CalendarEvent {
        const eventTimezone = 'UTC'; // Scheduled tasks are stored in UTC
        const isCompleted = scheduledTask.status === 'completed';
        const isInProgress = scheduledTask.status === 'in_progress';

        // Parse the ISO strings and convert to local time for display
        const start = toZonedTime(parseISO(scheduledTask.start_datetime), eventTimezone);
        const end = scheduledTask.end_datetime ?
            toZonedTime(parseISO(scheduledTask.end_datetime), eventTimezone) :
            undefined;

        const title = scheduledTask.title;

        return {
            id: scheduledTask.id,
            title: `📋 ${title}`, // Add task emoji for visual distinction
            start: start,
            end: end,
            allDay: false, // Tasks typically have specific durations
            draggable: false, // Scheduled tasks might not be draggable
            color: this.getTaskColor(scheduledTask.status, scheduledTask.priority),
            meta: {
                type: 'scheduledTask', // Important: indicates this is a scheduled task
                taskId: scheduledTask.id,
                uploadId: scheduledTask.upload_id,
                status: scheduledTask.status,
                priority: scheduledTask.priority || 0,
                description: scheduledTask.description || '',
                isScheduledTask: true, // Flag to identify as scheduled task
                parentTaskId: scheduledTask.parent_task_id,
                createdAt: scheduledTask.created_at,
                updatedAt: scheduledTask.updated_at
            },
            // Additional visual cues for task status
            cssClass: `scheduled-task ${scheduledTask.status}`,
            resizable: {
                beforeStart: !isCompleted, // Can't resize completed tasks
                afterEnd: !isCompleted
            }
        };
    }

    /**
     * Helper method to determine color based on task status and priority
     */
    private static getTaskColor(status: string, priority?: number): any {
        // Define colors based on status
        const statusColors: { [key: string]: string } = {
            'scheduled': '#4CAF50', // Green
            'in_progress': '#2196F3', // Blue
            'completed': '#9E9E9E', // Grey
            'failed': '#F44336', // Red
            'pending': '#FF9800' // Orange
        };

        // Base color from status
        let color = statusColors[status] || '#607D8B'; // Default blue-grey

        // Adjust for priority if provided
        if (priority !== undefined) {
            if (priority >= 8) color = '#D32F2F'; // High priority - red
            else if (priority >= 5) color = '#FF9800'; // Medium priority - orange
        }

        return {
            primary: color,
            secondary: `${color}33`, // Add transparency for secondary color
        };
    }

    /**
     * Converts multiple scheduled tasks to calendar events
     */
    public static fromScheduledTasks(tasks: ScheduledTaskModel[]): CalendarEvent[] {
        return tasks.map(task => this.fromScheduledTask(task));
    }

    /**
     * Filters events to show only scheduled tasks
     */
    public static filterScheduledTasks(events: CalendarEvent[]): CalendarEvent[] {
        return events.filter(event =>
            event.meta?.type === 'scheduledTask' ||
            event.meta?.isScheduledTask === true
        );
    }

    /**
     * Updates an existing scheduled task event with new data
     */
    public static updateScheduledTaskEvent(
        existingEvent: CalendarEvent,
        updatedTask: ScheduledTaskModel
    ): CalendarEvent {
        const updatedEvent = this.fromScheduledTask(updatedTask);
        return {
            ...existingEvent,
            ...updatedEvent,
            meta: {
                ...existingEvent.meta,
                ...updatedEvent.meta
            }
        };
    }
}