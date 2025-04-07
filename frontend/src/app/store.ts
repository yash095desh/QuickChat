import { configureStore} from "@reduxjs/toolkit"
import userReducer from "@/features/user/userSlice"
import chatReducer from "@/features/currentChat/currentChatSlice"
import modalReducer from "@/features/modal/modalSlice"


export const store = configureStore({
    reducer:{
        user: userReducer,
        currentChat: chatReducer,
        modal:modalReducer
    }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch