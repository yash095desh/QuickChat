"use client";

import axios from "axios";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { User } from "@/types";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/hooks/reducer.hooks";
import { setCurrentChat } from "@/features/currentChat/currentChatSlice";

interface SearchBoxProps {
  handleUserClick?: (user: User) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ handleUserClick }) => {
  const [text, setText] = useState("");
  const [searchedUser, setSearchedUser] = useState<User[]>([]);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  useEffect(() => {
    if (text) {
      searchUser();
    } else {
      setSearchedUser([]);
    }
  }, [text]);

  const searchUser = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/user/getUser?text=${text}`
      );
      if (response.data.success) {
        console.log("users", response.data.users);
        setSearchedUser(response.data.users);
      }
    } catch (error) {
      console.log("error in getting search response:", error);
    }
  };

  const handleCurrentChat = async (s_user: User) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/chat/exists?userId=${user._id}&receiverId=${s_user._id}`
      );
      if (response.data.success) {
        if (response.data.chatExists) {
          console.log(response.data);
          dispatch(setCurrentChat(response.data.chat));
        } else {
          dispatch(
            setCurrentChat({
              users: [s_user, user],
              _id: null,
              chatName: null,
              isGroupChat: null,
              Admins: null,
              lastMessage: null,
            })
          );
        }
      }
    } catch (error) {
      console.log("error while seting the currentChat:", error);
    } finally {
      setSearchedUser([]);
      setText("");
    }
  };

  return (
    <div className=" relative px-4 rounded-2xl shadow-md w-full bg-white flex items-center">
      <Search className=" h-6 w-6 text-gray-400" />
      <input
        type="text"
        placeholder="Search"
        className=" p-4 outline-none w-full "
        value={text}
        onChange={(ev) => setText(ev.target.value)}
      />
      {searchedUser.length > 0 && (
        <div className=" absolute w-full top-full mt-1 shadow-xl left-0 right-0 bg-white  z-10 border rounded-xl border-gray-300">
          {searchedUser
            .filter((s_user) => s_user._id !== user._id)
            .map((s_user) => (
              <div
                className=" p-2 w-full flex items-center gap-6 border-b border-b-gray-300 hover:bg-blue-100 cursor-pointer"
                key={s_user._id}
                onClick={() => {
                  setText("");
                  handleUserClick
                    ? handleUserClick(s_user)
                    : handleCurrentChat(s_user);
                }}
              >
                {/* Profile-Picture */}
                {s_user.avatar ? (
                  <Image
                    src={s_user.avatar}
                    alt="profile-picture"
                    className=" rounded-full"
                    height={36}
                    width={36}
                  />
                ) : (
                  <Image
                    src="/profile-user.png"
                    alt="profile-picture"
                    className=" rounded-full"
                    height={36}
                    width={36}
                  />
                )}

                <div className=" flex flex-col ">
                  <h1 className=" text-lg ">{s_user.name}</h1>
                  <p className=" text-gray-400 text-xs">{s_user.email}</p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
