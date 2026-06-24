"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-colors outline-none",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Định dạng màu nền dựa vào data-state hoạt động của Radix
        "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80",
        // Định dạng kích thước Switch dựa vào prop size
        "data-[size=default]:h-[18px] data-[size=default]:w-[34px]",
        "data-[size=sm]:h-[14px] data-[size=sm]:w-[24px]",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-background ring-0 transition-transform shadow-sm",
          // Màu sắc của nút tròn (thumb) lúc bật/tắt
          "dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground",
          // Kích thước nút tròn tương ứng với size của Switch
          "group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3",
          // Xử lý dịch chuyển hành trình (Dùng giá trị cố định để không bị lệch pixel)
          "group-data-[size=default]/switch:data-[state=checked]:translate-x-[16px]",
          "group-data-[size=default]/switch:data-[state=unchecked]:translate-x-[2px]",
          "group-data-[size=sm]/switch:data-[state=checked]:translate-x-[10px]",
          "group-data-[size=sm]/switch:data-[state=unchecked]:translate-x-[2px]"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }