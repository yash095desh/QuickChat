import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ModalState = "logout" | "createGroupChat" | "updateAccountDetails"| null;

const initialState: ModalState = null as ModalState;

export const modalSlice = createSlice({
    name:"modal",
    initialState,
    reducers:{
        setModal:(state,action:PayloadAction<ModalState>)=>{
            return action.payload
        },
        closeModal:(state)=>{
            return null
        }
    }
})

export const {setModal,closeModal} = modalSlice.actions;

export default modalSlice.reducer;

