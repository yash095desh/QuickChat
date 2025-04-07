import { AppDispatch, RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()