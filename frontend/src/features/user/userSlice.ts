import { User } from "@/types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState : User = {
    _id : null,
    name : null,
    email : null,
    bio: null,
    avatar:null,
    phoneNumber:null
}

export const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        setUser: (state, action:PayloadAction<User>)=>{
            return { ...state, ...action.payload }
        },
        clearUser: ()=>initialState
    }
})                                                                         

export const {setUser, clearUser} = userSlice.actions

export default userSlice.reducer