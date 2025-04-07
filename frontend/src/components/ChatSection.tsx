"use client";
import React, { useEffect, useState } from "react";
import SingleChat from "./SingleChat";
import SearchBox from "./SearchBox";
import { useAppSelector } from "@/hooks/reducer.hooks";
import axios from "axios";
import { Chat } from "@/types";
import { Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { setModal } from "@/features/modal/modalSlice";
import { ModalTypes } from "./customModal/CustomModel";

function ChatSection() {
  const [chats, setChats] = useState<Chat[]>([]);
  const user = useAppSelector((state) => state.user);
  const currentChat = useAppSelector((state) => state.currentChat);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchChats();
  }, [currentChat]);

  const fetchChats = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/chat/getAll?userId=${user._id}`
      );

      if (response.data.success) {
        setChats(response.data.chats);
      }
    } catch (error) {
      console.log("error while fetching chats:", error);
    }
  };

  return (
    <div className=" flex flex-col w-full gap-4 ">
      <SearchBox />
      <div className=" bg-white rounded-2xl shadow-md p-4 w-full h-full">
        <div className=" flex justify-between items-center mb-4">
          <h1 className=" text-2xl font-semibold ">Chats</h1>
          <button
            className=" flex items-center gap-1 text-base font-semibold rounded-lg border border-blue-300 bg-blue-100 text-blue-700 px-4 py-2"
            onClick={() => dispatch(setModal(ModalTypes.CREATE_GROUP_CHAT))}
          >
            <Plus className=" w-4 h-4" />
            Group
          </button>
        </div>
        <div className=" flex flex-col">
          {/* Single Chat Component */}
          {chats.length > 0 ? (
            chats.map((chat) => <SingleChat key={chat._id} chat={chat} />)
          ) : (
            <p>Start a new Chat</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatSection;
