"use client";
import { clearCurrentChat, setCurrentChat } from "@/features/currentChat/currentChatSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/reducer.hooks";
import socket from "@/lib/socket";
import { Message, User } from "@/types";
import axios from "axios";
import { ArrowLeft, Send } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

function ChatBox() {
  const currentChat = useAppSelector((state) => state.currentChat);
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [messages, setMessages] = useState<Message[]>([]);
  const [receiver, setReceiver] = useState<User | null>(null);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReceiver(currentChat.users?.find((u) => u._id !== user._id) || null);
    setMessages([]);
    if (currentChat._id) {
      fetchChatMessages();
    }
  }, [currentChat]);

  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      if(message.chatId === currentChat._id){
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.off("newMessage").on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage); // Clean up on unmount
    };
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchChatMessages = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/chat`,
        {
          userId: user._id,
          chatId: currentChat._id,
        }
      );
      if (response.data.success) {
        console.log("messages :",response.data.messages)
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.log("error while fetching messages:", error);
    }
  };

  const sendMessage = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    try {
      setSending(true);
      let response ;
      if(currentChat && currentChat.isGroupChat){
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_URL}/api/chat/group/send`,
          {
            senderId: user._id,
            content: inputText,
            chatId: currentChat._id
          }
        );
      }else{
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_URL}/api/chat/send`,
          {
            senderId: user._id,
            receiverId: receiver?._id,
            content: inputText,
          }
        );
      }
      if (response.data.success) {
        setInputText("");
        setMessages((prev) => [...prev, response.data.message]);
        if (!currentChat._id) {
          console.log("check seaafs")
          dispatch(setCurrentChat(response.data.chat));
        }
      }
    } catch (error) {
      console.log("error while sending the message:", error);
    } finally {
      setSending(false);
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const profilePicture = currentChat.isGroupChat
    ? currentChat.chatIcon || "/groupProfile.png"
    : receiver?.avatar || "/profile-user.png";

  return (
    <div className={`  ${currentChat._id ? ' flex' : 'hidden'} bg-white rounded-2xl shadow-md flex-1 lg:flex flex-col justify-between lg:max-w-[50%] w-full h-full overflow-y-scroll hidden-scrollbar `}>
      {currentChat._id || receiver?._id ? (
        <>
          <div className="p-4">
            <div className=" flex items-center sticky top-0 z-10 bg-white justify-between gap-4 w-full border-b border-b-gray-300 py-2">
              <div className=" flex item-center gap-3">
                <ArrowLeft className=" w-8 h-8 text-gray-400 block lg:hidden cursor-pointer" onClick={()=>dispatch(clearCurrentChat())}/>
                <Image
                  src={profilePicture}
                  alt="profile-picture"
                  className=" rounded-full"
                  height={42}
                  width={42}
                />

                <div className=" flex flex-col gap-2 justify-start px-4">
                  <h2 className=" text-xl font-semibold text-gray-800">
                    {currentChat.chatName
                      ? currentChat.chatName
                      : receiver?.name}
                  </h2>
                </div>
              </div>
            </div>
            {messages?.length > 0 && (
              <div className=" p-2 flex flex-col gap-4 w-full pb-12">
                {messages.map((message: Message) => (
                  <div
                    key={message._id}
                    className={`flex relative ${
                      user._id === message.senderId._id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-xl max-w-[70%] flex flex-col gap-1 items-start ${
                        user._id === message.senderId._id 
                          ? "bg-[#6E00FF] text-white"
                          : "bg-gray-300 text-black"
                      }`}
                    >
                      {user._id !== message.senderId._id && currentChat.isGroupChat && (
                        <span className={`text-xs  ${user._id === message.senderId._id?"text-gray-200": "text-gray-600" }`}>{message?.senderId?.name?.split(" ")[0]}</span>
                      )}
                      {message?.content}
                    </div>
                    <span
                      className={`w-3 h-3 absolute top-full rounded-full ${
                        user._id === message.senderId._id
                          ? "bg-[#6E00FF] text-white -right-2 "
                          : "bg-gray-300 text-black -left-2 "
                      }`}
                    />
                  </div>
                ))}
                <div ref={messageEndRef} />
              </div>
            )}
          </div>
          <form
            className=" w-full flex items-center sticky bottom-0 justify-between p-4 bg-white "
            onSubmit={sendMessage}
          >
            <input
              type="text"
              className=" max-w-[85%] w-full px-6 py-2 text-base rounded-xl outline-none bg-blue-100 border-blue-300"
              placeholder="Type your message here.."
              value={inputText}
              onChange={(ev) => setInputText(ev.target.value)}
            />
            <button
              className="p-2 rounded-lg bg-[#6E00FF] text-white disabled:opacity-70 min-w-10"
              type="submit"
              disabled={sending}
            >
              {sending ? "..." : <Send className=" h-6 w-6 text-white" />}
            </button>
          </form>
        </>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center text-center">
          <Image
            src="/ChatBoxUi.svg"
            alt="chatBoxUi"
            width={200}
            height={200}
            className="w-full max-w-[200px] h-auto"
          />
          <p className="mt-4 text-lg text-gray-600">
            Let’s get chatting! Pick a conversation to begin.
          </p>
        </div>
      )}
    </div>
  );
}

export default ChatBox;
