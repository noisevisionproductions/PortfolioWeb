export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
    companyName: string;
    programmingLanguages: string[];
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    email: string;
}

export interface User {
    email: string;
    role: string;
    authorities: string[];
    name: string;
    companyName: string;
    programmingLanguages: string[];
}

export enum Authority {
    CREATE_PROJECTS = 'CREATE_PROJECTS',
    EDIT_PROJECTS = 'EDIT_PROJECTS',
    DELETE_PROJECTS = 'DELETE_PROJECTS',
    SEND_MESSAGES = 'SEND_MESSAGES'
}