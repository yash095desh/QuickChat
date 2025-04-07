import { Chat } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState:Chat = {
    chatName:null,
    users:null,
    lastMessage:null,
    isGroupChat:null,
    Admins:null 
}



export const currectChatSlice = createSlice({
    name:'currentChat',
    initialState,
    reducers:{
        setCurrentChat : (state,action:PayloadAction<Chat>)=>{
            return {...action.payload}
        },
        clearCurrentChat :()=>initialState
    }
})

export const {setCurrentChat, clearCurrentChat} = currectChatSlice.actions

export default currectChatSlice.reducer