import { User } from "./user.interface";

export interface Chat {
    _id?: string | null,
    users: User[] | null,
    isGroupChat?: boolean | null, 
    chatName?: string | null,
    chatIcon?:string | null,
    lastMessage?:string | null,
    Admins?: Array<Object>| Array<string> | null,
    updatedAt?:string,
    createdAt?:string,
}