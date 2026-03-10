export enum HttpStatusCode {
    // Success
    OK = 200,                // Everything worked
    CREATED = 201,           // Something was added (e.g., User Sign Up)

    // Client Errors (User mistakes)
    BAD_REQUEST = 400,       // Missing fields / Invalid data
    UNAUTHORIZED = 401,      // User is not logged in
    FORBIDDEN = 403,         // User is logged in but can't do this (e.g. Admin only)
    NOT_FOUND = 404,         // Resource doesn't exist
    CONFLICT = 409,          // Duplicate data (e.g. Email already exists)
    TOO_MANY_REQUESTS = 429, // 

    // Server Errors (Your code mistakes)
    INTERNAL_SERVER_ERROR = 500,
}