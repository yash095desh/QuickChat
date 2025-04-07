import { setCurrentChat } from "@/features/currentChat/currentChatSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/reducer.hooks";
import socket from "@/lib/socket";
import { formatDate } from "@/lib/utils";
import { Chat, User } from "@/types";
import Image from "next/image";
import React, { useEffect, useState } from "react";

function SingleChat({ chat }: { chat: Chat }) {
  const user = useAppSelector((state) => state.user);
  const currentChat = useAppSelector((state) => state.currentChat);
  const dispatch = useAppDispatch();
  const [receiver, setReceiver] = useState<User>();

  useEffect(() => {
    if (user && chat) {
      setReceiver(chat.users?.find((s_user) => s_user._id !== user._id));
    }
  }, [user,chat]);

  const handleClick = () => {
    if (chat._id !== currentChat._id) {
      if(currentChat.isGroupChat){
        socket.emit("leaveGroup",currentChat._id);
      }
      if(chat.isGroupChat){
        socket.emit("joinGroup", chat._id);
      }
      dispatch(setCurrentChat(chat));
    }
  };

  const profilePicture = chat.isGroupChat
  ? chat.chatIcon || "/groupProfile.png"
  : receiver?.avatar || "/profile-user.png";

  return (
    <div
      className=" p-2 w-full flex items-center gap-6 border-b border-b-gray-300 hover:bg-blue-100 cursor-pointer"
      onClick={handleClick}
    >
      {/* Profile-Picture */}
      <Image
        src={profilePicture}
        alt="profile-picture"
        className="rounded-full"
        height={38}
        width={38}
      />
      <div className=" flex items-center justify-between w-full">
        <div className=" flex flex-col ">
          <h1 className=" text-lg ">
            {!!chat.chatName ? chat.chatName : receiver?.name}
          </h1>
          <p className=" text-gray-400 text-xs">{chat.isGroupChat ? chat?.lastMessage :receiver?.email}</p>
        </div>
        <p className=" text-gray-400 text-sm"> {formatDate(new Date(chat?.updatedAt || ""))}</p>
      </div>
    </div>
  );
}

export default SingleChat;
