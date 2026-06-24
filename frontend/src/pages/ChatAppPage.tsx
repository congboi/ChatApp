import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { 
  SidebarProvider, 
  SidebarInset, 
  SidebarTrigger 
} from "@/components/ui/sidebar"
import ChatWindowLayout from "@/components/chat/chatWindowLayout"


const ChatAppPage = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-screen overflow-hidden">
        {/* Nội dung chính sẽ nằm ở đây */}
        <div className="flex flex-1 flex-col h-full bg-muted/20 overflow-hidden">
           <ChatWindowLayout />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default ChatAppPage
