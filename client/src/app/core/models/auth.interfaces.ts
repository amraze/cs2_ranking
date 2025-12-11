export interface AuthResponse {
    message: string;
    success: boolean;
    token: {
        accessToken: string;
        refreshToken: string;
        expiration: string;
    };
}

export interface AuthRequest {
    email: string,
    password: string,
    firstName: string,
    lastName: string
}
