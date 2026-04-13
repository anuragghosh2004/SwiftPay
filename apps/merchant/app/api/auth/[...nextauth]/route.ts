import NextAuth from "next-auth"
import {auth_options} from "../../../lib/auht"
const handler = NextAuth(auth_options);
export const GET = handler;
export const POST= handler;