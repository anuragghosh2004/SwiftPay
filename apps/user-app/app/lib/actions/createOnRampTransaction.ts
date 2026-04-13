"use server"
import {getServerSession} from "next-auth"
import {auth_Options} from "../auth";
import {client} from "@repo/db/client"
export async function createOnRampTransaction(amount:number,provider:string){
    //we also need the userid .. but we donot send it as a parameter bcz it is a security threat
    const session = await getServerSession(auth_Options);
    const userId= (session?.user as any)?.id;
    const token = Math.random().toString();
if(!userId){
    return {
        message:"user not logged in "
    }
}
await client.onRampTransaction.create({
    data:{
userId:Number(userId),
amount:amount*100,
status:"Processing",
startTime:new Date(),
provider,
token:token 

    }
})
return {
    message:"onramp transaction added"
}
}