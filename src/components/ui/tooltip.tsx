import { Tooltip as TooltipPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "~/lib/cn"

function TooltipProvider({
  delayDuration = 700,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, children, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-[10010]! w-fit! max-w-xs! origin-(--radix-tooltip-content-transform-origin)! rounded-md! border! border-border! bg-popover! px-3! py-1.5! text-xs! leading-4! text-popover-foreground! shadow-md! outline-hidden!",
        className
      )}
      {...props}
    >
      {children}
      <TooltipPrimitive.Arrow
        className="fill-popover! stroke-border! stroke-[0.5]!"
        data-slot="tooltip-arrow"
        height={6}
        width={12}
      />
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
