import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB } from "./libs/db.js";
import authRoute from "./router/authRoute.js";
import cookieParser from "cookie-parser";
import userRoute from "./router/userRoute.js";
import { protectedRouter } from "./middlewares/authMiddlewares.js";
import cors from "cors";
import friendRoute from "./router/friendRouter.js";
import messageRoute from "./router/messageRoute.js";
import conversationRoute from "./router/conversationRoute.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import {app,server} from "./socket/index.js";
import { v2 as cloudinary } from 'cloudinary';

const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: process.env.CLIENT_URL,credentials:true}));



cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});


//swagger
const swaggerDocument = JSON.parse(fs.readFileSync("./src/swagger.json", "utf8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));    

//public routers
app.use('/api/auth', authRoute);

//private routers
app.use(protectedRouter);
app.use('/api/users', userRoute);
app.use('/api/friends', friendRoute);
app.use('/api/messages', messageRoute);
app.use('/api/conversations', conversationRoute);

connectDB().then(()=>{
    server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });
})
