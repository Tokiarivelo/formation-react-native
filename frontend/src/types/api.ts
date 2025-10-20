//AUTH RESPONSE TYPE    
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
    user: {
        id: number;
        email: string;
        username: String,
        firstName: String,
        lastName: String,
        isActive: boolean,
        role: String,
        createdAt: String,
        updatedAt: String,
    };
}


//USERS
export interface UserCredentials {
    email: string;
    password: string;
    username?: string,
    firstName?: string,
    lastName?: string,
}

export interface User {
    id: number;
    email: string;
    username: String,
    firstName: String,
    lastName: String,
    isActive: boolean,
    role: String,
    createdAt: String,
    updatedAt: String,
}