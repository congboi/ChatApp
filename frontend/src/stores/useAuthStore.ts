import { create } from "zustand";
import {toast} from "sonner"
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";
import { persist } from "zustand/middleware";
import { useChatStore } from "./useChatStore";
import { User } from "lucide-react";


export const useAuthStore = create<AuthState>()(
    persist((set,get) => ({
    accessToken: null,
    user: null,
    loading: false,

    setAccessToken: (accessToken)=>{
        set({accessToken})
    },
    setUser:(user) =>{
        set({user});
    },
    clearState: () => {
        set({accessToken: null, user: null, loading: false});
        useChatStore.getState().reset();
        localStorage.clear();
        sessionStorage.clear();

    },

    signUp: async (username, password, email, firstName, lastName)=>{
        try {
            set({loading: true})
            //gọi api
            await authService.signUp(username,password,email,firstName,lastName)
            toast.success("Đăng ký thành công")
        } catch (error) {
            console.error(error),
            toast.error("Đăng ký thất bại")
        } finally {
            set({loading: false})
        }
    },
    signIn: async (username,password)=>{
        try {
            get().clearState();
            set({loading: true})
            localStorage.clear();
            useChatStore.getState().reset();
            //gọi api 
            const {accessToken} = await authService.signIn(username,password)
            get().setAccessToken(accessToken);
            await get().fetchMe();
            useChatStore.getState().fetchConversations();
            toast.success("Đăng nhập thành công")
        } catch (error) {
            console.error(error),
            toast.error("Đăng nhập thất bại")
        } finally {
            set({loading: false})
        }
    },
    signOut: async () => {
        try {
            get().clearState();
            await authService.signOut();
            toast.success("Đăng xuất thành công");
        } catch (error) {
            console.error(error);
            toast.error("Đăng xuất thất bại");
        }
    },
    fetchMe: async()=>{
        try {
            set({loading: true})
            const user = await authService.fetchMe()
            set({user});

        } catch (error) {
            console.error(error),
            set({user:null,accessToken:null});
            toast.error("Lấy thông tin thất bại");
        } finally {
            set({loading: false})
        }
    },
    refresh: async()=>{
        try {
            set({loading: true})
            const {user, fetchMe,setAccessToken} = get();
            const accessToken = await authService.refresh();
            setAccessToken(accessToken);
            if(!user){
                await fetchMe();
            }
        } catch (error: any) {
            // Chỉ hiện thông báo nếu không phải là lỗi 401 (lỗi 401 là bình thường khi chưa đăng nhập)
            if (error.response && error.response.status !== 401) {
                toast.error("Hết phiên đăng nhập, vui lòng đăng nhập lại");
            }
            get().clearState();
        } finally {
            set({loading: false});
        }
    }
}),{
    name: "auth-storage",
    partialize: (state) => ({
        user: state.user,
    }),
})
);

