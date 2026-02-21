// Represents a user within the application
export interface UserModel {
    id: number;               // Unique identifier for the user
    username: string;        // User's full name
    email: string;     // User's email address
    profileImage?: string
}

// Represents the credentials used for user authentication
export interface AuthCredentials {
    email: string;     // User's email used for authentication
    password: string;         // User's password for authentication
    rememberMe?: boolean;
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
    id?: number; // optional, will be set after creation
    title: string;           // Title of the event
    description: string;     // Description of the event
    startDate: Date;        // Start date and time of the event
    endDate: Date;          // End date and time of the event
    timezone: string;        // Timezone of event
    isAllDay: boolean;      // Indicates if the event lasts all day
    location: string;       // Location where the event takes place
    calendarId: number;     // ID of the calendar to which the event belongs
}

export interface TaskModel {
    id: number,
    description: string;
    dueDate: Date;
    duration: number;
    priority: number;
    calendarId: number;
}

export interface ScheduledTaskModel {
    id: string;
    parent_task_id?: string;
    upload_id: string;
    start_datetime: string;  // ISO string in UTC
    end_datetime: string;    // ISO string in UTC
    status: string;          // e.g., 'scheduled', 'completed', 'in_progress'
    created_at: string;
    updated_at: string;
    // Add task-specific fields if available from backend
    title?: string;          // Task title/description
    description?: string;    // More detailed description
    priority?: number;       // Task priority
}