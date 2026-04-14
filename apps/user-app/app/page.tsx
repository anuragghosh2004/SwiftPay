

import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation'
import { auth_Options } from "./lib/auth";

export default async function Page() {
  const session = await getServerSession(auth_Options);
  if (session?.user) {
    redirect('/dashboard')
  } else {
    redirect('/api/auth/signin')
  }

}