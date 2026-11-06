// Base URL of the SaaS app (login/signup/dashboard). In production this is
// https://app.blackfram.com; in local dev it defaults to the Vite app server.
export const APP_URL = (import.meta.env.VITE_APP_URL as string | undefined)?.replace(/\/$/, '') || 'http://localhost:5173';
