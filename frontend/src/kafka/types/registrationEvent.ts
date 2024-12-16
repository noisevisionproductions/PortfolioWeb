export enum EventStatus {
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED'
}

export interface RegistrationEvent {
    id: number;
    userId: string;
    email: string;
    name: string | null;
    companyName: string | null;
    timestamp: string;
    status: EventStatus;
    ipAddress: string | null;
    userAgent: string | null;
    registrationSource: string | null;
}

export interface RegistrationStats {
    totalRegistrations: number;
    successfulRegistration: number;
    failedRegistrations: number;
    successRate: number;
    recentEvents: RegistrationEvent[];
}