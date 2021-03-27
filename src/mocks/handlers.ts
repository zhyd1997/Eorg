import { rest } from "msw";

interface AuthBody {
    username: string;
    password: string;
}

interface AuthResponse {
    username: string;
}

export const handlers = [
    rest.post<AuthBody, AuthResponse>("/login", (req, res, ctx) => {
        // TODO
    }),
];
