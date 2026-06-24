import { friendService } from "@/services/friendService";
import type { FriendState } from "@/types/store";
import { fa } from "zod/v4/locales";
import { create } from "zustand";

export const useFriendStore = create <FriendState>((set,get)=>({
    friends: [],
    loading: false,
    receivedList: [],
    sentList: [],
    searchByUsername: async (username) =>{
        try {
            set({loading: true});
            const user = await friendService.searchByUsername(username);

            return user;
        } catch (error) {
            console.error("Lỗi xảy ra khi tìm user bằng username",error);
            return null;
        } finally{
            set({loading: false});
        }

    },
    addFriend: async (to,message) =>{
        try {
            set({loading: true});
            const resultMessage = await friendService.sendFriendRequest(to, message);
            return resultMessage;
        } catch (error) {
            console.error("Lỗi xảy ra khi addFriend",error);
            return "Lỗi xảy ra khi gửi kết bạn . hãy thử lại"
        } finally{
            set({loading:false})
        }
    },
    getAllFriendRequests: async()=>{
        try {
            set({loading: true});
            const result = await friendService.getAllFriendRequest();
            if(!result) result;
            const {received,sent} =result;
            set({receivedList: received, sentList: sent});
        } catch (error) {
            console.error("Lỗi xảy ra khi getallFriendRequests",error)
        }finally{
            set({loading: false})
        }
    },
    acceptRequest: async (requestId) =>{
        try {
            set({loading: true});
            await friendService.acceptRequest(requestId);
            set((state)=>({
                receivedList: state.receivedList.filter((r)=> r._id !== requestId),
            }));
        } catch (error) {
            console.error("Lỗi xảy ra khi acceptrequest",error)
        }
    },
    declineRequest: async (requestId) =>{
        try {
            set({loading: true});
            await friendService.declineRequest(requestId);
            set((state)=>({
                receivedList: state.receivedList.filter((r)=> r._id !== requestId)
            }))
            
        } catch (error) {
            console.error("Lỗi xảy ra khi declinerequest",error)
        } finally{
            set({loading: false});
        }
    },

    getFriends: async()=>{
        try {
            set({loading: true});
            const friends = await friendService.getFriendList();
            set({friends: friends})
        } catch (error) {
            console.error("Lỗi xảy ra khi load bạn",error);
            set({friends: []});
        } finally{
            set({loading: false});
        }
    }
}))