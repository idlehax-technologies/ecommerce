import { SESSION_MAX_AGE_SECONDS } from "../config/session";

export const AUTH_COOKIE = "auth";

export const CSRF_COOKIE = "csrf_token";

export const CSRF_HEADER = "x-csrf-token";

export const AUTH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
} as const;

export const AUTH_COOKIE_CLEAR_OPTIONS = {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: 0,
} as const;

export const CSRF_COOKIE_OPTIONS = {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
} as const;