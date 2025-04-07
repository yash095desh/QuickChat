"use client";
import { setModal } from "@/features/modal/modalSlice";
import { useAppDispatch } from "@/hooks/reducer.hooks";
import { User } from "@/types";
import { LucideLogOut, MessageCircleMoreIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ModalTypes } from "./customModal/CustomModel";

function SideBar({ user }: { user: User | null }) {
  const dispatch = useAppDispatch();

  const handleLogOut = () => {
    dispatch(setModal(ModalTypes.LOG_OUT));
  };

  return (
    <div className="rounded-2xl py-6 bg-[#6E00FF]  flex flex-col justify-between items-center">
      <div className=" flex flex-col items-center gap-10">
        <div
          className=" cursor-pointer"
          onClick={() => dispatch(setModal(ModalTypes.UPDATE_ACCOUNT_DETAILS))}
        >
          {user?.avatar ? (
            <div className=" p-1 bg-[#5322BC] rounded-full">
              <Image
                src={user?.avatar}
                alt="Profile Image"
                height={48}
                width={48}
                className=" rounded-full border-2 border-white"
              />
            </div>
          ) : (
            <div className=" bg-white rounded-full cursor-pointer">
              <Image
                src="/profile-user.png"
                alt="Profile Image"
                height={48}
                width={48}
                className=" rounded-full border-2 border-white"
              />
            </div>
          )}
        </div>
        <div className=" w-full px-6 py-4 border-r-2 border-r-orange-400 bg-[#612DD1]">
          <Link href={"/"}>
            <MessageCircleMoreIcon className=" h-8 w-8 " color="white" />
          </Link>
        </div>
      </div>

      <div
        onClick={handleLogOut}
        className=" w-full px-6 py-4 cursor-pointer hover:bg-[#5322BC]"
      >
        <LucideLogOut className=" h-8 w-8 " color="white" />
      </div>
    </div>
  );
}

export default SideBar;
