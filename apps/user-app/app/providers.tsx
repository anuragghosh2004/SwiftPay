"use client"
// we needed to write "use client" because "jotai". is a react component 
import { Provider } from "jotai";
import {SessionProvider} from "next-auth/react"

export const Proovider=({children}:{
  children: React.ReactNode;
})=>{
    return <Provider><SessionProvider>{children}</SessionProvider></Provider>
}
