export interface User {
    id: number;
    name: string;
    email: string;
    // Add other user properties as needed
}

export interface Credentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    status: boolean;
    authorisation: {
        token: string;
    };
}