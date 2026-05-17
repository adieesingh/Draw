"use client"
import {Button} from '@repo/ui/button';
import { Head } from '@repo/ui/head';
import { InputForm } from '@repo/ui/input';
import {Bottom} from '@repo/ui/bottom';
import { useState } from 'react';
import axios from 'axios'
import { useRouter } from 'next/navigation';


interface AuthProps{
  isSignin:boolean
}

export default function Auth({ isSignin }: AuthProps) {
  const [name,setName]=useState("");
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("")
  const router =useRouter();
  console.log(isSignin)
 async function handleSignup(){
  try {
    const response = await axios.post("http://localhost:3002/signup",{
      name,
      username,
      password
    })
    if(!response){
      alert("Not signup")

    }
    if(response){
      alert("Signup")
      router.push("room");
    }
  } catch (error:any) {
    console.log(error)
  }
    
  }
  async function handleSignin(){
    try {
      const response = await axios.post("http://localhost:3002/signin",{
        username,
        password
      },{
        withCredentials:true
      })
      if(!response){
        alert("Not Signup")
      }
      if(response){
      alert("Signin Sucessfully")
      router.push("/room")
        
        
      }
    } catch (error:any) {
      console.log(error)
    }
      
  }
  return  <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <Head text={isSignin ? "Sign In" : "Sign Up"}></Head>
        
        <form className="space-y-4">
          {!isSignin && (
            <InputForm value={name} type='name' placeholder='Enter a name' onChange={(e)=>setName(e.target.value)}></InputForm>
          )}

        <InputForm type='email' value={username}  placeholder='Enter a email' onChange={(e)=>setUsername(e.target.value)}></InputForm>

         <InputForm type='password' value={password} placeholder='Enter a password' onChange={(e)=>setPassword(e.target.value)}></InputForm>

         <Button type='button' text={isSignin ? "Login" : "Create Account"} onClick={isSignin?handleSignin:handleSignup}></Button>
        </form>

          <Bottom href={isSignin?"/Signup":"/Signin"} label={isSignin ? "Don't have an account ?" : "Already have an account ?"} text={isSignin ? "Signup" : "Login"} onClick={()=>!isSignin}></Bottom>
      </div>
    </div>
}
