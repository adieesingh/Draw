"use client"
import { BACKEND_URL } from "@/config";
import { Button } from "@repo/ui/button";
import { Head } from "@repo/ui/head";
import { InputForm } from "@repo/ui/input";
import axios from "axios";
import { useRouter } from "next/navigation";

import { useState } from "react";


export default function Room() {
    const [name,setName]=useState("");
    const router =useRouter();
    const  handleSubmit=async()=>{
        const res =await axios.post(`${BACKEND_URL}/room`,{
            name:name    
        },{
          withCredentials:true
        })
        if(!res){
            alert("Data not insert ")
        }
        if(res){
            console.log(res.data.roomId)
            alert(`${res.data.roomId}`)
            router.push(`/canvas/${res.data.roomId}`)
        }
    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96   ">
        <Head text="Create a room"></Head>
        <InputForm onChange={(e)=>setName(e.target.value)} placeholder="Enter a Room Name" type="name" value={name}></InputForm>
        <Button onClick={handleSubmit} text="Submit" type="button"></Button>
      </div>
    </div>
  );
}
