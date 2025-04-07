"use client";
import React, { useState } from "react";
import ProfileUpload from "../ProfileUpload";
import { useAppDispatch, useAppSelector } from "@/hooks/reducer.hooks";
import { User } from "@/types";
import axios from "axios";
import { setUser } from "@/features/user/userSlice";
import { closeModal } from "@/features/modal/modalSlice";
import Spinner from "../Spinner";

function UpdateAccountDetails() {
  const user = useAppSelector((state) => state.user);
  const [profileUrl, setProfileUrl] = useState<string | null>();
  const [userDetails, setUserDetails] = useState<User>(user);
  const [loading , setLoading] = useState(false)
  const dispatch = useAppDispatch()


  const handleChange = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
    setUserDetails((prev)=>({...prev,[ev.target.id]:ev.target.value}))
  }

  const handleSubmit = async(ev:React.FormEvent) =>{
    ev.preventDefault();
    try {
        setLoading(true)
        const { name , phoneNumber , bio } = userDetails;
        const data = {name, phoneNumber, bio, avatar:profileUrl}
        const response = await axios.put(`${process.env.NEXT_PUBLIC_URL}/api/user/edit/${user._id}`,data);
        if(response.data.success){
            dispatch(setUser(response.data.user))
            dispatch(closeModal())
        }
    } catch (error) {
        console.log("error in updating user details:",error)
    }
    finally{
        setLoading(true)
    }
  }

  return (
    <div
      className=" bg-white px-4 py-6 rounded-lg w-full max-w-xl flex flex-col gap-4 items-center justify-center"
      onClick={(ev) => ev.stopPropagation()}
    >
      <h1 className=" text-lg text-gray-800 font-semibold"> Edit Profile</h1>
      <p className=" text-gray-400 text-sm ">
        Edit your details and save changes
      </p>
      <ProfileUpload
        profileUrl={profileUrl ||user.avatar || "/profile-user.png"}
        setImage={setProfileUrl}
      />
      <p className=" text-gray-800 mb-2">
        {user.avatar ? "Change Avatar" : "Upload Avatar"}
      </p>
      <form className=" w-full space-y-2 " onSubmit={handleSubmit}>
        <input
          type="text"
          className=" px-8 py-3 rounded-xl  bg-gray-50 border border-gray-200 outline-none w-full disabled:opacity-60"
          placeholder="Email"
          value={userDetails.email || ""}
          disabled={true}
        />
        <input
          type="text"
          className=" px-8 py-3 rounded-xl  bg-gray-50 border border-gray-200 outline-none w-full "
          placeholder="Name"
          id = "name"
          value={userDetails.name || ""}
          onChange={handleChange}
        />
        <input
          type="number"
          className=" px-8 py-3 rounded-xl  bg-gray-50 border border-gray-200 outline-none w-full "
          placeholder="Phone Number"
          id = "phoneNumber"
          value={userDetails.phoneNumber || ""}
          onChange={handleChange}
        />
        <textarea
          className=" px-8 py-3 rounded-xl  bg-gray-50 border border-gray-200 outline-none w-full "
          placeholder="Bio"
          id = "bio"
          cols={7}
          value={userDetails.bio || ""}
          onChange={handleChange}
        />
      <button
        className=" px-4 py-2 rounded-lg bg-blue-500 text-white w-full disabled:opacity-50"
        disabled={loading}
        >
        {loading?<Spinner/>:"Save Changes"}
      </button>
    </form>
    </div>
  );
}

export default UpdateAccountDetails;
