export class BaseError extends Error {
    constructor(
        public message: string,
        public code: string
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class ApiError extends BaseError {
    constructor(
        public status: number,
        message: string,
        code: string = 'API_ERROR'
    ) {
        super(message, code);
        this.status = status;
    }
}

export class ValidationError extends BaseError {
    constructor(
        public errors: Record<string, string>
    ) {
        super('Validation Error', 'VALIDATION_ERROR');
    }
}

export class AuthError extends BaseError {
    constructor(
        public type: string,
        public key: string
    ) {
        super('Authentication Error', 'AUTH_ERROR');
    }
}