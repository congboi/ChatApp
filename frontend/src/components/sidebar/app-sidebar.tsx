"use client"

import * as React from "react"
import { useState, useEffect } from "react" // <-- Thêm dòng này để dùng hook kiểm soát mount

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Moon, Sun } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import CreateNewChat from "@/components/chat/CreateNewChat"
import NewGroupChatModal from "@/components/chat/NewGroupChatModal"
import GroupChatList from "@/components/chat/GroupChatList"
import AddFriendModal from "@/components/chat/AddFriendModal"
import DirectMessageList from "@/components/chat/DirectMessageList"
import { useThemeStore } from "@/stores/useThemeStore"
import { NavUser } from "./nav-user"
import { useAuthStore } from "@/stores/useAuthStore"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isDark, toggleTheme } = useThemeStore()
  const [mounted, setMounted] = useState(false) // Trạng thái kiểm tra component đã load xong ở Client chưa

  // Chạy ngay sau khi component render lần đầu tiên trên trình duyệt
  useEffect(() => {
    setMounted(true)

    // Đọc trạng thái lưu trong Zustand và ép thẻ html thêm/bỏ class dark chuẩn xác
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDark]) // Lắng nghe mỗi khi isDark thay đổi (bao gồm cả lần load đầu tiên)


  const {user} = useAuthStore();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="bg-gradient-primary">
              <a href="#">
                <div className="flex w-full items-center px-2 justify-between">
                  <h1 className="text-xl font-bold text-white">Chat App</h1>
                  <div className="flex items-center gap-2">
                    <Sun className="size-4 text-white/80" />
                    
                    <Switch
                      // Chỉ khi đã nạp xong data (mounted = true) thì mới lấy isDark
                      // Nếu chưa load xong (ở server hoặc lúc bắt đầu load), mặc định để false để nút không bị nhảy bậy
                      checked={mounted ? isDark : false}
                      onCheckedChange={toggleTheme}
                      className="data-[state=checked]:bg-white/30 data-[state=unchecked]:bg-black/20"
                    />
                    
                    <Moon className="size-4 text-white/80" />
                  </div>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="beatiful-scrollbar">
        <SidebarGroup>
          <SidebarGroupContent>
            <CreateNewChat />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <div className="flex items-center justify-between">
                      <SidebarGroupLabel className="uppercase">
            Nhóm chat
          </SidebarGroupLabel>
            <NewGroupChatModal/>
          </div>

          <SidebarGroupContent>
            <GroupChatList />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="uppercase">
            Bạn bè
          </SidebarGroupLabel>
          <SidebarGroupAction title="Kết bạn" className="cursor-pointer">
            <AddFriendModal/>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <DirectMessageList />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {user && <NavUser user={user}/>}
      </SidebarFooter>
    </Sidebar>
  )
}