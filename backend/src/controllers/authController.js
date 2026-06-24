import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = '15m'; 
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

export const signUp = async (req, res) => {
    try {
        const {username, password, email,firstName,lastName } = req.body;
        if(!username || !password || !email || !firstName || !lastName){
            return res.status(400).json({message: "All fields are required"});
        }
        //kiểm tra usernam e tồn tại chưa
        const duplicate = await User.findOne({username});
        if(duplicate){
            return res.status(409).json({message: "Username already exists"});
        }
        // mã hoá password 
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10); //salt =10


        //create new user
        await  User.create({
            username,
            hashedPassword,
            email,
            displayName: `${lastName} ${firstName}`,
        });
        console.log("đk ok");
         return res.sendStatus(204);
         
    } catch (error) { 
        console.log('lỗi khi gọi signup',error);
        return res.status(500).json({message: "lỗi hệ thống"});
    }
    
}
export const signIn = async(req,res) =>{
    try {
        //lấy input
        const {username,password} = req.body;
        if(!username || !password){
            return res.status(400).json({message: "thiếu username hoặc password"});
        }
        //lấy hashpassword trong db so sánh với password
        const user = await User.findOne({username});
        if(!user){
            return res.status(401).json({message: "username hoặc password ko đúng"});

        }
        // kiểm tra password
        const passwordCorrect = await bcrypt.compare(password,user.hashedPassword);
        if(!passwordCorrect){
            return res.status(401).json({message: "username hoặc password ko đúng"});
        }

        //nếu khớp tạo accessToken với jwt
        const accessToken = jwt.sign(
            {
                userId: user._id
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: ACCESS_TOKEN_TTL
            }
        )
        //tạo refreshToken và lưu vào db
        const refreshToken = crypto.randomBytes(64).toString('hex');

        //tạo session mới để lưu refreshToken
        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
        })
        //trả refreshToken về trong cookie
        res.cookie('refreshToken',refreshToken,{
            httpOnly: true,
            secure: true,
            sameSite: 'none', //backend, frontend deploy riêng
            maxAge: REFRESH_TOKEN_TTL
        });
        //trả accessToken về trong res

        return res.status(200).json({message: `User ${user.displayName} đã loggin`,accessToken});
        
    } catch (error) {
        console.log('lỗi khi gọi signIn',error);
        return res.status(500).json({message: "lỗi hệ thống"});
    }
}
export const signOut = async (req, res) =>{
    try {
        //lấy refreshToken từ cookie
        const token = req.cookies?.refreshToken;
        if(token){
            //xoá refreshToken trong Session
            await Session.deleteOne({refreshToken: token});
        }
        //xoá cookie
        res.clearCookie("refreshToken");
        return res.sendStatus(204);
    } catch (error) {
        console.error('lỗi khi gọi signOut',error);
        return res.status(500).json({message: "lỗi hệ thống"});
    }
}
export const refreshToken = async (req, res) =>{
    try {
        //lấy refresh token từ cookie
        const token = req.cookies?.refreshToken;
        if(!token){
            return res.status(401).json({message: "Không có refresh token"});
        }
        // so với refresh token trong db
        const session = await Session.findOne({refreshToken: token});
        if(!session){
            return res.status(403).json({message: "token ko hợp lệ hoặc hết hạn"});
        }
        // kiểm tra hết hạn chưa
        if(session.expiresAt < new Date()){
            return res.status(403).json({message: "token hết hạn"});
        }
        //tạo access token mới
        const accessToken = jwt.sign(
            {
                userId: session.userId
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: ACCESS_TOKEN_TTL
            }
        )
        //return 
        return res.status(200).json({accessToken});
        
    } catch (error) {
        console.error("Lỗi khi gọi refreshToken",error);
        return res.status(500).json({message: "lỗi hệ thống"});
    }
}