import React from 'react'

const UnreadCountBadge = ({unreadCount}: {unreadCount: number}) => {
  return (
    <div className='pulse-ring absolute z-20 -top-1 -right-1'>
        <div className='size-5 flex items-center justify-center text-[10px] font-bold text-white bg-gradient-chat border-2 border-background rounded-full shadow-sm'>
            {unreadCount > 9 ? "9+" : unreadCount}
        </div>
    </div>
  )
}

export default UnreadCountBadge