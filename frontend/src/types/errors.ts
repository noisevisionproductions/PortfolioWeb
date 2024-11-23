export class ValidationError extends Error {
    constructor(public errors: Record<string, string>) {
        super('Validation Error');
        this.name = 'ValidationError';
    }
}

export class AuthError extends Error {
    constructor(public type: string, public key: string) {
        super('Authentication Error');
        this.name = 'AuthError';
    }
}