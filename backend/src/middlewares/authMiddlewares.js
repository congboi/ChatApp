import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const protectedRouter = (req,res,next) =>{
    try {
        //lấy token từ header
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if(!token){
            return res.status(401).json({message: "ko tìm thấy acesstoken"});
        }

        //xác nhận token hợp lệ
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,async (err,decodedUser) =>{
            if(err){
              console.log(err);
              return res.status(403).json({message: "Access token hết hạn hoặc ko đúng"});
            }
            //tìm user
            const user = await User.findById(decodedUser.userId).select('-hashedPassword');
            if(!user){
                return res.status(404).json({message: "ko tìm thấy user"});
            }
            //trả user về req
            req.user = user;
            next();
        })
    } catch (error) {
        console.log('lỗi khi xác minh jwt trong protectedRouter',error);
        return res.status(500).json({message: "lỗi hệ thống"});
    }
}