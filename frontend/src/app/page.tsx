"use client";
import ChatBox from "@/components/ChatBox";
import ChatSection from "@/components/ChatSection";
import CustomModel from "@/components/customModal/CustomModel";
import SideBar from "@/components/SideBar";
import Spinner from "@/components/Spinner";
import { useAppSelector } from "@/hooks/reducer.hooks";
import { useAuth } from "@/hooks/useAuth";
import socket from "@/lib/socket";
import { ReactHTMLElement, useEffect, useState } from "react";

function page() {
  const { loading } = useAuth();
  const user = useAppSelector((state) => state.user);
  const currentChat = useAppSelector((state)=> state.currentChat)

  useEffect(() => {
    console.log(user);
  }, [user]);

  useEffect(() => {
    if (user?._id) {
      socket.auth = { userId: user._id }; // Pass userId dynamically
      socket.connect(); // Now connect after setting userId
    }

    return () => {
      socket.disconnect();
    };
  }, [user]);

  if (!user._id || loading) {
    return (
      <div className=" h-screen fixed w-full flex items-center justify-between">
        <Spinner size={8} />
      </div>
    );
  }

  return (
    <div className=" flex w-full h-screen justify-between p-8 gap-10">
      <CustomModel />
      <div className={`flex  gap-10 lg:max-w-[50%] w-full ${currentChat?._id && 'hidden lg:flex'}`}>
        <SideBar user={user} />
        <ChatSection />
      </div>
      {/* <ChatBox/> */}
      <ChatBox />
    </div>
  );
}

export default page;
