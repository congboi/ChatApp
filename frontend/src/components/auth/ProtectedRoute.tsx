import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { Navigate, Outlet } from 'react-router'

const ProtectedRoute = () => {
    const {accessToken, user, loading, refresh, fetchMe} = useAuthStore();
    const [starting, setStarting] = useState(true);

    const init = async () => {
        try {
            // Lấy state mới nhất từ store
            let currentToken = useAuthStore.getState().accessToken;
            
            // Nếu chưa có token, thử refresh từ cookie
            if (!currentToken) {
                await refresh();
                currentToken = useAuthStore.getState().accessToken;
            }
            
            // Nếu đã có token mà chưa có user, lấy thông tin user
            if (currentToken && !useAuthStore.getState().user) {
                await fetchMe();
            }
        } catch (error) {
            console.error("Init failed", error);
        } finally {
            setStarting(false);
        }
    }
    useEffect(() => {
        init();
    }, []);
    if(starting || loading ){
        return <div className='flex h-screen items-center justify-center'>Đang tải ...</div>
    }
    if(!accessToken) {
        return <Navigate to="/signin" replace/>
    }
    
  return (
    <Outlet></Outlet>
  )
}

export default ProtectedRoute