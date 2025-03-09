export interface Event {
    title: string;
    description: string;
    start: Date;
    end: Date;
    timezone: string;
    allDay: boolean;
    location: string;
    calendar: number;
}