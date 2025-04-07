"use client"
import { toast } from '@/hooks/use-toast'
import { GoogleLogin } from '@react-oauth/google'
import {jwtDecode} from 'jwt-decode'
import { useRouter } from 'next/navigation'
import React from 'react'

function GoogleLoginButton({text="signin_with"}:{text:"signin_with"|"signup_with"}) {
  const router = useRouter();
  return (
    <GoogleLogin
    width={350}
      onSuccess={async(credentialResponse)=>{
        const googleToken = credentialResponse.credential
        
        //Send the token to the backend
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/google/auth`,{
            method:"POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({token:googleToken})
        })

        const data = await res.json();

        if(data.success){
            // Store token in localStorage or session for authentication
            localStorage.setItem("token",data.token)
            toast({
              title: `${text == 'signin_with'?"Login Successful!":"Registration Successful!"}`,
              variant: "default",
            })
            router.push("/")
        }
      }}
      onError={()=>{
        console.log("Login Failed")
      }}
      text={text}
      />
  )
}

export default GoogleLoginButton