export interface Event {
    title: string;
    description: string;
    start: Date;
    end: Date;
    allDay: boolean;
    location: string;
    calendar: number;
}