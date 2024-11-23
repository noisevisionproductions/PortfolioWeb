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