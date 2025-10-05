import * as React from "react"
import { cn } from "@/lib/utils"

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  pauseOnHover?: boolean
  direction?: "left" | "right"
  speed?: number
}

export function Marquee({
  children,
  pauseOnHover = true,
  direction = "left",
  speed = 40,
  className,
  ...props
}: MarqueeProps) {
  return (
    <div 
      className={cn(
        "w-full overflow-hidden py-8",
        className
      )} 
      {...props}
    >
      <div className="relative flex max-w-full overflow-hidden">
        <div 
          className={cn(
            "flex w-max animate-marquee gap-16",
            pauseOnHover && "hover:[animation-play-state:paused]",
            direction === "right" && "animate-marquee-reverse"
          )}
          style={{ "--duration": `${speed}s` } as React.CSSProperties}
        >
          {children}
          {children}
        </div>
      </div>
    </div>
  )
}