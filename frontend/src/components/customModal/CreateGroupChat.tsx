"use client";
import React, { useState } from "react";
import SearchBox from "../SearchBox";
import { User } from "@/types";
import Image from "next/image";
import { X } from "lucide-react";
import ProfileUpload from "../ProfileUpload";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/hooks/reducer.hooks";
import { setCurrentChat } from "@/features/currentChat/currentChatSlice";
import { closeModal } from "@/features/modal/modalSlice";

function CreateGroupChat() {
  const user = useAppSelector((state) => state.user);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [chatName, setChatName] = useState("");
  const [chatIcon, setChatIcon] = useState<string | null>();
  const { toast }: { toast: (options: { title: string }) => void } = useToast();
  const dispatch = useAppDispatch();

  const addUserToChat = (user: User) => {
    setSelectedUsers((prev) => [...prev, user]);
  };

  const removeUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((user) => user._id !== userId));
  };

  const handleCreate = async () => {
    try {
      if (selectedUsers.length < 2) {
        toast({
          title: "Minimum 2 users required",
        });
        return;
      }
      if (!chatName) {
        toast({
          title: "Chat Name required",
        });
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/chat/createGroupChat`,
        {
          chatName,
          users: [...selectedUsers.map((user)=>user._id), user._id],
          admin: [user._id],
          chatIcon,
        }
      );
      if (response.data.success) {
        setChatName("");
        setSelectedUsers([]);
        setChatIcon("");
        dispatch(setCurrentChat(response.data.chat));
        dispatch(closeModal());
      }
    } catch (error) {
      console.log("error in creating chat", error);
    }
  };
  return (
    <div
      className=" bg-white px-4 py-8 rounded-lg w-full max-w-xl flex flex-col gap-4 items-center justify-center"
      onClick={(ev) => ev.stopPropagation()}
    >
      <h1 className=" text-lg text-gray-800 font-semibold"> New Group</h1>
      <p className=" text-gray-400 text-sm mb-4">
        Welcome! Start by giving your group a name and adding members
      </p>
      <ProfileUpload
        profileUrl={chatIcon || "/groupProfile.png"}
        setImage={setChatIcon}
      />
      <p className=" text-gray-800 mb-2">Group Icon</p>
      <SearchBox handleUserClick={addUserToChat} />
      {selectedUsers.length > 0 && (
        <div className=" flex items-center gap-6 px-2 w-full">
          {selectedUsers.map((user) => {
            const profilePicture = user?.avatar || "/profile-user.png";
            return (
              <div className=" flex flex-col gap-1 items-center" key={user._id}>
                <div className=" relative">
                  <Image
                    src={profilePicture}
                    alt="userProfile"
                    height={42}
                    width={42}
                    className="rounded-full"
                  />
                  <span
                    className=" p-1 rounded-full bg-gray-100 absolute -top-2 -right-2 cursor-pointer"
                    onClick={() => user._id && removeUser(user._id)}
                  >
                    <X className=" w-4 h-4" />
                  </span>
                </div>
                <p className=" text-sm text-gray-600">{user.name}</p>
              </div>
            );
          })}
        </div>
      )}
      <div className=" w-full flex ">
        <input
          type="text"
          className=" px-8 py-4 rounded-xl  shadow-xl outline-none w-full "
          placeholder="Chat Name"
          value={chatName}
          onChange={(ev) => setChatName(ev.target.value)}
        />
      </div>
      <button
        className=" px-4 py-2 rounded-lg bg-blue-500 text-white w-full"
        onClick={handleCreate}
      >
        Create Group
      </button>
    </div>
  );
}

export default CreateGroupChat;
