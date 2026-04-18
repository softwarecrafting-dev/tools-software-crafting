import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { env } from "./env";

export interface SessionData {
  userId: string;
  role: "admin" | "member";
  sessionId: string;
  expiresAt: number;
}

export const sessionOptions: SessionOptions = {
  password: env.SESSION_SECRET,
  cookieName: "sc_invoice_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};

export async function getSession() {
  const cookieStore = await cookies();

  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
