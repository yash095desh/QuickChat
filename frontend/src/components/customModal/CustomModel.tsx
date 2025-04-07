"use client";
import { closeModal } from "@/features/modal/modalSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/reducer.hooks";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import CreateGroupChat from "./CreateGroupChat";
import { clearCurrentChat } from "@/features/currentChat/currentChatSlice";
import { clearUser } from "@/features/user/userSlice";
import UpdateAccountDetails from "./UpdateAccountDetails";

export const ModalTypes = {
    LOG_OUT: "logout" as const,
    CREATE_GROUP_CHAT: "createGroupChat" as const,
    UPDATE_ACCOUNT_DETAILS: "updateAccountDetails" as const,
};

function CustomModel() {
  const router = useRouter()
  const modal = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch()


  if (!modal) return null;

  const MODAL_COMPONENTS: Record<string, React.FC> = {
    logout: () => (
      <div className="p-4 bg-white rounded-lg w-full max-w-md flex flex-col justify-center items-center" onClick={(ev)=>ev.stopPropagation()}>
        <p className="text-lg ">Do you want to logout?</p>
        <div className="flex gap-2 mt-4">
          <button className="bg-red-500 text-white px-4 py-2 rounded" 
                  onClick={() => handleLogOut()}>
            Yes
          </button>
          <button className="bg-gray-300 px-4 py-2 rounded" 
                  onClick={() => dispatch(closeModal())}>
            No
          </button>
        </div>
      </div>
    ),
    createGroupChat: () => <CreateGroupChat/>,
    updateAccountDetails: () => <UpdateAccountDetails/>
  };


  const ModalContent = MODAL_COMPONENTS[modal] || (() => <></>);

  const handleLogOut = () =>{
    dispatch(closeModal())
    localStorage.removeItem("token")
      dispatch(clearCurrentChat())
      dispatch(clearUser())
      router.push("/signIn")
  }



  return (
    <div className="fixed inset-0 bg-black/50 z-20 flex items-center justify-center" onClick={()=>dispatch(closeModal())}>
      <ModalContent/>
    </div>
  );
}

export default CustomModel;
