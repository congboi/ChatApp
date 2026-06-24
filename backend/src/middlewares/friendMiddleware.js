import Conversation from "../models/Conversation.js";
import Friend from "../models/Friend.js";


const pair = (a,b)=>{
    return a<b? [a,b] : [b,a]
};

export const checkFriendship = async (req,res,next) =>{
    try {
        const me = req.user._id;
        const recipientId = req.body?.recipientId?? null;

        const memberIds = req.body?.memberIds?? [];

        if(!recipientId && memberIds.length === 0){
            return res.status(400).json({message: 'Cần cung cấp  recipientId hoặc memberIds'})
        }


        if(recipientId){
            const [userA,userB] = pair(me,recipientId);
            const isFriend = await Friend.findOne({userA,userB});
            if(!isFriend){
                return res.status(403).json({message: "chưa kết bạn với người này"});
            }
            return next();
        }

        //todo chat nhóm\
        const friendChecks = memberIds.map(async(memberId)=>{
            const [userA,userB] = pair(me,memberId);
            const friend = await Friend.findOne({userA,userB});
            return friend ? null: memberId;
        });
        const results = await Promise.all(friendChecks);
        const notFriends = results.filter(Boolean);
        if(notFriends.length > 0){
            return res.status(403).json({message: "chưa kết bạn với một số người", notFriends});
        }
         next();
    } catch (error) {
        console.log('lỗi khi gọi checkFriendship',error);
        return res.status(500).json({message: "lỗi hệ thống"});
    }
}

export const checkGroupMembership = async (req,res,next) => {
    try {
        const {ConversationId} = req.body;
        const userId = req.user._id;
        const conversation = await Conversation.findById(ConversationId);
        if(!conversation){
            return res.status(404).json({message: "Không tìm thấy cuộc trò chuyện"});
        }
        const isMember = conversation.participants.some(participant => participant.userId.toString() === userId.toString());
        if(!isMember){
            return res.status(403).json({message: "Không phải thành viên của cuộc trò chuyện"});
        }
        req.conversation = conversation;
        next();
    } catch (error) {
        console.log('lỗi khi gọi checkGroupMembership',error);
        return res.status(500).json({message: "lỗi hệ thống"});
    }
}
