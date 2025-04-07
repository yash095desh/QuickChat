import mongoose from 'mongoose'


export const connectDb = async() =>{
    try {
        if(!process.env.MONGO_URL) throw new Error('MONGO_URL not set')
        await mongoose.connect(process.env.MONGO_URL)
        console.log("DB Connected !")
    } catch (error) {
        console.error('Error in connecting to DB :',error)
    }
}