export interface Event {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    allDay: boolean;
    location: string;
    calendarId: number | null;
}