export interface Message {
    _id : string,
    content : string,
    senderId : sender,
    chatId : string,
}

interface sender {
    _id : string,
    name : string,
    avatar : string
}