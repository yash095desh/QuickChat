"use client";
import { useAppSelector } from "@/hooks/reducer.hooks";
import axios from "axios";
import { Upload } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import Spinner from "./Spinner";

interface ProfileUploadProps {
  profileUrl: string;
  setImage: React.Dispatch<React.SetStateAction<string|null|undefined>>
}

function ProfileUpload({ profileUrl ,setImage }: ProfileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = ev.target.files && ev.target.files[0];
      if (!file) return;

      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "messenger");
      data.append("cloud_name", "yashdesh");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/yashdesh/image/upload",
        data,
        {
          onUploadProgress: (ProgressEvent) => {
            const percentage = Math.round(
              (ProgressEvent.loaded * 100) / ProgressEvent.total!
            );
            console.log("uploading percentage:", percentage);
            setUploadProgress(percentage);
          },
        }
      );
      if(response.data.url){
        setImage(response.data.url)
      }
    } catch (error) {
      console.log("error while profile uploading:", error);
    }
  };

  return (
    <div className=" relative">
      <Image
        src={profileUrl}
        alt="Profile-Image"
        className={` rounded-full border object-cover border-gray-300 ${uploadProgress > 0 && uploadProgress < 100 && "opacity-50"}`}
        width={56}
        height={56}
      />
      {uploadProgress > 0 && uploadProgress < 100 ? (
        <div className=" absolute inset-0 rounded-full text-xs flex items-center j text-center font-medium text-gray-600 ">
          Uploading {uploadProgress} %
        </div>
      ) : (
        <span
          className=" p-1 bg-gray-200 rounded-full absolute -bottom-2 -right-2 cursor-pointer"
          onClick={() => {
            const fileInput = document.getElementById("fileInput");
            if (fileInput) fileInput.click();
          }}
        >
          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={handleUpload}
            accept="image/*"
            multiple={false}
          />
          <Upload className=" w-4 h-4" />
        </span>
      )}
    </div>
  );
}

export default ProfileUpload;
