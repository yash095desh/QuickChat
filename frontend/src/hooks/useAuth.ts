import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch , useAppSelector } from "./reducer.hooks";
import { setUser } from "@/features/user/userSlice"

export interface UserPayload {
  userId: string;
  email: string;
  exp: number;
  iat:number;
  avatar:string;
}

export const useAuth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user); // Get user from Redux

  useEffect(() => {
    router.prefetch("/signIn");
    const token = localStorage.getItem("token");

    if (user?._id) {
      setLoading(false); // If user is already in Redux, no need to fetch again
      return;
    }

    if (token) {
      const decodedUser = jwtDecode<UserPayload>(token!);
      if (decodedUser.exp * 1000 < Date.now()) {
        console.log("Token expired, logging out...");
        localStorage.removeItem("token");
        window.location.href = "/signIn";
      } else {
        fetchUser(decodedUser.userId);
      }
    } else {
      window.location.href = "/signIn";
    }
  }, [user]); // Depend on user state

  const fetchUser = async (userId: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/user?userId=${userId}`
      );
      if (response.data.success) {
        dispatch(setUser(response.data.user));
      }
    } catch (error) {
      console.log("error in getting user", error);
    } finally {
      setLoading(false);
    }
  };

  return { loading };
};
