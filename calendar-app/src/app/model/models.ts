// Represents a user within the application
export interface UserModel {
    id: number;               // Unique identifier for the user
    fullName: string;        // User's full name
    emailAddress: string;     // User's email address
}

// Represents the credentials used for user authentication
export interface AuthCredentials {
    email: string;     // User's email used for authentication
    password: string;         // User's password for authentication
}

// Represents the response returned from the server upon successful authentication
export interface AuthResponseModel {
    isSuccess: boolean;       // Indicates success or failure of the authentication process
    authorisation: {          // Object containing authorization details
        token: string;        // Auth token for the authenticated user
    };
}

// Represents a time zone with its name and offset
export interface TimezoneModel {
    name: string;            // Name of the time zone
    utcOffset: string;      // Offset from UTC, e.g., "+01:00"
}

// Represents an event in the calendar
export interface EventModel {
    title: string;           // Title of the event
    description: string;     // Description of the event
    startTime: Date;        // Start date and time of the event
    endTime: Date;          // End date and time of the event
    timezone: string;        // Timezone of event
    isAllDay: boolean;      // Indicates if the event lasts all day
    location: string;       // Location where the event takes place
    calendarId: number;     // ID of the calendar to which the event belongs
}