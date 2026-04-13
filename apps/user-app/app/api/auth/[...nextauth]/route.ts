import {auth_Options} from "../../../lib/auth"
import NextAuth from "next-auth"
const handler = NextAuth(auth_Options);
export const GET=handler;
export const POST= handler;