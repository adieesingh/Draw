import {z} from 'zod';

export const signupParse = z.object({
    name:z.string().min(3,"Min 3 letter").max(20,"Max 20 letter"),
    username:z.email(),
    password:z.string().min(8,"Min 8 letter").max(20,"Max 20 letter")
})

export const signinParse =z.object({
    username:z.email(),
    password:z.string().min(8,"Min 8 letter should be there")
})

export const roomParse = z.object({
    name:z.string()
})