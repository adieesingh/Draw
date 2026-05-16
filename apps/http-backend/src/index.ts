import express from 'express';
import {roomParse, signinParse, signupParse} from '@repo/common/validation';
import {prismaClient} from '@repo/db/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '@repo/backend-common/jwt'
import { middleware } from './middleware.js';
import cors from 'cors'
const app =express();

app.use(express.json());

app.use(cors());

// signup 
app.post("/signup",async(req,res)=>{
    try {
        const signupData = signupParse.safeParse(req.body);
        console.log(signupData)
        if(!signupData.success){
            return res.status(411).json({
                message:"Data is not valid"
            })
        }
        const hashPassword = await bcrypt.hash(signupData.data.password,10)
    const response = await prismaClient.user.create({
        data:{
            username:signupData.data.username,
            password:hashPassword,
            name:signupData.data.name
        }
    })
    console.log("data done")
    if(!response){
        return res.status(411).json({
            message:"data dosent inserted"
        })
    }
    if(response){
        return res.status(200).json({
            message:"Data inserted sucessfully"
        })
    }
    } catch (error) {
        return res.status(500).json({
            message:"Internal Server down"
        })
    }
})

//signin
app.post('/signin',async(req,res)=>{
    try {
         const signinData = signinParse.safeParse(req.body);
    if(!signinData.success){
        return res.status(411).json({
            message:"Data was wrong"
        })
    }
    const checkEmailExist = await prismaClient.user.findFirst({
        where:{username:signinData.data.username}
    })
    if(!checkEmailExist){
        return res.status(411).json({
            message:"Email not exists please register"
        })
    }
    const comparePassword = await bcrypt.compare(signinData.data.password,checkEmailExist.password);
    const token = jwt.sign({userId:checkEmailExist.id},JWT_SECRET);

    if(!comparePassword){
        return res.status(411).json({
            message:"Password wrong",
           
        })
    }
    if(comparePassword){
        return res.status(200).json({
            message:"Signup succesfully",
            token:`Bearer ${token}`
        })
    }
    } catch (error) {
        return res.status(500).json({
            message:"Internal server down"
        })
    }
   
})

// roomId
app.post('/room',middleware,async (req,res)=>{
    try {
    const parsedData = roomParse.safeParse(req.body);
    
    if(!parsedData.success){
        return res.status(404).json({
            message:"Data is not proper"
        })
    }
   
    const userId= ( req as any).userId;
  
    const response = await prismaClient.room.create({
        data:{
            slug:parsedData.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            data.name,
            adminId:userId
        }
    })
    if(!response){
        return res.status(411).json({
            message:"Data is not proper"
        })
    }
    if(response){
        return res.status(200).json({
            message:"Data inserted succesfully",
            roomId:response.id
        })
    }
    } catch (error) {
        return res.status(500).json({
            message:"Internal Server down",
            error:error
        })
    }
    

})

app.get('/chats/:roomId',async (req,res)=>{
try {
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
        where:{
            roomId:roomId
        },
        orderBy:{
            id:"desc"
        },
        take:1000
    })
    if(!messages){
        return res.status(404).json({
            message:"Data not insert"
        })
    }
    return res.status(200).json({
        messages
    })
    
} catch (error) {
    console.log(error);
    res.json({
        message:[]
    })

}
});

app.get('/room/:slug',async(req,res)=>{
    try {
          const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where:{
            slug
        }
    });
    res.json({
        room
    })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:error
        })
    }
  
})
app.listen(3002,()=>{
    console.log("port is listening")
})