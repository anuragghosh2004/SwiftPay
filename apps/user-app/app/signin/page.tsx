"use client"
import {signOut,signIn} from "next-auth/react"
import {useRouter} from "next/navigation"
import {useState} from "react"
export default function(){
const [phone, setPhone]=useState("");
const [password,setPassword]=useState("")
    return <div>
      
        <div><div><input type="text" placeholder="phone" onChange={(e)=>{setPhone(e.target.value);}}></input></div>
        <div><input type="text" placeholder="password" onChange={(e)=>{ 
            setPassword(e.target.value);
        }}></input></div>
        <button onClick={()=>{signIn("credentials",{
            phone:phone,
            password:password,redirect:false
        })}}>login with email</button>
        </div>
        <div><button onClick ={()=>{signOut()}}><div>Logout</div></button></div>
        
        </div>

}